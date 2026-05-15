import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const COMPARISON = [
  { feature: 'AI Sales Analytics', standard: false, saqu: true },
  { feature: 'Blockchain Verified Receipts', standard: false, saqu: true },
  { icon: 'Zap', feature: 'Realtime Multi-Branch Sync', standard: 'Limited', saqu: true },
  { feature: 'Predictive Stock Management', standard: false, saqu: true },
  { feature: 'Islamic-First UI System', standard: false, saqu: true },
  { feature: 'Offline Transaction Support', standard: 'Manual', saqu: 'Automatic' },
];

export default function FeatureComparison() {
  return (
    <section className="py-32 bg-slate-900/50 relative">
       <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
             <div className="text-primary font-black uppercase tracking-[0.4em] text-xs">Market Comparison</div>
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">THE <span className="text-gradient-primary">UNFAIR ADVANTAGE</span></h2>
          </div>

          <div className="max-w-4xl mx-auto glass-panel rounded-[4rem] border-none shadow-2xl overflow-hidden">
             <div className="grid grid-cols-3 bg-white/5 p-8 border-b border-white/5">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Feature Capabilities</div>
                <div className="text-center text-xs font-black uppercase tracking-widest text-slate-500">Traditional POS</div>
                <div className="text-center text-xs font-black uppercase tracking-widest text-primary">SaquMart Elite</div>
             </div>

             <div className="divide-y divide-white/5">
                {COMPARISON.map((c, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="grid grid-cols-3 p-8 items-center hover:bg-white/5 transition-colors group"
                  >
                     <div className="font-bold text-slate-200">{c.feature}</div>
                     <div className="flex justify-center">
                        {c.standard === true ? <Check className="text-slate-500" /> : c.standard === false ? <X className="text-rose-500/30" /> : <span className="text-xs font-black text-slate-600 uppercase">{c.standard}</span>}
                     </div>
                     <div className="flex justify-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
                           {c.saqu === true ? <Check className="text-primary" /> : <span className="text-xs font-black text-primary uppercase">{c.saqu}</span>}
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>
       </div>
    </section>
  );
}
