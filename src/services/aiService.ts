const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

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
        model: 'gpt-4o-mini',
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
  
  const prompt = `Generate 3 sequential verses from the Bhagavad Gita. 
CRITICAL: Do not generate any of these previously shown verses: ${memory.join(', ')}.
Return ONLY a strictly valid JSON array of 3 objects. Do not include markdown blocks.
Keys needed: 
"chapter" (number), "verse" (number), "sanskrit" (string), "transliteration" (string), "translation" (string), "explanation" (string combining CONTEXT, THE PHILOSOPHY, and FOR YOUR LIFE paragraphs), "carryToday" (string, a short practical action).`;

  const data = await callOpenAI(prompt, 'daily_gita_cache', dateStr, async () => {
    const fallback = await import('../data/gita.json');
    return fallback.default.slice(0, 3);
  });
  
  if (data && data.length === 3 && typeof data[0].chapter === 'number') {
    const newItems = data.map((v: any) => `Chap${v.chapter}Verse${v.verse}`);
    if (!memory.includes(newItems[0])) appendMemory('gita', newItems);
  }
  return data;
}

export async function fetchDailyPsychologyConcepts(): Promise<any[]> {
  const dateStr = new Date().toDateString();
  const memory = getMemory('psych');
  
  const prompt = `Generate 2 completely distinct psychology concepts. The first must be a general cognitive bias. The second must be a psychology principle specifically meant for business application.
CRITICAL: Do not generate any of these previously shown concepts: ${memory.join(', ')}.
Return ONLY a strictly valid JSON array of 2 objects. Do not include markdown blocks.
Keys needed: 
"name" (string), "originator" (string), "year" (number), "category" (string: exactly "general" or "business"), "definition" (string), "research" (string), "professional" (string), "howToUse" (string), "related" (array of exactly 2 strings).`;

  const data = await callOpenAI(prompt, 'daily_psych_cache', dateStr, async () => {
    const fallback = await import('../data/psychology.json');
    return [
      fallback.default.find((c: any) => c.category === 'general'),
      fallback.default.find((c: any) => c.category === 'business')
    ];
  });
  
  if (data && data.length === 2 && data[0].name) {
    const newItems = data.map((c: any) => c.name);
    if (!memory.includes(newItems[0])) appendMemory('psych', newItems);
  }
  return data;
}

export async function fetchDailyBookSummary(): Promise<any> {
    const dateStr = new Date().toDateString();
    const memory = getMemory('books');
    
    const prompt = `Generate a masterclass-level book summary for a high-impact non-fiction book (psychology, business, economics, or philosophy).
CRITICAL: Do not summarize any of these previously shown books: ${memory.join(', ')}.
Return ONLY a strictly valid JSON object representing ONE book. Do not include markdown blocks.
Keys needed: 
"title" (string), "author" (string), "category" (string), "year" (number), "summary" (string), "highlights" (array of exactly 5 string highlights), "action" (string "One Thing to Do Today").`;
  
    const data = await callOpenAI(prompt, 'daily_book_cache', dateStr, async () => {
      return {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        category: 'Psychology / Behavioural Economics',
        year: 2011,
        summary: `Daniel Kahneman — the only psychologist to win a Nobel Prize in Economics — spent five decades studying the systematic errors human minds make when thinking and deciding. This book is his synthesis. He argues that the mind operates through two systems: System 1, which is fast, automatic, emotional, and largely unconscious; and System 2, which is slow, deliberate, effortful, and logical. The trouble is that System 2 is lazy. We use it far less than we think. Most of our judgements — including consequential financial, medical, and moral decisions — are produced by System 1 and merely rubber-stamped by System 2. The book catalogues the cognitive biases that emerge from this architecture: anchoring, availability heuristic, loss aversion, overconfidence, planning fallacy, and dozens more. It is not a self-help book. It is an honest, sometimes humbling account of how profoundly unreliable human intuition is — and what conditions allow genuine expertise to develop.`,
        highlights: [
          `System 1 cannot be turned off, only managed. The biases Kahneman describes are not fixable through willpower or intelligence — they are baked into the architecture of human cognition. Even statisticians fall for them. The practical implication: the goal is not to eliminate bias but to design decision environments (checklists, pre-mortems, reference class forecasting) that catch System 1 errors before they become consequential.`,
          `Anchoring is more powerful than almost anyone believes. The first number in any negotiation disproportionately influences the final outcome — even when both parties know it is arbitrary. In one study, judges gave lighter sentences after rolling a low number on a loaded dice. Understanding anchoring means setting it deliberately when you're selling, and building explicit protocols to ignore it when you're evaluating.`,
          `Loss aversion (losses hurt ~2x more than equivalent gains feel good) explains a vast range of irrational behaviour — from investors holding losing positions too long, to employees resisting pay restructuring even when the expected value is identical. Kahneman and Tversky's Prospect Theory won the Nobel precisely because it described actual human behaviour, not the rational agent economists had assumed.`,
          `Overconfidence is the most dangerous and pervasive bias in professional settings. CEOs, analysts, doctors, and lawyers all consistently overestimate their accuracy and underestimate uncertainty. The planning fallacy — the systematic tendency to underestimate time, cost, and risk on projects — is a direct consequence. The antidote is reference class forecasting: instead of asking "how long will this take?" ask "how long did similar projects actually take?"`,
          `Genuine expertise requires two conditions that are rarely both present: an environment with sufficient regularity to be learnable, and prolonged practice with rapid, unambiguous feedback. Chess players and anaesthesiologists develop real expertise. Stock pickers and clinical psychologists making long-range predictions largely do not — their environments lack the feedback loop required for skill acquisition.`
        ],
        action: `Today, before making any significant decision, write down three reasons you might be wrong — then genuinely consider them before proceeding. This is the simplest implementation of what Kahneman calls a "pre-mortem," and it activates System 2 in a situation where System 1 would otherwise dominate.`
      };
    });
    
    if (data && data.title) {
      if (!memory.includes(data.title)) appendMemory('books', [data.title]);
    }
    return data;
}

