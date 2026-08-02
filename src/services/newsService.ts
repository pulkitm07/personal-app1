import type { NewsArticle } from '../types';

// Removed rss2json to fix rate limits, using allorigins + DOMParser instead
// ── Feed lists ────────────────────────────────────────────────────────────────

const GEOPOLITICAL_FEEDS = [
  'https://news.google.com/rss/search?q=source:reuters+world&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=source:associated+press+world&hl=en-US&gl=US&ceid=US:en',
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://www.thehindu.com/news/international/feeder/default.rss',
  'https://www.economist.com/international/rss.xml',
  'https://thediplomat.com/feed/',
];

const FINANCE_FEEDS = [
  'https://news.google.com/rss/search?q=source:reuters+business+markets&hl=en-US&gl=US&ceid=US:en',
  'https://feeds.bloomberg.com/markets/news.rss',
  'https://www.ft.com/markets?format=rss',
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://www.livemint.com/rss/markets',
];

const FINTECH_FEEDS: { url: string; skipKeywordFilter: boolean }[] = [
  { url: 'https://techcrunch.com/category/fintech/feed/', skipKeywordFilter: true },
  { url: 'https://www.finextra.com/rss/headlines.aspx', skipKeywordFilter: true },
  { url: 'https://thefintechtimes.com/feed/', skipKeywordFilter: true },
  { url: 'https://economictimes.indiatimes.com/tech/technology/rssfeeds/13357270.cms', skipKeywordFilter: false },
  { url: 'https://www.businessinsider.com/fintech/rss', skipKeywordFilter: false },
];

const CONSULTING_FEEDS: { url: string; skipKeywordFilter: boolean }[] = [
  { url: 'https://hbr.org/resources/rss/topics/managing-organizations', skipKeywordFilter: true },
  { url: 'https://www.mckinsey.com/insights/rss', skipKeywordFilter: true },
  { url: 'https://sloanreview.mit.edu/feed/', skipKeywordFilter: true },
  { url: 'https://www.consultancy.uk/rss', skipKeywordFilter: true },
  { url: 'https://www.consulting.us/rss', skipKeywordFilter: true },
];

const PSYCHOLOGY_FEEDS: { url: string; skipKeywordFilter: boolean }[] = [
  { url: 'https://www.psychologytoday.com/us/front/feed', skipKeywordFilter: true },
  { url: 'https://www.apa.org/news/psycport/rss', skipKeywordFilter: true },
  { url: 'https://www.scientificamerican.com/mind-and-brain/rss', skipKeywordFilter: true },
  { url: 'https://digest.bps.org.uk/feed/', skipKeywordFilter: true },
  { url: 'https://greatergood.berkeley.edu/site/rss', skipKeywordFilter: true },
];

// ── Keyword filters ────────────────────────────────────────────────────────────

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

const FINTECH_ALLOW = [
  'payments', 'payment', 'digital banking', 'upi', 'neobank', 'neo-bank',
  'crypto regulation', 'blockchain', 'rbi digital currency', 'fintech funding',
  'insurtech', 'wealthtech', 'embedded finance', 'bnpl', 'stablecoin',
  'cbdc', 'open banking', 'fintech', 'digital wallet', 'mobile banking',
  'digital payment', 'digital currency', 'defi', 'regtech',
];

// ── Exclusion filter ──────────────────────────────────────────────────────────
const EXCLUDED = [
  'sport', 'cricket', 'football', 'soccer', 'tennis', 'ipl', 'hockey',
  'celebrity', 'bollywood', 'entertainment', 'movie', 'film', 'actor',
  'recipe', 'horoscope', 'astrology', 'fashion', 'beauty', 'lifestyle',
];

function isExcluded(text: string) {
  return EXCLUDED.some(w => text.includes(w));
}

