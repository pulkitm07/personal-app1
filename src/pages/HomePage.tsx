import { useEffect, useState } from 'react';
import { Card, SkeletonCard } from '../components/UI/Card';
import { QuoteSection } from '../components/Home/QuoteSection';
import { MarketsSection } from '../components/Home/MarketsSection';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { fetchGeopoliticalNews, fetchFinanceNews, fetchConsultingNews } from '../services/newsService';
import { fetchMarketData } from '../services/marketService';
import { formatRelativeTime } from '../utils/storage';
import quotesData from '../data/quotes.json';
import type { Quote, MarketData, NewsArticle } from '../types';

type NewsTab = 'geopolitical' | 'financial' | 'consulting';

const TABS: { id: NewsTab; label: string }[] = [
  { id: 'geopolitical', label: 'Geopolitical' },
  { id: 'financial',    label: 'Financial' },
  { id: 'consulting',   label: 'Consulting' },
];

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent">
            {article.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500 shrink-0">
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>

        <h3 className="text-[15px] font-medium leading-snug text-gray-900 dark:text-white">
          {article.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500 dark:text-gray-500">{article.source}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent dark:text-accent hover:underline flex items-center gap-1"
          >
            Read full story
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </Card>
  );
}

export function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  
  const [activeTab, setActiveTab] = useState<NewsTab>('geopolitical');
  const [geoNews, setGeoNews] = useState<NewsArticle[]>([]);
  const [finNews, setFinNews] = useState<NewsArticle[]>([]);
  const [consultingNews, setConsultingNews] = useState<NewsArticle[]>([]);
  const [keyInsight, setKeyInsight] = useState<string>('');
  
  const [markets, setMarkets] = useState<MarketData | null>(null);
  const [marketsFetchedAt, setMarketsFetchedAt] = useState<number | null>(null);
  const [marketsIsStale, setMarketsIsStale] = useState(false);
  const [newsLoading, setNewsLoading] = useState(true);
  const [marketsLoading, setMarketsLoading] = useState(true);

  useEffect(() => {
    loadDailyContent();
  }, []);

  const loadDailyContent = async () => {
    // Quote
    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setQuote(quotesData[dayOfYear % quotesData.length]);

    // Load markets and news concurrently
    setNewsLoading(true);
    setMarketsLoading(true);

    const [marketData, geo, fin, consulting] = await Promise.all([
      fetchMarketData(),
      fetchGeopoliticalNews(),
      fetchFinanceNews(),
      fetchConsultingNews(),
    ]);

    setMarkets(marketData.data);
    setMarketsFetchedAt(marketData.fetchedAt);
    setMarketsIsStale(marketData.isStale);
    setMarketsLoading(false);

    setGeoNews(geo);
    setFinNews(fin.articles);
    setKeyInsight(fin.keyInsight);
    setConsultingNews(consulting);
    setNewsLoading(false);
  };

  const activeArticles =
    activeTab === 'geopolitical' ? geoNews :
    activeTab === 'financial'    ? finNews :
    consultingNews;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* 1. Motivational Quote */}
      {quote && <QuoteSection quote={quote} />}

      {/* 2. News with Tabs */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="text-lg lg:text-xl font-medium text-gray-900 dark:text-white">
            Daily News
          </h2>
        </div>
        
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'financial' && keyInsight && !newsLoading && (
          <Card className="mb-4 bg-accent/5 dark:bg-accent/10 border-accent/20 dark:border-accent/20">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-1 h-12 bg-accent dark:bg-accent rounded-full" />
              <div>
                <p className="text-xs font-medium text-accent dark:text-accent mb-1">
                  TODAY'S KEY INSIGHT
                </p>
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                  {keyInsight}
                </p>
              </div>
            </div>
          </Card>
        )}

        {newsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : activeArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeArticles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Could not load news feeds — check your connection and try again.
            </p>
            <button
              onClick={loadDailyContent}
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent dark:bg-accent/10 dark:hover:bg-accent/20 dark:text-accent rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Refresh Feeds
            </button>
          </Card>
        )}
      </section>

      {/* 3. Market Rates */}
      <MarketsSection
        markets={markets}
        fetchedAt={marketsFetchedAt}
        isStale={marketsIsStale}
        loading={marketsLoading}
      />
    </div>
  );
}
