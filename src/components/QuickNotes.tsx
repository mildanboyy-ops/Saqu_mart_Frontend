import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function QuickNotes() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('saqumart-quick-note');
    if (saved) setNote(saved);
  }, []);

  const handleSave = () => {
    localStorage.setItem('saqumart-quick-note', note);
    toast.success('Catatan cepat disimpan!');
    setIsOpen(false);
  };

  return (
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 animate-bounce hover:animate-none"
      >
        <StickyNote className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-80 bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="bg-amber-200 dark:bg-amber-800/60 p-3 flex justify-between items-center border-b border-amber-300 dark:border-amber-700">
              <span className="font-black text-amber-900 dark:text-amber-100 flex items-center gap-2 text-sm uppercase tracking-widest">
                <StickyNote className="h-4 w-4" /> Quick Note
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-amber-900 dark:text-amber-100 hover:bg-amber-300 dark:hover:bg-amber-700 rounded-full" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <textarea
                placeholder="Tulis catatan penting kasir..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full min-h-[150px] bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-amber-950 dark:text-amber-50 placeholder:text-amber-900/50 dark:placeholder:text-amber-100/30 font-medium"
              />
              <Button className="w-full gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md" onClick={handleSave}>
                <Save className="h-4 w-4" /> Simpan Catatan
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
