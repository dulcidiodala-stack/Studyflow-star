import { useState, type FormEvent } from 'react';
import { useStore } from '../lib/store';
import { Calculator, Trash2, Plus, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export const GradesCalculator = () => {
  const { grades, addGrade, deleteGrade } = useStore();
  const [subject, setSubject] = useState('');
  const [evals, setEvals] = useState<string[]>(['', '', '', '']);
  const [teacherTest, setTeacherTest] = useState('');
  const [trimesterTest, setTrimesterTest] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject || evals.some(v => !v) || !teacherTest || !trimesterTest) return;

    addGrade({
      subject,
      evaluations: evals.map(Number),
      teacherTest: Number(teacherTest),
      trimesterTest: Number(trimesterTest),
    });

    setSubject('');
    setEvals(['', '', '', '']);
    setTeacherTest('');
    setTrimesterTest('');
  };

  const updateEval = (index: number, value: string) => {
    const newEvals = [...evals];
    newEvals[index] = value;
    setEvals(newEvals);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold tracking-tight">Calculadora de Médias</h3>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Info size={20} />
            </button>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Insira as suas notas para calcular a média final do trimestre automaticamente.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      {showInfo && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-xs text-blue-700 dark:text-blue-300 animate-in fade-in slide-in-from-top-2">
          <p><strong>Fórmula utilizada:</strong></p>
          <p className="mt-1">Média = (Média das Avaliações × 30%) + (Prova Professor × 30%) + (Prova Trimestre × 40%)</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="group">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1 mb-2 block">Disciplina</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Matemática, Física..."
              className="w-full px-5 py-4 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {evals.map((val, i) => (
              <div key={i} className="group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1 mb-1.5 block">{i + 1}ª Avaliação</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={val}
                  onChange={(e) => updateEval(i, e.target.value)}
                  placeholder="0.0"
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white text-center font-bold"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1 mb-1.5 block">Prova Professor</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={teacherTest}
                onChange={(e) => setTeacherTest(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white text-center font-bold text-indigo-600 dark:text-indigo-400"
              />
            </div>
            <div className="group">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1 mb-1.5 block">Prova Trimestre</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={trimesterTest}
                onChange={(e) => setTrimesterTest(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all dark:text-white text-center font-bold text-indigo-600 dark:text-indigo-400"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-[1.5rem] font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <Plus size={20} /> Calcular e Guardar
        </button>
      </form>

      <div className="space-y-4">
        <h4 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Calculator size={20} className="text-indigo-600" />
          Histórico de Médias
        </h4>
        
        <div className="grid gap-4">
          {grades.map((g) => (
            <div key={g.id} className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm group relative overflow-hidden">
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-white text-lg">{g.subject}</h5>
                  <div className="flex gap-2 mt-1">
                    {g.evaluations.map((ev, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold">{ev}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-tighter">Média Final</p>
                  <p className={cn(
                    "text-3xl font-black tracking-tighter",
                    g.finalAverage >= 10 ? "text-emerald-500" : "text-red-500"
                  )}>
                    {g.finalAverage}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteGrade(g.id)}
                className="absolute top-4 right-4 p-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
              <div className={cn(
                "absolute left-0 top-0 w-1 h-full",
                g.finalAverage >= 10 ? "bg-emerald-500" : "bg-red-500"
              )} />
            </div>
          ))}
          {grades.length === 0 && (
            <div className="py-12 text-center text-zinc-400 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem]">
              <p className="text-sm">Nenhuma média calculada ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
