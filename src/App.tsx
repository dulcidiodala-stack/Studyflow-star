import { useState } from 'react';
import { useStore } from './lib/store';
import { Pomodoro } from './components/Pomodoro';
import { TaskList } from './components/TaskList';
import { Goals } from './components/Goals';
import { Exams } from './components/Exams';
import { GradesCalculator } from './components/GradesCalculator';
import { SettingsPanel } from './components/SettingsPanel';
import { Library } from './components/Library';
import { Community } from './components/Community';
import { SchoolSearch } from './components/SchoolSearch';
import { Auth } from './components/Auth';
import { 
  LayoutDashboard, 
  Timer, 
  CheckSquare, 
  GraduationCap,
  Calculator,
  Moon,
  Sun,
  Calendar as CalendarIcon,
  Settings,
  Library as LibraryIcon,
  MessageSquare,
  Search,
  Target,
  LogOut
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'dashboard' | 'focus' | 'tasks' | 'goals' | 'exams' | 'grades' | 'settings' | 'library' | 'community' | 'search';

function App() {
  const { theme, setTheme, tasks, exams, grades, user, setUser } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  if (!user) {
    return (
      <div className={cn("min-h-screen transition-colors duration-300", theme === 'dark' ? "dark bg-black" : "bg-zinc-50")}>
        <Auth />
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'library', icon: LibraryIcon, label: 'Docs' },
    { id: 'search', icon: Search, label: 'Busca' },
    { id: 'community', icon: MessageSquare, label: 'Chat' },
    { id: 'settings', icon: Settings, label: 'Config' },
  ];

  const quickActions = [
    { id: 'focus', icon: Timer, label: 'Foco', color: 'bg-indigo-600' },
    { id: 'tasks', icon: CheckSquare, label: 'Tarefas', color: 'bg-emerald-500' },
    { id: 'grades', icon: Calculator, label: 'Médias', color: 'bg-amber-500' },
    { id: 'exams', icon: GraduationCap, label: 'Provas', color: 'bg-rose-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <header className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">StudyFlow</h1>
                <p className="text-zinc-500 font-semibold text-sm">Olá, {user.name || 'Estudante'}!</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-4 rounded-[1.5rem] bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 shadow-sm border border-zinc-100 dark:border-zinc-800"
                >
                  {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                </button>
                <button
                  onClick={() => setUser(null)}
                  className="p-4 rounded-[1.5rem] bg-white dark:bg-zinc-900 text-rose-500 shadow-sm border border-zinc-100 dark:border-zinc-800"
                >
                  <LogOut size={22} />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setActiveTab(action.id as Tab)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", action.color)}>
                    <action.icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{action.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none"
              >
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Tarefas</p>
                <h3 className="text-4xl font-black mt-1 tracking-tighter">{tasks.filter(t => !t.completed).length}</h3>
                <p className="text-[10px] mt-2 font-bold opacity-60">pendentes</p>
              </motion.div>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-800 text-white shadow-xl shadow-zinc-200 dark:shadow-none"
              >
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Média Global</p>
                <h3 className="text-4xl font-black mt-1 tracking-tighter">
                  {grades.length > 0 
                    ? (grades.reduce((a, b) => a + b.finalAverage, 0) / grades.length).toFixed(1)
                    : '0.0'}
                </h3>
                <p className="text-[10px] mt-2 font-bold opacity-60">trimestral</p>
              </motion.div>
            </div>

            <section>
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Próximas Provas</h2>
                <button onClick={() => setActiveTab('exams')} className="text-xs font-bold uppercase tracking-widest text-indigo-600">Ver todos</button>
              </div>
              <div className="space-y-4">
                {exams.slice(0, 2).map(exam => (
                  <div key={exam.id} className="p-5 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500">
                      <CalendarIcon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white text-lg tracking-tight">{exam.subject}</p>
                      <p className="text-xs font-semibold text-zinc-400">{new Date(exam.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}</p>
                    </div>
                  </div>
                ))}
                {exams.length === 0 && (
                  <div className="p-10 rounded-[2.5rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800 text-center">
                    <p className="text-zinc-400 text-sm font-medium">Tudo calmo por aqui...</p>
                  </div>
                )}
              </div>
            </section>

            <motion.section 
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('goals')}
              className="p-8 rounded-[3rem] bg-gradient-to-br from-emerald-500 to-teal-600 text-white cursor-pointer shadow-2xl shadow-emerald-100 dark:shadow-none relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Metas Ativas</p>
                  <h3 className="text-2xl font-black tracking-tight">Ver Progresso</h3>
                </div>
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md">
                  <Target size={32} />
                </div>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </motion.section>
          </div>
        );
      case 'focus': return <div className="space-y-8"><h2 className="text-3xl font-black tracking-tighter dark:text-white">Foco</h2><Pomodoro /></div>;
      case 'tasks': return <div className="space-y-8"><h2 className="text-3xl font-black tracking-tighter dark:text-white">Tarefas</h2><TaskList /></div>;
      case 'goals': return <div className="space-y-8"><h2 className="text-3xl font-black tracking-tighter dark:text-white">Metas</h2><Goals /></div>;
      case 'exams': return <div className="space-y-8"><h2 className="text-3xl font-black tracking-tighter dark:text-white">Provas</h2><Exams /></div>;
      case 'grades': return <div className="space-y-8"><h2 className="text-3xl font-black tracking-tighter dark:text-white">Médias</h2><GradesCalculator /></div>;
      case 'settings': return <div className="space-y-8"><h2 className="text-3xl font-black tracking-tighter dark:text-white">Definições</h2><SettingsPanel /></div>;
      case 'library': return <div className="space-y-8"><h2 className="text-3xl font-black tracking-tighter dark:text-white">Biblioteca</h2><Library /></div>;
      case 'community': return <div className="space-y-8"><h2 className="text-3xl font-black tracking-tighter dark:text-white">Comunidade</h2><Community /></div>;
      case 'search': return <div className="space-y-8"><SchoolSearch /></div>;
      default: return null;
    }
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300", theme === 'dark' ? "dark bg-black" : "bg-zinc-50")}>
      <main className="max-w-md mx-auto px-6 pt-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-800 px-6 pb-8 pt-4 safe-area-bottom">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                activeTab === tab.id ? "text-indigo-600 scale-110" : "text-zinc-400"
              )}
            >
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
