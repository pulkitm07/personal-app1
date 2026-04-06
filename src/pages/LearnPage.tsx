import { useState } from 'react';
import { Card } from '../components/UI/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ─── GITA DATA ────────────────────────────────────────────────────────────────
const gitaVerses = [
  {
    chapter: 2, verse: 47,
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    transliteration: 'Karmaṇy-evādhikāras te mā phaleṣhu kadāchana | Mā karma-phala-hetur bhūr mā te saṅgo 'stvakarmaṇi ||',
    translation: 'You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
    explanation: `CONTEXT: At this moment in the Mahabharata, Arjuna has collapsed on the battlefield of Kurukshetra, paralysed by grief and moral confusion. He doesn't want to fight his own family. Krishna responds with what becomes the entire philosophical foundation of the Bhagavad Gita — beginning here, with arguably the most quoted verse in Indian philosophy.\n\nTHE PHILOSOPHY: Krishna is articulating the doctrine of Nishkama Karma — action without attachment to outcomes. This is not passive resignation. It is the most demanding form of engagement: doing your absolute best while being psychologically detached from whether you win or lose. The concept cuts against a fundamental human tendency to tie our self-worth to results. Krishna is saying: the results are not yours to control. The effort is.\n\nFOR YOUR LIFE: In finance and consulting, you will pitch ideas that get rejected, work on deals that collapse, study for exams you might fail. This verse is a precise antidote to outcome anxiety. It doesn't tell you to stop caring — it tells you to redirect your energy entirely into the quality of your work, not the verdict on it. The student who studies because they genuinely want to understand outperforms the one who studies only to pass. This is the same idea, 5,000 years older.`,
    carryToday: 'Do the work completely. Release the outcome entirely. Your only domain is the effort — everything else is noise.'
  },
  {
    chapter: 2, verse: 14,
    sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    transliteration: 'Mātrā-sparśhās tu kaunteya śhītoṣhṇa-sukha-duḥkha-dāḥ | Āgamāpāyino \'nityās tāṁs titikṣhasva bhārata ||',
    translation: 'O son of Kunti, the contact between the senses and sense objects gives rise to fleeting perceptions of happiness and distress. These are non-permanent — they come and go like winter and summer. One must learn to tolerate them without being disturbed.',
    explanation: `CONTEXT: Arjuna is overwhelmed by grief — the prospect of loss, pain, death. Krishna responds not with sympathy but with a precise philosophical observation about the nature of experience itself. He is redirecting Arjuna from emotion to epistemology.\n\nTHE PHILOSOPHY: This verse introduces Titiksha — the Stoic-adjacent concept of equanimity. Krishna is pointing to impermanence (Anitya): every experience, whether pleasurable or painful, is temporary by nature. The Stoics called this Memento Mori. The Buddhists called it Anicca. Krishna calls it the basic operating condition of all sensory experience. What disturbs us is not the event — it is our assumption that the event is permanent.\n\nFOR YOUR LIFE: You will face rejection letters, failed internships, difficult managers, and market downturns. This verse is not telling you to be emotionally numb — it is telling you not to build your identity around temporary states. The bad semester passes. The hostile boss leaves. The bear market ends. Training yourself to zoom out — to see the temporary nature of your current discomfort — is one of the most practically useful mental skills you can develop in your 20s.`,
    carryToday: 'Whatever is making you anxious right now is temporary. It came — it will go. Hold it lightly.'
  },
  {
    chapter: 3, verse: 27,
    sanskrit: 'प्रकृतेः क्रियमाणानि गुणैः कर्माणि सर्वशः। अहङ्कारविमूढात्मा कर्ताहमिति मन्यते॥',
    transliteration: 'Prakṛiteḥ kriyamāṇāni guṇaiḥ karmāṇi sarvaśhaḥ | Ahankāra-vimūḍhātmā kartāham iti manyate ||',
    translation: 'All actions are performed by the qualities of material nature. But the deluded, confused by ego, think: "I am the doer."',
    explanation: `CONTEXT: Krishna is now moving deeper into the philosophy of action — explaining why humans suffer unnecessarily. The previous verses established what to do; this one diagnoses why we get it wrong.\n\nTHE PHILOSOPHY: This verse strikes at the ego — Ahankara, literally "I-maker." The delusion Krishna identifies is the belief that we are the sole authors of our outcomes. In reality, outcomes emerge from an extraordinary confluence of factors: your upbringing, timing, the economy, other people's decisions, biological luck, network effects. To claim full credit or full blame is epistemically false. The Gunas — three fundamental qualities of nature (Tamas, Rajas, Sattva) — operate through us, not solely because of us.\n\nFOR YOUR LIFE: This has direct implications for both success and failure. When your startup succeeds, the ego says "I did this." When it fails, the ego says "I failed." Both are distortions. The honest position is: "I contributed my best effort to a complex system whose outputs I don't fully control." This protects you from both arrogance in success and crushing self-blame in failure — two of the most career-derailing mental traps for ambitious young professionals.`,
    carryToday: 'You are a contributor to outcomes, not their sole cause. Take credit wisely. Take blame honestly. Hold both lightly.'
  }
];

