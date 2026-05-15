import { motion } from 'framer-motion';
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { Zap, Users, Globe, Shield } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Active Users', value: 12500, suffix: '+' },
  { icon: Zap, label: 'Transactions/sec', value: 8500, suffix: '' },
  { icon: Globe, label: 'Global Nodes', value: 124, suffix: '' },
  { icon: Shield, label: 'Data Protected', value: 100, suffix: '%' },
];

export default function StatsCounter() {
  return (
    <section className="py-20 relative">
       <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full" />
       
       <div className="container mx-auto px-6 relative z-10">
          <div className="glass-panel p-12 rounded-[4rem] border-none shadow-2xl flex flex-wrap justify-between items-center gap-12 bg-white/5 backdrop-blur-3xl">
             {stats.map((s, i) => (
               <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4 min-w-[200px]"
               >
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                     <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                     <div className="flex items-baseline justify-center gap-1">
                        <AnimatedCounter value={s.value} className="text-5xl font-black text-white tracking-tighter" />
                        <span className="text-3xl font-black text-primary">{s.suffix}</span>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{s.label}</p>
                  </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}
