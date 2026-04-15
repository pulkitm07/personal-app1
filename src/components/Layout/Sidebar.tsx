import { Home, Newspaper, BookOpen, Settings, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { settings } = useTheme();

  return (
    <aside className="hidden md:flex md:flex-col bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-800 md:w-12 lg:w-56 fixed left-0 top-0 h-screen transition-all duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 lg:block hidden">
        <h1 className="text-xl font-medium">Daily</h1>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? settings.accentColor === 'navy'
                    ? 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent'
                    : 'bg-[#D97706]/10 text-[#D97706] dark:bg-[#D97706]/20 dark:text-[#F59E0B]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden lg:block text-[15px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 hidden lg:block">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </aside>
  );
}

