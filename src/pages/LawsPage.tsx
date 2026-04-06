import { Card } from '../components/UI/Card';

const laws = [
  {
    category: 'corporate' as const,
    plainTitle: 'A Contract is Only Valid if Both Sides Actually Agreed to Something Real',
    legalName: 'Section 10, Indian Contract Act 1872 — Essentials of a Valid Contract',
    whatIsThis: `A contract in India is only legally enforceable if it meets specific conditions: both parties must have freely consented (no coercion, fraud, or misrepresentation), both must be legally capable of contracting (adults of sound mind), the purpose must be lawful, and there must be consideration — meaning both sides must give something of value. If any of these conditions is missing, the contract is either void (never existed legally) or voidable (can be cancelled by the affected party). You cannot enforce a contract made under threat, made with a minor, or made for an illegal purpose.`,
    whyExists: `Without this framework, the stronger party in any transaction could impose terms on the weaker party and then demand legal enforcement. The essentials create a minimum standard of fairness — courts will only protect agreements that reflect genuine, voluntary mutual commitment. Before 1872, contract disputes in British India were handled inconsistently; this Act created a unified, predictable framework that made commerce possible at scale.`,
    example: `In 2017, a Mumbai startup signed a vendor agreement with a freelancer but failed to include a specific deliverable or timeline — just a vague "digital services" description. When the relationship broke down, the startup tried to sue for breach. The court ruled the contract unenforceable because there was no certain object — one of the essential elements. The startup recovered nothing. Real case principle: Balfour v. Balfour (adapted for India) — agreements that lack certainty of terms cannot be enforced.`,
    meansForYou: `Every time you sign an employment offer, a freelance agreement, or a startup founder agreement — the Indian Contract Act governs it. Check that you are not signing under pressure, that the terms are specific (not vague), and that what you're being asked to do is lawful. Verbal contracts are also valid in India for most transactions — but nearly impossible to prove. Get it in writing.`,
    oneLine: 'A valid contract needs free consent, capable parties, lawful purpose, and real consideration — if any element is missing, courts won\'t enforce it.'
  },
  {
    category: 'constitutional' as const,
    plainTitle: 'The Government Cannot Take Your Life or Freedom Without Following a Fair Process',
    legalName: 'Article 21, Constitution of India — Protection of Life and Personal Liberty',
    whatIsThis: `Article 21 states: "No person shall be deprived of his life or personal liberty except according to procedure established by law." In its original 1950 reading, this meant the government only needed a law — any law — to justify depriving you of liberty. But in the landmark Maneka Gandhi case (1978), the Supreme Court dramatically expanded it: the procedure must also be fair, just, and reasonable. Since then, courts have stretched Article 21 to cover an extraordinary range of rights — privacy, dignity, livelihood, health, education, a clean environment, speedy trial, and more.`,
    whyExists: `This article exists as the fundamental guarantee against arbitrary state power. Without it, the government could imprison, execute, or harm citizens without any legal process at all. It is the constitutional foundation of personal freedom in India — and the Supreme Court has used it to fill in rights that the framers of the Constitution did not explicitly enumerate. It is not an exaggeration to say that Article 21 is the most litigated and most expansive article in the Indian Constitution.`,
    example: `In Justice K.S. Puttaswamy v. Union of India (2017) — the Right to Privacy case — a nine-judge bench of the Supreme Court unanimously ruled that privacy is a fundamental right under Article 21. This judgment directly challenged Aadhaar's mandatory linking and shaped India's entire data protection framework. The case was brought by a retired judge in his 90s who argued that the government's biometric data collection violated his dignity and autonomy. The Supreme Court agreed.`,
    meansForYou: `Article 21 protects you directly. If you are arrested, you cannot be held indefinitely without being produced before a magistrate (within 24 hours). If your employer fires you from a government job without a hearing, that may violate Article 21. Your right to privacy online — including from your employer or the state — is anchored here. And if a hospital denies you emergency treatment, courts have held that this too violates Article 21.`,
    oneLine: 'Article 21 guarantees that the state cannot touch your life or freedom without a process that is not just legal, but also fair — and courts have used it to build almost every right Indians have that isn\'t explicitly written elsewhere.'
  },
  {
    category: 'criminal' as const,
    plainTitle: 'Cheating Someone Financially is a Criminal Offence, Not Just a Civil Dispute',
    legalName: 'Section 318, Bharatiya Nyaya Sanhita (BNS) 2023 — Cheating [Replaced Section 420, IPC]',
    whatIsThis: `Section 318 of the BNS (the new criminal code that replaced the Indian Penal Code in 2024) defines cheating as: deceiving someone, and by that deception, dishonestly inducing them to deliver property, or to do or omit something they would not otherwise do — causing damage to body, mind, reputation, or property. The key elements are deception + dishonest inducement + actual harm. Section 318(4) specifically covers cheating that involves delivering property or valuable securities — the equivalent of the old Section 420 IPC that made "420" synonymous with fraud in Indian culture.`,
    whyExists: `Without criminalising cheating, all financial fraud would be a civil matter — meaning the victim could only sue for money, a process that is slow, expensive, and often futile when the fraudster has already moved the money. Making cheating a criminal offence allows police to investigate, arrest, and prosecute fraudsters regardless of whether the victim can afford a civil lawyer. It is the state's tool against financial predators.`,
    example: `In the Saradha chit fund scam (West Bengal, 2013), promoters collected approximately ₹2,500 crore from 1.7 million investors — mostly low-income people — promising unrealistic returns. The funds were never invested; they were used to pay earlier investors in a Ponzi structure. When the scheme collapsed, promoters were charged under Section 420 IPC (now 318 BNS), along with money laundering charges under PMLA. Multiple arrests followed, though recovery for investors remained limited.`,
    meansForYou: `If someone defrauds you — a vendor who takes payment and disappears, a partner who misrepresents financials, an employer who never intended to pay your salary — you have a criminal remedy, not just a civil one. File an FIR citing Section 318 BNS. This is important: many lawyers will push you toward civil court (which benefits them in fees); criminal complaints are faster to file and create real pressure on the accused. Also understand: if you mislead investors as a founder about your company's status, this section could apply to you.`,
    oneLine: 'Cheating someone financially — through deliberate deception that causes them to hand over money or property — is a criminal offence in India that can result in imprisonment up to seven years, not just a civil lawsuit.'
  },
  {
    category: 'landmark' as const,
    plainTitle: 'The Case That Gave Every Indian the Right to Know What the Government is Doing',
    legalName: 'Union of India v. Association for Democratic Reforms (2002) — and the Right to Information',
    whatIsThis: `This Supreme Court case established that voters have a constitutional right to know the criminal background, financial assets, and educational qualifications of candidates contesting elections. The Election Commission was directed to require candidates to disclose this information as a mandatory affidavit. The legal foundation was Articles 19(1)(a) (freedom of speech and expression, which the Court read to include the right to receive information) and Article 21 (the right to a dignified life, which requires an informed electorate). This case directly preceded and enabled the Right to Information Act (RTI) of 2005.`,
    whyExists: `Before this judgment, Indian voters had almost no verified information about who they were voting for. Candidates with serious criminal cases could contest without disclosure. Wealthy politicians could hide their assets. The Court recognised that a democracy in which voters cannot make informed choices is not a functioning democracy — transparency in public life is a constitutional requirement, not an administrative courtesy.`,
    example: `The immediate aftermath was dramatic. In the 2004 general elections — the first after this judgment — candidates were required to file affidavits for the first time. Analysis of those affidavits by organisations like the Association for Democratic Reforms revealed that 128 MPs in the newly elected Lok Sabha had declared criminal cases against themselves. This data, which had never been systematically available before, became a permanent feature of Indian electoral journalism and civil society monitoring.`,
    meansForYou: `This case established the principle that public power requires public accountability — a principle that now extends well beyond elections. The RTI Act that followed gives you the right to request documents, decisions, and expenditure records from any government body. As a professional, this is a tool: journalists use it to break stories, lawyers use it to gather evidence, activists use it to expose corruption, and ordinary citizens use it to understand why a government decision affected them. File RTI applications freely — it is your constitutional right, costs ₹10, and government bodies must respond within 30 days.`,
    oneLine: 'This 2002 Supreme Court case established that Indian citizens have a constitutional right to information about those who exercise public power — a right that became the foundation of the RTI Act and permanently changed the transparency landscape of Indian democracy.'
  }
];

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
          {law.plainTitle}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-500 font-mono leading-relaxed">
          {law.legalName}
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
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">Law of the Day</h1>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Four laws today — one from each domain. Written for someone with zero legal background.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {laws.map((law, i) => (
          <LawCard key={i} law={law} />
        ))}
      </div>
    </div>
  );
}
