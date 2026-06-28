const d = new Date('2026-04-23');
const start = new Date(d.getFullYear(), 0, 0);
const diff = d.getTime() - start.getTime();
const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
console.log(dayOfYear);
