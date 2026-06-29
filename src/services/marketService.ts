import type { MarketData } from '../types';

const CACHE_KEY = 'market_data_v7';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface MarketResult {
  data: MarketData | null;
  fetchedAt: number | null;
  isStale: boolean;
  fromCache: boolean;
}

// ── Cache helpers ──────────────────────────────────────────────────────────────

interface CacheEntry {
  data: MarketData;
  fetchedAt: number;
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (!entry?.fetchedAt || !entry?.data) return null;
    return entry;
  } catch {
    return null;
  }
}

function writeCache(data: MarketData): number {
  const fetchedAt = Date.now();
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt }));
  } catch { /* ignore */ }
  return fetchedAt;
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

// ── Crypto — Binance (no key, no CORS issues) ─────────────────────────────────

async function fetchCrypto(): Promise<{ btc: MarketData['btc']; eth: MarketData['eth']; sol: MarketData['sol'] } | null> {
  try {
    const [btcRes, ethRes, solRes] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT'),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT'),
    ]);

    if (!btcRes.ok || !ethRes.ok || !solRes.ok) return null;

    const [btc, eth, sol] = await Promise.all([
      btcRes.json(),
      ethRes.json(),
      solRes.json(),
    ]);

    return {
      btc: { price: parseFloat(btc.lastPrice),  change24h: parseFloat(btc.priceChangePercent)  },
      eth: { price: parseFloat(eth.lastPrice),  change24h: parseFloat(eth.priceChangePercent)  },
      sol: { price: parseFloat(sol.lastPrice),  change24h: parseFloat(sol.priceChangePercent)  },
    };
  } catch {
    return null;
  }
}

// ── Forex — Frankfurter (ECB data, CORS-safe, ~₹84) ─────────────────────────

async function fetchForex(): Promise<MarketData['usdInr']> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
    if (res.ok) {
      const data = await res.json();
      if (data?.rates?.INR) {
        return { rate: data.rates.INR, change: 0 };
      }
    }
  } catch { /* fall through */ }
  return { rate: 0, change: 0 };
}

// ── Indian Markets — allorigins proxy → query2 Yahoo Finance ─────────────────

async function fetchYahoo(symbol: string): Promise<{ value: number; change: number } | null> {
  try {
    const targetUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const proxyUrl  = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    const res = await fetch(proxyUrl);
    if (!res.ok) return null;

    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const value  = meta.regularMarketPrice        ?? 0;
    const change = meta.regularMarketChangePercent ?? 0;

    return {
      value:  parseFloat(value.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
    };
  } catch {
    return null;
  }
}

async function fetchIndianMarkets(): Promise<{ sensex: MarketData['sensex']; nifty: MarketData['nifty'] }> {
  const [sensex, nifty] = await Promise.all([
    fetchYahoo('^BSESN'),
    fetchYahoo('^NSEI'),
  ]);

  return {
    sensex: sensex ?? { value: 0, change: 0 },
    nifty:  nifty  ?? { value: 0, change: 0 },
  };
}

// ── Assemble ──────────────────────────────────────────────────────────────────

async function fetchLive(): Promise<MarketData | null> {
  try {
    const [crypto, usdInr, indian] = await Promise.all([
      fetchCrypto(),
      fetchForex(),
      fetchIndianMarkets(),
    ]);

    if (!crypto) return null;

    return {
      btc:    crypto.btc,
      eth:    crypto.eth,
      sol:    crypto.sol,
      usdInr,
      sensex: indian.sensex,
      nifty:  indian.nifty,
    };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchMarketData(): Promise<MarketResult> {
  // Clear all old stale caches once on every load
  try {
    localStorage.removeItem('market_data_cache_v6');
    localStorage.removeItem('market_cache');
  } catch { /* ignore */ }

  const now    = Date.now();
  const cached = readCache();

  // Cache hit — within 5 minutes
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      data:      cached.data,
      fetchedAt: cached.fetchedAt,
      isStale:   false,
      fromCache: true,
    };
  }

  // Cache miss or expired — fetch fresh
  const live = await fetchLive();

  if (live) {
    const fetchedAt = writeCache(live);
    return { data: live, fetchedAt, isStale: false, fromCache: false };
  }

  // Fetch failed — fall back to stale cache with warning
  if (cached) {
    return {
      data:      cached.data,
      fetchedAt: cached.fetchedAt,
      isStale:   true,
      fromCache: true,
    };
  }

  // Nothing at all — signal unavailable
  clearCache();
  return { data: null, fetchedAt: null, isStale: true, fromCache: false };
}
