const fs = require('fs');

let content = fs.readFileSync('src/services/aiService.ts', 'utf-8').split(/\\r?\\n/).join('\\n');

const replacements = [
  {
    find: "const fallback = await import('../data/gita.json');\\n    return fallback.default.slice(0, 3);",
    replace: "const fallback = await import('../data/gita.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    const startIndex = (dayOfYear * 3) % fallback.default.length;\\n    return [\\n      fallback.default[startIndex],\\n      fallback.default[(startIndex + 1) % fallback.default.length],\\n      fallback.default[(startIndex + 2) % fallback.default.length]\\n    ];"
  },
  {
    find: "const fallback = await import('../data/psychology.json');\\n    return [\\n      fallback.default.find((c: any) => c.category === 'general'),\\n      fallback.default.find((c: any) => c.category === 'business')\\n    ];",
    replace: "const fallback = await import('../data/psychology.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    const general = fallback.default.filter((c: any) => c.category === 'general');\\n    const business = fallback.default.filter((c: any) => c.category === 'business');\\n    return [\\n      general[dayOfYear % (general.length || 1)],\\n      business[dayOfYear % (business.length || 1)]\\n    ];"
  },
  {
    find: "const fallback = await import('../data/finance-terms.json');\\n    return fallback.default.slice(0, 3);",
    replace: "const fallback = await import('../data/finance-terms.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    const startIndex = (dayOfYear * 3) % fallback.default.length;\\n    return [\\n      fallback.default[startIndex],\\n      fallback.default[(startIndex + 1) % fallback.default.length],\\n      fallback.default[(startIndex + 2) % fallback.default.length]\\n    ];"
  },
  {
    find: "const fallback = await import('../data/vocabulary.json');\\n    return fallback.default.slice(0, 3);",
    replace: "const fallback = await import('../data/vocabulary.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    const startIndex = (dayOfYear * 3) % fallback.default.length;\\n    return [\\n      fallback.default[startIndex],\\n      fallback.default[(startIndex + 1) % fallback.default.length],\\n      fallback.default[(startIndex + 2) % fallback.default.length]\\n    ];"
  },
  {
    find: "const fallback = await import('../data/laws.json');\\n    return fallback.default[0];",
    replace: "const fallback = await import('../data/laws.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    return fallback.default[dayOfYear % fallback.default.length];"
  }
];

let changedCount = 0;
for (const r of replacements) {
  if (content.includes(r.find)) {
    content = content.replace(r.find, r.replace);
    changedCount++;
  } else {
    console.log("Could not find:", r.find);
  }
}

content = content.replace(/_v6/g, '_v7');

fs.writeFileSync('src/services/aiService.ts', content);
console.log("Replaced", changedCount, "items.");
