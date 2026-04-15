import type { DailyContent, ChecklistTask } from '../types';

export const storage = {
  getDailyContent(date: string): DailyContent | null {
    try {
      const stored = localStorage.getItem(`daily_content_${date}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setDailyContent(date: string, content: DailyContent): void {
    localStorage.setItem(`daily_content_${date}`, JSON.stringify(content));
  },

  getChecklistTasks(date: string): ChecklistTask[] {
    try {
      const stored = localStorage.getItem(`checklist_${date}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setChecklistTasks(date: string, tasks: ChecklistTask[]): void {
    localStorage.setItem(`checklist_${date}`, JSON.stringify(tasks));
  },

  getStreak(): number {
    try {
      const streak = localStorage.getItem('daily_streak');
      return streak ? parseInt(streak, 10) : 0;
    } catch {
      return 0;
    }
  },

  setStreak(streak: number): void {
    localStorage.setItem('daily_streak', streak.toString());
  },

  getLastCheckDate(): string | null {
    return localStorage.getItem('last_check_date');
  },

  setLastCheckDate(date: string): void {
    localStorage.setItem('last_check_date', date);
  },

  getGitaProgress(): { chapter: number; verse: number } {
    try {
      const stored = localStorage.getItem('gita_progress');
      return stored ? JSON.parse(stored) : { chapter: 1, verse: 1 };
    } catch {
      return { chapter: 1, verse: 1 };
    }
  },

  setGitaProgress(chapter: number, verse: number): void {
    localStorage.setItem('gita_progress', JSON.stringify({ chapter, verse }));
  },

  getContentProgress(type: string): string[] {
    try {
      const stored = localStorage.getItem(`progress_${type}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addContentProgress(type: string, id: string): void {
    const progress = this.getContentProgress(type);
    if (!progress.includes(id)) {
      progress.push(id);
      localStorage.setItem(`progress_${type}`, JSON.stringify(progress));
    }
  },

  getSleepEntries(): { date: string; hours: number }[] {
    try {
      const stored = localStorage.getItem('sleep_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setSleepEntries(entries: { date: string; hours: number }[]): void {
    localStorage.setItem('sleep_entries', JSON.stringify(entries));
  },
};

export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
}
