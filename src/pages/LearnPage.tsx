import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import gitaData from '../data/gita.json';
import psychologyData from '../data/psychology.json';
import financeData from '../data/finance-terms.json';
import vocabularyData from '../data/vocabulary.json';
import lawsData from '../data/laws.json';
import { fetchDailyGitaVerses, fetchDailyPsychologyConcepts, fetchDailyBookSummary, fetchDailyCaseStudy } from '../services/aiService';

// ─── GITA DATA ────────────────────────────────────────────────────────────────
const gitaVerses = gitaData as any[];

// ─── PSYCHOLOGY DATA ──────────────────────────────────────────────────────────
const psychologyList = psychologyData as any[];

// ─── FINANCE TERMS DATA ───────────────────────────────────────────────────────
const financeTermsList = financeData as any[];

// ─── VOCABULARY DATA ──────────────────────────────────────────────────────────
const vocabWordsList = vocabularyData as any[];

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
  const [selectedVerses, setSelectedVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyGitaVerses().then(data => {
      setSelectedVerses(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Section title="Bhagavad Gita — Today's Verses">
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400 animate-pulse">
              OpenAI is curating today's verses...
            </p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Bhagavad Gita — Today's Verses">
      <div className="space-y-6">
        {selectedVerses.map((verse, i) => (
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
  const [selectedConcepts, setSelectedConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyPsychologyConcepts().then(data => {
      setSelectedConcepts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Section title="Psychology Concepts">
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 animate-pulse">
              OpenAI is generating today's psychological principles...
            </p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Psychology Concepts">
      <div className="space-y-6">
        {selectedConcepts.map((c, idx) => (
          <Card key={idx}>
            <div className="mb-5">
              <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded mb-3 ${c.category === 'business' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                {c.category === 'business' ? 'Business Application' : 'General Psychology'}
              </span>
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
                {c.related.map((r: string, i: number) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-accent dark:text-accent shrink-0">→</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ─── FINANCE TERMS SECTION ────────────────────────────────────────────────────
function FinanceTermsSection() {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const startIndex = (dayOfYear * 3) % financeTermsList.length;
  const selectedTerms = [
    financeTermsList[startIndex],
    financeTermsList[(startIndex + 1) % financeTermsList.length],
    financeTermsList[(startIndex + 2) % financeTermsList.length],
  ];

  return (
    <Section title="Finance Terms">
      <div className="grid md:grid-cols-3 gap-5">
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
  const [b, setB] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyBookSummary().then(data => {
      setB(data);
      setLoading(false);
    });
  }, []);

  if (loading || !b) {
    return (
      <Section title="Book Summary">
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-pulse">
              OpenAI is generating today's masterclass summary...
            </p>
          </div>
        </div>
      </Section>
    );
  }

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
            {b.highlights.map((h: string, i: number) => (
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
  const [c, setC] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyCaseStudy().then(data => {
      setC(data);
      setLoading(false);
    });
  }, []);

  if (loading || !c) {
    return (
      <Section title="Company Case Study">
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 animate-pulse">
              OpenAI is generating today's real-world business case...
            </p>
          </div>
        </div>
      </Section>
    );
  }

  const typeConfig: Record<string, { label: string, bg: string }> = {
    rise: { label: 'The Rise', bg: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    fall: { label: 'The Fall', bg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
    comeback: { label: 'The Comeback', bg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' }
  };
  
  const currentConfig = typeConfig[c.type as string] || typeConfig.rise;

  return (
    <Section title="Company Case Study">
      <Card className="!p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-[#1a1a1a]">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs px-2 py-1 rounded font-medium ${currentConfig.bg}`}>{currentConfig.label}</span>
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
              {c.story.split('\n\n').map((para: string, i: number) => (
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
              {c.lessons.map((lesson: string, i: number) => (
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
  const [activeTab, setActiveTab] = useState('finance');

  const tabs = [
    { id: 'finance', label: 'Finance' },
    { id: 'vocab', label: 'Vocabulary' },
    { id: 'gita', label: 'Bhagavad Gita' },
    { id: 'psychology', label: 'Psychology' },
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

