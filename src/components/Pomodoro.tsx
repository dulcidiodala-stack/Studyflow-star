import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          setMode(mode === 'work' ? 'break' : 'work');
          setMinutes(mode === 'work' ? 5 : 25);
          alert(mode === 'work' ? 'Tempo de descanso!' : 'Hora de focar!');
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'work' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => { setMode('work'); setMinutes(25); setSeconds(0); setIsActive(false); }}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            mode === 'work' ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          )}
        >
          Foco
        </button>
        <button
          onClick={() => { setMode('break'); setMinutes(5); setSeconds(0); setIsActive(false); }}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            mode === 'break' ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          )}
        >
          Pausa
        </button>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-100 dark:text-zinc-800"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={754}
            strokeDashoffset={754 - (754 * (minutes * 60 + seconds)) / (mode === 'work' ? 25 * 60 : 5 * 60)}
            className="text-indigo-600 transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-bold tracking-tighter text-zinc-900 dark:text-white">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-sm font-medium text-zinc-500 mt-2 flex items-center gap-2">
            {mode === 'work' ? <BookOpen size={16} /> : <Coffee size={16} />}
            {mode === 'work' ? 'Foco' : 'Descanso'}
          </span>
        </div>
      </div>

      <div className="flex gap-6 mt-10">
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:scale-110 transition-transform"
        >
          <RotateCcw size={24} />
        </button>
        <button
          onClick={toggleTimer}
          className="p-6 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-110 transition-transform"
        >
          {isActive ? <Pause size={32} /> : <Play size={32} fill="white" />}
        </button>
      </div>
    </div>
  );
};
