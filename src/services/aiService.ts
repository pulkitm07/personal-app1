import gitaData from '../data/gita.json';
import psychologyData from '../data/psychology.json';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Books Fallback Data Set
const booksData = [
  {
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
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help / Psychology',
    year: 2018,
    summary: `Atomic Habits reshapes how we think about progress and success. Instead of setting massive goals, Clear argues that we should focus on the underlying systems that drive our behavior. A habit is a routine or behavior that is performed regularly—and, in many cases, automatically. Changes that seem small and unimportant at first will compound into remarkable results if you're willing to stick with them.`,
    highlights: [
      `Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them.`,
      `Forget about goals, focus on systems instead. Goals are about the results you want to achieve. Systems are about the processes that lead to those results.`,
      `Make it Obvious. The first Law of Behavior Change. Create environments that make your good habits inevitably easy to engage with.`,
      `Make it Attractive. The second Law. Pair an action you want to do with an action you need to do (temptation bundling).`,
      `Make it Easy. The third Law. Reduce the friction associated with your good habits. When friction is low, habits are easy.`
    ],
    action: `Identify one small friction point in a habit you want to build and eliminate it today using the Two-Minute Rule.`
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    category: 'Productivity / Career',
    year: 2016,
    summary: `Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time. Newport argues that in our increasingly distracted digital world, this skill is becoming rarer and therefore more valuable.`,
    highlights: [
      `The Deep Work Hypothesis: The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy.`,
      `Network tools (email, social media) fragment our attention and lead to 'shallow work', which is non-cognitively demanding and easy to replicate.`,
      `To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction.`,
      `Embrace Boredom: Your brain needs to be trained to overcome its desire for distraction. If you give in to distraction at the first sign of boredom, your focus muscle weakens.`,
      `Quit Social Media: Evaluate network tools based on whether they bring significantly more value to your professional and personal life than they drain.`
    ],
    action: `Schedule a 90-minute block of uninterrupted time tomorrow morning. Turn off all notifications and focus entirely on your most important task.`
  },
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'Business / Entrepreneurship',
    year: 2014,
    summary: `Zero to One focuses on how companies can create new, entirely unprecedented value (going from 0 to 1) rather than copying existing models (going from 1 to n). Thiel, co-founder of PayPal and Palantir, argues that the most valuable businesses create a monopoly in a small niche before expanding. Focus on uniqueness, proprietary technology, and network effects.`,
    highlights: [
      `Competition is for losers. If you want to create and capture lasting value, look to build a monopoly. Monopolies drive progress because the promise of years of monopoly profits provides the incentive to innovate.`,
      `The Thiel Question: What important truth do very few people agree with you on? The best businesses are built on secrets—truths that are not widely known.`,
      `Start small and monopolize. It's always a red flag when entrepreneurs talk about getting 1% of a $100 billion market. Create something that dominates a specialized, small market first.`,
      `Technology vs. Globalization. Doing what we already know how to do takes the world from 1 to n (globalization). Creating something new takes us from 0 to 1 (technology).`,
      `Sales matter. Even the best product will not sell itself. Distribution is essential, and many businesses fail because they ignore the mechanics of selling.`
    ],
    action: `Write down three counterintuitive beliefs you hold about your industry. Explore how you could build a unique solution around one of them.`
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Finance / Psychology',
    year: 2020,
    summary: `Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people. Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life's most important topics.`,
    highlights: [
      `No One's Crazy. Your personal experiences with money make up maybe 0.00000001% of what's happened in the world, but maybe 80% of how you think the world works.`,
      `Luck & Risk. They are siblings. They are the reality that every outcome in life is guided by forces other than individual effort. Don't focus too much on specific individuals and case studies; look for broad patterns.`,
      `Never Enough. The hardest financial skill is getting the goalpost to stop moving. Comparing yourself to others is a game you can never win.`,
      `Wealth is What You Don't See. Wealth is simply the unspent income. It's the cars not purchased, the diamonds not bought, the watches not worn.`,
      `Room for Error. The most important part of any plan is planning on your plan not going according to plan. Margin of safety ensures survival.`
    ],
    action: `Calculate your true savings rate and identify one recurring expense that is purely for showing status. Decide if it's worth keeping.`
  }
];

