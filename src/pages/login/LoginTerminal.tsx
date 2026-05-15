import { motion } from 'framer-motion';
import { Zap, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LoginTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const allLogs = [
    "> Initializing Secure Connection...",
    "> Negotiating SSL/TLS 1.3...",
    "> Establishing Neural Link...",
    "> AI Intrusion Detection: ACTIVE",
    "> Blockchain Ledger: SYNCED",
    "> Security Protocol: ELITE",
    "> System Entropy: OPTIMAL",
    "> Ready for Authentication...",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-6), allLogs[i % allLogs.length]]);
      i++;
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 p-8 font-mono text-[10px] overflow-hidden relative group h-full">
       <div className="absolute inset-0 cyber-grid opacity-10" />
       
       <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 relative z-10">
          <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-white/20 uppercase tracking-[0.3em] font-black">Secure_Console v4.0</span>
       </div>

       <div className="space-y-3 relative z-10">
          {logs.map((log, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
               <span className={idx === logs.length - 1 ? "text-primary" : "text-white/40"}>
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

       <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4 z-10">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
             <Zap className="h-4 w-4 text-emerald-500" />
             <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase">Latency</span>
                <span className="text-white font-black uppercase">2ms</span>
             </div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-3">
             <Shield className="h-4 w-4 text-blue-500" />
             <div className="flex flex-col">
                <span className="text-[8px] text-white/30 uppercase">Auth</span>
                <span className="text-white font-black uppercase">Secure</span>
             </div>
          </div>
       </div>
    </div>
  );
}
