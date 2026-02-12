import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import { LogIn, UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) setUser({ id: data.user.id, email: data.user.email!, name: data.user.user_metadata.name });
      } else {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: { data: { name } } 
        });
        if (error) throw error;
        if (data.user) setUser({ id: data.user.id, email: data.user.email!, name });
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-100 mb-4">
            <LogIn size={40} />
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {isLogin ? 'Bem-vindo de volta' : 'Cria a tua conta'}
          </h2>
          <p className="text-zinc-500 font-medium">Acede ao teu fluxo de estudos.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="password"
              placeholder="Palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLogin ? 'Entrar' : 'Registar'}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-center text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors"
        >
          {isLogin ? 'Não tens conta? Regista-te' : 'Já tens conta? Entra aqui'}
        </button>
      </div>
    </div>
  );
};
