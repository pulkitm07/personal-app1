import { Card, SkeletonCard } from '../UI/Card';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import type { MarketData } from '../../types';

interface MarketsSectionProps {
  markets: MarketData | null;
  fetchedAt: number | null;
  isStale: boolean;
  loading?: boolean;
}

// ── Relative timestamp helper ─────────────────────────────────────────────────
function relativeTime(epochMs: number | null): string {
  if (!epochMs) return '';
  const diffSec = Math.floor((Date.now() - epochMs) / 1000);
  if (diffSec < 60) return 'Updated just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin === 1) return 'Updated 1 min ago';
  if (diffMin < 60) return `Updated ${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `Updated ${diffHr}h ago`;
}

export function MarketsSection({ markets, fetchedAt, isStale, loading }: MarketsSectionProps) {
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
      {/* Header: title + live/stale indicator */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-base lg:text-lg font-medium text-gray-900 dark:text-white">
          Markets
        </h2>

        {isStale ? (
          /* ⚠ Stale — API failed or data >2h old */
          <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 px-2 py-0.5 rounded-full">
            <AlertTriangle size={11} />
            {markets ? 'Prices may be outdated' : '⚠ Prices unavailable'}
          </span>
        ) : fetchedAt ? (
          /* 🟢 Live */
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {relativeTime(fetchedAt)}
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
            { label: 'Bitcoin',   symbol: 'BTC',   value: markets.btc.price,     change: markets.btc.change24h,  prefix: '$' },
            { label: 'Ethereum',  symbol: 'ETH',   value: markets.eth.price,     change: markets.eth.change24h,  prefix: '$' },
            { label: 'Solana',    symbol: 'SOL',   value: markets.sol.price,     change: markets.sol.change24h,  prefix: '$' },
            { label: 'USD/INR',   symbol: 'FOREX', value: markets.usdInr.rate,   change: markets.usdInr.change,  prefix: '₹' },
            { label: 'Sensex',    symbol: 'BSE',   value: markets.sensex.value,  change: markets.sensex.change,  prefix: ''  },
            { label: 'Nifty 50',  symbol: 'NSE',   value: markets.nifty.value,   change: markets.nifty.change,   prefix: ''  },
          ].map((item) => (
            <Card key={item.symbol} className="!p-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.symbol}</p>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {item.prefix}
                    {item.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
