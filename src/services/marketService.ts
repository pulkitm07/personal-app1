import type { MarketData } from '../types';

const CACHE_KEY = 'market_data_v8';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface MarketResult {
  data: MarketData | null;
  fetchedAt: number | null;
  isStale: boolean;
  fromCache: boolean;
}

// ── Cache helpers ─────────────────────────────────────────────────────────────

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

// ── Crypto — Binance public API (no key, no CORS issues) ─────────────────────

async function fetchCrypto(): Promise<{
  btc: MarketData['btc'];
  eth: MarketData['eth'];
  sol: MarketData['sol'];
} | null> {
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
      btc: { price: parseFloat(btc.lastPrice), change24h: parseFloat(btc.priceChangePercent) },
      eth: { price: parseFloat(eth.lastPrice), change24h: parseFloat(eth.priceChangePercent) },
      sol: { price: parseFloat(sol.lastPrice), change24h: parseFloat(sol.priceChangePercent) },
    };
  } catch {
    return null;
  }
}

// ── Crypto — Binance primary, CryptoCompare fallback ─────────────────────────

async function fetchCrypto(): Promise<{
  btc: MarketData['btc'];
  eth: MarketData['eth'];
  sol: MarketData['sol'];
} | null> {
  // Primary: Binance
  try {
    const [btcRes, ethRes, solRes] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT'),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT'),
    ]);

    if (btcRes.ok && ethRes.ok && solRes.ok) {
      const [btc, eth, sol] = await Promise.all([
        btcRes.json(), ethRes.json(), solRes.json(),
      ]);
      return {
        btc: { price: parseFloat(btc.lastPrice), change24h: parseFloat(btc.priceChangePercent) },
        eth: { price: parseFloat(eth.lastPrice), change24h: parseFloat(eth.priceChangePercent) },
        sol: { price: parseFloat(sol.lastPrice), change24h: parseFloat(sol.priceChangePercent) },
      };
    }
  } catch { /* fall through to CryptoCompare */ }

  // Fallback: CryptoCompare (free, no key)
  try {
    const res = await fetch(
      'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,SOL&tsyms=USD'
    );
    if (res.ok) {
      const d = await res.json();
      const parse = (sym: string) => ({
        price: d.RAW?.[sym]?.USD?.PRICE ?? 0,
        change24h: d.RAW?.[sym]?.USD?.CHANGEPCT24HOUR ?? 0,
      });
      return { btc: parse('BTC'), eth: parse('ETH'), sol: parse('SOL') };
    }
  } catch { /* fall through */ }

  return null;
}

// ── Forex — open.er-api.com (free, no key, supports INR) ─────────────────────

async function fetchForex(): Promise<MarketData['usdInr']> {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data?.rates?.INR) {
      return { rate: parseFloat(data.rates.INR.toFixed(2)), change: 0 };
    }
    return { rate: 0, change: 0 };
  } catch {
    return { rate: 0, change: 0 };
  }
}

// ── Indian Markets — Vercel /api/yahoo (primary) + proxy fallbacks ───────────

function parseYahooResponse(data: any): { value: number; change: number } | null {
  try {
    const meta = data?.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    const change = meta?.regularMarketChangePercent ?? 0;
    if (!price || isNaN(price)) return null;
    return {
      value: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
    };
  } catch {
    return null;
  }
}

async function fetchWithProxy(
  proxyUrl: string,
  isWrapped: boolean
): Promise<{ value: number; change: number } | null> {
  try {
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = await res.json();
    const data = isWrapped ? JSON.parse(json.contents) : json;
    return parseYahooResponse(data);
  } catch {
    return null;
  }
}

async function fetchIndex(rawSymbol: string): Promise<{ value: number; change: number }> {
  // Primary: Vercel serverless /api/yahoo — runs server-side, no CORS
  try {
    const r0 = await fetch(`/api/yahoo?symbol=${encodeURIComponent(rawSymbol)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (r0.ok) {
      const d0 = await r0.json();
      const parsed = parseYahooResponse(d0);
      if (parsed) return parsed;
    }
  } catch { /* fall through */ }

  const yahooUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(rawSymbol)}?interval=1d&range=1d`;
  const encoded  = encodeURIComponent(yahooUrl);

  // Fallback 1 — corsproxy.io
  const r1 = await fetchWithProxy(`https://corsproxy.io/?${encoded}`, false);
  if (r1) return r1;

  // Fallback 2 — allorigins /get (wrapped)
  const r2 = await fetchWithProxy(`https://api.allorigins.win/get?url=${encoded}`, true);
  if (r2) return r2;

  return { value: 0, change: 0 };
}

async function fetchIndianMarkets(): Promise<{
  sensex: MarketData['sensex'];
  nifty: MarketData['nifty'];
}> {
  const [sensex, nifty] = await Promise.all([
    fetchIndex('^BSESN'),
    fetchIndex('^NSEI'),
  ]);
  return { sensex, nifty };
}

// ── Assemble all sources ──────────────────────────────────────────────────────

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
  // Wipe all legacy cache keys
  ['market_data_v7', 'market_data_cache_v6', 'market_data_cache_v5',
    'market_data_cache_v4', 'market_data_cache_v3', 'market_cache']
    .forEach(k => { try { localStorage.removeItem(k); } catch { /**/ } });

  const now = Date.now();
  const cached = readCache();

  // Cache hit — within 5 minutes
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      data: cached.data,
      fetchedAt: cached.fetchedAt,
      isStale: false,
      fromCache: true,
    };
  }

  // Cache miss or expired — fetch fresh
  const live = await fetchLive();

  if (live) {
    const fetchedAt = writeCache(live);
    return { data: live, fetchedAt, isStale: false, fromCache: false };
  }

  // Fetch failed — serve stale cache with warning
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