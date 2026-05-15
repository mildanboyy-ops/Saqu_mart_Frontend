import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#020617]">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
         <div className="absolute inset-0 cyber-grid opacity-10" />
         
         {/* Floating Aurora Particles */}
         {[...Array(6)].map((_, i) => (
           <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: i * 2 }}
            className="absolute blur-[120px] rounded-full"
            style={{ 
              width: Math.random() * 400 + 200, 
              height: Math.random() * 400 + 200,
              backgroundColor: i % 2 === 0 ? '#10b981' : '#3b82f6',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
           />
         ))}
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex justify-center">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="bg-primary/10 backdrop-blur-xl border border-primary/20 px-6 py-2 rounded-full flex items-center gap-3 cursor-pointer group"
             >
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Enterprise Elite Edition is Now Live</span>
                <ChevronRight className="h-3 w-3 text-primary group-hover:translate-x-1 transition-transform" />
             </motion.div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
            SMART RETAIL <br />
            <span className="text-gradient-primary">ECOSYSTEM</span> BY AI
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
            Revolutionizing the future of commerce with Realtime POS, <br className="hidden md:block" /> 
            AI Analytics, and Blockchain Security in one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              onClick={() => navigate('/login')}
              className="h-16 px-10 rounded-2xl luxury-button text-lg group"
            >
              GET STARTED <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 text-lg font-black gap-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                 <Play className="h-4 w-4 fill-white" />
              </div>
              LIVE DEMO
            </Button>
          </div>

          <div className="pt-12 flex justify-center gap-12 opacity-40">
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">99.9%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">UPTIME</span>
             </div>
             <div className="w-[1px] h-12 bg-white/10" />
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">12M+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">TRANS_SEC</span>
             </div>
             <div className="w-[1px] h-12 bg-white/10" />
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">256B</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">ENCRYPTION</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-video bg-primary/20 blur-[150px] rounded-full" />
    </section>
  );
}
