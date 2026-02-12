import { useState, type FormEvent } from 'react';
import { useStore, type Priority } from '../lib/store';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

export const TaskList = () => {
  const { tasks, toggleTask, deleteTask, addTask } = useStore();
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle,
      priority,
      dueDate: new Date().toISOString(),
    });
    setNewTitle('');
  };

  const priorityColors = {
    low: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    medium: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    high: 'text-red-500 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                priority === p ? priorityColors[p] : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
              )}
            >
              {p === 'low' ? 'Baixa' : p === 'medium' ? 'Média' : 'Alta'}
            </button>
          ))}
          <button
            type="submit"
            className="ml-auto px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
          >
            Adicionar
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "transition-colors",
                  task.completed ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-600 hover:text-indigo-500"
                )}
              >
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              <div>
                <p className={cn(
                  "font-medium transition-all",
                  task.completed ? "line-through text-zinc-400" : "text-zinc-900 dark:text-white"
                )}>
                  {task.title}
                </p>
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-wider",
                  task.priority === 'high' ? "text-red-500" : task.priority === 'medium' ? "text-yellow-600" : "text-blue-500"
                )}>
                  {task.priority}
                </span>
              </div>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <p>Nenhuma tarefa pendente. Aproveita!</p>
          </div>
        )}
      </div>
    </div>
  );
};
