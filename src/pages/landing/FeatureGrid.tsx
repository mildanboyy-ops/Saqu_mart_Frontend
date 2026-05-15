import { motion } from 'framer-motion';
import { 
  BrainCircuit, ShoppingCart, Activity, Shield, 
  Smartphone, Database, Layout, Clock, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  { 
    icon: BrainCircuit, 
    title: 'AI Intelligence Engine', 
    desc: 'Predictive analytics that forecast your sales and inventory needs with 99% accuracy.',
    color: 'emerald'
  },
  { 
    icon: ShoppingCart, 
    title: 'Smart POS Terminal', 
    desc: 'Lightning-fast checkout experience with multi-method payment and blockchain receipts.',
    color: 'blue'
  },
  { 
    icon: Activity, 
    title: 'Realtime Telemetry', 
    desc: 'Monitor every transaction, stock movement, and employee performance in real-time.',
    color: 'violet'
  },
  { 
    icon: Shield, 
    title: 'Blockchain Security', 
    desc: 'Immutable transaction ledger ensuring absolute data integrity and fraud prevention.',
    color: 'rose'
  },
  { 
    icon: Smartphone, 
    title: 'Omnichannel Ready', 
    desc: 'Seamless operation across mobile, tablet, and desktop with offline sync support.',
    color: 'amber'
  },
  { 
    icon: Database, 
    title: 'Edge Computing', 
    desc: 'High-performance data processing at the edge for zero-latency operations.',
    color: 'sky'
  }
];

export default function FeatureGrid() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
           <div className="max-w-2xl space-y-4">
              <div className="text-primary font-black uppercase tracking-[0.4em] text-xs">Unmatched Capabilities</div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-none">
                FUTURE-READY <br /> <span className="text-gradient-primary">INFRASTRUCTURE</span>
              </h2>
           </div>
           <p className="max-w-sm text-slate-400 font-medium">
            Building the next generation of retail technology with high-end tools for elite businesses.
           </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {features.map((f, i) => (
             <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
             >
                <div className="glass-panel h-full p-10 rounded-[3rem] border-none shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                   <div className={cn("absolute -right-8 -top-8 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700", `bg-${f.color}-500`)} />
                   
                   <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mb-8 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500", `text-${f.color}-500 shadow-lg shadow-${f.color}-500/10 group-hover:shadow-${f.color}-500/20`)}>
                      <f.icon className="h-8 w-8" />
                   </div>

                   <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{f.title}</h3>
                   <p className="text-slate-400 font-medium leading-relaxed mb-6">
                    {f.desc}
                   </p>

                   <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-20px] group-hover:translate-x-0 transition-all duration-500">
                      LEARN MORE <Sparkles className="h-3 w-3" />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
