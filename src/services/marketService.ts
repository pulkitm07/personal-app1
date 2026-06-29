import type { MarketData } from '../types';

const CACHE_KEY = 'market_data_cache_v7';
const CACHE_TTL_MS = 30 * 60 * 1000;
const STALE_WARN_MS = 2 * 60 * 60 * 1000;

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
  } catch {
    // ignore
  }
  return fetchedAt;
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

// ── Crypto — Primary: CoinCap (no key, no rate limit) ─────────────────────────

async function fetchCrypto(): Promise<{ btc: MarketData['btc']; eth: MarketData['eth']; sol: MarketData['sol'] } | null> {
  try {
    const [btcRes, ethRes, solRes] = await Promise.all([
      fetch('https://api.coincap.io/v2/assets/bitcoin'),
      fetch('https://api.coincap.io/v2/assets/ethereum'),
      fetch('https://api.coincap.io/v2/assets/solana'),
    ]);

    if (btcRes.ok && ethRes.ok && solRes.ok) {
      const [btcJson, ethJson, solJson] = await Promise.all([
        btcRes.json(),
        ethRes.json(),
        solRes.json(),
      ]);

      const parse = (json: { data: { priceUsd: string; changePercent24Hr: string } }) => ({
        price: parseFloat(json.data.priceUsd),
        change24h: parseFloat(json.data.changePercent24Hr),
      });

      return {
        btc: parse(btcJson),
        eth: parse(ethJson),
        sol: parse(solJson),
      };
    }
  } catch { /* fall through */ }

  // Fallback: Coinbase spot prices (no change%, use 0)
  try {
    const [btcRes, ethRes, solRes] = await Promise.all([
      fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot'),
      fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot'),
      fetch('https://api.coinbase.com/v2/prices/SOL-USD/spot'),
    ]);

    if (btcRes.ok && ethRes.ok && solRes.ok) {
      const [btcJson, ethJson, solJson] = await Promise.all([
        btcRes.json(),
        ethRes.json(),
        solRes.json(),
      ]);

      return {
        btc: { price: parseFloat(btcJson.data.amount), change24h: 0 },
        eth: { price: parseFloat(ethJson.data.amount), change24h: 0 },
        sol: { price: parseFloat(solJson.data.amount), change24h: 0 },
      };
    }
  } catch { /* fall through */ }

  return null;
}

// ── Forex — Frankfurter (ECB data, no key needed) ─────────────────────────────

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

// ── Indian Markets — Yahoo Finance via Vercel proxy ───────────────────────────

async function fetchYahooViaProxy(symbol: string): Promise<{ value: number; change: number } | null> {
  try {
    const res = await fetch(`/api/yahoo?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) return null;

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const latest = result.meta?.regularMarketPrice;
    const change = result.meta?.regularMarketChangePercent ?? 0;

    if (latest == null || isNaN(latest)) return null;

    return { value: parseFloat(latest.toFixed(2)), change: parseFloat(change.toFixed(2)) };
  } catch {
    return null;
  }
}

async function fetchYahooDirect(symbol: string): Promise<{ value: number; change: number } | null> {
  // Fallback: query2 has more relaxed CORS than query1
  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const latest = result.meta?.regularMarketPrice;
    const change = result.meta?.regularMarketChangePercent ?? 0;

    if (latest == null || isNaN(latest)) return null;

    return { value: parseFloat(latest.toFixed(2)), change: parseFloat(change.toFixed(2)) };
  } catch {
    return null;
  }
}

async function fetchIndianMarkets(): Promise<{ sensex: MarketData['sensex']; nifty: MarketData['nifty'] }> {
  // Try Vercel proxy first, then fall back to query2 direct
  const [sensex, nifty] = await Promise.all([
    fetchYahooViaProxy('^BSESN').then(r => r ?? fetchYahooDirect('^BSESN')),
    fetchYahooViaProxy('^NSEI').then(r => r ?? fetchYahooDirect('^NSEI')),
  ]);

  return {
    sensex: sensex ?? { value: 0, change: 0 },
    nifty: nifty ?? { value: 0, change: 0 },
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
      btc: crypto.btc,
      eth: crypto.eth,
      sol: crypto.sol,
      usdInr,
      sensex: indian.sensex,
      nifty: indian.nifty,
    };
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchMarketData(): Promise<MarketResult> {
  const now = Date.now();
  const cached = readCache();

  // Cache hit — within 30 min
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      data: cached.data,
      fetchedAt: cached.fetchedAt,
      isStale: (now - cached.fetchedAt) > STALE_WARN_MS,
      fromCache: true,
    };
  }

  // Cache miss or expired — fetch fresh
  const live = await fetchLive();

  if (live) {
    const fetchedAt = writeCache(live);
    return { data: live, fetchedAt, isStale: false, fromCache: false };
  }

  // Fetch failed — fall back to stale cache
  if (cached) {
    return {
      data: cached.data,
      fetchedAt: cached.fetchedAt,
      isStale: true,
      fromCache: true,
    };
  }

  // Nothing at all
  clearCache();
  return { data: null, fetchedAt: null, isStale: true, fromCache: false };
}
