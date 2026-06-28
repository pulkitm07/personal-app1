import fs from 'fs';

let content = fs.readFileSync('src/services/aiService.ts', 'utf-8');

// Overwrite the specific substrings using explicit indexOf to ensure absolute zero failure
const gitaTarget = "const fallback = await import('../data/gita.json');\\n    return fallback.default.slice(0, 3);";
const gitaReplace = \`const fallback = await import('../data/gita.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = (dayOfYear * 3) % fallback.default.length;
    return [
      fallback.default[startIndex],
      fallback.default[(startIndex + 1) % fallback.default.length],
      fallback.default[(startIndex + 2) % fallback.default.length]
    ];\`;
content = content.replace(gitaTarget, gitaReplace);

const psychTarget = "const fallback = await import('../data/psychology.json');\\n    return [\\n      fallback.default.find((c: any) => c.category === 'general'),\\n      fallback.default.find((c: any) => c.category === 'business')\\n    ];";
const psychReplace = \`const fallback = await import('../data/psychology.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const general = fallback.default.filter((c: any) => c.category === 'general');
    const business = fallback.default.filter((c: any) => c.category === 'business');
    return [
      general[dayOfYear % (general.length || 1)],
      business[dayOfYear % (business.length || 1)]
    ];\`;
content = content.replace(psychTarget, psychReplace);

const financeTarget = "const fallback = await import('../data/finance-terms.json');\\n    return fallback.default.slice(0, 3);";
const financeReplace = \`const fallback = await import('../data/finance-terms.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = (dayOfYear * 3) % fallback.default.length;
    return [
      fallback.default[startIndex],
      fallback.default[(startIndex + 1) % fallback.default.length],
      fallback.default[(startIndex + 2) % fallback.default.length]
    ];\`;
content = content.replace(financeTarget, financeReplace);

const vocabTarget = "const fallback = await import('../data/vocabulary.json');\\n    return fallback.default.slice(0, 3);";
const vocabReplace = \`const fallback = await import('../data/vocabulary.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const startIndex = (dayOfYear * 3) % fallback.default.length;
    return [
      fallback.default[startIndex],
      fallback.default[(startIndex + 1) % fallback.default.length],
      fallback.default[(startIndex + 2) % fallback.default.length]
    ];\`;
content = content.replace(vocabTarget, vocabReplace);

const lawTarget = "const fallback = await import('../data/laws.json');\\n    return fallback.default[0];";
const lawReplace = \`const fallback = await import('../data/laws.json');
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return fallback.default[dayOfYear % fallback.default.length];\`;
content = content.replace(lawTarget, lawReplace);


content = content.replace(/_v6/g, '_v7');

fs.writeFileSync('src/services/aiService.ts', content);
