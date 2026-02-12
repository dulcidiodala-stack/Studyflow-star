import { useState, type FormEvent } from 'react';
import { useStore } from '../lib/store';
import { Target, Plus, Trash2 } from 'lucide-react';

export const Goals = () => {
  const { goals, addGoal, updateGoalProgress, deleteGoal } = useStore();
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(10);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({ title, target, current: 0 });
    setTitle('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/20">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nova meta (ex: Ler 50 páginas)"
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
          />
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
            />
            <button
              type="submit"
              className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Adicionar Meta
            </button>
          </div>
        </div>
      </form>

      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = Math.min(100, (goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">{goal.title}</h3>
                    <p className="text-xs text-zinc-500">{goal.current} de {goal.target} completados</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-zinc-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="relative h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex gap-2 mt-4">
                {[1, 5, 10].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateGoalProgress(goal.id, goal.current + val)}
                    className="flex-1 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-zinc-100 dark:border-zinc-700"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
