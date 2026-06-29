import { useEffect, useRef, useState } from 'react';
import { Card, SkeletonCard } from '../UI/Card';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { MarketData } from '../../types';
import { fetchMarketData } from '../../services/marketService';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface MarketsSectionProps {
  markets: MarketData | null;
  fetchedAt: number | null;
  isStale: boolean;
  loading?: boolean;
}

function formatValue(value: number, prefix: string, fractionDigits = 2): string {
  if (!value || value === 0) return '—';
  return `${prefix}${value.toLocaleString('en-IN', { maximumFractionDigits: fractionDigits })}`;
}

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function MarketsSection({ markets: initialMarkets, fetchedAt: initialFetchedAt, isStale: initialIsStale, loading }: MarketsSectionProps) {
  const [markets, setMarkets] = useState<MarketData | null>(initialMarkets);
  const [fetchedAt, setFetchedAt] = useState<number | null>(initialFetchedAt);
  const [isStale, setIsStale] = useState(initialIsStale);
  const [countdown, setCountdown] = useState<number>(REFRESH_INTERVAL_MS);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync with parent props on first load
  useEffect(() => {
    setMarkets(initialMarkets);
    setFetchedAt(initialFetchedAt);
    setIsStale(initialIsStale);
  }, [initialMarkets, initialFetchedAt, initialIsStale]);

  // Set up 5-minute auto-refresh
  useEffect(() => {
    const doRefresh = async () => {
      // Force cache bypass by clearing this key before fetch
      try { localStorage.removeItem('market_data_cache_v7'); } catch {}

      const result = await fetchMarketData();
      if (result.data) {
        setMarkets(result.data);
        setFetchedAt(result.fetchedAt);
        setIsStale(result.isStale);
      }
      setCountdown(REFRESH_INTERVAL_MS);
    };

    intervalRef.current = setInterval(doRefresh, REFRESH_INTERVAL_MS);

    // Countdown tick every second
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

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

      {/* Unavailable state */}
      {!markets ? (
        <Card className="flex flex-col items-center justify-center p-6 text-center space-y-2">
          <AlertTriangle size={20} className="text-amber-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Market prices could not be loaded right now. Please refresh to try again.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Bitcoin',  symbol: 'BTC',   value: markets.btc.price,    change: markets.btc.change24h,  prefix: '$' },
            { label: 'Ethereum', symbol: 'ETH',   value: markets.eth.price,    change: markets.eth.change24h,  prefix: '$' },
            { label: 'Solana',   symbol: 'SOL',   value: markets.sol.price,    change: markets.sol.change24h,  prefix: '$' },
            { label: 'USD/INR',  symbol: 'FOREX', value: markets.usdInr.rate,  change: markets.usdInr.change,  prefix: '₹' },
            { label: 'Sensex',   symbol: 'BSE',   value: markets.sensex.value, change: markets.sensex.change,  prefix: ''  },
            { label: 'Nifty 50', symbol: 'NSE',   value: markets.nifty.value,  change: markets.nifty.change,   prefix: ''  },
          ].map((item) => (
            <Card key={item.symbol} className="!p-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.symbol}</p>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatValue(item.value, item.prefix)}
                  </p>
                  {item.value > 0 ? (
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        item.change >= 0
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-red-600 dark:text-red-500'
                      }`}
                    >
                      {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>
                        {item.change >= 0 ? '+' : ''}
                        {item.change.toFixed(2)}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-600">Unavailable</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
