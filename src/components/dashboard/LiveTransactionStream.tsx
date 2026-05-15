import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactionStore } from '@/store/useTransactionStore';
import { Zap } from 'lucide-react';

export default function LiveTransactionStream() {
  const transactions = useTransactionStore(state => state.transactions);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (transactions.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % transactions.slice(0, 10).length);
    }, 4000);
    return () => clearInterval(interval);
  }, [transactions]);

  if (transactions.length === 0) return null;

  const displayTx = transactions.slice(0, 10);
  const currentTx = displayTx[currentIndex % displayTx.length];

  if (!currentTx) return null;

  return (
    <div className="h-10 flex items-center overflow-hidden w-[250px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTx.id}
          initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
          className="flex items-center gap-3"
        >
          <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
             <Zap className="h-3 w-3 text-primary animate-pulse" />
          </div>
          <div className="flex flex-col">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">LIVE SALES</span>
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
             </div>
             <div className="flex items-center gap-1">
                <span className="text-xs font-bold truncate max-w-[120px]">
                  {currentTx.items[0]?.name || 'Produk'}
                </span>
                <span className="text-[10px] font-black text-emerald-600">
                  +Rp {currentTx.total.toLocaleString()}
                </span>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
