import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
           <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-xs"
           >
            Unified Control Center
           </motion.div>
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            LIVE DASHBOARD <span className="text-gradient-primary">PREVIEW</span>
           </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          {/* Glass Mockup Frame */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" />
          
          <div className="relative bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden p-4 md:p-8 aspect-[16/10]">
             {/* Inner UI Mockup */}
             <div className="w-full h-full bg-[#020617] rounded-[2rem] overflow-hidden flex flex-col">
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-8">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary rounded-xl" />
                      <div className="w-32 h-3 bg-white/5 rounded-full" />
                   </div>
                   <div className="flex gap-4">
                      <div className="w-8 h-8 bg-white/5 rounded-xl" />
                      <div className="w-8 h-8 bg-white/5 rounded-xl" />
                   </div>
                </div>
                
                <div className="flex-1 p-8 grid grid-cols-4 gap-6">
                   {[TrendingUp, ShoppingCart, Users, Package].map((Icon, i) => (
                     <Card key={i} className="bg-white/5 border-none rounded-3xl p-6">
                        <Icon className="h-6 w-6 text-primary mb-4" />
                        <div className="space-y-2">
                           <div className="w-12 h-2 bg-white/10 rounded-full" />
                           <div className="w-20 h-4 bg-white/20 rounded-full" />
                        </div>
                     </Card>
                   ))}
                   <Card className="col-span-3 bg-white/5 border-none rounded-[2.5rem] p-8 flex flex-col justify-end">
                      <div className="w-full h-48 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl relative overflow-hidden">
                         <motion.div 
                          animate={{ x: ['0%', '-50%'] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 flex items-center"
                         >
                            <svg className="w-[200%] h-full">
                               <path d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50" fill="none" stroke="#10b981" strokeWidth="4" />
                            </svg>
                         </motion.div>
                      </div>
                   </Card>
                   <Card className="col-span-1 bg-white/5 border-none rounded-[2.5rem] p-6 space-y-4">
                      <div className="w-full h-2 bg-white/10 rounded-full" />
                      <div className="w-full h-2 bg-white/10 rounded-full" />
                      <div className="w-2/3 h-2 bg-white/10 rounded-full" />
                      <div className="flex-1" />
                      <div className="w-full h-10 bg-primary rounded-2xl" />
                   </Card>
                </div>
             </div>
          </div>

          {/* Floating UI Badges */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 bg-emerald-500 text-white p-6 rounded-[2rem] shadow-2xl font-black text-xl flex items-center gap-3 border-4 border-slate-900"
          >
             <TrendingUp className="h-8 w-8" /> +42%
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-10 -left-10 bg-blue-600 text-white p-6 rounded-[2rem] shadow-2xl font-black text-xl flex items-center gap-3 border-4 border-slate-900"
          >
             <Users className="h-8 w-8" /> 1.2K LIVE
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
