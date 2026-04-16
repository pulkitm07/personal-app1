export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: 'navy' | 'amber';
  timezone: string;
  dailyRefreshTime: string;
  morningNotification: boolean;
  eveningNotification: boolean;
  eveningNotificationTime: string;
  sectionsEnabled: Record<string, boolean>;
}

export interface Quote {
  text: string;
  author: string;
  bio: string;
}

export interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  category: string;
  summary: string;
  url: string;
}

export interface MarketData {
  btc: { price: number; change24h: number };
  eth: { price: number; change24h: number };
  sol: { price: number; change24h: number };
  usdInr: { rate: number; change: number };
  sensex: { value: number; change: number };
  nifty: { value: number; change: number };
}

export interface GitaVerse {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  explanation: string;
  carryToday: string;
}

export interface PsychologyConcept {
  name: string;
  originator: string;
  year: number;
  definition: string;
  research: string;
  professional: string;
  howToUse: string;
  related: string[];
}

export interface FinanceTerm {
  term: string;
  domain: string;
  definition: string;
  whyItMatters: string;
  formula?: string;
  example: string;
  interviewTrap: string;
}

export interface VocabularyWord {
  word: string;
  pronunciation: string;
  etymology: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  usageNote: string;
}

export interface BookSummary {
  title: string;
  author: string;
  category: string;
  year: number;
  summary: string;
  highlights: string[];
  action: string;
}

export interface Law {
  title: string;
  category: 'corporate' | 'constitutional' | 'criminal' | 'landmark';
  whatIsThis: string;
  whyExists: string;
  example: string;
  meansForYou: string;
  oneLine: string;
}

export interface CaseStudy {
  company: string;
  type: 'rise' | 'fall' | 'comeback';
  headline: string;
  story: string;
  diagnosis: string;
  lessons: string[];
}

export interface ChecklistTask {
  id: string;
  text: string;
  column: 'content' | 'habits';
  isDefault: boolean;
  position: number;
  completed: boolean;
}

export interface SleepEntry {
  id?: string;
  date: string;
  hours: number;
}

export interface DailyContent {
  date: string;
  quote: Quote;
  geopoliticalNews: NewsArticle[];
  financeNews: {
    articles: NewsArticle[];
    keyInsight: string;
  };
  markets: MarketData;
  gitaVerses: GitaVerse[];
  psychology: PsychologyConcept;
  financeTerms: FinanceTerm[];
  vocabulary: VocabularyWord[];
  book: BookSummary;
  laws: Law[];
  caseStudy: CaseStudy;
}
