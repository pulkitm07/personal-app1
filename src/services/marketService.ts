import type { MarketData } from '../types';

const CACHE_KEY = 'market_data_cache_v6';
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

// ── Fetch live data ────────────────────────────────────────────────────────────

async function fetchCrypto(): Promise<{ btc: MarketData['btc']; eth: MarketData['eth']; sol: MarketData['sol'] } | null> {
  try {
    // Step 1: Use CoinGecko's free public endpoint with no authentication
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
    );
    if (res.ok) {
      const data = await res.json();
      return {
        btc: { price: data.bitcoin?.usd ?? null, change24h: data.bitcoin?.usd_24h_change ?? null },
        eth: { price: data.ethereum?.usd ?? null, change24h: data.ethereum?.usd_24h_change ?? null },
        sol: { price: data.solana?.usd ?? null, change24h: data.solana?.usd_24h_change ?? null },
      };
    }
  } catch {
    // Return null immediately on failure instead of hardcoded fallbacks
  }
  return null;
}

async function fetchForex(): Promise<MarketData['usdInr']> {
  // Step 2: Use open.er-api.com free no-key endpoint
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data?.rates?.INR) {
        return { rate: data.rates.INR, change: 0 };
      }
    }
  } catch {
    // Return empty on failure
  }
  return { rate: 0, change: 0 };
}

async function fetchYahooProxy(symbol: string): Promise<{ value: number; change: number } | null> {
  // Step 3: Use Yahoo Finance Proxy Endpoint
  try {
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    // We proxy it through our Vercel API to bypass CORS
    const res = await fetch(`/api/yahoo?symbol=${encodeURIComponent(symbol)}`);
    if (!res.ok) return null;
    
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;
    
    // Extract regularMarketPrice and regularMarketChangePercent from the response
    const latest = result.meta?.regularMarketPrice;
    let change = result.meta?.regularMarketChangePercent ?? 0;
    
    if (latest == null || isNaN(latest)) return null;
    
    return { value: parseFloat(latest.toFixed(2)), change: parseFloat(change.toFixed(2)) };
  } catch {
    return null;
  }
}

async function fetchIndianMarkets(): Promise<{ sensex: MarketData['sensex']; nifty: MarketData['nifty'] }> {
  const [sensex, nifty] = await Promise.all([
    fetchYahooProxy('^BSESN'),
    fetchYahooProxy('^NSEI'),
  ]);

  return {
    sensex: sensex ?? { value: 0, change: 0 },
    nifty: nifty ?? { value: 0, change: 0 },
  };
}

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
  } catch (err) {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchMarketData(): Promise<MarketResult> {
  // Step 5: Clear localStorage market cache
  try {
    localStorage.removeItem('market_cache');
    // Also clearing the older cache keys just to be thoroughly sure
    localStorage.removeItem('market_data_cache_v3');
    localStorage.removeItem('market_data_cache_v4');
    localStorage.removeItem('market_data_cache_v5');
  } catch {}

  const now = Date.now();
  const cached = readCache();

  // 1. Cache hit — within 30 min
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return {
      data: cached.data,
      fetchedAt: cached.fetchedAt,
      isStale: (now - cached.fetchedAt) > STALE_WARN_MS,
      fromCache: true,
    };
  }

  // 2. Cache miss or expired — fetch fresh
  const live = await fetchLive();

  if (live) {
    const fetchedAt = writeCache(live);
    return { data: live, fetchedAt, isStale: false, fromCache: false };
  }

  // 3. Fetch failed — fall back to stale cache with a warning if it exists
  if (cached) {
    return {
      data: cached.data,
      fetchedAt: cached.fetchedAt,
      isStale: true,
      fromCache: true,
    };
  }

  // 4. Nothing at all — signal unavailable
  clearCache();
  return { data: null, fetchedAt: null, isStale: true, fromCache: false };
}
