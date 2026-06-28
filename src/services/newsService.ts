import type { NewsArticle } from '../types';

const RSS2JSON = 'https://api.rss2json.com/v1/api.json';

// ── Feed lists ────────────────────────────────────────────────────────────────

const GEOPOLITICAL_FEEDS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml', // BBC
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://www.aljazeera.com/xml/rss/all.xml', // Al Jazeera
  'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  'https://www.thehindu.com/news/international/feeder/default.rss', // The Hindu
  'https://feeds.a.dj.com/rss/RSSWorldNews.xml', // WSJ World
  'https://www.ft.com/world?format=rss', // FT World
  'https://www.foreignaffairs.com/rss.xml', // Foreign Affairs
  'https://thediplomat.com/feed/', // The Diplomat
  'https://thegeopolitics.com/feed/', // The Geopolitics
  'https://www.economist.com/international/rss.xml', // The Economist
  'https://worldview.stratfor.com/rss/all/rss.xml', // Stratfor
  'https://news.google.com/rss/search?q=source:reuters+world&hl=en-US&gl=US&ceid=US:en', // Reuters (via Google News RSS)
  'https://news.google.com/rss/search?q=source:associated+press+world&hl=en-US&gl=US&ceid=US:en', // AP (via Google News RSS)
];

const FINANCE_FEEDS = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', // Economic Times
  'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms',
  'https://www.moneycontrol.com/rss/latestnews.xml', // Moneycontrol
  'https://www.thehindubusinessline.com/markets/feeder/default.rss',
  'https://www.livemint.com/rss/markets', // Mint
  'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', // WSJ Markets
  'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml', // WSJ Business
  'https://www.ft.com/markets?format=rss', // FT Markets
  'https://feeds.bloomberg.com/markets/news.rss', // Bloomberg Markets
  'https://news.google.com/rss/search?q=source:reuters+business+markets&hl=en-US&gl=US&ceid=US:en', // Reuters Business
];

const CONSULTING_FEEDS: { url: string; skipKeywordFilter: boolean }[] = [
  // Dedicated management/consulting publications — accept all articles from these
  { url: 'https://hbr.org/resources/rss/topics/managing-organizations', skipKeywordFilter: true },
  { url: 'https://hbr.org/resources/rss/topics/leadership', skipKeywordFilter: true },
  { url: 'https://www.strategy-business.com/rss/', skipKeywordFilter: true },
  { url: 'https://www.ft.com/management?format=rss', skipKeywordFilter: true }, // FT Management
  { url: 'https://sloanreview.mit.edu/feed/', skipKeywordFilter: true }, // MIT Sloan
  { url: 'https://www.mckinsey.com/insights/rss', skipKeywordFilter: true }, // McKinsey Insights
  { url: 'https://www.economist.com/business/rss.xml', skipKeywordFilter: true }, // The Economist Business
  { url: 'https://fortune.com/feed/', skipKeywordFilter: false }, // Fortune (Filter applied)
  // General business feeds — filter by consulting keywords
  { url: 'https://economictimes.indiatimes.com/news/company/corporate-trends/rssfeeds/13357270.cms', skipKeywordFilter: false },
  { url: 'https://www.livemint.com/rss/companies', skipKeywordFilter: false },
  { url: 'https://www.thehindubusinessline.com/companies/feeder/default.rss', skipKeywordFilter: false },
];

const CONSULTING_ALLOW = [
  'strategy', 'strateg', 'consult', 'management', 'manag',
  'leader', 'ceo', 'executive', 'board', 'chairman',
  'transform', 'restructur', 'reorgani', 'turnaround',
  'mckinsey', 'bcg', 'bain', 'deloitte', 'pwc', 'kpmg', 'accenture',
  'advisory', 'supply chain', 'operations', 'efficiency',
  'digital', 'innovation', 'ai strategy', 'workforce', 'talent',
  'culture', 'business model', 'corporate governance',
  'private equity', 'merger', 'acquisition', 'due diligence',
  'company', 'corporate', 'firm', 'industry', 'sector',
];

// ── Exclusion filter ──────────────────────────────────────────────────────────
const EXCLUDED = [
  'sport', 'cricket', 'football', 'soccer', 'tennis', 'ipl', 'hockey',
  'celebrity', 'bollywood', 'entertainment', 'movie', 'film', 'actor',
  'recipe', 'horoscope', 'astrology', 'fashion', 'beauty',
];

function isExcluded(text: string) {
  return EXCLUDED.some(w => text.includes(w));
}

// ── Recency filter ────────────────────────────────────────────────────────────
function isWithinDays(pubDate: string, days: number): boolean {
  if (!pubDate) return false; // if no date, let it through
  const pub = new Date(pubDate).getTime();
  if (isNaN(pub)) return true; // if unparseable, let it through
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return pub >= cutoff;
}

// ── Categorisers ──────────────────────────────────────────────────────────────

