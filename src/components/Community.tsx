import { useState, useEffect, type FormEvent } from 'react';
import { useStore } from '../lib/store';
import { Send, Users } from 'lucide-react';

export const Community = () => {
  const { messages, addMessage, fetchMessages } = useStore();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;
    setLoading(true);
    await addMessage(content);
    setContent('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[70vh] pb-20">
      <div className="flex items-center gap-3 mb-6 p-4 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/20">
        <div className="p-2 rounded-xl bg-indigo-600 text-white">
          <Users size={20} />
        </div>
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white">Comunidade StudyFlow</h3>
          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Estudantes Online: Conectado</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.user === 'Tu (Estudante)' ? 'flex-row-reverse' : ''}`}>
            <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-2xl bg-zinc-100" />
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.user === 'Tu (Estudante)' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-tl-none'
            }`}>
              <p className="text-[10px] font-black uppercase tracking-tighter mb-1 opacity-70">{msg.user}</p>
              <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
              <p className="text-[8px] mt-2 opacity-50 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreve algo para a turma..."
          className="flex-1 px-5 py-4 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:text-white font-medium shadow-sm"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-lg shadow-indigo-100 active:scale-90 transition-all disabled:opacity-50"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};
