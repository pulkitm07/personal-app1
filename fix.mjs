import fs from 'fs';

let content = fs.readFileSync('src/pages/LearnPage.tsx', 'utf-8');

// The replacement blocks:

const financeReplacement = `// ─── FINANCE TERMS SECTION ────────────────────────────────────────────────────
function FinanceTermsSection() {
  const [selectedTerms, setSelectedTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyFinanceTerm().then(data => {
      setSelectedTerms(data);
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
      setSelectedWords(data);
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

content = content.replace(/ \/\/ ─── FINANCE TERMS SECTION[\s\S]*?\/\/ ─── VOCABULARY SECTION/m, "\\n" + financeReplacement + "\\n\\n// ─── VOCABULARY SECTION");
content = content.replace(/ \/\/ ─── VOCABULARY SECTION[\s\S]*?\/\/ ─── BOOK SUMMARY SECTION/m, "\\n" + vocabReplacement + "\\n\\n// ─── BOOK SUMMARY SECTION");

content = content.replace(/selectedTermsData\.map/g, "selectedTerms.map");
content = content.replace(/selectedWordsData\.map/g, "selectedWords.map");

// Save 
fs.writeFileSync('src/pages/LearnPage.tsx', content);
