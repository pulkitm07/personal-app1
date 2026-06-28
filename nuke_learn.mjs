import fs from 'fs';

const lines = fs.readFileSync('src/pages/LearnPage.tsx', 'utf-8').split('\n');

const financeReplacement = `// ─── FINANCE TERMS SECTION ────────────────────────────────────────────────────
function FinanceTermsSection() {
  const [selectedTerms, setSelectedTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyFinanceTerm().then(data => {
      setSelectedTerms(data||[]);
      setLoading(false);
    });
  }, []);

  if (loading || selectedTerms.length === 0) {
    return (
      <Section title="Finance Terms">
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400 animate-pulse">
              OpenAI is curating financial concepts...
            </p>
          </div>
        </div>
      </Section>
    );
  }

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

            {term.formula && term.formula !== "N/A" && (
              <div className="mb-4">
                <Label>Formula</Label>
                <div className="bg-gray-900 dark:bg-black rounded-lg p-3 font-mono text-xs text-green-400 leading-relaxed whitespace-pre-wrap">
                  {term.formula}
                </div>
              </div>
            )}

            <Field label="Real Example">{term.example}</Field>

            <div>
              <Label>Interview Trap ⚠️ </Label>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">{term.interviewTrap}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}`;

const vocabReplacement = `// ─── VOCABULARY SECTION ───────────────────────────────────────────────────────
function VocabularySection() {
  const [selectedWords, setSelectedWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyVocabulary().then(data => {
      setSelectedWords(data||[]);
      setLoading(false);
    });
  }, []);

  if (loading || selectedWords.length === 0) {
    return (
      <Section title="Vocabulary Builder">
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">
              OpenAI is building your vocabulary...
            </p>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Vocabulary Builder">
      <div className="grid md:grid-cols-3 gap-5">
        {selectedWords.map((word, i) => (
          <Card key={i}>
            <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">{word.word}</h3>
              <p className="text-xs font-mono text-accent dark:text-accent mt-1">{word.pronunciation}</p>
            </div>

            {word.etymology && <Field label="Etymology">{word.etymology}</Field>}
            <Field label="Definition">{word.definition}</Field>

            <div className="mb-4">
              <Label>Professional Examples</Label>
              <div className="space-y-2">
                {word.examples?.map((ex: string, j: number) => (
                  <p key={j} className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed pl-3 border-l-2 border-gray-200 dark:border-gray-700">
                    {ex}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <Label>Synonyms</Label>
                <p className="text-gray-600 dark:text-gray-400">{word.synonyms?.join(', ')}</p>
              </div>
              <div>
                <Label>Antonyms</Label>
                <p className="text-gray-600 dark:text-gray-400">{word.antonyms?.join(', ')}</p>
              </div>
            </div>

            {word.usageNote && <Field label="Usage Note">{word.usageNote}</Field>}
          </Card>
        ))}
      </div>
    </Section>
  );
}`;

const lawReplacement = `// ─── LAWS SECTION ─────────────────────────────────────────────────────────────
const categoryConfig: Record<string, any> = {
  corporate: { label: 'Corporate Law', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-l-green-500' },
  constitutional: { label: 'Constitutional Law', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-l-blue-500' },
  criminal: { label: 'Criminal Law', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-l-red-500' },
  landmark: { label: 'Landmark Case', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-l-amber-500' }
};

function LawsSection() {
  const [law, setLaw] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyLaw().then(data => {
      setLaw(data);
      setLoading(false);
    });
  }, []);

  if (loading || !law) {
    return (
      <Section title="Law of the Day">
        <div className="flex justify-center items-center py-20 min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
              OpenAI is retrieving legal principles...
            </p>
          </div>
        </div>
      </Section>
    );
  }

  const config = categoryConfig[law.category] || categoryConfig.corporate;

  return (
    <Section title="Law of the Day">
      <Card className={\`border-l-4 \${config.border} !p-0 overflow-hidden\`}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-[#1a1a1a]">
          <span className={\`inline-block text-xs px-3 py-1 rounded font-medium mb-4 \${config.bg} \${config.text}\`}>
            {config.label}
          </span>
          <h3 className="text-2xl font-medium text-gray-900 dark:text-white leading-snug mb-2">{law.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500 font-mono leading-relaxed">{law.reference}</p>
        </div>
        <div className="p-6 space-y-6">
          <div><Label>What Is This?</Label><p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{law.whatIsThis}</p></div>
          <div><Label>Why Does This Exist?</Label><p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{law.whyExists}</p></div>
          <div>
            <Label>Real Example</Label>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{law.example}</p>
            </div>
          </div>
          <div><Label>What This Means for You</Label><p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{law.meansForYou}</p></div>
          <div className="bg-gradient-to-r from-accent/5 to-transparent dark:from-accent/10 border-l-2 border-accent dark:border-accent pl-4 py-3 pr-3 rounded-r-lg">
            <p className="text-xs font-mono text-accent dark:text-accent mb-2 uppercase tracking-wider">One Line Summary</p>
            <p className="text-base text-gray-900 dark:text-white font-medium leading-relaxed italic">"{law.oneLine}"</p>
          </div>
        </div>
      </Card>
    </Section>
  );
}`;

const preFinance = lines.slice(0, 211).join('\n');
const postVocabPreLaw = lines.slice(314, 480).join('\n');
const postLaw = lines.slice(538).join('\n');

const newContent = [
  preFinance,
  financeReplacement,
  vocabReplacement,
  postVocabPreLaw,
  lawReplacement,
  postLaw
].join('\n');

fs.writeFileSync('src/pages/LearnPage.tsx', newContent);
