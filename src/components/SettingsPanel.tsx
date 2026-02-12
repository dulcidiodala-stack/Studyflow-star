import { useState } from 'react';
import { useStore } from '../lib/store';
import { Percent, Music, ShieldCheck } from 'lucide-react';

export const SettingsPanel = () => {
  const { settings, updateSettings } = useStore();
  const [localWeights, setLocalWeights] = useState(settings.weights);

  const ringtones = ['Crystal', 'Aurora', 'Reflection', 'Sonar', 'Cosmos'];

  const handleWeightChange = (key: keyof typeof localWeights, val: string) => {
    const num = Math.min(100, Math.max(0, Number(val)));
    const newWeights = { ...localWeights, [key]: num };
    setLocalWeights(newWeights);
    
    const total = newWeights.evaluations + newWeights.teacherTest + newWeights.trimesterTest;
    if (total === 100) {
      updateSettings({ weights: newWeights });
    }
  };

  const total = localWeights.evaluations + localWeights.teacherTest + localWeights.trimesterTest;

  return (
    <div className="space-y-8 pb-20">
      <section className="space-y-4">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <Music size={24} className="text-indigo-600" />
          Som de Notificação
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {ringtones.map((r) => (
            <button
              key={r}
              onClick={() => updateSettings({ ringtone: r })}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                settings.ringtone === r 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <span className="font-bold">{r}</span>
              {settings.ringtone === r && <ShieldCheck size={20} />}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <Percent size={24} className="text-indigo-600" />
          Personalizar Pesos das Notas
        </h3>
        <div className="p-6 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Avaliações (4)</label>
                <span className="text-sm font-black text-indigo-600">{localWeights.evaluations}%</span>
              </div>
              <input 
                type="range" 
                value={localWeights.evaluations} 
                onChange={(e) => handleWeightChange('evaluations', e.target.value)}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Prova Professor</label>
                <span className="text-sm font-black text-indigo-600">{localWeights.teacherTest}%</span>
              </div>
              <input 
                type="range" 
                value={localWeights.teacherTest} 
                onChange={(e) => handleWeightChange('teacherTest', e.target.value)}
                className="w-full accent-indigo-600"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Prova Trimestre</label>
                <span className="text-sm font-black text-indigo-600">{localWeights.trimesterTest}%</span>
              </div>
              <input 
                type="range" 
                value={localWeights.trimesterTest} 
                onChange={(e) => handleWeightChange('trimesterTest', e.target.value)}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <div className={`p-4 rounded-xl text-center font-bold text-sm ${total === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {total === 100 
              ? '✓ Configuração válida (Total 100%)' 
              : `⚠ O total deve ser 100% (Atual: ${total}%)`}
          </div>
        </div>
      </section>
    </div>
  );
};
