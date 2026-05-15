import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

import { Server, Wifi, Database, RefreshCw, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveSystemStatus() {
  const status = [
    { label: 'Cloud Gateway', status: 'Online', latency: '12ms', icon: Globe, color: 'emerald' },
    { label: 'Blockchain Verifier', status: 'Active', latency: '4ms', icon: ShieldCheck, color: 'blue' },
    { label: 'Real-time WebSocket', status: 'Connected', latency: '2ms', icon: Wifi, color: 'violet' },
    { label: 'AI Inference Engine', status: 'Standby', latency: '45ms', icon: Cpu, color: 'amber' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {status.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-4 rounded-[1.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
        >
          <div className="flex justify-between items-start mb-3">
             <div className={cn("p-2 rounded-xl", `bg-${s.color}-500/10`)}>
                <s.icon className={cn("h-4 w-4", `text-${s.color}-500`)} />
             </div>
             <div className="flex flex-col items-end">
                <span className={cn("text-[9px] font-black uppercase tracking-widest", `text-${s.color}-500`)}>{s.status}</span>
                <span className="text-[8px] font-mono text-muted-foreground">{s.latency}</span>
             </div>
          </div>
          <p className="text-[10px] font-black uppercase text-slate-300 tracking-wider mb-2">{s.label}</p>
          <div className="flex gap-1">
             {[...Array(12)].map((_, j) => (
                <div 
                  key={j} 
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    j < 8 ? `bg-${s.color}-500` : "bg-white/5"
                  )} 
                />
             ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}



