import { useEffect, useState } from 'react';
import { QuoteSection } from '../components/Home/QuoteSection';
import { MarketsSection } from '../components/Home/MarketsSection';
import { fetchMarketData } from '../services/marketService';
import quotesData from '../data/quotes.json';
import type { Quote, MarketData } from '../types';

export function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [markets, setMarkets] = useState<MarketData | null>(null);
  const [marketsFetchedAt, setMarketsFetchedAt] = useState<number | null>(null);
  const [marketsIsStale, setMarketsIsStale] = useState(false);
  const [marketsLoading, setMarketsLoading] = useState(true);

  useEffect(() => {
    loadDailyContent();
  }, []);

  const loadDailyContent = async () => {
    // Quote — deterministic by day of year
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setQuote(quotesData[dayOfYear % quotesData.length]);

    // Markets
    setMarketsLoading(true);
    const marketData = await fetchMarketData();
    setMarkets(marketData.data);
    setMarketsFetchedAt(marketData.fetchedAt);
    setMarketsIsStale(marketData.isStale);
    setMarketsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. Motivational Quote */}
      {quote && <QuoteSection quote={quote} />}

      {/* 2. Market Rates */}
      <MarketsSection
        markets={markets}
        fetchedAt={marketsFetchedAt}
        isStale={marketsIsStale}
        loading={marketsLoading}
      />
    </div>
  );
}
