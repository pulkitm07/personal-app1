import { useEffect, useRef, useState } from 'react';
import { Card, SkeletonCard } from '../UI/Card';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { MarketData } from '../../types';
import { fetchMarketData } from '../../services/marketService';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface MarketsSectionProps {
  markets: MarketData | null;
  fetchedAt: number | null;
  isStale: boolean;
  loading?: boolean;
}

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// ── Card item type ─────────────────────────────────────────────────────────────

type CardMode = 'currency' | 'index' | 'yield' | 'commodity';

interface CardItem {
  label: string;  // human-readable name, e.g. "Bitcoin"
  unit: string;   // clean unit label shown under name, e.g. "USD" — NEVER a raw ticker
  key: string;    // unique React key, can be the raw ticker internally
  value: number;
  change: number;
  prefix: string;
  suffix: string;
  subLabel: string;
  fractionDigits: number;
  mode: CardMode;
}

function formatValue(
  value: number,
  prefix: string,
  suffix: string,
  fractionDigits: number,
): string {
  if (!value || value === 0) return '—';
  return `${prefix}${value.toLocaleString('en-IN', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  })}${suffix}`;
}

// ── Change row — BUG 1 FIX ────────────────────────────────────────────────────
// "Unavailable" is shown ONLY when the price itself is 0 (i.e. !hasData at card level).
// A change of exactly 0.00% is valid and should display normally (e.g. during pre-market).
function ChangeRow({ change, mode }: { change: number; mode: CardMode }) {
  const isUp = change >= 0;
  const colorCls = isUp
    ? 'text-green-600 dark:text-green-500'
    : 'text-red-600 dark:text-red-500';

  if (mode === 'yield') {
    const bps = (change * 100).toFixed(1);
    return (
      <div className={`flex items-center gap-1 text-xs ${colorCls}`}>
        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        <span>{isUp ? '+' : ''}{bps} bps</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 text-xs ${colorCls}`}>
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      <span>{isUp ? '+' : ''}{change.toFixed(2)}%</span>
    </div>
  );
}

// ── Single card ────────────────────────────────────────────────────────────────

function MarketCard({ item }: { item: CardItem }) {
  const hasData = item.value > 0;
  return (
    <Card className="!p-3">
      <div className="space-y-2">
        <div>
          {/* BUG 2 FIX: show clean unit label, not raw ticker */}
          <p className="text-xs text-gray-600 dark:text-gray-400">{item.label}</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.unit}</p>
        </div>
        <div>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {hasData
              ? formatValue(item.value, item.prefix, item.suffix, item.fractionDigits)
              : '—'}
          </p>
          {item.subLabel && (
            <p className="text-[10px] text-gray-400 dark:text-gray-600 leading-tight mb-0.5">
              {item.subLabel}
            </p>
          )}
          {/* BUG 1 FIX: "Unavailable" only when price is missing, not when change = 0 */}
          {hasData ? (
            <ChangeRow change={item.change} mode={item.mode} />
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-600">Unavailable</p>
          )}
        </div>
      </div>
    </Card>
  );
}

// ── Group wrapper — BUG 3 FIX ─────────────────────────────────────────────────
// Each group of 3 gets its own label + 3-column grid.

function MarketGroup({
  label,
  items,
  showDivider = true,
}: {
  label: string;
  items: CardItem[];
  showDivider?: boolean;
}) {
  return (
    <>
      {showDivider && (
        <div className="border-t border-gray-200 dark:border-gray-800 mt-5" />
      )}
      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-2 mt-4">
        {label}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map(item => (
          <MarketCard key={item.key} item={item} />
        ))}
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function MarketsSection({
  markets: initialMarkets,
  fetchedAt: initialFetchedAt,
  isStale: initialIsStale,
  loading,
}: MarketsSectionProps) {
  const [markets, setMarkets] = useState<MarketData | null>(initialMarkets);
  const [fetchedAt, setFetchedAt] = useState<number | null>(initialFetchedAt);
  const [isStale, setIsStale] = useState(initialIsStale);
  const [countdown, setCountdown] = useState<number>(REFRESH_INTERVAL_MS);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMarkets(initialMarkets);
    setFetchedAt(initialFetchedAt);
    setIsStale(initialIsStale);
  }, [initialMarkets, initialFetchedAt, initialIsStale]);

  useEffect(() => {
    const doRefresh = async () => {
      try { localStorage.removeItem('market_data_v10'); } catch {}
      const result = await fetchMarketData();
      if (result.data) {
        setMarkets(result.data);
        setFetchedAt(result.fetchedAt);
        setIsStale(result.isStale);
      }
      setCountdown(REFRESH_INTERVAL_MS);
    };

    intervalRef.current = setInterval(doRefresh, REFRESH_INTERVAL_MS);

    const start = Date.now();
    countdownRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = REFRESH_INTERVAL_MS - (elapsed % REFRESH_INTERVAL_MS);
      setCountdown(remaining);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="mb-6">
        <h2 className="text-base lg:text-lg font-medium mb-4 text-gray-900 dark:text-white">
          Markets
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── BUG 3 FIX: 4 clean groups of 3 ──────────────────────────────────────────

  const cryptoCards: CardItem[] = markets ? [
    { key: 'BTC',  label: 'Bitcoin',  unit: 'USD', value: markets.btc.price, change: markets.btc.change24h, prefix: '$', suffix: '', subLabel: '', fractionDigits: 0, mode: 'currency' },
    { key: 'ETH',  label: 'Ethereum', unit: 'USD', value: markets.eth.price, change: markets.eth.change24h, prefix: '$', suffix: '', subLabel: '', fractionDigits: 2, mode: 'currency' },
    { key: 'SOL',  label: 'Solana',   unit: 'USD', value: markets.sol.price, change: markets.sol.change24h, prefix: '$', suffix: '', subLabel: '', fractionDigits: 2, mode: 'currency' },
  ] : [];

  const indiaCards: CardItem[] = markets ? [
    { key: 'FOREX',  label: 'USD / INR', unit: 'Forex', value: markets.usdInr.rate,  change: markets.usdInr.change,  prefix: '₹', suffix: '',  subLabel: '',          fractionDigits: 2, mode: 'currency' },
    { key: 'SENSEX', label: 'Sensex',    unit: 'BSE',   value: markets.sensex.value, change: markets.sensex.change,  prefix: '',  suffix: '',  subLabel: 'Index pts', fractionDigits: 0, mode: 'index'   },
    { key: 'NIFTY',  label: 'Nifty 50', unit: 'NSE',   value: markets.nifty.value,  change: markets.nifty.change,   prefix: '',  suffix: '',  subLabel: 'Index pts', fractionDigits: 0, mode: 'index'   },
  ] : [];

  const usCards: CardItem[] = markets ? [
    { key: 'NASDAQ', label: 'Nasdaq',    unit: 'USD', value: markets.nasdaq.value,   change: markets.nasdaq.change,   prefix: '', suffix: '', subLabel: 'Index pts', fractionDigits: 0, mode: 'index' },
    { key: 'SP500',  label: 'S&P 500',   unit: 'USD', value: markets.sp500.value,    change: markets.sp500.change,    prefix: '', suffix: '', subLabel: 'Index pts', fractionDigits: 0, mode: 'index' },
    { key: 'DJI',    label: 'Dow Jones', unit: 'USD', value: markets.dowjones.value, change: markets.dowjones.change, prefix: '', suffix: '', subLabel: 'Index pts', fractionDigits: 0, mode: 'index' },
  ] : [];

  const ratesCards: CardItem[] = markets ? [
    { key: 'TNX',  label: '10-Yr Yield', unit: 'US Treasury', value: markets.treasury10y.value,    change: markets.treasury10y.change,    prefix: '',  suffix: '%', subLabel: 'Yield',   fractionDigits: 3, mode: 'yield'     },
    { key: 'GOLD', label: 'Gold',         unit: 'INR/gram',    value: markets.goldInrPerGram.value, change: markets.goldInrPerGram.change, prefix: '₹', suffix: '',  subLabel: '',        fractionDigits: 2, mode: 'commodity' },
    { key: 'OIL',  label: 'Oil (WTI)',    unit: 'USD/bbl',     value: markets.oilWti.value,         change: markets.oilWti.change,         prefix: '$', suffix: '',  subLabel: '',        fractionDigits: 2, mode: 'commodity' },
  ] : [];

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-base lg:text-lg font-medium text-gray-900 dark:text-white">
          Markets
        </h2>

        {isStale ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 px-2 py-0.5 rounded-full">
            <AlertTriangle size={11} />
            {markets ? 'Prices may be outdated' : 'Prices unavailable'}
          </span>
        ) : fetchedAt ? (
          <span className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Updated just now
            <span className="text-gray-400 dark:text-gray-500 font-normal">
              · Updates in {formatCountdown(countdown)}
            </span>
          </span>
        ) : null}
      </div>

      {!markets ? (
        <Card className="flex flex-col items-center justify-center p-6 text-center space-y-2">
          <AlertTriangle size={20} className="text-amber-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Market prices could not be loaded right now. Please refresh to try again.
          </p>
        </Card>
      ) : (
        <>
          {/* Group 1 — Crypto */}
          <MarketGroup label="Crypto" items={cryptoCards} showDivider={false} />

          {/* Group 2 — Indian Markets */}
          <MarketGroup label="Indian Markets" items={indiaCards} />

          {/* Group 3 — US Markets */}
          <MarketGroup label="US Markets" items={usCards} />

          {/* Group 4 — Rates & Commodities */}
          <MarketGroup label="Rates & Commodities" items={ratesCards} />
        </>
      )}
    </div>
  );
}
