import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      <div className="md:ml-12 lg:ml-56 pb-16 md:pb-0">
        <header className="md:hidden sticky top-0 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-40">
          <h1 className="text-lg font-medium">Daily</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>

      <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
}
