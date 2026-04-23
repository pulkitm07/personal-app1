const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
if (!API_KEY) {
  console.error("CRITICAL ERROR: VITE_OPENAI_API_KEY is not defined in your environment variables! The AI will permanently fail and use offline fallbacks. Please add VITE_OPENAI_API_KEY to your Vercel settings.");
}

type CacheEntry<T> = {
  date: string;
  data: T;
};

// --- Memory Module ---
function getMemory(domain: string): string[] {
  try {
    const mem = localStorage.getItem(`ai_memory_${domain}`);
    return mem ? JSON.parse(mem) : [];
  } catch (e) {
    return [];
  }
}

function appendMemory(domain: string, items: string[]) {
  const mem = getMemory(domain);
  const newMem = [...mem, ...items].slice(-300);
  localStorage.setItem(`ai_memory_${domain}`, JSON.stringify(newMem));
}

// Helper for AI Calls
async function callOpenAI(prompt: string, cacheKey: string, dateStr: string, fallbackFn: () => Promise<any>) {
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed: CacheEntry<any> = JSON.parse(cached);
      if (parsed.date === dateStr) return parsed.data;
    } catch(e) {}
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      })
    });

    if (!response.ok) throw new Error("API Failed");

    const result = await response.json();
    let content = result.choices[0].message.content.trim();
    if (content.startsWith('```json')) content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    if (content.startsWith('```')) content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    
    const data = JSON.parse(content);
    
    localStorage.setItem(cacheKey, JSON.stringify({ date: dateStr, data }));
    return data;
  } catch (error) {
    console.warn("AI fetch error, using fallback.", error);
    return await fallbackFn();
  }
}

export async function fetchDailyGitaVerses(): Promise<any[]> {
  const dateStr = new Date().toDateString();
  const memory = getMemory('gita');
  
}
