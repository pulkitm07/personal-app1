import type { NewsArticle } from '../types';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY as string;
const NEWS_API_BASE = 'https://newsapi.org/v2';
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

// ── Exclusion list shared across all sections ─────────────────────────────────
const EXCLUSION_KEYWORDS = [
  'sport', 'cricket', 'football', 'soccer', 'tennis', 'ipl',
  'celebrity', 'bollywood', 'entertainment', 'movie', 'film',
  'recipe', 'horoscope', 'astrology', 'lifestyle',
];

function passesExclusion(text: string): boolean {
  return !EXCLUSION_KEYWORDS.some(kw => text.includes(kw));
}

/** Deduplicate by normalised title (first 60 chars) */
function deduplicateByTitle(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 60).trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── NewsAPI helpers ───────────────────────────────────────────────────────────

interface NewsApiArticle {
  title: string;
  description: string | null;
  url: string;
  source: { name: string };
  publishedAt: string;
}

async function fetchNewsApi(params: Record<string, string>): Promise<NewsApiArticle[]> {
  try {
    const query = new URLSearchParams({ ...params, apiKey: NEWS_API_KEY, pageSize: '100' });
    const res = await fetch(`${NEWS_API_BASE}/everything?${query}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !data.articles) return [];
    // Filter out "[Removed]" articles (NewsAPI placeholder for deleted articles)
    return (data.articles as NewsApiArticle[]).filter(
      a => a.title && a.title !== '[Removed]' && a.url
    );
  } catch {
    return [];
  }
}

async function fetchNewsApiTopHeadlines(params: Record<string, string>): Promise<NewsApiArticle[]> {
  try {
    const query = new URLSearchParams({ ...params, apiKey: NEWS_API_KEY, pageSize: '100' });
    const res = await fetch(`${NEWS_API_BASE}/top-headlines?${query}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !data.articles) return [];
    return (data.articles as NewsApiArticle[]).filter(
      a => a.title && a.title !== '[Removed]' && a.url
    );
  } catch {
    return [];
  }
}

function mapNewsApiArticle(a: NewsApiArticle, category: string): NewsArticle {
  return {
    title: a.title,
    source: a.source.name,
    publishedAt: a.publishedAt,
    category,
    summary: a.description || '',
    url: a.url,
  };
}

// ── Geopolitical categoriser ──────────────────────────────────────────────────
function categorizeGeo(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('war') || text.includes('conflict') || text.includes('ceasefire') || text.includes('missile') || text.includes('military')) return 'Conflict';
  if (text.includes('election') || text.includes('vote') || text.includes('president') || text.includes('prime minister')) return 'Politics';
  if (text.includes('climate') || text.includes('environment') || text.includes('carbon')) return 'Climate';
  if (text.includes('trade') || text.includes('tariff') || text.includes('sanction')) return 'Trade & Economy';
  if (text.includes('diplomatic') || text.includes('summit') || text.includes('foreign') || text.includes('bilateral')) return 'Diplomacy';
  if (text.includes('india') && (text.includes('government') || text.includes('modi') || text.includes('parliament'))) return 'India';
  return 'Geopolitics';
}

// ── Finance categoriser ───────────────────────────────────────────────────────
function categorizeFinance(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('sensex') || text.includes('nifty') || text.includes('bse') || text.includes('nse') || text.includes('stock market')) return 'Markets';
  if (text.includes('ipo') || text.includes('merger') || text.includes('acquisition')) return 'M&A';
  if (text.includes('rbi') || text.includes('fed') || text.includes('interest rate') || text.includes('monetary')) return 'Central Banks';
  if (text.includes('startup') || text.includes('funding') || text.includes('venture')) return 'Startups';
  if (text.includes('crypto') || text.includes('bitcoin')) return 'Crypto';
  if (text.includes('budget') || text.includes('tax') || text.includes('gdp') || text.includes('inflation')) return 'Macro';
  return 'Finance';
}

// ── Consulting categoriser ────────────────────────────────────────────────────
function categorizeConsulting(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('mckinsey') || text.includes('bcg') || text.includes('bain') || text.includes('deloitte') || text.includes('pwc') || text.includes('kpmg')) return 'Big Consulting';
  if (text.includes('strategy') || text.includes('strategic')) return 'Strategy';
  if (text.includes('leadership') || text.includes('ceo') || text.includes('executive') || text.includes('board')) return 'Leadership';
  if (text.includes('digital') || text.includes('ai') || text.includes('automation') || text.includes('innovation')) return 'Digital';
  if (text.includes('supply chain') || text.includes('operations') || text.includes('logistics')) return 'Operations';
  if (text.includes('talent') || text.includes('workforce') || text.includes('culture') || text.includes('hiring')) return 'Talent';
  return 'Management';
}

// ── RSS2JSON fallback (for consulting) ────────────────────────────────────────
const CONSULTING_FEEDS = [
  'https://hbr.org/resources/rss/topics/managing-organizations',
  'https://www.strategy-business.com/rss/',
  'https://economictimes.indiatimes.com/small-biz/rssfeeds/7771597760.cms',
];

