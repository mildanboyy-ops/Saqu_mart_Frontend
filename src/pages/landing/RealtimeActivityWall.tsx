import { motion } from 'framer-motion';
import { ShoppingCart, UserPlus, Zap, Package, AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

const ACTIVITIES = [
  { icon: ShoppingCart, text: 'Sale: Kopi Saqu x2 (Tebet Branch)', time: 'Just now', color: 'emerald' },
  { icon: UserPlus, text: 'New Member: "Ahmad" joined loyalty', time: '2m ago', color: 'blue' },
  { icon: Zap, text: 'AI Optimization: Stock rebalanced', time: '5m ago', color: 'violet' },
  { icon: Package, text: 'Stock In: 50x Mineral Water (Depok)', time: '12m ago', color: 'amber' },
  { icon: AlertTriangle, text: 'Security: Blockchain block verified', time: '15m ago', color: 'rose' },
];

export default function RealtimeActivityWall() {
  return (
    <section className="py-32 relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <div className="text-primary font-black uppercase tracking-[0.4em] text-xs">Live Ecosystem</div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-white">
                THE SYSTEM <br /> <span className="text-gradient-primary">THAT NEVER SLEEPS</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                Experience the power of a fully synchronized retail network. Every action, every sale, and every AI insight is streamed across your enterprise in real-time.
              </p>
              <div className="flex gap-4">
                 <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-500 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Global Sync: Active
                 </div>
                 <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    Nodes: 24 Online
                 </div>
              </div>
           </div>

           <div className="relative h-[500px] flex flex-col gap-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 z-10 pointer-events-none" />
              
              <motion.div 
                animate={{ y: ['0%', '-50%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="space-y-4"
              >
                {[...ACTIVITIES, ...ACTIVITIES].map((a, i) => (
                  <div key={i} className="glass-panel p-6 rounded-[2rem] border-none shadow-xl flex items-center gap-6 group hover:scale-[1.02] transition-transform">
                     <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/5", `text-${a.color}-500 shadow-lg shadow-${a.color}-500/10`)}>
                        <a.icon className="h-6 w-6" />
                     </div>
                     <div className="flex-1">
                        <p className="text-white font-bold leading-tight">{a.text}</p>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">{a.time}</p>
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                           <Zap className="h-4 w-4 text-white" />
                        </div>
                     </div>
                  </div>
                ))}
              </motion.div>
           </div>
        </div>
      </div>
    </section>
  );
}
