import fs from 'fs';

let content = fs.readFileSync('src/services/aiService.ts', 'utf-8');

// 1. Better Error Reporting and API key reading
content = content.replace(
  `    if (!response.ok) throw new Error("API Failed");
`,
  `    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API Failure details: ", response.status, errText);
      throw new Error("API Failed: " + response.status + " " + errText);
    }
`
);

// 2. Ironclad JSON Extraction
content = content.replace(
  `    let content = result.choices[0].message.content.trim();
    if (content.startsWith('\`\`\`json')) content = content.replace(/^\`\`\`json\\n/, '').replace(/\\n\`\`\`$/, '');
    if (content.startsWith('\`\`\`')) content = content.replace(/^\`\`\`\\n/, '').replace(/\\n\`\`\`$/, '');
    
    const data = JSON.parse(content);`,
  `    let content = result.choices[0].message.content.trim();
    
    // Robust extraction bounds
    const firstBracket = content.indexOf('[');
    const firstBrace = content.indexOf('{');
    const firstCharIndex = (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) ? firstBracket : firstBrace;
    
    const lastBracket = content.lastIndexOf(']');
    const lastBrace = content.lastIndexOf('}');
    const lastCharIndex = (lastBracket !== -1 && (lastBrace === -1 || lastBracket > lastBrace)) ? lastBracket : lastBrace;
    
    if (firstCharIndex !== -1 && lastCharIndex !== -1) {
       content = content.substring(firstCharIndex, lastCharIndex + 1);
    }
    
    const data = JSON.parse(content);`
);

// 3. Fallback cache invalidation to v6
content = content.replace(/_v5/g, '_v6');

// 4. Expose missing API key explicitly in UI or console
// If the key is undefined, at least warn strongly!
content = content.replace(
  `const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;`,
  `const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
if (!API_KEY) {
  console.error("CRITICAL ERROR: VITE_OPENAI_API_KEY is not defined in your environment variables! The AI will permanently fail and use offline fallbacks. Please add VITE_OPENAI_API_KEY to your Vercel settings.");
}`
);

fs.writeFileSync('src/services/aiService.ts', content);