function geoCategory(t: string, d: string) {
  const s = `${t} ${d}`.toLowerCase();
  if (/war|conflict|ceasefire|missile|military|attack|bomb|troops/.test(s)) return 'Conflict';
  if (/election|vote|president|prime minister|parliament|coalition/.test(s)) return 'Politics';
  if (/climate|environment|carbon|cop\d|emissions/.test(s)) return 'Climate';
  if (/trade|tariff|sanction|export|import/.test(s)) return 'Trade';
  if (/diplomac|summit|bilateral|foreign minister|treaty/.test(s)) return 'Diplomacy';
  if (/india/.test(s)) return 'India';
  return 'World';
}

function finCategory(t: string, d: string) {
  const s = `${t} ${d}`.toLowerCase();
  if (/sensex|nifty|bse|nse|stock market|share market|equity/.test(s)) return 'Markets';
  if (/ipo|merger|acquisition/.test(s)) return 'M&A';
  if (/rbi|fed|interest rate|monetary|repo|rate cut|rate hike/.test(s)) return 'Central Banks';
  if (/startup|funding|venture|unicorn|seed/.test(s)) return 'Startups';
  if (/crypto|bitcoin|ethereum|blockchain/.test(s)) return 'Crypto';
  if (/budget|tax|gdp|inflation|fiscal|deficit/.test(s)) return 'Macro';
  return 'Finance';
}

function consultCategory(t: string, d: string) {
  const s = `${t} ${d}`.toLowerCase();
  if (/mckinsey|bcg|bain|deloitte|pwc|kpmg|accenture/.test(s)) return 'Big Consulting';
  if (/strateg/.test(s)) return 'Strategy';
  if (/leader|ceo|executive|board/.test(s)) return 'Leadership';
  if (/digital|ai |automation|innovation|tech/.test(s)) return 'Digital';
  if (/supply chain|operations|logistics/.test(s)) return 'Operations';
  if (/talent|workforce|culture|hiring|employee/.test(s)) return 'Talent';
  if (/merger|acquisition|private equity/.test(s)) return 'M&A';
  return 'Management';
}

// ── Core fetch ────────────────────────────────────────────────────────────────

async function fetchFeed(
  url: string,
  categorise: (t: string, d: string) => string
): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${RSS2JSON}?rss_url=${encodeURIComponent(url)}`);
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

/** Geopolitical — only articles from the last 72 hours */
export async function fetchGeopoliticalNews(): Promise<NewsArticle[]> {
  const settled = await Promise.allSettled(
    GEOPOLITICAL_FEEDS.map(url => fetchFeed(url, geoCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => {
      if (!a.title) return false;
      const text = `${a.title} ${a.summary}`.toLowerCase();
      return !isExcluded(text) && isWithinDays(a.publishedAt, 3);
    });

  const result = dedup(articles);

  // Sort: international first, India last; then newest within each group
  result.sort((a, b) => {
    const aIndia = a.category === 'India' ? 1 : 0;
    const bIndia = b.category === 'India' ? 1 : 0;
    if (aIndia !== bIndia) return aIndia - bIndia;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return result;
}

/** Finance — only articles from the last 48 hours */
export async function fetchFinanceNews(): Promise<{ articles: NewsArticle[]; keyInsight: string }> {
  const settled = await Promise.allSettled(
    FINANCE_FEEDS.map(url => fetchFeed(url, finCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => {
      if (!a.title) return false;
      const text = `${a.title} ${a.summary}`.toLowerCase();
      return !isExcluded(text) && isWithinDays(a.publishedAt, 2);
    });

  const result = dedup(articles);
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return { articles: result, keyInsight: pickInsight(result) };
}

/** Consulting — dedicated publications (no keyword filter) + business feeds (keyword filtered)
 *  Articles within 7 days (consulting publications update less frequently) */
export async function fetchConsultingNews(): Promise<NewsArticle[]> {
  const settled = await Promise.allSettled(
    CONSULTING_FEEDS.map(({ url }) => fetchFeed(url, consultCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap((r, i) => {
      const { skipKeywordFilter } = CONSULTING_FEEDS[i];
      return r.value.filter(a => {
        if (!a.title) return false;
        const text = `${a.title} ${a.summary}`.toLowerCase();
        if (isExcluded(text)) return false;
        if (!isWithinDays(a.publishedAt, 7)) return false;
        // Dedicated consulting feeds: accept all non-excluded articles
        if (skipKeywordFilter) return true;
        // General business feeds: must match a consulting keyword
        return CONSULTING_ALLOW.some(kw => text.includes(kw));
      });
    });

  const result = dedup(articles);
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return result;
}

// ── Insight ───────────────────────────────────────────────────────────────────

function pickInsight(articles: NewsArticle[]): string {
  if (articles.length === 0) return '';
  const pool = [
    'Global markets remain volatile amid central bank policy uncertainty and geopolitical tensions affecting risk sentiment.',
    'Tech sector earnings continue to drive market momentum, with AI-focused companies commanding premium valuations.',
    'Emerging markets face headwinds from dollar strength and rising yields, prompting investors to reassess allocations.',
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}
