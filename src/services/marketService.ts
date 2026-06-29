import type { MarketData } from '../types';

const CACHE_KEY = 'market_data_v9';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface MarketResult {
  data: MarketData | null;
  fetchedAt: number | null;
  isStale: boolean;
  fromCache: boolean;
}

// ── Cache ──────────────────────────────────────────────────────────────────────

interface CacheEntry { data: MarketData; fetchedAt: number; }

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (!entry?.fetchedAt || !entry?.data) return null;
    return entry;
  } catch { return null; }
}

function writeCache(data: MarketData): number {
  const fetchedAt = Date.now();
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt })); } catch { /**/ }
  return fetchedAt;
}

function clearCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /**/ }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeFloat(v: unknown, fallback = 0): number {
  const n = parseFloat(String(v));
  return isNaN(n) ? fallback : n;
}

async function safeFetch(url: string, timeoutMs = 8000): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res.ok ? res : null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ── Crypto — Binance primary, CryptoCompare fallback ──────────────────────────

async function fetchCrypto(): Promise<{
  btc: MarketData['btc'];
  eth: MarketData['eth'];
  sol: MarketData['sol'];
} | null> {
  // Primary: Binance 24hr ticker (no key, no CORS for browser)
  try {
    const [bR, eR, sR] = await Promise.all([
      safeFetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
      safeFetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT'),
      safeFetch('https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT'),
    ]);
    if (bR && eR && sR) {
      const [b, e, s] = await Promise.all([bR.json(), eR.json(), sR.json()]);
      return {
        btc: { price: safeFloat(b.lastPrice), change24h: safeFloat(b.priceChangePercent) },
        eth: { price: safeFloat(e.lastPrice), change24h: safeFloat(e.priceChangePercent) },
        sol: { price: safeFloat(s.lastPrice), change24h: safeFloat(s.priceChangePercent) },
      };
    }
  } catch { /**/ }

  // Fallback: CryptoCompare (free, no key)
  try {
    const res = await safeFetch(
      'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,SOL&tsyms=USD'
    );
    if (res) {
      const d = await res.json();
      const p = (sym: string) => ({
        price: safeFloat(d.RAW?.[sym]?.USD?.PRICE),
        change24h: safeFloat(d.RAW?.[sym]?.USD?.CHANGEPCT24HOUR),
      });
      return { btc: p('BTC'), eth: p('ETH'), sol: p('SOL') };
    }
  } catch { /**/ }

  return null;
}

// ── Forex — two free no-key endpoints ─────────────────────────────────────────

async function fetchForex(): Promise<MarketData['usdInr']> {
  // Primary: open.er-api.com
  try {
    const res = await safeFetch('https://open.er-api.com/v6/latest/USD');
    if (res) {
      const data = await res.json();
      if (data?.rates?.INR) {
        return { rate: safeFloat(data.rates.INR.toFixed(2)), change: 0 };
      }
    }
  } catch { /**/ }

  // Fallback: exchangerate-api.com
  try {
    const res = await safeFetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (res) {
      const data = await res.json();
      if (data?.rates?.INR) {
        return { rate: safeFloat(data.rates.INR.toFixed(2)), change: 0 };
      }
    }
  } catch { /**/ }

  return { rate: 0, change: 0 };
}

// ── Indian Indices — Vercel /api/yahoo (primary) + allorigins fallback ─────────

function parseYahooMeta(data: unknown): { value: number; change: number } | null {
  try {
    const meta = (data as any)?.chart?.result?.[0]?.meta;
    const price  = safeFloat(meta?.regularMarketPrice);
    const change = safeFloat(meta?.regularMarketChangePercent);
    if (!price) return null;
    return { value: safeFloat(price.toFixed(2)), change: safeFloat(change.toFixed(2)) };
  } catch { return null; }
}

async function fetchIndex(symbol: string): Promise<{ value: number; change: number }> {
  // Method 1: Vercel serverless /api/yahoo — server-side, no CORS restriction
  try {
    const res = await safeFetch(`/api/yahoo?symbol=${encodeURIComponent(symbol)}`);
    if (res) {
      const parsed = parseYahooMeta(await res.json());
      if (parsed) return parsed;
    }
  } catch { /**/ }

  // Method 2: allorigins /get proxy (wraps response in { contents: "..." })
  try {
    const targetUrl = encodeURIComponent(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
    );
    const res = await safeFetch(`https://api.allorigins.win/get?url=${targetUrl}`);
    if (res) {
      const wrapper = await res.json();
      const parsed = parseYahooMeta(JSON.parse(wrapper.contents));
      if (parsed) return parsed;
    }
  } catch { /**/ }

  // Method 3: corsproxy.io
  try {
    const targetUrl = encodeURIComponent(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
    );
    const res = await safeFetch(`https://corsproxy.io/?${targetUrl}`);
    if (res) {
      const parsed = parseYahooMeta(await res.json());
      if (parsed) return parsed;
    }
  } catch { /**/ }

  return { value: 0, change: 0 };
}

async function fetchIndianMarkets(): Promise<{ sensex: MarketData['sensex']; nifty: MarketData['nifty'] }> {
  const [sensex, nifty] = await Promise.all([
    fetchIndex('^BSESN'),
    fetchIndex('^NSEI'),
  ]);
  return { sensex, nifty };
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
  } catch { return null; }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchMarketData(): Promise<MarketResult> {
  // Wipe every known old cache key on load
  ['market_data_v8','market_data_v7','market_data_cache_v6','market_data_cache_v5',
   'market_data_cache_v4','market_data_cache_v3','market_cache']
    .forEach(k => { try { localStorage.removeItem(k); } catch { /**/ } });

  const now    = Date.now();
  const cached = readCache();

  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return { data: cached.data, fetchedAt: cached.fetchedAt, isStale: false, fromCache: true };
  }

  const live = await fetchLive();

  if (live) {
    const fetchedAt = writeCache(live);
    return { data: live, fetchedAt, isStale: false, fromCache: false };
  }

  if (cached) {
    return { data: cached.data, fetchedAt: cached.fetchedAt, isStale: true, fromCache: true };
  }

  clearCache();
  return { data: null, fetchedAt: null, isStale: true, fromCache: false };
}