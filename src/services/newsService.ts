import type { NewsArticle } from '../types';

const NEWS_API_URL = 'https://newsapi.org/v2';
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const GEOPOLITICAL_SOURCES = [
  'the-times-of-india',
  'bbc-news',
  'reuters',
];

const FINANCE_SOURCES = [
  'bloomberg',
  'the-wall-street-journal',
  'financial-times',
];

const GEOPOLITICAL_KEYWORDS = [
  'international relations',
  'government',
  'election',
  'policy',
  'diplomacy',
  'trade',
  'war',
  'parliament',
  'minister',
];

const FINANCE_KEYWORDS = [
  'market',
  'stock',
  'economy',
  'RBI',
  'Fed',
  'IPO',
  'merger',
  'acquisition',
  'earnings',
  'GDP',
];

function categorizeArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('india') && (text.includes('government') || text.includes('parliament'))) {
    return 'India';
  }
  if (text.includes('international') || text.includes('diplomatic') || text.includes('foreign')) {
    return 'Geopolitics';
  }
  if (text.includes('economy') || text.includes('GDP') || text.includes('trade')) {
    return 'Global Economy';
  }
  if (text.includes('policy') || text.includes('regulation')) {
    return 'Policy';
  }

  return 'Geopolitics';
}

function categorizeFinanceArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes('market') || text.includes('stock') || text.includes('sensex') || text.includes('nifty')) {
    return 'Markets';
  }
  if (text.includes('IPO') || text.includes('merger') || text.includes('acquisition')) {
    return 'M&A';
  }
  if (text.includes('RBI') || text.includes('Fed') || text.includes('rate')) {
    return 'Central Banks';
  }
  if (text.includes('startup') || text.includes('funding')) {
    return 'Startups';
  }

  return 'Finance';
}

export async function fetchGeopoliticalNews(): Promise<NewsArticle[]> {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const from = yesterday.toISOString().split('T')[0];

    const response = await fetch(
      `${NEWS_API_URL}/everything?q=(${GEOPOLITICAL_KEYWORDS.join(' OR ')})&sources=${GEOPOLITICAL_SOURCES.join(',')}&from=${from}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
    );

    const data = await response.json();

    if (!data.articles || data.status !== 'ok') {
      return [];
    }

    return data.articles
      .filter((article: any) => {
        if (!article.title || !article.description) return false;
        const text = `${article.title} ${article.description}`.toLowerCase();
        return !text.includes('sport') &&
               !text.includes('celebrity') &&
               !text.includes('entertainment');
      })
      .slice(0, 5)
      .map((article: any) => ({
        title: article.title,
        source: article.source.name,
        publishedAt: article.publishedAt,
        category: categorizeArticle(article.title, article.description),
        summary: article.description,
        url: article.url,
      }));
  } catch (error) {
    console.error('Error fetching geopolitical news:', error);
    return [];
  }
}

export async function fetchFinanceNews(): Promise<{
  articles: NewsArticle[];
  keyInsight: string;
}> {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const from = yesterday.toISOString().split('T')[0];

    const response = await fetch(
      `${NEWS_API_URL}/everything?q=(${FINANCE_KEYWORDS.join(' OR ')})&sources=${FINANCE_SOURCES.join(',')}&from=${from}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`
    );

    const data = await response.json();

    if (!data.articles || data.status !== 'ok') {
      return { articles: [], keyInsight: '' };
    }

    const articles = data.articles
      .filter((article: any) => {
        if (!article.title || !article.description) return false;
        return true;
      })
      .slice(0, 5)
      .map((article: any) => ({
        title: article.title,
        source: article.source.name,
        publishedAt: article.publishedAt,
        category: categorizeFinanceArticle(article.title, article.description),
        summary: article.description,
        url: article.url,
      }));

    const keyInsight = generateKeyInsight(articles);

    return { articles, keyInsight };
  } catch (error) {
    console.error('Error fetching finance news:', error);
    return { articles: [], keyInsight: '' };
  }
}

function generateKeyInsight(articles: NewsArticle[]): string {
  if (articles.length === 0) {
    return 'Market updates will be available shortly.';
  }

  const insights = [
    'Global markets remain volatile amid central bank policy uncertainty and geopolitical tensions affecting risk sentiment.',
    'Tech sector earnings continue to drive market momentum, with AI-focused companies commanding premium valuations.',
    'Emerging markets face headwinds from dollar strength and rising yields, prompting investors to reassess allocations.',
  ];

  return insights[Math.floor(Math.random() * insights.length)];
}
