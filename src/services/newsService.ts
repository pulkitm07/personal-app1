import type { NewsArticle } from '../types';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

// ── Geopolitical feeds ────────────────────────────────────────────────────────
const GEOPOLITICAL_FEEDS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  'https://www.thehindu.com/news/international/feeder/default.rss',
  'https://feeds.reuters.com/reuters/worldNews',
  'https://foreignpolicy.com/feed/',
];

// ── Finance feeds ─────────────────────────────────────────────────────────────
const FINANCE_FEEDS = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms',
  'https://www.moneycontrol.com/rss/latestnews.xml',
  'https://www.thehindubusinessline.com/markets/feeder/default.rss',
  'https://www.livemint.com/rss/markets',
  'https://feeds.reuters.com/reuters/businessNews',
  'https://feeds.bloomberg.com/markets/news.rss',
];

// ── Consulting / strategy feeds ───────────────────────────────────────────────
const CONSULTING_FEEDS = [
  'https://hbr.org/resources/rss/topics/managing-organizations',
  'https://www.strategy-business.com/rss/',
  'https://www.ft.com/management?format=rss',
  'https://economictimes.indiatimes.com/small-biz/rssfeeds/7771597760.cms',
  'https://feeds.hbr.org/harvardbusiness',
  'https://www.mckinsey.com/feeds/all-insights',
];

// ── Exclusion list shared across all sections ─────────────────────────────────
const EXCLUSION_KEYWORDS = [
  'sport', 'cricket', 'football', 'soccer', 'tennis', 'ipl',
  'celebrity', 'bollywood', 'entertainment', 'movie', 'film',
  'recipe', 'horoscope', 'astrology', 'lifestyle',
];

// ── Geopolitical: broad allow keywords (ANY match = include) ──────────────────
const GEO_ALLOW_KEYWORDS = [
  'war', 'conflict', 'ceasefire', 'sanctions', 'missile', 'military',
  'election', 'president', 'prime minister', 'government', 'parliament',
  'diplomacy', 'diplomatic', 'treaty', 'summit', 'bilateral', 'multilateral',
  'nato', 'un ', 'united nations', 'security council',
  'minister', 'foreign', 'geopolit', 'international', 'trade war',
  'tariff', 'embargo', 'climate', 'refugee', 'protest', 'coup',
  'nuclear', 'terrorism', 'alliance', 'invasion', 'annexation',
  'india', 'china', 'russia', 'ukraine', 'usa', 'europe', 'iran',
  'israel', 'gaza', 'pakistan', 'korea', 'taiwan', 'africa',
  'policy', 'regulation', 'act ', 'bill ', 'law ', 'court',
];

// ── Finance: allow keywords ───────────────────────────────────────────────────
const FINANCE_ALLOW_KEYWORDS = [
  'market', 'stock', 'sensex', 'nifty', 'bse', 'nse',
  'economy', 'gdp', 'inflation', 'recession', 'growth',
  'rbi', 'fed', 'rate', 'interest rate', 'monetary', 'fiscal',
  'ipo', 'merger', 'acquisition', 'm&a', 'valuation',
  'earnings', 'revenue', 'profit', 'loss', 'quarter',
  'rupee', 'dollar', 'currency', 'forex', 'usd', 'inr',
  'crypto', 'bitcoin', 'fintech', 'banking', 'npa', 'loan',
  'startup', 'funding', 'investment', 'venture', 'hedge fund',
  'commodity', 'gold', 'oil', 'crude', 'bond', 'yield',
  'budget', 'tax', 'sebi', 'rbi', 'debt',
];

// ── Consulting / strategy: allow keywords ────────────────────────────────────
const CONSULTING_ALLOW_KEYWORDS = [
  'strategy', 'strategic', 'consulting', 'consultant',
  'management', 'leadership', 'ceo', 'executive', 'board',
  'transformation', 'restructuring', 'turnaround', 'reorgani',
  'mckinsey', 'bcg', 'bain', 'deloitte', 'pwc', 'kpmg', 'ey',
  'advisory', 'corporate governance', 'due diligence',
  'supply chain', 'operations', 'efficiency', 'productivity',
  'digital transformation', 'ai strategy', 'innovation',
  'organisational', 'organizational', 'talent', 'workforce',
  'merger integration', 'private equity', 'pe fund',
  'business model', 'competitive advantage', 'market entry',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function passesExclusion(text: string): boolean {
  return !EXCLUSION_KEYWORDS.some(kw => text.includes(kw));
}

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some(kw => text.includes(kw.toLowerCase()));
}

