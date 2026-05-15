import { motion, AnimatePresence } from 'framer-motion';
import LandingNavbar from './LandingNavbar';
import HeroSection from './HeroSection';
import DashboardPreview from './DashboardPreview';
import FeatureGrid from './FeatureGrid';
import StatsCounter from './StatsCounter';
import LandingFooter from './LandingFooter';
import RealtimeActivityWall from './RealtimeActivityWall';
import FeatureComparison from './FeatureComparison';
import OperatingSystemUI from './OperatingSystemUI';
import PremiumCursor from './PremiumCursor';
import { Card } from "@/components/ui/card";
import { BrainCircuit, Sparkles, Quote, Calendar, Moon, Zap, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#020617] text-white selection:bg-primary/30 scroll-smooth relative">
      <PremiumCursor />
      
      {/* Aurora Background System */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
          >
             <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-6"
             >
                <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                   <Zap className="h-10 w-10 text-white fill-white" />
                </div>
                <div className="flex flex-col items-center">
                   <h1 className="text-4xl font-black tracking-tighter">SAQU<span className="text-primary">MART</span></h1>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mt-2">Elite Retail Engine</p>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LandingNavbar />
      
      <main className="relative z-10">
        <HeroSection />
        
        <StatsCounter />
        
        <DashboardPreview />

        {/* AI Features Showcase Section */}
        <section className="py-32 relative" id="ai">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <div className="text-primary font-black uppercase tracking-[0.4em] text-xs">Deep Intelligence</div>
                 <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
                  AI-POWERED <br /> <span className="text-gradient-primary">DECISION MAKING</span>
                 </h2>
                 <p className="text-slate-400 font-medium text-lg leading-relaxed">
                  Our neural engine analyzes millions of data points across your retail network to provide actionable business intelligence.
                 </p>
                 <div className="space-y-4">
                    {[
                      'Predictive Sales Forecasting',
                      'Automated Fraud Detection',
                      'Smart Inventory Optimization',
                      'Customer Behavior Analytics'
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group">
                         <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="h-3 w-3 text-primary" />
                         </div>
                         <span className="font-bold text-slate-200">{item}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="relative">
                 <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                 <Card className="glass-panel rounded-[4rem] p-12 border-none shadow-2xl relative z-10 overflow-hidden group">
                    <div className="absolute inset-0 cyber-grid opacity-20" />
                    <BrainCircuit className="h-64 w-64 text-primary opacity-10 absolute -bottom-10 -right-10 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative space-y-6">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                             <Sparkles className="h-6 w-6 text-primary" />
                          </div>
                          <h4 className="text-xl font-black uppercase tracking-widest">Neural Engine v4</h4>
                       </div>
                       <div className="space-y-4">
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} whileInView={{ width: '85%' }} className="h-full bg-primary" />
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} whileInView={{ width: '92%' }} className="h-full bg-blue-500" />
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} whileInView={{ width: '78%' }} className="h-full bg-violet-500" />
                          </div>
                       </div>
                       <div className="pt-8">
                          <p className="text-xs font-mono text-primary animate-pulse">ANALYZING_MARKET_TRENDS...</p>
                          <p className="text-2xl font-black mt-2">"Sales predicted to rise 24% next weekend."</p>
                       </div>
                    </div>
                 </Card>
              </div>
            </div>
          </div>
        </section>

        <OperatingSystemUI />

        <FeatureGrid />

        <RealtimeActivityWall />

        <FeatureComparison />

        {/* Islamic Premium Section */}
        <section className="py-32 relative bg-emerald-950/20">
          <div className="container mx-auto px-6">
             <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="flex justify-center">
                   <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/20">
                      <Quote className="h-10 w-10 text-primary" />
                   </div>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                  BERNIAGA DENGAN <span className="text-gradient-primary">BERKAH</span>
                </h2>
                <p className="text-2xl font-medium italic text-slate-300 font-serif">
                  "Jujur dalam berniaga adalah kunci keberkahan. <br /> SaquMart hadir untuk mendukung bisnis yang amanah."
                </p>
                <div className="grid md:grid-cols-3 gap-8 pt-12">
                   {[
                     { icon: Calendar, label: 'Islamic Calendar', val: 'Zulqaidah 1447' },
                     { icon: Moon, label: 'Next Prayer', val: 'Maghrib 18:05' },
                     { icon: Globe, label: 'Global Availability', val: '24/7 Sync' },
                   ].map((item, i) => (
                     <div key={i} className="glass-panel p-8 rounded-3xl border-none">
                        <item.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{item.label}</h4>
                        <p className="text-xl font-black mt-2">{item.val}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
           <div className="container mx-auto px-6">
              <div className="glass-panel p-20 rounded-[4rem] border-none shadow-2xl relative overflow-hidden bg-gradient-to-br from-primary/20 to-blue-600/20 text-center space-y-8 group">
                 <div className="absolute inset-0 cyber-grid opacity-10" />
                 <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none relative z-10">
                    READY TO UPGRADE <br /> YOUR BUSINESS?
                 </h2>
                 <p className="text-xl text-slate-300 font-medium relative z-10">Join thousands of elite retailers using SaquMart.</p>
                 <div className="flex justify-center pt-8 relative z-10">
                    <button className="h-20 px-12 rounded-3xl luxury-button text-2xl active:scale-95 transition-all">
                       START YOUR FREE TRIAL
                    </button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
