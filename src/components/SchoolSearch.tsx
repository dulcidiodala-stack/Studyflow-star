import { useState, type FormEvent } from 'react';
import { Search, Globe, X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export const SchoolSearch = () => {
  const [query, setQuery] = useState('');
  const [showIframe, setShowIframe] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query) return;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`;
    setCurrentUrl(searchUrl);
    setShowIframe(true);
  };

  if (showIframe) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col">
        <div className="p-4 flex items-center gap-4 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <button onClick={() => setShowIframe(false)} className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-white">
            <X size={20} />
          </button>
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-sm truncate dark:text-zinc-400">
            {query}
          </div>
          <button onClick={() => setCurrentUrl(currentUrl)} className="p-2 text-zinc-400">
            <RotateCcw size={20} />
          </button>
        </div>
        <div className="flex-1 relative bg-zinc-50">
          <iframe 
            src={currentUrl} 
            className="w-full h-full border-none"
            title="Google Search"
          />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-3 rounded-full shadow-2xl border dark:border-zinc-800">
            <button className="p-2 text-zinc-400 hover:text-indigo-600"><ChevronLeft size={24} /></button>
            <button className="p-2 text-zinc-400 hover:text-indigo-600"><ChevronRight size={24} /></button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-2" />
            <button onClick={() => setShowIframe(false)} className="p-2 text-rose-500"><X size={24} /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 mb-2">
          <Globe size={32} />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">Pesquisa Escolar</h2>
        <p className="text-sm text-zinc-500 font-medium px-10">Explora o conhecimento global diretamente do StudyFlow.</p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar no Google..."
          className="w-full pl-14 pr-6 py-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all dark:text-white font-bold text-lg shadow-xl"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={24} />
      </form>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/20 text-center space-y-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto">
            <Globe size={20} />
          </div>
          <p className="font-bold text-sm dark:text-white">Web Completa</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20 text-center space-y-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white mx-auto">
            <Search size={20} />
          </div>
          <p className="font-bold text-sm dark:text-white">Resultados Seguros</p>
        </div>
      </div>
    </div>
  );
};
