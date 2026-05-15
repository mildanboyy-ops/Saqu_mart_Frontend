
import { ShoppingCart, Mail, Globe, MapPin, Phone, Share2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Glow */}
      <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">SAQU<span className="text-primary">MART</span></span>
            </Link>
            <p className="max-w-xs text-slate-400 font-medium leading-relaxed">
              Leading the smart retail revolution with AI-powered ecosystems and global enterprise solutions.
            </p>
            <div className="flex gap-4">
               {[Globe, Share2, ExternalLink].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all">
                    <Icon className="h-5 w-5" />
                 </a>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Platform</h4>
            <ul className="space-y-4">
               {['Features', 'AI Engine', 'Dashboard', 'Security'].map(item => (
                 <li key={item}><a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">{item}</a></li>
               ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Resources</h4>
            <ul className="space-y-4">
               {['Documentation', 'API Reference', 'Community', 'Academy'].map(item => (
                 <li key={item}><a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">{item}</a></li>
               ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Contact</h4>
            <ul className="space-y-4">
               <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <Mail className="h-4 w-4 text-primary" /> contact@saqumart.com
               </li>
               <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <MapPin className="h-4 w-4 text-primary" /> Jakarta, Indonesia
               </li>
               <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <Phone className="h-4 w-4 text-primary" /> +62 21 555 0123
               </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            © 2026 SAQU MART ENTERPRISE. ALL RIGHTS RESERVED.
           </p>
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">SYSTEM_STABLE</span>
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">v4.0.0-PROD</p>
           </div>
        </div>
      </div>
    </footer>
  );
}
