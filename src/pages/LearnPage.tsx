import { useState } from 'react';
import { Card } from '../components/UI/Card';
import gitaData from '../data/gita.json';
import psychologyData from '../data/psychology.json';
import financeData from '../data/finance-terms.json';
import vocabularyData from '../data/vocabulary.json';
import lawsData from '../data/laws.json';

// ─── GITA DATA ────────────────────────────────────────────────────────────────
const gitaVerses = gitaData as any[];

// ─── PSYCHOLOGY DATA ──────────────────────────────────────────────────────────
const psychologyList = psychologyData as any[];

// ─── FINANCE TERMS DATA ───────────────────────────────────────────────────────
const financeTermsList = financeData as any[];

// ─── VOCABULARY DATA ──────────────────────────────────────────────────────────
const vocabWordsList = vocabularyData as any[];

// ─── BOOK SUMMARY DATA ────────────────────────────────────────────────────────
const bookSummary = {
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

// ─── CASE STUDY DATA ──────────────────────────────────────────────────────────
const caseStudy = {
  company: 'WeWork',
  type: 'fall' as const,
  headline: 'How a $47 billion office-rental company imploded in six weeks',
  founded: 2010,
  country: 'USA',
  industry: 'Real Estate / PropTech',
  story: `August 2019. WeWork files its S-1 — the document that was supposed to crown Adam Neumann as the next Steve Jobs and validate SoftBank's $10.65 billion bet. Instead, it detonated a bomb under the company.\n\nThe S-1 revealed what insiders had long whispered: WeWork was not a tech company. It was a real estate arbitrage business dressed in Silicon Valley clothing — signing long-term office leases, subdividing the space, and subletting it to startups and corporates at a premium. This model works fine. The problem was the valuation. At $47 billion, WeWork was priced like a software platform with infinite scale and near-zero marginal cost. In reality, every new member required expensive physical buildout. Revenue was $1.8 billion. Losses were $1.9 billion. The company was literally losing more than it earned.\n\nThen came the personal revelations. Neumann had trademarked the word "We" and sold it back to WeWork for $5.9 million. He had taken a $500 million personal credit line secured against his company stock. He had purchased properties that he then leased back to WeWork — at a profit to himself. The S-1 contained a governance structure that gave him 20 votes per share versus 1 for regular investors. The IPO was yanked. Neumann was removed as CEO in September 2019 — but given a $1.7 billion exit package to leave.`,
  diagnosis: `WeWork's collapse had one root cause wearing several masks: the conflation of growth with value creation. The company was expanding its losses as fast as its revenue — a structure that only works if you eventually reach profitability at scale, which WeWork's unit economics made mathematically implausible. A single WeWork location took 24â€“36 months to reach profitability. The company was opening locations faster than existing ones matured. SoftBank's capital enabled the delusion. Neumann's charisma sold it. And a bull market in private tech valuations meant nobody ran the basic arithmetic until the IPO forced transparency. The moment the S-1 made the numbers public, the story collapsed.`,
  lessons: [
    `Revenue growth without unit economics is not a business model — it is an accelerating liability. Before being impressed by any company's top-line growth, ask: does each new unit of revenue come with a clear path to positive contribution margin? WeWork's per-location economics were well understood internally. They were simply not discussed externally.`,
    `Governance structure is a leading indicator of risk, not a footnote. Neumann's 20-to-1 voting rights meant no board or investor could check his behaviour. When you evaluate any company — as an investor, employee, or analyst — read the governance section of the filing as carefully as the financial statements. Who can say no to the CEO? If the answer is nobody, the financial risk is compounded by a structural one.`,
    `The valuation of a business must be anchored in its actual economic model, not its aspirational narrative. "We are a tech company" is a claim that must be tested against the cost structure, not accepted because the founder says so. WeWork's gross margin, capex requirements, and lease obligations all screamed "real estate." Only its pitch deck screamed "tech." In investing and in due diligence, always let the numbers override the narrative.`
  ]
};

// ─── COLLAPSIBLE SECTION ─────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 animate-fade-in transition-all">
      <h2 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white mb-6">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium tracking-widest uppercase text-accent dark:text-accent mb-1.5">
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>
    </div>
  );
}

