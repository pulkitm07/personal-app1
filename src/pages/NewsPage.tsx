import { useEffect, useState } from 'react';
import { Card, SkeletonCard } from '../components/UI/Card';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { fetchGeopoliticalNews, fetchFinanceNews } from '../services/newsService';
import { formatRelativeTime } from '../utils/storage';
import type { NewsArticle } from '../types';

export function NewsPage() {
  const [geoNews, setGeoNews] = useState<NewsArticle[]>([]);
  const [finNews, setFinNews] = useState<NewsArticle[]>([]);
  const [keyInsight, setKeyInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const [geo, fin] = await Promise.all([
      fetchGeopoliticalNews(),
      fetchFinanceNews(),
    ]);
    setGeoNews(geo);
    setFinNews(fin.articles);
    setKeyInsight(fin.keyInsight);
    setLoading(false);
  };

  const NewsCard = ({ article }: { article: NewsArticle }) => (
    <Card className="h-full flex flex-col">
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent">
            {article.category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-500">
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
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {article.source}
          </span>
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section>
        <h2 className="text-lg lg:text-xl font-medium mb-4 text-gray-900 dark:text-white">
          Geopolitical News
        </h2>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : geoNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geoNews.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              News feeds are loading — tap the refresh button to try again.
            </p>
            <button 
              onClick={loadNews} 
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent dark:bg-accent/10 dark:hover:bg-accent/20 dark:text-accent rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Refresh Feeds
            </button>
          </Card>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg lg:text-xl font-medium mb-3 text-gray-900 dark:text-white">
            Finance & Consulting News
          </h2>
          {keyInsight && (
            <Card className="bg-accent/5 dark:bg-accent/10 border-accent/20 dark:border-accent/20">
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
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : finNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {finNews.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              News feeds are loading — tap the refresh button to try again.
            </p>
            <button 
              onClick={loadNews} 
              className="flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent dark:bg-accent/10 dark:hover:bg-accent/20 dark:text-accent rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Refresh Feeds
            </button>
          </Card>
        )}
      </section>
    </div>
  );
}

