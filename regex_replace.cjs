const fs = require('fs');

let content = fs.readFileSync('src/services/aiService.ts', 'utf-8');

// Regex replaces
content = content.replace(
  /import\('\.\.\/data\/gita\.json'\);\s*return fallback\.default\.slice\(0, 3\);/m,
  "import('../data/gita.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    const startIndex = (dayOfYear * 3) % fallback.default.length;\\n    return [\\n      fallback.default[startIndex],\\n      fallback.default[(startIndex + 1) % fallback.default.length],\\n      fallback.default[(startIndex + 2) % fallback.default.length]\\n    ];"
);

content = content.replace(
  /import\('\.\.\/data\/psychology\.json'\);\s*return \[\s*fallback\.default\.find\(\(c: any\) => c\.category === 'general'\),\s*fallback\.default\.find\(\(c: any\) => c\.category === 'business'\)\s*\];/m,
  "import('../data/psychology.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    const general = fallback.default.filter((c: any) => c.category === 'general');\\n    const business = fallback.default.filter((c: any) => c.category === 'business');\\n    return [\\n      general[dayOfYear % (general.length || 1)],\\n      business[dayOfYear % (business.length || 1)]\\n    ];"
);

content = content.replace(
  /import\('\.\.\/data\/finance-terms\.json'\);\s*return fallback\.default\.slice\(0, 3\);/m,
  "import('../data/finance-terms.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    const startIndex = (dayOfYear * 3) % fallback.default.length;\\n    return [\\n      fallback.default[startIndex],\\n      fallback.default[(startIndex + 1) % fallback.default.length],\\n      fallback.default[(startIndex + 2) % fallback.default.length]\\n    ];"
);

content = content.replace(
  /import\('\.\.\/data\/vocabulary\.json'\);\s*return fallback\.default\.slice\(0, 3\);/m,
  "import('../data/vocabulary.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    const startIndex = (dayOfYear * 3) % fallback.default.length;\\n    return [\\n      fallback.default[startIndex],\\n      fallback.default[(startIndex + 1) % fallback.default.length],\\n      fallback.default[(startIndex + 2) % fallback.default.length]\\n    ];"
);

content = content.replace(
  /import\('\.\.\/data\/laws\.json'\);\s*return fallback\.default\[0\];/m,
  "import('../data/laws.json');\\n    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));\\n    return fallback.default[dayOfYear % fallback.default.length];"
);

content = content.replace(/_v6/g, '_v7');

fs.writeFileSync('src/services/aiService.ts', content);
console.log("Regex replacements finished.");