// ─── GITA SECTION ─────────────────────────────────────────────────────────────
function GitaSection() {
  return (
    <Section title="Bhagavad Gita — Today's Verses">
      <div className="space-y-6">
        {gitaVerses.map((verse, i) => (
          <Card key={i} className="border-l-4 border-l-amber-500 dark:border-l-amber-400">
            <div className="space-y-4">
              {/* Ref */}
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400 tracking-widest uppercase">
                Chapter {verse.chapter} Â· Verse {verse.verse}
              </p>

              {/* Sanskrit */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                <Label>Sanskrit</Label>
                <p className="text-base italic text-gray-900 dark:text-gray-100 leading-loose font-serif">
                  {verse.sanskrit}
                </p>
              </div>

              {/* Transliteration */}
              <Field label="Transliteration">
                <span className="font-mono text-xs">{verse.transliteration}</span>
              </Field>

              {/* Translation */}
              <Field label="Literal Translation">
                {verse.translation}
              </Field>

              {/* Explanation */}
              <div className="mb-4">
                <Label>Explanation</Label>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4 space-y-3">
                  {verse.explanation.split('\n\n').map((para, j) => (
                    <p key={j} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {para.startsWith('CONTEXT:') ? (
                        <><span className="font-semibold text-blue-700 dark:text-blue-400">Context: </span>{para.replace('CONTEXT: ', '')}</>
                      ) : para.startsWith('THE PHILOSOPHY:') ? (
                        <><span className="font-semibold text-blue-700 dark:text-blue-400">The Philosophy: </span>{para.replace('THE PHILOSOPHY: ', '')}</>
                      ) : para.startsWith('FOR YOUR LIFE:') ? (
                        <><span className="font-semibold text-blue-700 dark:text-blue-400">For Your Life: </span>{para.replace('FOR YOUR LIFE: ', '')}</>
                      ) : para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Carry Today */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg p-3">
                <Label>Carry This Today</Label>
                <p className="text-sm italic text-amber-800 dark:text-amber-300 leading-relaxed">
                  "{verse.carryToday}"
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ─── PSYCHOLOGY SECTION ───────────────────────────────────────────────────────
function PsychologySection() {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const conceptIndex = dayOfYear % psychologyList.length;
  const c = psychologyList[conceptIndex];

  return (
    <Section title="Psychology Concept">
      <Card>
        <div className="mb-5">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">{c.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500 font-mono mt-1">
            {c.originator}, {c.year}
          </p>
        </div>

        <Field label="What It Is">{c.definition}</Field>

        <div className="mb-4">
          <Label>The Original Research</Label>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{c.research}</p>
          </div>
        </div>

        <Field label="In Your Professional Life">{c.professional}</Field>
        <Field label="How to Use It">{c.howToUse}</Field>

        <div>
          <Label>Related Concepts</Label>
          <div className="space-y-2">
            {c.related.map((r, i) => (
              <div key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-accent dark:text-accent shrink-0">→</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Section>
  );
}

// ─── FINANCE TERMS SECTION ────────────────────────────────────────────────────
function FinanceTermsSection() {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const startIndex = (dayOfYear * 2) % financeTermsList.length;
  const selectedTerms = [
    financeTermsList[startIndex],
    financeTermsList[(startIndex + 1) % financeTermsList.length],
  ];

  return (
    <Section title="Finance Terms">
      <div className="grid md:grid-cols-2 gap-5">
        {selectedTerms.map((term, i) => (
          <Card key={i}>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{term.term}</h3>
              <p className="text-xs font-mono text-accent dark:text-accent mt-1">{term.domain}</p>
            </div>

            <Field label="Definition">{term.definition}</Field>
            <Field label="Why It Matters">{term.whyItMatters}</Field>

            <div className="mb-4">
              <Label>Formula</Label>
              <div className="bg-gray-900 dark:bg-black rounded-lg p-3 font-mono text-xs text-green-400 leading-relaxed whitespace-pre-wrap">
                {term.formula}
              </div>
            </div>

            <Field label="Real Example">{term.example}</Field>

            <div>
              <Label>Interview Trap ⚠️</Label>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{term.interviewTrap}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ─── VOCABULARY SECTION ───────────────────────────────────────────────────────
function VocabularySection() {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const startIndex = (dayOfYear * 3) % vocabWordsList.length;
  const selectedWords = [
    vocabWordsList[startIndex],
    vocabWordsList[(startIndex + 1) % vocabWordsList.length],
    vocabWordsList[(startIndex + 2) % vocabWordsList.length],
  ];

  return (
    <Section title="Vocabulary Builder">
      <div className="grid md:grid-cols-3 gap-5">
        {selectedWords.map((word, i) => (
          <Card key={i}>
            <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{word.word}</h3>
              <p className="text-xs font-mono text-accent dark:text-accent mt-1">{word.pronunciation}</p>
            </div>

            <Field label="Etymology">{word.etymology}</Field>
            <Field label="Definition">{word.definition}</Field>

            <div className="mb-4">
              <Label>Professional Examples</Label>
              <div className="space-y-2">
                {word.examples.map((ex, j) => (
                  <p key={j} className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-gray-700">
                    {ex}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <Label>Synonyms</Label>
                <p className="text-gray-600 dark:text-gray-400">{word.synonyms.join(', ')}</p>
              </div>
              <div>
                <Label>Antonyms</Label>
                <p className="text-gray-600 dark:text-gray-400">{word.antonyms.join(', ')}</p>
              </div>
            </div>

            <Field label="Usage Note">{word.usageNote}</Field>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ─── BOOK SUMMARY SECTION ─────────────────────────────────────────────────────
function BookSummarySection() {
  const b = bookSummary;
  return (
    <Section title="Book Summary">
      <Card>
        {/* Header */}
        <div className="flex gap-5 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="w-16 h-22 bg-gradient-to-br from-accent to-[#1a5ca8] rounded-lg flex items-center justify-center text-white text-xs text-center p-2 shrink-0 font-medium leading-tight" style={{height: '88px'}}>
            {b.title.split(' ').slice(0, 3).join(' ')}
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{b.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{b.author}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent">
                {b.category}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {b.year}
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <Label>Summary</Label>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{b.summary}</p>
        </div>

        {/* Highlights */}
        <div className="mb-6">
          <Label>Key Highlights</Label>
          <div className="space-y-4">
            {b.highlights.map((h, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl font-bold text-gray-200 dark:text-gray-700 shrink-0 leading-tight font-serif">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">{h}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="bg-gradient-to-r from-accent/10 to-transparent dark:from-accent/20 border border-accent/20 rounded-lg p-4">
          <Label>One Thing to Do Today</Label>
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{b.action}</p>
        </div>
      </Card>
    </Section>
  );
}

// ─── CASE STUDY SECTION ───────────────────────────────────────────────────────
function CaseStudySection() {
  const c = caseStudy;
  const typeLabel = { rise: 'The Rise', fall: 'The Fall', comeback: 'The Comeback' }[c.type];
  const typeBg = { rise: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', fall: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', comeback: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' }[c.type];

  return (
    <Section title="Company Case Study">
      <Card className="!p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-[#1a1a1a]">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs px-2 py-1 rounded font-medium ${typeBg}`}>{typeLabel}</span>
            <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">{c.founded} Â· {c.country} Â· {c.industry}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{c.company}</h3>
          <p className="text-base text-gray-600 dark:text-gray-400 italic">{c.headline}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Story */}
          <div>
            <Label>The Story</Label>
            <div className="space-y-3">
              {c.story.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <Label>The Diagnosis</Label>
            <div className="border-l-4 border-accent dark:border-accent pl-4 bg-gray-50 dark:bg-gray-900/50 rounded-r-lg py-3 pr-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{c.diagnosis}</p>
            </div>
          </div>

          {/* Lessons */}
          <div>
            <Label>3 Lessons</Label>
            <div className="space-y-4">
              {c.lessons.map((lesson, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-3xl font-bold text-gray-200 dark:text-gray-700 shrink-0 leading-none font-serif">{i + 1}</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">{lesson}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}

// ─── LAWS SECTION ─────────────────────────────────────────────────────────────
const laws = lawsData as any[];
const categoryConfig: Record<string, any> = {
  corporate: { label: 'Corporate Law', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-l-green-500' },
  constitutional: { label: 'Constitutional Law', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-l-blue-500' },
  criminal: { label: 'Criminal Law', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-l-red-500' },
  landmark: { label: 'Landmark Case', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-l-amber-500' }
};

function LawCard({ law }: { law: typeof laws[0] }) {
  const config = categoryConfig[law.category] || categoryConfig.corporate;
  return (
    <Card className={`border-l-4 ${config.border} !p-0 overflow-hidden`}>
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <span className={`inline-block text-xs px-2 py-1 rounded font-medium mb-3 ${config.bg} ${config.text}`}>
          {config.label}
        </span>
        <h3 className="text-base font-medium text-gray-900 dark:text-white leading-snug mb-1.5">{law.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono leading-relaxed">{law.reference}</p>
      </div>
      <div className="p-5 space-y-4">
        <div><Label>What Is This?</Label><p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{law.whatIsThis}</p></div>
        <div><Label>Why Does This Exist?</Label><p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{law.whyExists}</p></div>
        <div>
          <Label>Real Example</Label>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{law.example}</p>
          </div>
        </div>
        <div><Label>What This Means for You</Label><p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{law.meansForYou}</p></div>
        <div className="bg-gradient-to-r from-accent/5 to-transparent dark:from-accent/10 border-l-2 border-accent dark:border-accent pl-3 py-2 pr-2 rounded-r-lg">
          <p className="text-xs font-mono text-accent dark:text-accent mb-1 uppercase tracking-wider">One Line Summary</p>
          <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed italic">"{law.oneLine}"</p>
        </div>
      </div>
    </Card>
  );
}

function LawsSection() {
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const categories = ['constitutional', 'corporate', 'criminal', 'landmark'] as const;
  const lawsByCategory = categories.map((cat) => {
    const categoryLaws = laws.filter((l: any) => l.category === cat);
    const index = dayOfYear % categoryLaws.length;
    return categoryLaws[index];
  });

  return (
    <Section title="Law of the Day">
      <div className="grid md:grid-cols-2 gap-6">
        {lawsByCategory.map((law: any, i: number) => (
          <LawCard key={i} law={law} />
        ))}
      </div>
    </Section>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export function LearnPage() {
  const [activeTab, setActiveTab] = useState('gita');

  const tabs = [
    { id: 'gita', label: 'Bhagavad Gita' },
    { id: 'psychology', label: 'Psychology' },
    { id: 'finance', label: 'Finance' },
    { id: 'vocab', label: 'Vocabulary' },
    { id: 'books', label: 'Books' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'laws', label: 'Laws' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">Learn</h1>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
               activeTab === tab.id
                ? 'bg-accent text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'gita' && <GitaSection />}
        {activeTab === 'psychology' && <PsychologySection />}
        {activeTab === 'finance' && <FinanceTermsSection />}
        {activeTab === 'vocab' && <VocabularySection />}
        {activeTab === 'books' && <BookSummarySection />}
        {activeTab === 'case-studies' && <CaseStudySection />}
        {activeTab === 'laws' && <LawsSection />}
      </div>
    </div>
  );
}

