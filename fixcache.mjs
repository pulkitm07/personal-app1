import fs from 'fs';

// --- UPDATE aiService.ts ---
let aiService = fs.readFileSync('src/services/aiService.ts', 'utf-8');
aiService = aiService.replace(/'daily_gita_cache'/g, "'daily_gita_v4'");
aiService = aiService.replace(/'daily_psych_cache'/g, "'daily_psych_v4'");
aiService = aiService.replace(/'daily_book_cache'/g, "'daily_book_v4'");
aiService = aiService.replace(/'daily_case_cache'/g, "'daily_case_v4'");
aiService = aiService.replace(/'daily_finance_cache'/g, "'daily_finance_v4'");
aiService = aiService.replace(/'daily_vocab_cache'/g, "'daily_vocab_v4'");
aiService = aiService.replace(/'daily_law_cache'/g, "'daily_law_v4'");
fs.writeFileSync('src/services/aiService.ts', aiService);

// --- UPDATE newsService.ts ---
let newsService = fs.readFileSync('src/services/newsService.ts', 'utf-8');

// Replace Geopolitical Feeds
newsService = newsService.replace(
`const GEOPOLITICAL_FEEDS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://feeds.bbci.co.uk/news/world/south_asia/rss.xml',
  'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  'https://www.thehindu.com/news/national/feeder/default.rss',
  'https://feeds.feedburner.com/ndtvnews-india-news',
];`,
`const GEOPOLITICAL_FEEDS = [
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  'https://www.thehindu.com/news/international/feeder/default.rss',
];`
);

// Add sorting logic prioritizing international over national
newsService = newsService.replace(
`    // Sort by pubDate descending
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());`,
`    // Sort by pubDate descending, but push 'India' category below others to satisfy international priority
    articles.sort((a, b) => {
      if (a.category === 'India' && b.category !== 'India') return 1;
      if (b.category === 'India' && a.category !== 'India') return -1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });`
);

fs.writeFileSync('src/services/newsService.ts', newsService);
