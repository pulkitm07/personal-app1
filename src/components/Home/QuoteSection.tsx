import { Card } from '../UI/Card';
import type { Quote } from '../../types';

interface QuoteSectionProps {
  quote: Quote;
}

export function QuoteSection({ quote }: QuoteSectionProps) {
  return (
    <Card className="mb-6">
      <blockquote className="space-y-3">
        <p className="text-lg md:text-xl lg:text-[22px] leading-relaxed text-gray-900 dark:text-gray-100">
          "{quote.text}"
        </p>
        <footer className="flex flex-col gap-1">
          <cite className="font-medium not-italic text-gray-900 dark:text-white">
            {quote.author}
          </cite>
          <p className="text-sm text-gray-600 dark:text-gray-400">{quote.bio}</p>
        </footer>
      </blockquote>
    </Card>
  );
}

