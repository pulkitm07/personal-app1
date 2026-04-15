import { Card, SkeletonCard } from '../UI/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketData } from '../../types';

interface MarketsSectionProps {
  markets: MarketData | null;
  loading?: boolean;
}

export function MarketsSection({ markets, loading }: MarketsSectionProps) {
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

  if (!markets) return null;

  const marketItems = [
    {
      label: 'Bitcoin',
      symbol: 'BTC',
      value: markets.btc.price,
      change: markets.btc.change24h,
      prefix: '$',
    },
    {
      label: 'Ethereum',
      symbol: 'ETH',
      value: markets.eth.price,
      change: markets.eth.change24h,
      prefix: '$',
    },
    {
      label: 'Solana',
      symbol: 'SOL',
      value: markets.sol.price,
      change: markets.sol.change24h,
      prefix: '$',
    },
    {
      label: 'USD/INR',
      symbol: 'FOREX',
      value: markets.usdInr.rate,
      change: markets.usdInr.change,
      prefix: '₹',
    },
    {
      label: 'Sensex',
      symbol: 'BSE',
      value: markets.sensex.value,
      change: markets.sensex.change,
      prefix: '',
    },
    {
      label: 'Nifty 50',
      symbol: 'NSE',
      value: markets.nifty.value,
      change: markets.nifty.change,
      prefix: '',
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-base lg:text-lg font-medium mb-4 text-gray-900 dark:text-white">
        Markets
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {marketItems.map((item) => (
          <Card key={item.symbol} className="!p-3">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.symbol}
                </p>
              </div>

              <div>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {item.prefix}
                  {item.value.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div
                  className={`flex items-center gap-1 text-xs ${
                    item.change >= 0
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {item.change >= 0 ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
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
    </div>
  );
}

