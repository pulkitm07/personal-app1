import { Card } from '../components/UI/Card';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';

export function SettingsPage() {
  const { settings, updateSettings } = useTheme();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl lg:text-2xl font-medium mb-6 text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="space-y-6">
        <Card>
          <h2 className="text-base font-medium mb-4 text-gray-900 dark:text-white">
            Appearance
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateSettings({ theme: value as any })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      settings.theme === value
                        ? 'border-[#0C3B6E] dark:border-[#4A90E2] bg-[#0C3B6E]/5 dark:bg-[#4A90E2]/10'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Accent Color
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'navy', label: 'Deep Navy', color: '#0C3B6E' },
                  { value: 'amber', label: 'Warm Amber', color: '#D97706' },
                ].map(({ value, label, color }) => (
                  <button
                    key={value}
                    onClick={() => updateSettings({ accentColor: value as any })}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      settings.accentColor === value
                        ? 'border-gray-900 dark:border-gray-100'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-medium mb-4 text-gray-900 dark:text-white">
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Morning Notification
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Daily reminder at 6:00 AM IST
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({
                    morningNotification: !settings.morningNotification,
                  })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.morningNotification
                    ? 'bg-[#0C3B6E] dark:bg-[#4A90E2]'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.morningNotification ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Evening Reminder
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Optional evening check-in
                </p>
              </div>
              <button
                onClick={() =>
                  updateSettings({
                    eveningNotification: !settings.eveningNotification,
                  })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.eveningNotification
                    ? 'bg-[#0C3B6E] dark:bg-[#4A90E2]'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.eveningNotification ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-medium mb-2 text-gray-900 dark:text-white">
            About
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Daily v1.0.0
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Your personal daily dashboard for self-improvement
          </p>
        </Card>
      </div>
    </div>
  );
}