export async function fetchDailyCaseStudy(): Promise<any> {
    const dateStr = new Date().toDateString();
    const memory = getMemory('cases');
    
    const prompt = `Generate a detailed corporate business case study (startup rise, spectacular fall, or comeback).
CRITICAL: Do not generate on any of these previously shown companies: ${memory.join(', ')}.
Return ONLY a strictly valid JSON object representing ONE company case study. Do not include markdown blocks.
Keys needed: 
"company" (string), "type" (string: exactly "rise", "fall", or "comeback"), "headline" (string), "founded" (number), "country" (string), "industry" (string), "story" (string), "diagnosis" (string), "lessons" (array of exactly 3 strings).`;
  
    const data = await callOpenAI(prompt, 'daily_case_cache', dateStr, async () => {
      return {
        company: 'WeWork',
        type: 'fall',
        headline: 'How a $47 billion office-rental company imploded in six weeks',
        founded: 2010,
        country: 'USA',
        industry: 'Real Estate / PropTech',
        story: `August 2019. WeWork files its S-1 — the document that was supposed to crown Adam Neumann as the next Steve Jobs and validate SoftBank's $10.65 billion bet. Instead, it detonated a bomb under the company.\n\nThe S-1 revealed what insiders had long whispered: WeWork was not a tech company. It was a real estate arbitrage business dressed in Silicon Valley clothing — signing long-term office leases, subdividing the space, and subletting it to startups and corporates at a premium. This model works fine. The problem was the valuation. At $47 billion, WeWork was priced like a software platform with infinite scale and near-zero marginal cost. In reality, every new member required expensive physical buildout. Revenue was $1.8 billion. Losses were $1.9 billion. The company was literally losing more than it earned.\n\nThen came the personal revelations. Neumann had trademarked the word "We" and sold it back to WeWork for $5.9 million. He had taken a $500 million personal credit line secured against his company stock. He had purchased properties that he then leased back to WeWork — at a profit to himself. The S-1 contained a governance structure that gave him 20 votes per share versus 1 for regular investors. The IPO was yanked. Neumann was removed as CEO in September 2019 — but given a $1.7 billion exit package to leave.`,
        diagnosis: `WeWork's collapse had one root cause wearing several masks: the conflation of growth with value creation. The company was expanding its losses as fast as its revenue — a structure that only works if you eventually reach profitability at scale, which WeWork's unit economics made mathematically implausible. A single WeWork location took 24–36 months to reach profitability. The company was opening locations faster than existing ones matured. SoftBank's capital enabled the delusion. Neumann's charisma sold it. And a bull market in private tech valuations meant nobody ran the basic arithmetic until the IPO forced transparency. The moment the S-1 made the numbers public, the story collapsed.`,
        lessons: [
          `Revenue growth without unit economics is not a business model — it is an accelerating liability. Before being impressed by any company's top-line growth, ask: does each new unit of revenue come with a clear path to positive contribution margin? WeWork's per-location economics were well understood internally. They were simply not discussed externally.`,
          `Governance structure is a leading indicator of risk, not a footnote. Neumann's 20-to-1 voting rights meant no board or investor could check his behaviour. When you evaluate any company — as an investor, employee, or analyst — read the governance section of the filing as carefully as the financial statements. Who can say no to the CEO? If the answer is nobody, the financial risk is compounded by a structural one.`,
          `The valuation of a business must be anchored in its actual economic model, not its aspirational narrative. "We are a tech company" is a claim that must be tested against the cost structure, not accepted because the founder says so. WeWork's gross margin, capex requirements, and lease obligations all screamed "real estate." Only its pitch deck screamed "tech." In investing and in due diligence, always let the numbers override the narrative.`
        ]
      };
    });
    
    if (data && data.company) {
      if (!memory.includes(data.company)) appendMemory('cases', [data.company]);
    }
    return data;
}
