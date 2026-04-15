const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

type CacheEntry<T> = {
  date: string;
  data: T;
};

export async function fetchDailyGitaVerses(): Promise<any[]> {
  const dateStr = new Date().toDateString();
  const cacheKey = 'daily_gita_cache';
  
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed: CacheEntry<any[]> = JSON.parse(cached);
      if (parsed.date === dateStr) {
        return parsed.data;
      }
    } catch(e) {}
  }

  const prompt = `Generate 3 sequential verses from the Bhagavad Gita. Randomly pick a chapter and starting verse so it doesn't repeat.
Return ONLY a strictly valid JSON array of 3 objects. 
Do not include markdown blocks like \`\`\`json.
Each object must have exactly these keys: 
"chapter" (number), "verse" (number), "sanskrit" (string), "transliteration" (string), "translation" (string), 
"explanation" (string combining CONTEXT, THE PHILOSOPHY, and FOR YOUR LIFE paragraphs), 
"carryToday" (string, a short practical action).`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9
      })
    });

    if (!response.ok) throw new Error("API Failed");

    const result = await response.json();
    let content = result.choices[0].message.content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    }
    if (content.startsWith('```')) {
      content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    const data = JSON.parse(content);
    
    localStorage.setItem(cacheKey, JSON.stringify({
      date: dateStr,
      data: data
    }));
    
    return data;
  } catch (error) {
    console.error("AI fetch error fallback to local", error);
    const fallback = await import('../data/gita.json');
    return fallback.default.slice(0, 3);
  }
}

export async function fetchDailyPsychologyConcepts(): Promise<any[]> {
  const dateStr = new Date().toDateString();
  const cacheKey = 'daily_psych_cache';
  
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed: CacheEntry<any[]> = JSON.parse(cached);
      if (parsed.date === dateStr) {
        return parsed.data;
      }
    } catch(e) {}
  }

  const prompt = `Randomly select 2 completely distinct psychology concepts that are rarely talked about. The first must be a general psychology cognitive bias. The second must be a psychology principle specifically meant for business application.
Return ONLY a strictly valid JSON array of 2 objects. 
Do not include markdown blocks like \`\`\`json.
Each object must have exactly these keys: 
"name" (string), "originator" (string), "year" (number), "category" (string: exactly "general" or "business"),
"definition" (string), "research" (string), "professional" (string), "howToUse" (string), "related" (array of exactly 2 related psychological concept strings).`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9
      })
    });

    if (!response.ok) throw new Error("API Failed");

    const result = await response.json();
    let content = result.choices[0].message.content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    }
    if (content.startsWith('```')) {
      content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    const data = JSON.parse(content);
    
    localStorage.setItem(cacheKey, JSON.stringify({
      date: dateStr,
      data: data
    }));
    
    return data;
  } catch (error) {
    console.error("AI fetch error fallback to local", error);
    const fallback = await import('../data/psychology.json');
    return fallback.default.slice(0, 2);
  }
}
