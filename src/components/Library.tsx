import { useState, useRef } from 'react';
import { useStore } from '../lib/store';
import { supabase } from '../lib/supabase';
import { 
  FileText, 
  Pin, 
  Trash2, 
  ExternalLink, 
  FileImage, 
  Loader2, 
  Upload,
  File as FileIcon
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Library = () => {
  const { documents, addDocument, togglePinDocument, deleteDocument, user } = useStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage (Bucket: documents)
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Determine type
      let type = 'DOC';
      if (file.type.includes('pdf')) type = 'PDF';
      if (file.type.includes('image')) type = 'IMG';

      addDocument({
        name: file.name,
        type: type,
        url: publicUrl
      });

    } catch (error: any) {
      console.error('Error uploading:', error);
      alert('Erro ao carregar ficheiro. Certifique-se que o bucket "documents" existe no Supabase e tem permissões públicas.');
      
      // Fallback: Adicionar localmente mesmo sem upload se falhar (para teste)
      addDocument({
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'IMG' : 'DOC',
        url: '#'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const sortedDocs = [...documents].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText size={24} className="text-red-500" />;
      case 'IMG': return <FileImage size={24} className="text-blue-500" />;
      default: return <FileIcon size={24} className="text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="p-10 rounded-[3rem] border-4 border-dashed border-zinc-100 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer group text-center"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".pdf,image/*,.doc,.docx"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-200 group-hover:scale-110 transition-transform">
            {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
          </div>
          <div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">Carregar Documento</h3>
            <p className="text-sm text-zinc-500 font-medium">PDF, Imagens ou Word (Máx 5MB)</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-2">Os teus ficheiros ({documents.length})</h4>
        {sortedDocs.map((doc) => (
          <div key={doc.id} className={cn(
            "p-5 rounded-[2.5rem] bg-white dark:bg-zinc-900 border transition-all flex items-center justify-between group shadow-sm",
            doc.pinned ? "border-indigo-500 ring-4 ring-indigo-500/5" : "border-zinc-100 dark:border-zinc-800"
          )}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                {getIcon(doc.type)}
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white tracking-tight truncate max-w-[150px]">{doc.name}</h4>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{doc.type} • {new Date(doc.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => togglePinDocument(doc.id)}
                className={cn("p-3 rounded-2xl transition-all active:scale-90", doc.pinned ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800")}
              >
                <Pin size={20} fill={doc.pinned ? "currentColor" : "none"} />
              </button>
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 text-zinc-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all active:scale-90"
              >
                <ExternalLink size={20} />
              </a>
              <button 
                onClick={() => deleteDocument(doc.id)}
                className="p-3 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all active:scale-90"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {documents.length === 0 && !uploading && (
          <div className="py-20 text-center opacity-30">
            <FileIcon size={64} className="mx-auto mb-4" />
            <p className="font-bold">Nenhum documento guardado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
