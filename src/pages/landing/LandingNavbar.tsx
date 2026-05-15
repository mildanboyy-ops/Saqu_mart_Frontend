import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', path: '#features' },
    { label: 'AI Engine', path: '#ai' },
    { label: 'Solutions', path: '#solutions' },
    { label: 'Pricing', path: '#pricing' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 px-6 py-4",
        scrolled ? "bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">SAQU<span className="text-primary">MART</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.path}
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-tight"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
           <Button 
            variant="ghost" 
            className="text-white font-black hover:bg-white/5 rounded-xl px-6"
            onClick={() => navigate('/login')}
           >
            LOGIN
           </Button>
           <Button 
            className="luxury-button rounded-xl px-8"
            onClick={() => navigate('/register')}
           >
            GET STARTED <ArrowRight className="ml-2 h-4 w-4" />
           </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-black text-white"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-6 flex flex-col gap-4">
                 <Button className="w-full h-14 rounded-2xl luxury-button" onClick={() => navigate('/login')}>GET STARTED</Button>
                 <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-white" onClick={() => navigate('/login')}>LOGIN</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
