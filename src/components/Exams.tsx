import { useState, type FormEvent } from 'react';
import { useStore } from '../lib/store';
import { Calendar, Bell, Trash2 } from 'lucide-react';
import { formatDate } from '../lib/utils';

export const Exams = () => {
  const { exams, addExam, deleteExam } = useStore();
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !date) return;
    addExam({ subject, date, description: '' });
    setSubject('');
    setDate('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Disciplina/Exame"
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
          <button
            type="submit"
            className="px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Agendar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div key={exam.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500">
              <Calendar size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-zinc-900 dark:text-white">{exam.subject}</h4>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Bell size={14} />
                <span>{formatDate(exam.date)}</span>
              </div>
            </div>
            <button
              onClick={() => deleteExam(exam.id)}
              className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {exams.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <p>Nenhum exame agendado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
