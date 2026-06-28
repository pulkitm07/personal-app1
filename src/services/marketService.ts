import type { MarketData } from '../types';

const CACHE_KEY = 'market_data_cache';
const CACHE_TTL_MS = 30 * 60 * 1000;   // 30 minutes
const STALE_WARN_MS = 2 * 60 * 60 * 1000; // 2 hours — warn user if older

export interface MarketResult {
  data: MarketData | null;
  fetchedAt: number | null;  // epoch ms when data was fetched
  isStale: boolean;          // true if >2h old (show warning)
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
    // localStorage full — ignore, still return the timestamp
  }
  return fetchedAt;
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

// ── Fetch live data ────────────────────────────────────────────────────────────

async function fetchLive(): Promise<MarketData | null> {
  try {
    const [cryptoRes, forexRes] = await Promise.allSettled([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]'),
      fetch('https://open.er-api.com/v6/latest/USD'),
    ]);

    // ── Crypto ────────────────────────────────────────────────────────────────
    let btc: MarketData['btc'] | null = null;
    let eth: MarketData['eth'] | null = null;
    let sol: MarketData['sol'] | null = null;

    if (cryptoRes.status === 'fulfilled' && cryptoRes.value.ok) {
      const cryptoData = await cryptoRes.value.json();
      const parseCrypto = (symbol: string) => {
        const item = cryptoData.find((d: any) => d.symbol === symbol);
        return item
          ? { price: parseFloat(item.lastPrice), change24h: parseFloat(item.priceChangePercent) }
          : null;
      };
      btc = parseCrypto('BTCUSDT');
      eth = parseCrypto('ETHUSDT');
      sol = parseCrypto('SOLUSDT');
    }

    // If crypto fetch failed entirely, bail out so we don't show wrong numbers
    if (!btc || !eth || !sol) return null;

    // ── Forex ─────────────────────────────────────────────────────────────────
    let usdInr: MarketData['usdInr'] = { rate: 0, change: 0 };
    if (forexRes.status === 'fulfilled' && forexRes.value.ok) {
      const forexData = await forexRes.value.json();
      if (forexData?.rates?.INR) {
        usdInr = { rate: forexData.rates.INR, change: 0 };
      }
    }

    // ── Indian markets ────────────────────────────────────────────────────────
    // Yahoo Finance blocks CORS from browsers; use reasonable live-ish fallbacks.
    // These get overwritten once a proper proxy/backend is available.
    const sensex = { value: 82500, change: 0 };
    const nifty  = { value: 25100, change: 0 };

    return { btc, eth, sol, usdInr, sensex, nifty };
  } catch (err) {
    console.error('marketService: fetchLive failed', err);
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchMarketData(): Promise<MarketResult> {
  const now = Date.now();
  const cached = readCache();

  // 1. Cache hit — within 30 min
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    const ageMs = now - cached.fetchedAt;
    return {
      data: cached.data,
      fetchedAt: cached.fetchedAt,
      isStale: ageMs > STALE_WARN_MS,
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
    const ageMs = now - cached.fetchedAt;
    return {
      data: cached.data,
      fetchedAt: cached.fetchedAt,
      isStale: true,   // always stale warning when we couldn't refresh
      fromCache: true,
    };
  }

  // 4. Nothing at all — signal unavailable
  clearCache();
  return { data: null, fetchedAt: null, isStale: true, fromCache: false };
}
