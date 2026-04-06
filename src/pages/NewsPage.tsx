import { useEffect, useState } from 'react';
import { Card, SkeletonCard } from '../components/UI/Card';
import { ExternalLink } from 'lucide-react';
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
          <span className="text-xs px-2 py-1 rounded bg-[#0C3B6E]/10 text-[#0C3B6E] dark:bg-[#4A90E2]/20 dark:text-[#4A90E2]">
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
            className="text-xs text-[#0C3B6E] dark:text-[#4A90E2] hover:underline flex items-center gap-1"
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
          <Card>
            <p className="text-gray-600 dark:text-gray-400">
              No geopolitical news available at the moment.
            </p>
          </Card>
        )}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg lg:text-xl font-medium mb-3 text-gray-900 dark:text-white">
            Finance & Consulting News
          </h2>
          {keyInsight && (
            <Card className="bg-[#0C3B6E]/5 dark:bg-[#4A90E2]/10 border-[#0C3B6E]/20 dark:border-[#4A90E2]/20">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-1 h-12 bg-[#0C3B6E] dark:bg-[#4A90E2] rounded-full" />
                <div>
                  <p className="text-xs font-medium text-[#0C3B6E] dark:text-[#4A90E2] mb-1">
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
          <Card>
            <p className="text-gray-600 dark:text-gray-400">
              No finance news available at the moment.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
