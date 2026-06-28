import type { NewsArticle } from '../types';

const RSS2JSON = 'https://api.rss2json.com/v1/api.json';

// ── Feed lists — only proven, publicly accessible RSS feeds ───────────────────

const GEOPOLITICAL_FEEDS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  'https://www.thehindu.com/news/international/feeder/default.rss',
];

const FINANCE_FEEDS = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms',
  'https://www.moneycontrol.com/rss/latestnews.xml',
  'https://www.thehindubusinessline.com/markets/feeder/default.rss',
  'https://www.livemint.com/rss/markets',
];

const CONSULTING_FEEDS = [
  'https://hbr.org/resources/rss/topics/managing-organizations',
  'https://www.strategy-business.com/rss/',
  'https://economictimes.indiatimes.com/small-biz/rssfeeds/7771597760.cms',
];

// ── Exclusions (applied to all sections) ─────────────────────────────────────
const EXCLUDED = [
  'sport', 'cricket', 'football', 'soccer', 'tennis', 'ipl',
  'celebrity', 'bollywood', 'entertainment', 'movie', 'film',
  'recipe', 'horoscope', 'astrology',
];

function excluded(text: string) {
  return EXCLUDED.some(w => text.includes(w));
}

// ── Categorisers ──────────────────────────────────────────────────────────────

function geoCategory(t: string, d: string) {
  const s = `${t} ${d}`.toLowerCase();
  if (/war|conflict|ceasefire|missile|military|attack|bomb/.test(s)) return 'Conflict';
  if (/election|vote|president|prime minister|parliament/.test(s)) return 'Politics';
  if (/climate|environment|carbon|cop\d/.test(s)) return 'Climate';
  if (/trade|tariff|sanction|export|import/.test(s)) return 'Trade';
  if (/diplomac|summit|bilateral|foreign minister/.test(s)) return 'Diplomacy';
  if (/india/.test(s)) return 'India';
  return 'World';
}

function finCategory(t: string, d: string) {
  const s = `${t} ${d}`.toLowerCase();
  if (/sensex|nifty|bse|nse|stock market|share market/.test(s)) return 'Markets';
  if (/ipo|merger|acquisition/.test(s)) return 'M&A';
  if (/rbi|fed|interest rate|monetary|repo/.test(s)) return 'Central Banks';
  if (/startup|funding|venture|unicorn/.test(s)) return 'Startups';
  if (/crypto|bitcoin|ethereum/.test(s)) return 'Crypto';
  if (/budget|tax|gdp|inflation|fiscal/.test(s)) return 'Macro';
  return 'Finance';
}

function consultCategory(t: string, d: string) {
  const s = `${t} ${d}`.toLowerCase();
  if (/mckinsey|bcg|bain|deloitte|pwc|kpmg/.test(s)) return 'Big Consulting';
  if (/strateg/.test(s)) return 'Strategy';
  if (/leader|ceo|executive|board/.test(s)) return 'Leadership';
  if (/digital|ai |automation|innovation/.test(s)) return 'Digital';
  if (/supply chain|operations|logistics/.test(s)) return 'Operations';
  if (/talent|workforce|culture|hiring/.test(s)) return 'Talent';
  return 'Management';
}

// ── Core fetch (single feed via rss2json) ─────────────────────────────────────

async function fetchFeed(
  url: string,
  categorise: (t: string, d: string) => string
): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      `${RSS2JSON}?rss_url=${encodeURIComponent(url)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !Array.isArray(data.items)) return [];
    const source: string = data.feed?.title || 'News';
    return data.items.map((item: any) => {
      const desc = (item.description ?? '').replace(/<[^>]+>/g, '').trim();
      return {
        title: item.title ?? '',
        source,
        publishedAt: item.pubDate ?? '',
        category: categorise(item.title ?? '', desc),
        summary: desc,
        url: item.link ?? '',
      } satisfies NewsArticle;
    });
  } catch {
    return [];
  }
}

// ── Deduplication ─────────────────────────────────────────────────────────────

function dedup(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 55);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Exported fetchers ─────────────────────────────────────────────────────────

export async function fetchGeopoliticalNews(): Promise<NewsArticle[]> {
  // Fetch all feeds concurrently via Promise.allSettled so one failure doesn't kill rest
  const settled = await Promise.allSettled(
    GEOPOLITICAL_FEEDS.map(url => fetchFeed(url, geoCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => a.title && !excluded(`${a.title} ${a.summary}`.toLowerCase()));

  const result = dedup(articles);

  // Sort: non-India categories first, then newest
  result.sort((a, b) => {
    const aIndia = a.category === 'India' ? 1 : 0;
    const bIndia = b.category === 'India' ? 1 : 0;
    if (aIndia !== bIndia) return aIndia - bIndia;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return result;
}

export async function fetchFinanceNews(): Promise<{ articles: NewsArticle[]; keyInsight: string }> {
  const settled = await Promise.allSettled(
    FINANCE_FEEDS.map(url => fetchFeed(url, finCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => a.title && !excluded(`${a.title} ${a.summary}`.toLowerCase()));

  const result = dedup(articles);
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return { articles: result, keyInsight: pickInsight(result) };
}

export async function fetchConsultingNews(): Promise<NewsArticle[]> {
  const CONSULTING_ALLOW = [
    'strategy', 'strateg', 'consult', 'management', 'leader',
    'ceo', 'executive', 'board', 'transform', 'restructur',
    'mckinsey', 'bcg', 'bain', 'deloitte', 'pwc', 'kpmg', 'ey ',
    'advisory', 'supply chain', 'operations', 'digital', 'innovation',
    'ai ', 'workforce', 'talent', 'culture', 'business model',
    'private equity', 'merger', 'acquisition', 'due diligence',
  ];

  const settled = await Promise.allSettled(
    CONSULTING_FEEDS.map(url => fetchFeed(url, consultCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => {
      if (!a.title) return false;
      const text = `${a.title} ${a.summary}`.toLowerCase();
      if (excluded(text)) return false;
      return CONSULTING_ALLOW.some(kw => text.includes(kw));
    });

  const result = dedup(articles);
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return result;
}

// ── Insight generator ─────────────────────────────────────────────────────────

function pickInsight(articles: NewsArticle[]): string {
  if (articles.length === 0) return '';
  const pool = [
    'Global markets remain volatile amid central bank policy uncertainty and geopolitical tensions affecting risk sentiment.',
    'Tech sector earnings continue to drive market momentum, with AI-focused companies commanding premium valuations.',
    'Emerging markets face headwinds from dollar strength and rising yields, prompting investors to reassess allocations.',
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}
