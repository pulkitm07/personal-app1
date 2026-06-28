import type { MarketData } from '../types';

const CACHE_KEY = 'market_data_cache_v4';  // bumped version
const CACHE_TTL_MS = 30 * 60 * 1000;      // 30 minutes
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

async function fetchCrypto(): Promise<{ btc: MarketData['btc']; eth: MarketData['eth']; sol: MarketData['sol'] } | null> {
  try {
    // Primary: Binance
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
    if (res.ok) {
      const data = await res.json();
      const parse = (symbol: string) => {
        const item = data.find((d: { symbol: string; lastPrice: string; priceChangePercent: string }) => d.symbol === symbol);
        return item ? { price: parseFloat(item.lastPrice), change24h: parseFloat(item.priceChangePercent) } : null;
      };
      const btc = parse('BTCUSDT');
      const eth = parse('ETHUSDT');
      const sol = parse('SOLUSDT');
      if (btc && eth && sol) return { btc, eth, sol };
    }
  } catch { /* fall through */ }

  try {
    // Fallback: CoinGecko public API
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
    );
    if (res.ok) {
      const data = await res.json();
      return {
        btc: { price: data.bitcoin?.usd ?? 0, change24h: data.bitcoin?.usd_24h_change ?? 0 },
        eth: { price: data.ethereum?.usd ?? 0, change24h: data.ethereum?.usd_24h_change ?? 0 },
        sol: { price: data.solana?.usd ?? 0, change24h: data.solana?.usd_24h_change ?? 0 },
      };
    }
  } catch { /* fall through */ }

  return null;
}

async function fetchForex(): Promise<MarketData['usdInr']> {
  // Primary: exchangerate-api with key
  try {
    const key = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
    if (key) {
      const res = await fetch(`https://v6.exchangerate-api.com/v6/${key}/pair/USD/INR`);
      if (res.ok) {
        const data = await res.json();
        if (data?.conversion_rate) {
          return { rate: data.conversion_rate, change: 0 };
        }
      }
    }
  } catch { /* fall through */ }

  // Fallback: open.er-api.com (free, no key)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data?.rates?.INR) {
        return { rate: data.rates.INR, change: 0 };
      }
    }
  } catch { /* fall through */ }

  // Second fallback: fawazahmed0 currency API
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
    if (res.ok) {
      const data = await res.json();
      if (data?.usd?.inr) {
        return { rate: data.usd.inr, change: 0 };
      }
    }
  } catch { /* fall through */ }

  return { rate: 0, change: 0 };
}

async function fetchIndianMarkets(): Promise<{ sensex: MarketData['sensex']; nifty: MarketData['nifty'] }> {
  // Use Vercel Serverless Function to proxy Yahoo Finance and bypass CORS
  const fetchYahooProxy = async (symbol: string): Promise<{ value: number; change: number } | null> => {
    try {
      const res = await fetch(`/api/yahoo?symbol=${encodeURIComponent(symbol)}`);
      if (!res.ok) return null;
      
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) return null;
      
      const closes: number[] = result?.indicators?.quote?.[0]?.close ?? [];
      const validCloses = closes.filter((v: number | null) => v != null && !isNaN(v));
      if (validCloses.length === 0) return null;
      
      const latest = validCloses[validCloses.length - 1];
      let change = 0;
      
      if (validCloses.length >= 2) {
        const prev = validCloses[validCloses.length - 2];
        change = ((latest - prev) / prev) * 100;
      } else {
        const prevClose = result.meta?.chartPreviousClose;
        if (prevClose) {
          change = ((latest - prevClose) / prevClose) * 100;
        }
      }
      
      return { value: parseFloat(latest.toFixed(2)), change: parseFloat(change.toFixed(2)) };
    } catch {
      return null;
    }
  };

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
      isStale: true,   // always stale warning when we couldn't refresh
      fromCache: true,
    };
  }

  // 4. Nothing at all — signal unavailable
  clearCache();
  return { data: null, fetchedAt: null, isStale: true, fromCache: false };
}
