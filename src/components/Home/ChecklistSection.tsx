import { useState } from 'react';
import { Check, Plus, X, GripVertical } from 'lucide-react';
import { Card } from '../UI/Card';
import type { ChecklistTask } from '../../types';

interface ChecklistSectionProps {
  tasks: ChecklistTask[];
  onUpdateTasks: (tasks: ChecklistTask[]) => void;
}

const defaultContentTasks = [
  'Read motivational quote',
  'Read geopolitical news',
  'Read finance & consulting news',
  'Check market & crypto prices',
  'Study 3 Gita verses',
  'Learn psychology concept',
  'Learn 2 finance terms',
  'Learn 3 vocabulary words',
  'Read book summary',
  "Learn today's 4 laws",
  'Read company case study',
];

const defaultHabitsTasks = [
  'DSA question(s)',
  'Watch YouTube video (learning)',
  'College studies',
  'Other studies / reading',
  'Track sleep time',
  'Typing practice',
  'AI & research work',
];

export function ChecklistSection({ tasks, onUpdateTasks }: ChecklistSectionProps) {
  const [newTaskText, setNewTaskText] = useState('');

  const contentTasks = tasks.filter((t) => t.column === 'content');
  const habitsTasks = tasks.filter((t) => t.column === 'habits');

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleTask = (taskId: string) => {
    onUpdateTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (taskId: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== taskId));
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;

    const newTask: ChecklistTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      column: 'habits',
      isDefault: false,
      position: habitsTasks.length,
      completed: false,
    };

    onUpdateTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  const TaskItem = ({ task }: { task: ChecklistTask }) => (
    <div className="group flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
      <button
        onClick={() => toggleTask(task.id)}
        className="shrink-0 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center transition-all hover:border-[#0C3B6E] dark:hover:border-[#4A90E2]"
        style={{
          backgroundColor: task.completed ? 'currentColor' : 'transparent',
          borderColor: task.completed ? 'currentColor' : undefined,
        }}
      >
        {task.completed && <Check size={14} className="text-white" />}
      </button>

      <span
        className={`flex-1 text-[15px] ${
          task.completed
            ? 'line-through text-gray-400 dark:text-gray-600'
            : 'text-gray-900 dark:text-gray-100'
        }`}
      >
        {task.text}
      </span>

      {!task.isDefault && (
        <button
          onClick={() => deleteTask(task.id)}
          className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );

  return (
    <Card className="mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-medium text-gray-900 dark:text-white">
            Daily Progress
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0C3B6E] dark:bg-[#4A90E2] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
            CONTENT
          </h3>
          <div className="space-y-1">
            {contentTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
            HABITS
          </h3>
          <div className="space-y-1 mb-4">
            {habitsTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 text-[15px] bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C3B6E] dark:focus:ring-[#4A90E2]"
            />
            <button
              onClick={addTask}
              className="shrink-0 p-2 bg-[#0C3B6E] dark:bg-[#4A90E2] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function initializeDefaultTasks(): ChecklistTask[] {
  const tasks: ChecklistTask[] = [];

  defaultContentTasks.forEach((text, index) => {
    tasks.push({
      id: `content-${index}`,
      text,
      column: 'content',
      isDefault: true,
      position: index,
      completed: false,
    });
  });

  defaultHabitsTasks.forEach((text, index) => {
    tasks.push({
      id: `habits-${index}`,
      text,
      column: 'habits',
      isDefault: true,
      position: index,
      completed: false,
    });
  });

  return tasks;
}