// Case Studies Fallback Data Set
const casesData = [
  {
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
  },
  {
    company: 'Blockbuster',
    type: 'fall',
    headline: 'The giant that ignored the digital revolution',
    founded: 1985,
    country: 'USA',
    industry: 'Entertainment / Retail',
    story: `In the late 1990s and early 2000s, Blockbuster was the undisputed king of home entertainment, with over 9,000 stores globally and revenues peaking near $6 billion. But their lucrative business model had a fatal flaw: a significant portion of its profits came from late fees, penalizing their best customers.\n\nWhen a nimble startup named Netflix emerged in 1997, offering DVD rentals by mail with no late fees, Blockbuster executives were dismissive. In 2000, Netflix's founders offered to sell the company to Blockbuster for $50 million, and were literally laughed out of the room. Blockbuster firmly believed the future remained in brick-and-mortar stores. As broadband internet spread, Netflix successfully pivoted to streaming while Blockbuster scrambled too late to catch up. Straddled with massive debt and declining foot traffic, Blockbuster filed for bankruptcy in 2010. Today, only one franchise store remains in Bend, Oregon.`,
    diagnosis: `Blockbuster's failure was deeply rooted in strategic inertia and a failure to disrupt its own profitable but outdated model. The core of their failure was an over-reliance on physical retail optimization and 'late fees'. They optimized for their present state rather than orienting towards undeniable technological shifts in consumer behavior (convenience and digital streaming).`,
    lessons: [
      `Cannibalize your own business before someone else does. If Blockbuster had launched a compelling streaming service earlier, it would have hurt their retail profits in the short term, but secured their long-term survival.`,
      `Your revenue model shouldn't antagonize your core customers. Relying on late fees generated tremendous backlash and created the perfect opening for Netflix's subscription-based, penalty-free value proposition.`,
      `Don't let past success blind you to future shifts. Market dominance is never permanent. The leadership ignored the clear signals of broadband scaling because their existing cash flows blinded them to the impending digital revolution.`
    ]
  },
  {
    company: 'Apple',
    type: 'comeback',
    headline: 'From 90 days away from bankruptcy to trillion-dollar dominance',
    founded: 1976,
    country: 'USA',
    industry: 'Technology / Consumer Electronics',
    story: `By 1997, Apple was bleeding cash, struggling with a confusing array of mediocre products (like the Newton PDA), and entirely losing the PC war to Microsoft. The company was reportedly just 90 days away from bankruptcy.\n\nIn a desperate move, Apple acquired NeXT, bringing Steve Jobs back to the company he founded. Jobs ruthlessly pruned the product line from over 30 confusing models down to just four core quadrants: Desktop/Portable and Consumer/Pro. He secured a $150 million investment from arch-rival Microsoft to keep the lights on and guarantee Office software. Most importantly, he led a dramatic shift from building generic hardware to obsessing over design and user experience. The iMac G3 (1998) saved the company financially. Then came the iPod (2001), the iPhone (2007), and the iPad (2010)—transforming Apple from a struggling computer maker into the most valuable corporation on the planet.`,
    diagnosis: `Apple's turnaround hinged on brutal simplification. Prior to Jobs' return, Apple suffered from extreme product bloat, trying to please everyone and fundamentally pleasing no one. Jobs refocused the company on its core DNA: creating premium, beautifully designed, and functionally superior products. This allowed them to concentrate their limited resources on a few bets that paid off tremendously.`,
    lessons: [
      `Addition by subtraction. When a business is failing, the instinct is often to offer more features, more products, more services. Usually, the correct answer is drastic reduction. Cut the noise so the signal can be heard.`,
      `A coherent vision is more powerful than market share. Apple stopped trying to beat Microsoft at the commodity enterprise PC game and shifted the battleground to premium consumer design, where Apple held the advantage.`,
      `Swallow your pride to survive. Partnering with Bill Gates in 1997 infuriated Apple loyalists, but it secured the cash and software ecosystem necessary for survival, paving the way for future triumphs.`
    ]
  },
  {
    company: 'Airbnb',
    type: 'rise',
    headline: 'Selling cereal boxes to keep the lights on',
    founded: 2008,
    country: 'USA',
    industry: 'Hospitality / Travel',
    story: `In 2008, Brian Chesky and Joe Gebbia couldn't afford their San Francisco rent. They inflated three airbeds in their living room and hosted attendees of a local design conference, calling it "Airbed and Breakfast". \n\nThey launched during a harsh economic downturn, and initial traction was awful. To fund their struggling startup, they created custom cereal boxes during the 2008 election ("Obama O's" and "Cap'n McCains") and sold them for $40 a box. This hustle scored them an interview with Y Combinator's Paul Graham, who admitted: "If you can convince people to pay $40 for a box of cereal, you can maybe convince them to stay in other people's beds." The turning point came when they realized their hosts in New York were taking terrible photos of their apartments. The founders flew out, rented a $5,000 camera, and literally went door-to-door photographing the listings. Revenue immediately doubled, proving the model could work.`,
    diagnosis: `Airbnb succeeded because the founders did things that didn't scale in the early days. Instead of relying purely on code and algorithms to solve their growth problems, they engaged directly with their product and their users. The cereal boxes proved sheer determination, while the professional photography solved a critical trust and aesthetic barrier in the marketplace.`,
    lessons: [
      `Do things that don't scale. In the early stages, manual interventions (like taking photos door-to-door) are essential to kickstart a marketplace and understand the true friction points of your users.`,
      `Design builds trust. Renting a room from a stranger on the internet required an immense leap of faith. High-quality imagery and a beautiful UI bridged that trust gap, making the weird seem completely normal.`,
      `Hustle and resourcefulness can outlast capital. Selling novelty cereal had nothing to do with building a software platform, but it generated the cash flow and demonstrated the relentless grit required to survive the "trough of sorrow."`
    ]
  },
  {
    company: 'Nokia',
    type: 'fall',
    headline: 'The dominant mobile king that missed the smartphone era',
    founded: 1865,
    country: 'Finland',
    industry: 'Telecommunications',
    story: `In 2007, Nokia commanded over 40% of the global mobile phone market. They were the undisputed hardware kings, boasting legendary battery life and durability. \n\nThen Steve Jobs unveiled the iPhone. Nokia's leadership evaluated it and dismissed it: it had poor battery life, repeatedly dropped calls, and lacked a physical keyboard—all metrics Nokia dominated. Nokia continued optimizing their Symbian operating system, treating mobile phones primarily as hardware devices that occasionally used data. Apple and Google (with Android) realized the paradigm had shifted; phones were now software platforms that happen to make calls. As developers flocked to iOS and Android, Nokia's ecosystem withered. By 2013, Nokia's market share had plummeted, and they sold their entire mobile division to Microsoft in a desperate (and ultimately failed) bid to survive.`,
    diagnosis: `Nokia fell because of 'success-induced blindness'. Their mastery of the hardware paradigm prevented them from adopting the software and ecosystem paradigm. They measured their new competitors against the old metrics of success (battery life, drop tests) rather than the new metrics (app ecosystem, user interface fluidity). They won the battle they were fighting, but failed to notice a totally different war had begun.`,
    lessons: [
      `The metrics of success change. You cannot evaluate a disruptive threat using the KPIs of your existing business model. Nokia's hardware KPIs totally obfuscated the rising software threat.`,
      `Software eats hardware. In any technology sector, value inevitably migrates from the hardware layers up to the software and ecosystem layers. Ecosystems are far stickier and defensible than physical products alone.`,
      `Bureaucracy stifles innovation. As Nokia grew massive, its internal culture became risk-averse. Layers of middle management delayed the development of competitive touch-screen devices, allowing more agile competitors to dictate the future.`
    ]
  }
];

export async function fetchDailyGitaVerses(): Promise<any[]> {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  
  const startIndex = (dayOfYear * 3) % gitaData.length;
  return [
    gitaData[startIndex],
    gitaData[(startIndex + 1) % gitaData.length],
    gitaData[(startIndex + 2) % gitaData.length],
  ];
}

export async function fetchDailyPsychologyConcepts(): Promise<any[]> {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const generalConcepts = psychologyData.filter((c: any) => c.category === 'general');
  const businessConcepts = psychologyData.filter((c: any) => c.category === 'business');

  const gIdx = dayOfYear % generalConcepts.length;
  const bIdx = dayOfYear % businessConcepts.length;

  return [
    generalConcepts[gIdx],
    businessConcepts[bIdx]
  ];
}

export async function fetchDailyBookSummary(): Promise<any> {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const idx = dayOfYear % booksData.length;
  return booksData[idx];
}

export async function fetchDailyCaseStudy(): Promise<any> {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const idx = dayOfYear % casesData.length;
  return casesData[idx];
}
