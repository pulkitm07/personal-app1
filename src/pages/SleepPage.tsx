import { useState, useEffect } from 'react';
import { Card } from '../components/UI/Card';
import { storage, getTodayDate } from '../utils/storage';
import { Moon, Save, Calendar, BarChart2, Pencil, X, Check, Trash2 } from 'lucide-react';
import type { SleepEntry } from '../types';

export function SleepPage() {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [hours, setHours] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDate());
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHours, setEditHours] = useState<string>('');
  
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const loaded = storage.getSleepEntries();
    setEntries(loaded);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hours || isNaN(Number(hours))) return;

    const numHours = parseFloat(Number(hours).toFixed(1));
    const newEntries = [...entries];
    
    newEntries.push({ id: Date.now().toString(), date, hours: numHours });

    // Sort entries descending by date
    newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    storage.setSleepEntries(newEntries);
    setEntries(newEntries);
    setHours('');
  };

  const getAverage = (days: number) => {
    const todayStr = getTodayDate();
    const todayMs = new Date(todayStr).getTime();
    
    const recentEntries = entries.filter(entry => {
      const entryMs = new Date(entry.date).getTime();
      const diffDays = (todayMs - entryMs) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < days;
    });

    if (recentEntries.length === 0) return 0;
    
    const sum = recentEntries.reduce((acc, curr) => acc + curr.hours, 0);
    return (sum / recentEntries.length).toFixed(1);
  };

  const getTodayHours = () => {
    const today = getTodayDate();
    const sum = entries.filter(e => e.date === today).reduce((acc, curr) => acc + curr.hours, 0);
    return parseFloat(sum.toFixed(1));
  };

  const startEdit = (entry: SleepEntry) => {
    setEditingId(entry.id || entry.date);
    setEditHours(entry.hours.toString());
  };

  const saveEdit = () => {
    if (!editingId || !editHours || isNaN(Number(editHours))) return;
    const numHours = parseFloat(Number(editHours).toFixed(1));
    
    const newEntries = entries.map(e => 
      (e.id || e.date) === editingId ? { ...e, hours: numHours } : e
    );
    
    storage.setSleepEntries(newEntries);
    setEntries(newEntries);
    setEditingId(null);
  };

  const deleteEntry = (idToDelete: string) => {
    const newEntries = entries.filter(e => (e.id || e.date) !== idToDelete);
    storage.setSleepEntries(newEntries);
    setEntries(newEntries);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-accent/10 dark:bg-accent/20 rounded-xl">
          <Moon className="w-6 h-6 text-accent dark:text-accent" />
        </div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Sleep Tracker</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-accent/5 dark:bg-accent/5 border-none">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="w-5 h-5 text-accent dark:text-accent" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Today</h3>
          </div>
          <div className="text-3xl font-semibold text-gray-900 dark:text-white">
            {getTodayHours()} <span className="text-lg text-gray-500 font-normal">hrs</span>
          </div>
        </Card>

        <Card className="bg-[#D97706]/5 dark:bg-[#F59E0B]/5 border-none">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-[#D97706] dark:text-[#F59E0B]" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">7-Day Avg</h3>
          </div>
          <div className="text-3xl font-semibold text-gray-900 dark:text-white">
            {getAverage(7)} <span className="text-lg text-gray-500 font-normal">hrs</span>
          </div>
        </Card>

        <Card className="bg-emerald-500/5 dark:bg-emerald-500/5 border-none">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">30-Day Avg</h3>
          </div>
          <div className="text-3xl font-semibold text-gray-900 dark:text-white">
            {getAverage(30)} <span className="text-lg text-gray-500 font-normal">hrs</span>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Log Sleep</h2>
        <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              max={getTodayDate()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours of Sleep</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="24"
              required
              placeholder="e.g. 7.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-accent dark:bg-accent flex items-center justify-center gap-2 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Save size={18} />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent History</h2>
        {entries.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No sleep records found. Start logging your sleep!</p>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 7).map(entry => (
              <div key={entry.id || entry.date} className="group flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span className="font-medium text-gray-700 dark:text-gray-300 w-28">
                  {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                
                {editingId === (entry.id || entry.date) ? (
                  <div className="flex flex-1 items-center justify-end gap-2 pr-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="24"
                      value={editHours}
                      onChange={(e) => setEditHours(e.target.value)}
                      className="w-20 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:border-accent dark:focus:border-accent"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-red-500 p-1">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-end gap-3">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className={`h-full rounded-full ${entry.hours >= 7 ? 'bg-emerald-500' : entry.hours >= 5 ? 'bg-[#D97706]' : 'bg-red-500'}`}
                        style={{ width: `${Math.min((entry.hours / 12) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white w-12 text-right">{entry.hours}h</span>
                    
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all ml-2">
                      <button onClick={() => startEdit(entry)} className="text-gray-400 hover:text-accent dark:hover:text-accent transition-colors p-1">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteEntry(entry.id || entry.date)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

