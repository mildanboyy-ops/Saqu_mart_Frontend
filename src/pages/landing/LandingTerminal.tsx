import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const allLogs = [
    "> AI Engine Initializing...",
    "> Neural Network Syncing...",
    "> Global Node: CONNECTED",
    "> Analyzing Realtime Sales Data...",
    "> Fraud Detection: ACTIVE",
    "> Sales Prediction: +28% Next Week",
    "> Optimizing Inventory Levels...",
    "> System Status: ELITE",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-4), allLogs[i % allLogs.length]]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-[2rem] border-none shadow-2xl bg-black/60 backdrop-blur-3xl font-mono text-xs overflow-hidden group">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
         <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            <span className="ml-2 text-[10px] font-black uppercase text-white/30 tracking-widest">Saqu_AI_Terminal v4.0</span>
         </div>
         <Cpu className="h-4 w-4 text-primary animate-pulse" />
      </div>
      
      <div className="space-y-2 h-32 overflow-hidden">
         {logs.map((log, idx) => (
           <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
           >
              <span className={idx === logs.length - 1 ? "text-primary" : "text-slate-500"}>
                 {log}
              </span>
           </motion.div>
         ))}
         <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-primary inline-block align-middle"
         />
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
         <div className="bg-white/5 p-2 rounded-xl flex items-center gap-2">
            <Zap className="h-3 w-3 text-emerald-400" />
            <div className="flex flex-col">
               <span className="text-[8px] text-white/20 uppercase">Latency</span>
               <span className="text-[10px] font-black text-emerald-400">2ms</span>
            </div>
         </div>
         <div className="bg-white/5 p-2 rounded-xl flex items-center gap-2">
            <Shield className="h-3 w-3 text-blue-400" />
            <div className="flex flex-col">
               <span className="text-[8px] text-white/20 uppercase">Security</span>
               <span className="text-[10px] font-black text-blue-400">ELITE</span>
            </div>
         </div>
      </div>
    </div>
  );
}
