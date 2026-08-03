import type { MarketData } from '../types';

const CACHE_KEY = 'market_data_v11';
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
  try {
    const today = await safeFetch('https://api.frankfurter.app/latest?from=USD&to=INR');
    
    // Get yesterday's date in YYYY-MM-DD
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const yesterday = await safeFetch(`https://api.frankfurter.app/${yesterdayDate}?from=USD&to=INR`);
    
    if (today && yesterday) {
      const tData = await today.json();
      const yData = await yesterday.json();
      
      const rateToday = safeFloat(tData?.rates?.INR);
      const rateYesterday = safeFloat(yData?.rates?.INR);
      
      if (rateToday && rateYesterday) {
        const changePct = ((rateToday - rateYesterday) / rateYesterday) * 100;
        return { 
          rate: safeFloat(rateToday.toFixed(2)), 
          change: safeFloat(changePct.toFixed(2)) 
        };
      }
    }
  } catch { /**/ }

  // Fallback if frankfurter fails completely
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
    let price  = safeFloat(meta?.regularMarketPrice);
    
    // Yahoo's meta.chartPreviousClose is broken for commodities (returns current price).
    // So we fetch range=5d and get the actual previous close from the historical quotes.
    const closes = (data as any)?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
    const validCloses = closes.filter((c: any) => c !== null);
    
    let prevClose = safeFloat(meta?.chartPreviousClose);
    if (validCloses.length >= 2) {
      prevClose = safeFloat(validCloses[validCloses.length - 2]);
    }
    
    if (!price || !prevClose) return null;
    
    const changePct = ((price - prevClose) / prevClose) * 100;
    
    return { 
      value: safeFloat(price.toFixed(2)), 
      change: safeFloat(changePct.toFixed(2)) 
    };
  } catch { return null; }
}

async function fetchIndex(symbol: string): Promise<{ value: number; change: number }> {
  const queryUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;

  // Method 1: Vercel serverless /api/yahoo — server-side, no CORS restriction
  try {
    const res = await safeFetch(`/api/yahoo?symbol=${encodeURIComponent(symbol)}`);
    if (res) {
      const parsed = parseYahooMeta(await res.json());
      if (parsed) return parsed;
    }
  } catch { /**/ }

  // Method 2: allorigins /get proxy
  try {
    const targetUrl = encodeURIComponent(queryUrl);
    const res = await safeFetch(`https://api.allorigins.win/get?url=${targetUrl}`);
    if (res) {
      const wrapper = await res.json();
      const parsed = parseYahooMeta(JSON.parse(wrapper.contents));
      if (parsed) return parsed;
    }
  } catch { /**/ }

  // Method 3: corsproxy.io
  try {
    const targetUrl = encodeURIComponent(queryUrl);
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

async function fetchUSMarkets(usdInrRate: number): Promise<{
  nasdaq: MarketData['nasdaq'];
  sp500: MarketData['sp500'];
  dowjones: MarketData['dowjones'];
  treasury10y: MarketData['treasury10y'];
  goldInrPerGram: MarketData['goldInrPerGram'];
  oilWti: MarketData['oilWti'];
}> {
  const [nasdaq, sp500, dowjones, treasury10y, goldRaw, oilWti] = await Promise.all([
    fetchIndex('^IXIC'),
    fetchIndex('^GSPC'),
    fetchIndex('^DJI'),
    fetchIndex('^TNX'),
    fetchIndex('GC=F'),
    fetchIndex('CL=F'),
  ]);

  // Convert Gold from USD/oz → INR/gram
  const TROY_OZ_TO_GRAMS = 31.1035;
  const goldUsdPerGram = goldRaw.value / TROY_OZ_TO_GRAMS;
  const goldInrPerGram = usdInrRate > 0
    ? parseFloat((goldUsdPerGram * usdInrRate).toFixed(2))
    : 0;

  return {
    nasdaq,
    sp500,
    dowjones,
    treasury10y,
    goldInrPerGram: { value: goldInrPerGram, change: goldRaw.change },
    oilWti,
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

    // Fetch US markets after we have USD/INR rate (needed for gold conversion)
    const us = await fetchUSMarkets(usdInr.rate);

    return {
      btc: crypto.btc,
      eth: crypto.eth,
      sol: crypto.sol,
      usdInr,
      sensex: indian.sensex,
      nifty: indian.nifty,
      nasdaq: us.nasdaq,
      sp500: us.sp500,
      dowjones: us.dowjones,
      treasury10y: us.treasury10y,
      goldInrPerGram: us.goldInrPerGram,
      oilWti: us.oilWti,
    };
  } catch { return null; }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchMarketData(): Promise<MarketResult> {
  // Wipe every known old cache key on load
  ['market_data_v10','market_data_v9','market_data_v8','market_data_v7','market_data_cache_v6','market_data_cache_v5',
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