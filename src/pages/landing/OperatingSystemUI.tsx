import { motion } from 'framer-motion';
import { 
  Activity, BarChart3, Settings, 
  X, Minus, Maximize2, Terminal as TerminalIcon, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import LandingTerminal from './LandingTerminal';

export default function OperatingSystemUI() {
  return (
    <section className="py-32 relative overflow-hidden bg-[#020617]">
       {/* Background Depth */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
       
       <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-4">
             <div className="text-primary font-black uppercase tracking-[0.4em] text-xs">Unmatched Control</div>
             <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">THE RETAIL <span className="text-gradient-primary">OPERATING SYSTEM</span></h2>
             <p className="max-w-2xl mx-auto text-slate-400 font-medium">SaquMart is more than an app. It's a high-performance environment designed for absolute operational dominance.</p>
          </div>

          <div className="relative h-[800px] w-full max-w-6xl mx-auto bg-slate-900/40 rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-3xl group">
             {/* OS Desktop Background */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center" />
             <div className="absolute inset-0 cyber-grid opacity-20" />

             {/* OS Top Bar */}
             <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-6">
                   <Sparkles className="h-4 w-4 text-primary" />
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">SaquOS Enterprise v4.0.0</span>
                </div>
                <div className="flex items-center gap-4 text-white/40 font-mono text-[10px]">
                   <span>CPU: 12%</span>
                   <span>RAM: 4.2GB</span>
                   <span>14:27:52</span>
                </div>
             </div>

             {/* Draggable Windows Simulation */}
             <motion.div 
               drag
               dragMomentum={false}
               initial={{ x: 100, y: 100 }}
               className="absolute z-20 w-80 shadow-2xl"
             >
                <div className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden">
                   <div className="h-10 bg-white/5 px-4 flex items-center justify-between cursor-move">
                      <div className="flex items-center gap-2">
                         <Activity className="h-3 w-3 text-emerald-500" />
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">System Telemetry</span>
                      </div>
                      <div className="flex gap-1.5">
                         <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                         <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                         <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                      </div>
                   </div>
                   <div className="p-6 space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black text-white/40 uppercase">Sync Status</span>
                         <span className="text-[10px] font-black text-emerald-500">OPTIMAL</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div animate={{ width: ['20%', '80%', '40%', '60%'] }} transition={{ duration: 5, repeat: Infinity }} className="h-full bg-emerald-500" />
                      </div>
                   </div>
                </div>
             </motion.div>

             <motion.div 
               drag
               dragMomentum={false}
               initial={{ x: 600, y: 200 }}
               className="absolute z-10 w-96 shadow-2xl"
             >
                <LandingTerminal />
             </motion.div>

             <motion.div 
               drag
               dragMomentum={false}
               initial={{ x: 200, y: 400 }}
               className="absolute z-30 w-72 shadow-2xl"
             >
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-8 text-center space-y-4">
                   <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20">
                      <BarChart3 className="h-8 w-8 text-white" />
                   </div>
                   <h4 className="text-lg font-black text-white leading-tight">Predictive Analytics Ready</h4>
                   <p className="text-[10px] text-white/60 font-medium leading-relaxed">AI engine has completed 1.2M simulations for your next sales cycle.</p>
                   <button className="w-full h-10 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-colors">VIEW REPORT</button>
                </div>
             </motion.div>

             {/* OS Taskbar */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-3xl z-50">
                {[TerminalIcon, BarChart3, Settings, Activity].map((Icon, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10, scale: 1.2 }}
                    className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-primary transition-colors text-white"
                  >
                     <Icon className="h-6 w-6" />
                  </motion.div>
                ))}
             </div>
          </div>
       </div>
    </section>
  );
}
