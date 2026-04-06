import { useEffect, useState } from 'react';
import { QuoteSection } from '../components/Home/QuoteSection';
import { ChecklistSection, initializeDefaultTasks } from '../components/Home/ChecklistSection';
import { MarketsSection } from '../components/Home/MarketsSection';
import { fetchMarketData } from '../services/marketService';
import { storage, getTodayDate } from '../utils/storage';
import quotesData from '../data/quotes.json';
import type { Quote, ChecklistTask, MarketData } from '../types';

export function HomePage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [markets, setMarkets] = useState<MarketData | null>(null);
  const [marketsLoading, setMarketsLoading] = useState(true);

  useEffect(() => {
    loadDailyContent();
  }, []);

  const loadDailyContent = async () => {
    const today = getTodayDate();

    const dayOfYear = Math.floor(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const quoteIndex = dayOfYear % quotesData.length;
    setQuote(quotesData[quoteIndex]);

    let storedTasks = storage.getChecklistTasks(today);
    if (storedTasks.length === 0) {
      storedTasks = initializeDefaultTasks();
      storage.setChecklistTasks(today, storedTasks);
    }
    setTasks(storedTasks);

    setMarketsLoading(true);
    const marketData = await fetchMarketData();
    setMarkets(marketData);
    setMarketsLoading(false);
  };

  const handleUpdateTasks = (updatedTasks: ChecklistTask[]) => {
    setTasks(updatedTasks);
    storage.setChecklistTasks(getTodayDate(), updatedTasks);

    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const completionPercent = (completedCount / updatedTasks.length) * 100;

    if (completionPercent >= 80) {
      updateStreak();
    }
  };

  const updateStreak = () => {
    const today = getTodayDate();
    const lastCheck = storage.getLastCheckDate();

    if (lastCheck === today) {
      return;
    }

    if (lastCheck) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastCheck === yesterdayStr) {
        const currentStreak = storage.getStreak();
        storage.setStreak(currentStreak + 1);
      } else {
        storage.setStreak(1);
      }
    } else {
      storage.setStreak(1);
    }

    storage.setLastCheckDate(today);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {quote && <QuoteSection quote={quote} />}
      <ChecklistSection tasks={tasks} onUpdateTasks={handleUpdateTasks} />
      <MarketsSection markets={markets} loading={marketsLoading} />
    </div>
  );
}
