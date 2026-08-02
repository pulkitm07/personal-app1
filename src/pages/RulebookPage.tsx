import { BookOpen } from 'lucide-react';
import { Card } from '../components/UI/Card';

export function RulebookPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl lg:text-2xl font-medium text-gray-900 dark:text-white">
          Rulebook
        </h1>
      </div>

      <Card className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
          <BookOpen size={28} className="text-accent" />
        </div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Coming Soon
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Your personal rules and morals will appear here. This is your daily reminder to stay grounded and true to yourself.
        </p>
      </Card>
    </div>
  );
}