// ─── PSYCHOLOGY DATA ──────────────────────────────────────────────────────────
const psychologyConcept = {
  name: 'Cognitive Dissonance',
  originator: 'Leon Festinger',
  year: 1957,
  definition: `Cognitive dissonance is the mental discomfort experienced when a person holds two or more contradictory beliefs, values, or attitudes simultaneously — or when their actions conflict with their beliefs. The theory posits that this discomfort is a motivational state: people are driven to reduce it, often through rationalisation rather than genuine belief change. It is one of the most robust and consequential findings in social psychology.`,
  research: `Festinger and Carlsmith's 1959 experiment remains the landmark study. Participants were paid either $1 or $20 to lie to another person, claiming a boring task was interesting. When surveyed afterward, the $1 group rated the task as significantly more enjoyable than the $20 group. The explanation: the $20 group had sufficient external justification for lying (they were paid well), so their belief remained unchanged. The $1 group had insufficient justification — so their minds resolved the dissonance by genuinely convincing themselves the task was interesting. The mind rewrites reality to protect internal consistency.`,
  professional: `In consulting, cognitive dissonance explains why clients resist recommendations that contradict their existing strategy — they've already committed publicly to a direction, so accepting contrary evidence would produce dissonance. In finance, it underlies confirmation bias: an analyst who has already taken a position on a stock will unconsciously filter for confirming data. In corporate settings, it explains why teams that invested heavily in a failing project keep doubling down — the sunk cost is not just financial, it is psychological. Admitting the project should be killed means admitting their past judgment was wrong.`,
  howToUse: `When you notice yourself rationalising a decision you've already made, stop and ask: "Would I make this same decision if I were starting fresh today?" When advising others, reduce dissonance by giving them a face-saving reframe rather than a direct contradiction. Instead of "your strategy is wrong," try "given new market data, there's an updated approach that builds on what you've done." And watch your own reactions to information that contradicts your positions — strong negative reactions to contrary evidence are almost always dissonance, not logic.`,
  related: ['Confirmation Bias — the tendency to seek information that confirms existing beliefs', 'Self-Perception Theory (Bem, 1967) — we infer our own attitudes from our behaviour, not the other way around']
};

