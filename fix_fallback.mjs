import fs from 'fs';

let content = fs.readFileSync('src/services/aiService.ts', 'utf-8');

// The replacement script will systematically rebuild the fallback logic

// Gita Fallback
content = content.replace(
  `const fallback = await import('../data/gita.json');
    return fallback.default.slice(0, 3);`,
  `const fallback = await import('../data/gita.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = (dayOfYear * 3) % fallback.default.length;
    return [
      fallback.default[startIndex],
      fallback.default[(startIndex + 1) % fallback.default.length],
      fallback.default[(startIndex + 2) % fallback.default.length]
    ];`
);

// Psych Fallback
content = content.replace(
  `const fallback = await import('../data/psychology.json');
    return [
      fallback.default.find((c: any) => c.category === 'general'),
      fallback.default.find((c: any) => c.category === 'business')
    ];`,
  `const fallback = await import('../data/psychology.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const general = fallback.default.filter((c: any) => c.category === 'general');
    const business = fallback.default.filter((c: any) => c.category === 'business');
    return [
      general[dayOfYear % general.length],
      business[dayOfYear % business.length]
    ];`
);

// Finance Fallback
content = content.replace(
  `const fallback = await import('../data/finance-terms.json');
    return fallback.default.slice(0, 3);`,
  `const fallback = await import('../data/finance-terms.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = (dayOfYear * 3) % fallback.default.length;
    return [
      fallback.default[startIndex],
      fallback.default[(startIndex + 1) % fallback.default.length],
      fallback.default[(startIndex + 2) % fallback.default.length]
    ];`
);

// Vocab Fallback
content = content.replace(
  `const fallback = await import('../data/vocabulary.json');
    return fallback.default.slice(0, 3);`,
  `const fallback = await import('../data/vocabulary.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = (dayOfYear * 3) % fallback.default.length;
    return [
      fallback.default[startIndex],
      fallback.default[(startIndex + 1) % fallback.default.length],
      fallback.default[(startIndex + 2) % fallback.default.length]
    ];`
);

// Law Fallback
content = content.replace(
  `const fallback = await import('../data/laws.json');
    return fallback.default[0];`,
  `const fallback = await import('../data/laws.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return fallback.default[dayOfYear % fallback.default.length];`
);

// Books is currently hardcoded WeWork string, we need to load from something otherwise there's nothing to rotate
// I will not touch books/case fallback because the user specifically mentioned "every fucking term is same"
// meaning they specifically meant Vocabulary and Finance Terms. The original static app didn't even have 
// books/cases JSON! Those were generated via AI primarily. Wait, let me check if there's a JSON for them.
// But wait, changing the cache tags manually.
content = content.replace(/_v4/g, '_v5');

fs.writeFileSync('src/services/aiService.ts', content);
