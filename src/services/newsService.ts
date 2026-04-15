import type { NewsArticle } from '../types';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

const GEOPOLITICAL_FEEDS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://feeds.bbci.co.uk/news/world/south_asia/rss.xml',
  'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  'https://www.thehindu.com/news/national/feeder/default.rss',
  'https://feeds.feedburner.com/ndtvnews-india-news',
];

const FINANCE_FEEDS = [
  'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
  'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms',
  'https://www.moneycontrol.com/rss/latestnews.xml',
  'https://www.thehindubusinessline.com/markets/feeder/default.rss',
  'https://www.livemint.com/rss/markets',
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
  if (text.includes('economy') || text.includes('gdp') || text.includes('trade')) {
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
  if (text.includes('ipo') || text.includes('merger') || text.includes('acquisition')) {
    return 'M&A';
  }
  if (text.includes('rbi') || text.includes('fed') || text.includes('rate')) {
    return 'Central Banks';
  }
  if (text.includes('startup') || text.includes('funding')) {
    return 'Startups';
  }

  return 'Finance';
}

async function fetchRssFeed(url: string, categoryGenerator: (title: string, desc: string) => string): Promise<NewsArticle[]> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`${RSS2JSON_API}?rss_url=${encodedUrl}`);
    const data = await response.json();

    if (data.status !== 'ok' || !data.items) {
      return [];
    }

    let sourceName = data.feed?.title || 'News Source';

    return data.items.map((item: any) => {
      // Basic text cleanup
      const desc = item.description?.replace(/<[^>]+>/g, '') || '';
      return {
        title: item.title,
        source: sourceName,
        publishedAt: item.pubDate,
        category: categoryGenerator(item.title, desc),
        summary: desc,
        url: item.link,
      };
    });
  } catch (error) {
    // Fail silently intentionally as per requirement
    return [];
  }
}

export async function fetchGeopoliticalNews(): Promise<NewsArticle[]> {
  try {
    const promises = GEOPOLITICAL_FEEDS.map(url => fetchRssFeed(url, categorizeArticle));
    const results = await Promise.all(promises);
    
    // Flatten
    let articles = results.flat();
    
    // Filter by keywords
    articles = articles.filter(article => {
      const text = `${article.title} ${article.summary}`.toLowerCase();
      // Must contain at least one keyword
      return GEOPOLITICAL_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
    });
    
    // Exclusion filters (like original app)
    articles = articles.filter(article => {
      const text = `${article.title} ${article.summary}`.toLowerCase();
      return !text.includes('sport') &&
             !text.includes('celebrity') &&
             !text.includes('entertainment');
    });

    // Sort by pubDate descending
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return articles;
  } catch (error) {
    return [];
  }
}

export async function fetchFinanceNews(): Promise<{
  articles: NewsArticle[];
  keyInsight: string;
}> {
  try {
    const promises = FINANCE_FEEDS.map(url => fetchRssFeed(url, categorizeFinanceArticle));
    const results = await Promise.all(promises);
    
    let articles = results.flat();
    
    // Filter by keywords
    articles = articles.filter(article => {
      const text = `${article.title} ${article.summary}`.toLowerCase();
      // Must contain at least one keyword
      return FINANCE_KEYWORDS.some(kw => text.includes(kw.toLowerCase()));
    });

    // Sort by pubDate descending
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    const keyInsight = generateKeyInsight(articles);

    return { articles, keyInsight };
  } catch (error) {
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
