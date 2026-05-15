import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Check } from 'lucide-react';

interface PrinterSimulationProps {
  isOpen: boolean;
  onComplete: () => void;
  storeName: string;
}

export const PrinterSimulation: React.FC<PrinterSimulationProps> = ({ isOpen, onComplete, storeName }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setIsFinished(false);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsFinished(true);
              setTimeout(onComplete, 1000);
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-white/20 w-80 text-center overflow-hidden relative"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                {isFinished ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="h-12 w-12 text-emerald-500" />
                  </motion.div>
                ) : (
                  <Printer className="h-12 w-12 text-primary animate-bounce" />
                )}
              </div>
              
              <h3 className="text-xl font-black mb-2">{isFinished ? 'Selesai!' : 'Mencetak Struk...'}</h3>
              <p className="text-sm text-muted-foreground mb-6">Menghubungkan ke {storeName} Printer</p>
              
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8 border border-slate-200 dark:border-slate-700">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              {/* Virtual Receipt Paper */}
              <div className="relative mx-auto w-48 h-24 bg-slate-50 dark:bg-slate-800 border-x border-t rounded-t-lg shadow-inner overflow-hidden">
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 100 - (progress * 0.8) }}
                  className="bg-white dark:bg-slate-700 p-4 w-full h-[200px] shadow-sm text-left font-mono text-[8px] space-y-1"
                >
                  <div className="font-bold border-b pb-1 mb-1">{storeName}</div>
                  <div className="flex justify-between"><span>ITEM 1</span><span>Rp 10.000</span></div>
                  <div className="flex justify-between"><span>ITEM 2</span><span>Rp 25.000</span></div>
                  <div className="flex justify-between font-bold border-t pt-1"><span>TOTAL</span><span>Rp 35.000</span></div>
                  <div className="mt-4 text-center">--- TERIMA KASIH ---</div>
                </motion.div>
                
                {/* Printer Slot */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-400 dark:bg-slate-600 rounded-t-sm shadow-lg z-20" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
