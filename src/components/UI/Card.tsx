import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-4 lg:p-5 transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <Card>
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
      </div>
    </Card>
  );
}