// ─── FINANCE TERMS DATA ───────────────────────────────────────────────────────
const financeTerms = [
  {
    term: 'EBITDA',
    domain: 'Corporate Finance / Valuation',
    definition: `EBITDA — Earnings Before Interest, Taxes, Depreciation, and Amortisation — is a measure of a company's core operational profitability, stripped of financing decisions, accounting conventions, and tax environments. It is designed to approximate the cash-generating capacity of a business's operations independent of its capital structure. Unlike net income, which varies dramatically based on how a company is financed, EBITDA allows comparison across companies with different debt loads and depreciation policies.`,
    whyItMatters: `Investment bankers use EBITDA as the primary denominator in EV/EBITDA multiples — the most common valuation metric in M&A transactions. Private equity firms focus on it because it approximates free cash flow available for debt service (in leveraged buyouts). Lenders use EBITDA-based covenants (e.g. Net Debt / EBITDA < 3x) to monitor financial health. If you're in consulting or finance, you will encounter this metric in almost every engagement involving corporate valuation.`,
    formula: 'EBITDA = Net Income + Interest Expense + Tax Expense + Depreciation + Amortisation\nOR\nEBITDA = Operating Income (EBIT) + Depreciation + Amortisation',
    example: `Reliance Industries FY2023: Net profit ~₹73,000 Cr. But their EBITDA was ~₹1,53,000 Cr — more than double — because of massive depreciation from their Jio infrastructure rollout and significant interest costs on their debt. A buyer acquiring Reliance would use EBITDA, not net profit, to assess what the business actually generates before financing and accounting choices distort the picture.`,
    interviewTrap: `Candidates confuse EBITDA with free cash flow. They are NOT the same. EBITDA ignores capital expenditure (capex) — a capital-intensive business like a steel plant can have strong EBITDA but negative free cash flow because it must constantly reinvest in equipment. Warren Buffett famously called EBITDA "earnings before the bad stuff" for this reason. Always clarify whether the context calls for EBITDA or FCF.`
  },
  {
    term: 'Working Capital',
    domain: 'Corporate Finance / Accounting',
    definition: `Working Capital is the difference between a company's current assets (cash, inventory, receivables) and current liabilities (payables, short-term debt). It represents the liquid resources a company has available to fund its day-to-day operations. Positive working capital means the company can cover its near-term obligations. Negative working capital — though counterintuitively — can be a sign of operational efficiency in certain business models (see below).`,
    whyItMatters: `CFOs monitor working capital intensity to understand how much cash a business consumes as it grows. A company that requires significant working capital to scale (manufacturing, retail with large inventory) will need external financing to grow. Working capital analysis is central to LBO models, credit analysis, and any operational turnaround. Investment banking analysts build detailed working capital schedules in financial models to forecast cash requirements.`,
    formula: 'Working Capital = Current Assets − Current Liabilities\nNet Working Capital (NWC) = (Receivables + Inventory) − Payables\nChange in NWC affects the Cash Flow Statement directly',
    example: `Amazon has structurally negative working capital — customers pay immediately at purchase, but Amazon pays its suppliers 60–90 days later. This means Amazon receives cash before it needs to pay for the goods it sold. As Amazon grows, it generates more cash from operations automatically. This is a massive competitive advantage and explains how Amazon self-funded its growth for years despite thin margins.`,
    interviewTrap: `Candidates get confused about the sign convention in cash flow models. An INCREASE in working capital is a USE of cash (e.g. inventory builds up — you've spent cash to hold goods). A DECREASE in working capital is a SOURCE of cash. This is counterintuitive and trips up even experienced analysts. If a company's receivables grow, it hasn't collected cash yet — that's cash trapped in the business.`
  }
];

