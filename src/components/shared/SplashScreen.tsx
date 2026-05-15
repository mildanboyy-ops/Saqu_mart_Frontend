import { motion } from 'framer-motion';
import { ShoppingCart, BrainCircuit } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState("Initializing SaquMart Engine...");

  useEffect(() => {
    const timers = [
      setTimeout(() => setText("Synchronizing Global Node..."), 800),
      setTimeout(() => setText("Booting AI Intelligence Hub..."), 1600),
      setTimeout(() => setText("Welcome to the Future."), 2400),
      setTimeout(() => onComplete(), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 opacity-20">
         {[...Array(20)].map((_, i) => (
           <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-primary rounded-full"
           />
         ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mb-12"
      >
        <div className="absolute -inset-8 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
        <div className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <ShoppingCart className="h-20 w-20 text-primary" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2 bg-slate-950 p-2 rounded-xl border border-white/10 shadow-xl"
          >
            <BrainCircuit className="h-6 w-6 text-emerald-400" />
          </motion.div>
        </div>
      </motion.div>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-black tracking-tighter text-white">
          SAQU<span className="text-primary">MART</span>
        </h1>
        <div className="flex flex-col items-center gap-2">
           <motion.p 
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-black uppercase tracking-[0.4em] text-emerald-500/60"
           >
            {text}
           </motion.p>
           <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.8)]"
              />
           </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
        Elite Enterprise Edition v4.0.0
      </div>
    </motion.div>
  );
}
