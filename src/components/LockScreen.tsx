import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export default function LockScreen({ isLocked, onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState('');
  const { user } = useAuthStore();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy PIN check: for demo, any 4 digit or user's role name works, let's just accept '1234' or their password if we had it.
    // Since we don't have a real PIN system, we'll hardcode '1234' or accept empty for now, but let's make it '1234'
    if (pin === '1234' || pin === 'admin') {
      setPin('');
      onUnlock();
      toast.success("Sesi dilanjutkan");
    } else {
      toast.error("PIN salah!");
      setPin('');
    }
  };

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-white/10"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">Kasir Terkunci</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Sesi {user?.name || 'Anda'} dikunci karena tidak ada aktivitas.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Masukkan PIN (1234)" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="h-14 text-center text-2xl tracking-widest font-black rounded-xl"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl font-bold text-lg gap-2">
                <Unlock className="h-5 w-5" /> Buka Kunci
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
