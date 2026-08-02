import { useEffect, useState } from 'react';
import { Card, SkeletonCard } from '../components/UI/Card';
import { ExternalLink, RefreshCw, Brain } from 'lucide-react';
import {
  fetchGeopoliticalNews,
  fetchFinanceNews,
  fetchFintechNews,
  fetchConsultingNews,
} from '../services/newsService';
import { formatRelativeTime } from '../utils/storage';
import { getDailyTopics } from '../utils/dailyTopics';
import psychologyData from '../data/psychology.json';
import type { NewsArticle } from '../types';

type NewsTab = 'geopolitical' | 'finance' | 'fintech' | 'consultancy' | 'psychology';

interface PsychologyTopic {
  id: number;
  title: string;
  content: string;
}

const typedPsychData = psychologyData as PsychologyTopic[];

export function NewsPage() {
  const [activeTab, setActiveTab] = useState<NewsTab>('geopolitical');
  const [geoNews, setGeoNews]           = useState<NewsArticle[]>([]);
  const [finNews, setFinNews]           = useState<NewsArticle[]>([]);
  const [fintechNews, setFintechNews]   = useState<NewsArticle[]>([]);
  const [consultingNews, setConsultingNews] = useState<NewsArticle[]>([]);
  const [keyInsight, setKeyInsight]     = useState<string>('');
  const [loading, setLoading]           = useState(true);

  // Psychology topics are date-driven — no fetch needed
  const dailyTopics = getDailyTopics<PsychologyTopic>(typedPsychData, 2);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    
    // Fetch individually to prevent one failure from crashing the page
    await Promise.all([
      fetchGeopoliticalNews()
        .then(setGeoNews)
        .catch(() => setGeoNews([])),
      
      fetchFinanceNews()
        .then(fin => {
          setFinNews(fin.articles);
          setKeyInsight(fin.keyInsight);
        })
        .catch(() => {
          setFinNews([]);
          setKeyInsight('');
        }),
      
      fetchFintechNews()
        .then(setFintechNews)
        .catch(() => setFintechNews([])),
      
      fetchConsultingNews()
        .then(setConsultingNews)
        .catch(() => setConsultingNews([])),
    ]);
    
    setLoading(false);
  };

  // Article counts per tab
  const tabCounts: Record<NewsTab, number> = {
    geopolitical: geoNews.length,
    finance:      finNews.length,
    fintech:      fintechNews.length,
    consultancy:  consultingNews.length,
    psychology:   dailyTopics.length,
  };

  const TABS: { id: NewsTab; label: string }[] = [
    { id: 'geopolitical', label: 'Geopolitical' },
    { id: 'finance',      label: 'Finance' },
    { id: 'fintech',      label: 'Fintech' },
    { id: 'consultancy',  label: 'Consultancy' },
    { id: 'psychology',   label: 'Psychology' },
  ];

  const NewsCard = ({ article }: { article: NewsArticle }) => (
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

  const PsychologyCard = ({ topic }: { topic: PsychologyTopic }) => (
    <Card className="flex flex-col space-y-3">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent">
          Psychology
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 font-mono">
          #{topic.id}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold leading-snug text-gray-900 dark:text-white">
        {topic.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {topic.content}
      </p>
    </Card>
  );

  const EmptyState = () => (
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
  );

  const activeArticles: NewsArticle[] =
    activeTab === 'geopolitical' ? geoNews :
    activeTab === 'finance'      ? finNews :
    activeTab === 'fintech'      ? fintechNews :
    activeTab === 'consultancy'  ? consultingNews :
    [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">News</h1>
        <button
          onClick={loadNews}
          disabled={loading}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Tabs — horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {TABS.map(tab => {
          const count = tabCounts[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors shrink-0 ${
                isActive
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
              {!loading && count > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Key insight banner for Finance tab */}
      {activeTab === 'finance' && keyInsight && !loading && (
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

      {/* Psychology tab — daily topics from JSON */}
      {activeTab === 'psychology' && (
        <div className="space-y-4">
          <Card className="bg-accent/5 dark:bg-accent/10 border-accent/20 dark:border-accent/20">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-1 h-12 bg-accent dark:bg-accent rounded-full" />
              <div>
                <p className="text-xs font-medium text-accent dark:text-accent mb-1 flex items-center gap-1.5">
                  <Brain size={12} />
                  TODAY'S PSYCHOLOGY TOPICS
                </p>
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                  {dailyTopics.length > 0
                    ? `Reading topics #${dailyTopics[0].id} & #${dailyTopics[1]?.id} today — come back tomorrow for the next 2!`
                    : 'Loading topics...'}
                </p>
              </div>
            </div>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            {dailyTopics.map(topic => (
              <PsychologyCard key={topic.id} topic={topic} />
            ))}
          </div>
        </div>
      )}

      {/* News articles grid for all other tabs */}
      {activeTab !== 'psychology' && (
        loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
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
          <EmptyState />
        )
      )}
    </div>
  );
}