// ─── VOCABULARY DATA ──────────────────────────────────────────────────────────
const vocabWords = [
  {
    word: 'Perspicacious',
    pronunciation: '/ˌpɜːr.spɪˈkeɪ.ʃəs/',
    etymology: 'Latin perspicax (sharp-sighted), from perspicere — to see through clearly. Per (through) + specere (to look). The same root gives us "perspicuous" (clearly expressed) and "spectacle."',
    definition: 'Having a ready insight into and understanding of things; acutely perceptive and discerning, especially in practical matters or in reading situations and people.',
    examples: [
      'The perspicacious analyst identified the flaw in the company\'s unit economics six months before the market did, positioning the fund ahead of a significant correction.',
      'Her perspicacious observation during the client debrief — that the real problem was cultural, not structural — reframed the entire consulting engagement.',
      'A perspicacious reader of geopolitical risk, he had moved his emerging market exposure to defensive positions three weeks before the currency crisis materialised.'
    ],
    synonyms: ['astute', 'shrewd', 'discerning', 'perceptive', 'sagacious'],
    antonyms: ['obtuse', 'imperceptive', 'undiscerning'],
    usageNote: 'Use "perspicacious" when you want to emphasise the quality of perception and insight — particularly when someone reads a situation correctly that others missed. It is stronger than "perceptive" and carries a connotation of practical intelligence, not just intelligence. Avoid using it as a synonym for "intelligent" — it specifically describes the ability to see clearly through complexity. Overusing it in casual contexts will sound affected.'
  },
  {
    word: 'Equivocate',
    pronunciation: '/ɪˈkwɪv.ə.keɪt/',
    etymology: 'Medieval Latin aequivocatus, from aequivocus — of equal voice. Aequus (equal) + vox (voice). Originally meant to use words with two meanings; evolved to mean deliberately ambiguous speech.',
    definition: 'To use ambiguous or unclear language in order to avoid committing to a position or to conceal the truth; to speak or act in a deliberately evasive way.',
    examples: [
      'When pressed by the board on the project\'s viability, the managing director equivocated rather than deliver the difficult assessment the situation required.',
      'The central bank\'s statement was carefully constructed to equivocate on the timing of rate cuts, giving policymakers room to manoeuvre without triggering market volatility.',
      'In cross-examination, the auditor equivocated on key dates — a strategic error that the opposing counsel immediately exploited to undermine his credibility.'
    ],
    synonyms: ['prevaricate', 'hedge', 'waffle', 'obfuscate', 'dissemble'],
    antonyms: ['assert', 'affirm', 'declare', 'commit'],
    usageNote: 'Equivocate has a specifically negative connotation — it implies deliberate evasion, not honest uncertainty. "He was uncertain" is neutral; "he equivocated" implies he was hiding something or avoiding accountability. Use it as a precise critique, not a neutral description. In professional writing, it is powerful because it signals a character judgment, not just a behavioural observation.'
  },
  {
    word: 'Pellucid',
    pronunciation: '/pəˈluː.sɪd/',
    etymology: 'Latin pellucidus, from pellucere — to shine through. Per (through) + lucere (to shine). Related to "lucid," "elucidate," and "translucent." Originally described physical transparency; extended to mean clarity of expression.',
    definition: 'Translucently clear; (of writing, argument, or expression) easily understood; lucid and unambiguous in a way that leaves no room for misinterpretation.',
    examples: [
      'The McKinsey partner\'s opening slide was pellucid in its logic — three causes, three implications, one recommendation — and the client committee approved it within twenty minutes.',
      'Her memo on the regulatory risk was pellucid where her predecessor\'s had been opaque, which is precisely why the board finally understood the exposure they were carrying.',
      'A pellucid argumentative structure is the single most underrated skill in consulting — clients don\'t reward complexity, they reward clarity.'
    ],
    synonyms: ['lucid', 'limpid', 'crystalline', 'transparent', 'perspicuous'],
    antonyms: ['opaque', 'murky', 'obscure', 'convoluted'],
    usageNote: '"Pellucid" is rarer than "lucid" and carries a slightly more elevated register — it is the word you reach for when you want to praise exceptional clarity of thought or expression, not just adequate clarity. It works especially well in written contexts (pellucid prose, pellucid argument) rather than spoken ones. Do not use it to describe people — use it for ideas, arguments, or writing.'
  }
];

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
  diagnosis: `WeWork's collapse had one root cause wearing several masks: the conflation of growth with value creation. The company was expanding its losses as fast as its revenue — a structure that only works if you eventually reach profitability at scale, which WeWork's unit economics made mathematically implausible. A single WeWork location took 24–36 months to reach profitability. The company was opening locations faster than existing ones matured. SoftBank's capital enabled the delusion. Neumann's charisma sold it. And a bull market in private tech valuations meant nobody ran the basic arithmetic until the IPO forced transparency. The moment the S-1 made the numbers public, the story collapsed.`,
  lessons: [
    `Revenue growth without unit economics is not a business model — it is an accelerating liability. Before being impressed by any company's top-line growth, ask: does each new unit of revenue come with a clear path to positive contribution margin? WeWork's per-location economics were well understood internally. They were simply not discussed externally.`,
    `Governance structure is a leading indicator of risk, not a footnote. Neumann's 20-to-1 voting rights meant no board or investor could check his behaviour. When you evaluate any company — as an investor, employee, or analyst — read the governance section of the filing as carefully as the financial statements. Who can say no to the CEO? If the answer is nobody, the financial risk is compounded by a structural one.`,
    `The valuation of a business must be anchored in its actual economic model, not its aspirational narrative. "We are a tech company" is a claim that must be tested against the cost structure, not accepted because the founder says so. WeWork's gross margin, capex requirements, and lease obligations all screamed "real estate." Only its pitch deck screamed "tech." In investing and in due diligence, always let the numbers override the narrative.`
  ]
};

