import { motion } from 'framer-motion';
import { Scan, Sparkles, Activity } from 'lucide-react';

export default function FaceScanFrame() {
  return (
    <div className="relative w-72 h-80">
       {/* Outer Frame */}
       <div className="absolute inset-0 border-2 border-primary/20 rounded-[3rem] shadow-[0_0_50px_rgba(16,185,129,0.1)]" />
       
       {/* Animated Corners */}
       <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-[3rem]" />
       <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-[3rem]" />
       <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-[3rem]" />
       <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-[3rem]" />

       {/* Face Tracking Simulation */}
       <div className="absolute inset-8 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-full h-full bg-primary/10 rounded-[2rem] border-2 border-primary/30 flex items-center justify-center relative overflow-hidden"
          >
             <Scan className="h-24 w-24 text-primary opacity-40" />
             
             {/* Scan Lines */}
             <motion.div 
               animate={{ y: [-150, 150] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
               className="absolute w-full h-1 bg-primary shadow-[0_0_20px_#10b981] z-20"
             />
          </motion.div>
       </div>

       {/* AI Data Points */}
       <div className="absolute -left-12 top-1/4 space-y-4">
          <div className="bg-white/5 backdrop-blur-xl p-2 rounded-xl border border-white/10 flex flex-col items-center">
             <Activity className="h-4 w-4 text-primary mb-1" />
             <span className="text-[8px] font-black text-white/50">HEART_RATE</span>
             <span className="text-[10px] font-black text-white">72 BPM</span>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-2 rounded-xl border border-white/10 flex flex-col items-center">
             <Sparkles className="h-4 w-4 text-blue-400 mb-1" />
             <span className="text-[8px] font-black text-white/50">MOOD_SCORE</span>
             <span className="text-[10px] font-black text-white">CALM</span>
          </div>
       </div>

       {/* Bottom Telemetry */}
       <div className="absolute -bottom-16 left-0 right-0 text-center">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.5em] animate-pulse">Analyzing_Facial_Geometry...</p>
          <div className="flex justify-center gap-1 mt-2">
             {[...Array(20)].map((_, i) => (
               <motion.div 
                key={i}
                animate={{ height: [2, Math.random() * 8 + 4, 2] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                className="w-[2px] bg-primary/50"
               />
             ))}
          </div>
       </div>
    </div>
  );
}