async function fetchRssFeed(url: string): Promise<NewsApiArticle[]> {
  try {
    const res = await fetch(`${RSS2JSON_API}?rss_url=${encodeURIComponent(url)}&count=20`);
    const data = await res.json();
    if (data.status !== 'ok' || !data.items) return [];
    const sourceName: string = data.feed?.title || 'News';
    return data.items.map((item: any) => ({
      title: item.title,
      description: item.description?.replace(/<[^>]+>/g, '') || '',
      url: item.link,
      source: { name: sourceName },
      publishedAt: item.pubDate,
    }));
  } catch {
    return [];
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchGeopoliticalNews(): Promise<NewsArticle[]> {
  try {
    // Fetch top headlines (world) + targeted searches in parallel
    const [headlines, war, diplomacy, india, climate] = await Promise.all([
      fetchNewsApiTopHeadlines({ category: 'general', language: 'en' }),
      fetchNewsApi({ q: 'war OR conflict OR ceasefire OR missile OR military OR invasion', language: 'en', sortBy: 'publishedAt' }),
      fetchNewsApi({ q: 'election OR president OR diplomat OR summit OR UN OR NATO OR sanctions', language: 'en', sortBy: 'publishedAt' }),
      fetchNewsApi({ q: 'India government OR India foreign policy OR India geopolitics', language: 'en', sortBy: 'publishedAt' }),
      fetchNewsApi({ q: 'climate change OR global warming OR COP OR carbon emissions', language: 'en', sortBy: 'publishedAt' }),
    ]);

    const all = [...headlines, ...war, ...diplomacy, ...india, ...climate];

    const articles: NewsArticle[] = all
      .map(a => mapNewsApiArticle(a, categorizeGeo(a.title, a.description || '')))
      .filter(a => {
        const text = `${a.title} ${a.summary}`.toLowerCase();
        return passesExclusion(text) && a.title.length > 10;
      });

    const deduped = deduplicateByTitle(articles);

    // Sort: non-India first, then newest
    deduped.sort((a, b) => {
      if (a.category === 'India' && b.category !== 'India') return 1;
      if (b.category === 'India' && a.category !== 'India') return -1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    return deduped;
  } catch {
    return [];
  }
}

export async function fetchFinanceNews(): Promise<{ articles: NewsArticle[]; keyInsight: string }> {
  try {
    const [headlines, markets, macro, startups, india] = await Promise.all([
      fetchNewsApiTopHeadlines({ category: 'business', language: 'en' }),
      fetchNewsApi({ q: 'stock market OR Sensex OR Nifty OR BSE OR NSE OR IPO OR earnings', language: 'en', sortBy: 'publishedAt' }),
      fetchNewsApi({ q: 'RBI OR Federal Reserve OR interest rate OR inflation OR GDP OR recession', language: 'en', sortBy: 'publishedAt' }),
      fetchNewsApi({ q: 'startup funding OR venture capital OR unicorn OR merger acquisition', language: 'en', sortBy: 'publishedAt' }),
      fetchNewsApi({ q: 'India economy OR India finance OR India budget OR India trade', language: 'en', sortBy: 'publishedAt' }),
    ]);

    const all = [...headlines, ...markets, ...macro, ...startups, ...india];

    const articles: NewsArticle[] = all
      .map(a => mapNewsApiArticle(a, categorizeFinance(a.title, a.description || '')))
      .filter(a => {
        const text = `${a.title} ${a.summary}`.toLowerCase();
        return passesExclusion(text) && a.title.length > 10;
      });

    const deduped = deduplicateByTitle(articles);
    deduped.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const keyInsight = generateKeyInsight(deduped);
    return { articles: deduped, keyInsight };
  } catch {
    return { articles: [], keyInsight: '' };
  }
}

export async function fetchConsultingNews(): Promise<NewsArticle[]> {
  try {
    // NewsAPI for consulting/strategy/management + RSS feeds as supplement
    const [newsApi, ...rssResults] = await Promise.all([
      fetchNewsApi({
        q: 'management consulting OR business strategy OR McKinsey OR BCG OR Deloitte OR leadership OR organizational change OR digital transformation',
        language: 'en',
        sortBy: 'publishedAt',
      }),
      ...CONSULTING_FEEDS.map(url => fetchRssFeed(url)),
    ]);

    const rssArticles = rssResults.flat();
    const all = [...newsApi, ...rssArticles];

    const CONSULTING_ALLOW = [
      'strategy', 'strategic', 'consulting', 'consultant',
      'management', 'leadership', 'ceo', 'executive', 'board',
      'transformation', 'restructur', 'turnaround', 'reorgani',
      'mckinsey', 'bcg', 'bain', 'deloitte', 'pwc', 'kpmg', 'ey',
      'advisory', 'due diligence', 'supply chain', 'operations',
      'digital', 'innovation', 'ai strategy', 'workforce',
      'talent', 'culture', 'business model', 'private equity',
    ];

    const articles: NewsArticle[] = all
      .map(a => mapNewsApiArticle(a, categorizeConsulting(a.title, a.description || '')))
      .filter(a => {
        const text = `${a.title} ${a.summary}`.toLowerCase();
        if (!passesExclusion(text)) return false;
        return CONSULTING_ALLOW.some(kw => text.includes(kw));
      });

    const deduped = deduplicateByTitle(articles);
    deduped.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return deduped;
  } catch {
    return [];
  }
}

function generateKeyInsight(articles: NewsArticle[]): string {
  if (articles.length === 0) return 'Market updates will be available shortly.';
  const insights = [
    'Global markets remain volatile amid central bank policy uncertainty and geopolitical tensions affecting risk sentiment.',
    'Tech sector earnings continue to drive market momentum, with AI-focused companies commanding premium valuations.',
    'Emerging markets face headwinds from dollar strength and rising yields, prompting investors to reassess allocations.',
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}
