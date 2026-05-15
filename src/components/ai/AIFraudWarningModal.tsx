import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIFraudWarningModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [fraudData, setFraudData] = useState<any>(null);

  useEffect(() => {
    // Simulate AI Fraud Detection event randomly (1% chance every 10 seconds for demo)
    const interval = setInterval(() => {
      if (Math.random() < 0.05 && !isOpen) {
        setFraudData({
          riskLevel: 'HIGH',
          reason: 'Pola transaksi mencurigakan dari perangkat tidak dikenal.',
          location: 'Jakarta Selatan',
          confidence: '98%',
          timestamp: new Date().toLocaleTimeString()
        });
        setIsOpen(true);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-destructive/50 w-full max-w-md rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.3)]"
        >
          <div className="bg-destructive text-destructive-foreground p-4 flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full animate-pulse">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight">AI Fraud Warning</h2>
              <p className="text-xs opacity-90 uppercase tracking-widest font-bold">SaquMart Security Engine</p>
            </div>
          </div>
          
          <div className="p-6 space-y-4 text-slate-300">
            <div className="flex items-start gap-3 bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-destructive">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-bold leading-tight">{fraudData.reason}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1">Risk Level</p>
                <p className="font-black text-destructive">{fraudData.riskLevel}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1">Confidence</p>
                <p className="font-black text-amber-500">{fraudData.confidence}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1">Location</p>
                <p className="font-bold">{fraudData.location}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1">Time</p>
                <p className="font-bold">{fraudData.timestamp}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-950 flex justify-end gap-3 border-t border-white/5">
            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>Abaikan</Button>
            <Button variant="destructive" onClick={() => setIsOpen(false)} className="font-bold shadow-lg shadow-destructive/20">Kunci Akun</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