// ─── COLLAPSIBLE SECTION ─────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <h2 className="text-lg lg:text-xl font-medium text-gray-900 dark:text-white group-hover:text-[#0C3B6E] dark:group-hover:text-[#4A90E2] transition-colors">
          {title}
        </h2>
        {open ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium tracking-widest uppercase text-[#0C3B6E] dark:text-[#4A90E2] mb-1.5">
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
                Chapter {verse.chapter} · Verse {verse.verse}
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
  const c = psychologyConcept;
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
                <span className="text-[#0C3B6E] dark:text-[#4A90E2] shrink-0">→</span>
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
  return (
    <Section title="Finance Terms">
      <div className="grid md:grid-cols-2 gap-5">
        {financeTerms.map((term, i) => (
          <Card key={i}>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{term.term}</h3>
              <p className="text-xs font-mono text-[#0C3B6E] dark:text-[#4A90E2] mt-1">{term.domain}</p>
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
              <Label>Interview Trap ⚠️</Label>
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
  return (
    <Section title="Vocabulary Builder">
      <div className="grid md:grid-cols-3 gap-5">
        {vocabWords.map((word, i) => (
          <Card key={i}>
            <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{word.word}</h3>
              <p className="text-xs font-mono text-[#0C3B6E] dark:text-[#4A90E2] mt-1">{word.pronunciation}</p>
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
          <div className="w-16 h-22 bg-gradient-to-br from-[#0C3B6E] to-[#1a5ca8] rounded-lg flex items-center justify-center text-white text-xs text-center p-2 shrink-0 font-medium leading-tight" style={{height: '88px'}}>
            {b.title.split(' ').slice(0, 3).join(' ')}
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{b.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{b.author}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full bg-[#0C3B6E]/10 text-[#0C3B6E] dark:bg-[#4A90E2]/20 dark:text-[#4A90E2]">
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
        <div className="bg-gradient-to-r from-[#0C3B6E]/10 to-transparent dark:from-[#0C3B6E]/20 border border-[#0C3B6E]/20 rounded-lg p-4">
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
            <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">{c.founded} · {c.country} · {c.industry}</span>
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
            <div className="border-l-4 border-[#0C3B6E] dark:border-[#4A90E2] pl-4 bg-gray-50 dark:bg-gray-900/50 rounded-r-lg py-3 pr-3">
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

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">Learn</h1>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <GitaSection />
      <PsychologySection />
      <FinanceTermsSection />
      <VocabularySection />
      <BookSummarySection />
      <CaseStudySection />
    </div>
  );
}