/** Deduplicate by normalised title (strip punctuation, lowercase, compare first 60 chars) */
function deduplicateByTitle(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 60).trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function categorizeGeoArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('india') && (text.includes('government') || text.includes('parliament') || text.includes('modi'))) return 'India';
  if (text.includes('war') || text.includes('conflict') || text.includes('ceasefire') || text.includes('military')) return 'Conflict';
  if (text.includes('election') || text.includes('vote') || text.includes('president') || text.includes('prime minister')) return 'Politics';
  if (text.includes('climate') || text.includes('environment') || text.includes('carbon')) return 'Climate';
  if (text.includes('trade') || text.includes('tariff') || text.includes('economy')) return 'Global Economy';
  if (text.includes('diplomatic') || text.includes('summit') || text.includes('foreign')) return 'Diplomacy';
  return 'Geopolitics';
}

function categorizeFinanceArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('market') || text.includes('stock') || text.includes('sensex') || text.includes('nifty')) return 'Markets';
  if (text.includes('ipo') || text.includes('merger') || text.includes('acquisition')) return 'M&A';
  if (text.includes('rbi') || text.includes('fed') || text.includes('rate') || text.includes('monetary')) return 'Central Banks';
  if (text.includes('startup') || text.includes('funding') || text.includes('venture')) return 'Startups';
  if (text.includes('crypto') || text.includes('bitcoin')) return 'Crypto';
  if (text.includes('budget') || text.includes('tax') || text.includes('fiscal')) return 'Macro';
  return 'Finance';
}

function categorizeConsultingArticle(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('mckinsey') || text.includes('bcg') || text.includes('bain') || text.includes('deloitte') || text.includes('pwc')) return 'Big Consulting';
  if (text.includes('strategy') || text.includes('strategic')) return 'Strategy';
  if (text.includes('leadership') || text.includes('ceo') || text.includes('executive')) return 'Leadership';
  if (text.includes('digital') || text.includes('ai') || text.includes('automation')) return 'Digital';
  if (text.includes('supply chain') || text.includes('operations')) return 'Operations';
  if (text.includes('talent') || text.includes('workforce') || text.includes('culture')) return 'Talent';
  return 'Management';
}

async function fetchRssFeed(
  url: string,
  categoryGenerator: (title: string, desc: string) => string
): Promise<NewsArticle[]> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`${RSS2JSON_API}?rss_url=${encodedUrl}&count=50`);
    const data = await response.json();

    if (data.status !== 'ok' || !data.items) return [];

    const sourceName: string = data.feed?.title || 'News Source';

    return data.items.map((item: any) => {
      const desc = item.description?.replace(/<[^>]+>/g, '') || '';
      return {
        title: item.title,
        source: sourceName,
        publishedAt: item.pubDate,
        category: categoryGenerator(item.title, desc),
        summary: desc,
        url: item.link,
      } as NewsArticle;
    });
  } catch {
    return [];
  }
}

// ── Public fetch functions ────────────────────────────────────────────────────

export async function fetchGeopoliticalNews(): Promise<NewsArticle[]> {
  try {
    const results = await Promise.all(
      GEOPOLITICAL_FEEDS.map(url => fetchRssFeed(url, categorizeGeoArticle))
    );
    let articles = results.flat();

    const filtered = articles.filter(a => {
      const text = `${a.title} ${a.summary}`.toLowerCase();
      return passesExclusion(text) && matchesAny(text, GEO_ALLOW_KEYWORDS);
    });

    const deduped = deduplicateByTitle(filtered);

    // Sort: non-India categories first, then by recency
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

export async function fetchFinanceNews(): Promise<{
  articles: NewsArticle[];
  keyInsight: string;
}> {
  try {
    const results = await Promise.all(
      FINANCE_FEEDS.map(url => fetchRssFeed(url, categorizeFinanceArticle))
    );
    let articles = results.flat();

    articles = articles.filter(a => {
      const text = `${a.title} ${a.summary}`.toLowerCase();
      return passesExclusion(text) && matchesAny(text, FINANCE_ALLOW_KEYWORDS);
    });

    articles = deduplicateByTitle(articles);
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const keyInsight = generateKeyInsight(articles);
    return { articles, keyInsight };
  } catch {
    return { articles: [], keyInsight: '' };
  }
}

export async function fetchConsultingNews(): Promise<NewsArticle[]> {
  try {
    const results = await Promise.all(
      CONSULTING_FEEDS.map(url => fetchRssFeed(url, categorizeConsultingArticle))
    );
    let articles = results.flat();

    articles = articles.filter(a => {
      const text = `${a.title} ${a.summary}`.toLowerCase();
      return passesExclusion(text) && matchesAny(text, CONSULTING_ALLOW_KEYWORDS);
    });

    articles = deduplicateByTitle(articles);
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return articles;
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
