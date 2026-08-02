/**
 * Returns `count` items from a dataset deterministically based on today's date.
 * The same pair always appears on the same calendar date, cycling through all items.
 */
export function getDailyTopics<T>(data: T[], count: number = 2): T[] {
  if (!data.length) return [];
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const startIndex = (dayOfYear * count) % data.length;
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(data[(startIndex + i) % data.length]);
  }
  return result;
}
