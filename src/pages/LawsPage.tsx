import { Card } from '../components/UI/Card';

export function LawsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl lg:text-2xl font-medium mb-6 text-gray-900 dark:text-white">
        Law of the Day
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="space-y-3">
            <span className="inline-block text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              Corporate Law
            </span>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              Corporate & Business Law
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Learn one corporate law daily covering Companies Act, SEBI regulations, Contract Act, and more.
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <span className="inline-block text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
              Constitutional Law
            </span>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              Constitutional Law
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Understand your Fundamental Rights, Directive Principles, and constitutional provisions.
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <span className="inline-block text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
              Criminal Law
            </span>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              Criminal Law
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Learn criminal laws covering BNS, BNSS, IT Act, and other important legislation.
            </p>
          </div>
        </Card>

        <Card>
          <div className="space-y-3">
            <span className="inline-block text-xs px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              Landmark Cases
            </span>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              Landmark Case Law
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Study landmark Supreme Court and High Court judgments that shaped Indian law.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