// ── Recency filter ────────────────────────────────────────────────────────────
function isWithinDays(pubDate: string, days: number): boolean {
  if (!pubDate) return true; // missing pubDate → give benefit of the doubt
  const pub = new Date(pubDate).getTime();
  if (isNaN(pub)) return true;
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

function fintechCategory(t: string, d: string) {
  const s = `${t} ${d}`.toLowerCase();
  if (/upi|payment|wallet|mobile pay/.test(s)) return 'Payments';
  if (/blockchain|defi|crypto|stablecoin|cbdc/.test(s)) return 'Blockchain';
  if (/neobank|digital bank|open banking/.test(s)) return 'Digital Banking';
  if (/insurtech/.test(s)) return 'Insurtech';
  if (/wealthtech|robo.advis/.test(s)) return 'Wealthtech';
  if (/bnpl|buy now|lending/.test(s)) return 'Lending';
  if (/regulation|rbi|compliance|regtech/.test(s)) return 'Regulation';
  if (/funding|raise|series|investment/.test(s)) return 'Funding';
  return 'Fintech';
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

function psychCategory(t: string, d: string) {
  const s = `${t} ${d}`.toLowerCase();
  if (/mental health|anxiety|depression|therapy|trauma/.test(s)) return 'Mental Health';
  if (/brain|neuro|cognitive|memory/.test(s)) return 'Neuroscience';
  if (/behavior|habit|addiction/.test(s)) return 'Behavior';
  if (/child|development|parenting/.test(s)) return 'Development';
  if (/social|relationship|personality/.test(s)) return 'Social';
  return 'Psychology';
}

// ── Core fetch ────────────────────────────────────────────────────────────────

async function fetchFeed(
  url: string,
  categorise: (t: string, d: string) => string
): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    if (!res.ok) return [];
    
    const data = await res.json();
    if (!data.contents) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/xml');
    
    // Support both RSS (<item>) and Atom (<entry>)
    const isAtom = doc.querySelector('feed') !== null;
    const items = isAtom ? doc.querySelectorAll('entry') : doc.querySelectorAll('item');
    const sourceNode = isAtom ? doc.querySelector('feed > title') : doc.querySelector('channel > title');
    const source = sourceNode?.textContent || 'News';

    const articles: NewsArticle[] = [];
    
    items.forEach(item => {
      const title = (item.querySelector('title')?.textContent || '').trim();
      const link = (item.querySelector('link')?.textContent || item.querySelector('link')?.getAttribute('href') || '').trim();
      
      const pubDateNode = item.querySelector('pubDate') || item.querySelector('published') || item.querySelector('updated');
      const pubDate = (pubDateNode?.textContent || '').trim();
      
      const descNode = item.querySelector('description') || item.querySelector('summary') || item.querySelector('content');
      const description = (descNode?.textContent || '').trim();
      
      // Strip HTML tags for the clean summary
      const descClean = description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      if (title && link) {
        articles.push({
          title,
          source,
          publishedAt: pubDate,
          category: categorise(title, descClean),
          summary: descClean,
          url: link,
        });
      }
    });

    return articles;
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
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return result;
}

/** Finance — only articles from the last 72 hours */
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
      return !isExcluded(text) && isWithinDays(a.publishedAt, 3);
    });

  const result = dedup(articles);
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return { articles: result, keyInsight: pickInsight(result) };
}

/** Fintech — dedicated feeds skip keyword filter; general feeds use fintech keyword list */
export async function fetchFintechNews(): Promise<NewsArticle[]> {
  const settled = await Promise.allSettled(
    FINTECH_FEEDS.map(({ url }) => fetchFeed(url, fintechCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap((r, i) => {
      const { skipKeywordFilter } = FINTECH_FEEDS[i];
      return r.value.filter(a => {
        if (!a.title) return false;
        const text = `${a.title} ${a.summary}`.toLowerCase();
        if (isExcluded(text)) return false;
        if (!isWithinDays(a.publishedAt, 3)) return false;
        if (skipKeywordFilter) return true;
        return FINTECH_ALLOW.some(kw => text.includes(kw));
      });
    });

  const result = dedup(articles);
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return result;
}

/** Consultancy — dedicated publications (no keyword filter) + business feeds (keyword filtered) */
export async function fetchConsultingNews(): Promise<NewsArticle[]> {
  const settled = await Promise.allSettled(
    CONSULTING_FEEDS.map(f => fetchFeed(f.url, consultCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap((r, i) => {
      const { skipKeywordFilter } = CONSULTING_FEEDS[i];
      return r.value.filter(a => {
        if (!a.title) return false;
        const text = `${a.title} ${a.summary}`.toLowerCase();
        if (isExcluded(text)) return false;
        if (!isWithinDays(a.publishedAt, 3)) return false;
        if (skipKeywordFilter) return true;
        return CONSULTING_ALLOW.some(k => text.includes(k));
      });
    });

  const result = dedup(articles);
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return result;
}

export async function fetchPsychologyNews(): Promise<NewsArticle[]> {
  const settled = await Promise.allSettled(
    PSYCHOLOGY_FEEDS.map(f => fetchFeed(f.url, psychCategory))
  );

  const articles = settled
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(a => {
      if (!a.title) return false;
      const text = `${a.title} ${a.summary}`.toLowerCase();
      if (isExcluded(text)) return false;
      return isWithinDays(a.publishedAt, 7);
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
