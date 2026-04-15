import { Home, Newspaper, BookOpen, Settings, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', icon: Home },
  { id: 'news', icon: Newspaper },
  { id: 'learn', icon: BookOpen },
  { id: 'sleep', icon: Moon },
  { id: 'settings', icon: Settings },
];

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { settings } = useTheme();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 py-3 flex items-center justify-center transition-colors ${
                isActive
                  ? settings.accentColor === 'navy'
                    ? 'text-accent dark:text-accent'
                    : 'text-[#D97706] dark:text-[#F59E0B]'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

