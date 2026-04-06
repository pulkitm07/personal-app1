import { Card } from '../components/UI/Card';

export function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl lg:text-2xl font-medium mb-6 text-gray-900 dark:text-white">
        Learn
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-base font-medium mb-3 text-gray-900 dark:text-white">
            Bhagavad Gita Verses
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Daily verses with context, philosophy, and practical application. Content will be loaded here.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-medium mb-3 text-gray-900 dark:text-white">
            Psychology Concept
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Learn one psychological concept daily with research backing and professional applications.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-medium mb-3 text-gray-900 dark:text-white">
            Finance Terms
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Master 2 finance terms daily with definitions, examples, and interview insights.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-medium mb-3 text-gray-900 dark:text-white">
            Vocabulary Builder
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Expand your professional vocabulary with 3 C1-C2 level words daily.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-medium mb-3 text-gray-900 dark:text-white">
            Book Summary
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            One book summary daily from finance, consulting, psychology, and entrepreneurship.
          </p>
        </Card>

        <Card>
          <h2 className="text-base font-medium mb-3 text-gray-900 dark:text-white">
            Company Case Study
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Analyze real company stories - successes, failures, and comebacks.
          </p>
        </Card>
      </div>
    </div>
  );
}
