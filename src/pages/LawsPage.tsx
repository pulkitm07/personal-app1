import { Card } from '../components/UI/Card';
import lawsData from '../data/laws.json';

const laws = lawsData as any[];

const categoryConfig = {
  corporate: { label: 'Corporate Law', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-l-green-500' },
  constitutional: { label: 'Constitutional Law', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-l-blue-500' },
  criminal: { label: 'Criminal Law', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-l-red-500' },
  landmark: { label: 'Landmark Case', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-l-amber-500' }
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium tracking-widest uppercase text-[#0C3B6E] dark:text-[#4A90E2] mb-1.5">
      {children}
    </p>
  );
}

function LawCard({ law }: { law: typeof laws[0] }) {
  const config = categoryConfig[law.category];
  return (
    <Card className={`border-l-4 ${config.border} !p-0 overflow-hidden`}>
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <span className={`inline-block text-xs px-2 py-1 rounded font-medium mb-3 ${config.bg} ${config.text}`}>
          {config.label}
        </span>
        <h3 className="text-base font-medium text-gray-900 dark:text-white leading-snug mb-1.5">
          {law.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono leading-relaxed">
          {law.reference}
        </p>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <Label>What Is This?</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{law.whatIsThis}</p>
        </div>

        <div>
          <Label>Why Does This Exist?</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{law.whyExists}</p>
        </div>

        <div>
          <Label>Real Example</Label>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{law.example}</p>
          </div>
        </div>

        <div>
          <Label>What This Means for You</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{law.meansForYou}</p>
        </div>

        {/* One line summary */}
        <div className="bg-gradient-to-r from-[#0C3B6E]/5 to-transparent dark:from-[#0C3B6E]/10 border-l-2 border-[#0C3B6E] dark:border-[#4A90E2] pl-3 py-2 pr-2 rounded-r-lg">
          <p className="text-xs font-mono text-[#0C3B6E] dark:text-[#4A90E2] mb-1 uppercase tracking-wider">One Line Summary</p>
          <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed italic">
            "{law.oneLine}"
          </p>
        </div>
      </div>
    </Card>
  );
}

export function LawsPage() {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Select one law from each category for today
  const categories = ['constitutional', 'corporate', 'criminal', 'landmark'] as const;
  const lawsByCategory = categories.map((cat) => {
    const categoryLaws = laws.filter((l: any) => l.category === cat);
    const index = dayOfYear % categoryLaws.length;
    return categoryLaws[index];
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">Law of the Day</h1>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Four laws today — one from each domain. Written for someone with zero legal background.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {lawsByCategory.map((law: any, i: number) => (
          <LawCard key={i} law={law} />
        ))}
      </div>
    </div>
  );
}
