/**
 * Returns `count` topics sequentially from the dataset, starting from index 0 on EPOCH_DATE
 * and advancing by `count` each day. Topics always go in order: 2, 3, 4 … 244, 245, then loop.
 */
const EPOCH_DATE = new Date('2026-08-03T00:00:00+05:30').getTime();

export function getDailyTopics<T>(data: T[], count: number = 2): T[] {
  if (!data.length) return [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.max(
    0,
    Math.floor((now.getTime() - EPOCH_DATE) / (1000 * 60 * 60 * 24))
  );
  const startIndex = (daysSinceEpoch * count) % data.length;
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(data[(startIndex + i) % data.length]);
  }
  return result;
}
