import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Store, Shield, Fingerprint, ScanFace, QrCode, Globe, Zap, Cpu, Lock, 
  AlertCircle, Sparkles, Quote, Calendar, Moon, Mail, Eye, EyeOff,
  Activity, Cloud, Clock, CheckCircle2, Terminal as TerminalIcon,
  ShieldCheck, Share2, History, MapPin, ChevronLeft, ArrowRight,
  User, UserCheck, X
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import GlobalLoading from "@/components/GlobalLoading"
import { cn } from "@/lib/utils"
import LoginTerminal from "./login/LoginTerminal"
import FaceScanFrame from "./login/FaceScanFrame"

export default function Login() {
  const navigate = useNavigate();
  const { login, loginBiometric, user } = useAuthStore();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [scanType, setScanType] = useState<'Retina' | 'Palm' | 'Face' | 'Fingerprint' | null>(null);
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'qr' | 'biometric'>('credentials');
  const [isBooting, setIsBooting] = useState(true);
  const [showSessionReturn, setShowSessionReturn] = useState(false);

  // System Boot Sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
      // Check for existing session (mocked for demo)
      if (localStorage.getItem('last_user')) setShowSessionReturn(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard Navigation (66)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleBack();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBack = () => {
    // Smart Back Animation (52)
    toast.info("Navigating back to entry point...");
    setTimeout(() => navigate("/"), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login({ username, password });
      localStorage.setItem('last_user', username);
      toast.success(`Authentication Success. Establishing Neural Bridge...`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Access Denied. Identity signature mismatch.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  const simulateBiometric = (type: any) => {
    setScanType(type);
    setIsBiometricScanning(true);
    setTimeout(async () => {
      setIsBiometricScanning(false);
      toast.success(`${type} Authentication Successful.`);
      navigate("/dashboard");
    }, 4000);
  };

  return (
    <div className="min-h-screen flex bg-[#020617] relative overflow-hidden selection:bg-primary/30">
      <GlobalLoading loading={isLoggingIn} />

      {/* Smart Back Button (51, 54) */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.1, x: 5 }}
        onClick={handleBack}
        className="fixed top-8 left-8 z-[100] group"
      >
         <div className="glass-panel p-4 rounded-2xl border-none flex items-center gap-3 bg-white/5 backdrop-blur-2xl shadow-2xl group-hover:bg-primary group-hover:shadow-primary/20 transition-all">
            <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            <div className="flex flex-col items-start pr-4">
               <span className="text-[8px] font-black uppercase text-white/40 group-hover:text-white/70 tracking-widest">Navigation</span>
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Return Home</span>
            </div>
         </div>
      </motion.button>

      {/* System Boot Overlay */}
      <AnimatePresence>
         {isBooting && (
           <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#020617] flex items-center justify-center"
           >
              <div className="flex flex-col items-center gap-12 w-full max-w-lg px-12">
                 <div className="relative w-32 h-32">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute -inset-4 border-4 border-blue-500/10 rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Zap className="h-12 w-12 text-primary animate-pulse" />
                    </div>
                 </div>
                 <div className="w-full space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-white/30 uppercase">
                       <span>Initializing AI Core...</span>
                       <span>85%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2 }} className="h-full bg-primary shadow-[0_0_15px_#10b981]" />
                    </div>
                 </div>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row w-full">
        
        {/* Left Section: Live Dashboard Preview (69) */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-20 overflow-hidden">
           <div className="absolute inset-0 cyber-grid opacity-10" />
           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full" />

           <div className="relative z-10 space-y-12 w-full max-w-2xl">
              <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                       <Store className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">SAQU<span className="text-primary">MART</span></h2>
                 </div>
                 <h1 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">
                    ENTERPRISE <br /> <span className="text-gradient-primary">INTELLIGENCE</span>
                 </h1>
              </div>

              {/* Mini Dashboard Mockup */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-panel p-8 rounded-[3rem] border-none shadow-2xl bg-white/5 backdrop-blur-3xl space-y-6"
              >
                 <div className="flex justify-between items-center border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white/10 rounded-xl" />
                       <div className="w-32 h-2 bg-white/10 rounded-full" />
                    </div>
                    <div className="w-20 h-6 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center justify-center">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+24.5%</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-white/5 rounded-2xl p-4 flex flex-col justify-end gap-2">
                       <div className="w-12 h-1 bg-primary rounded-full" />
                       <div className="w-20 h-4 bg-white/20 rounded-full" />
                    </div>
                    <div className="h-32 bg-white/5 rounded-2xl p-4 flex flex-col justify-end gap-2">
                       <div className="w-12 h-1 bg-blue-500 rounded-full" />
                       <div className="w-20 h-4 bg-white/20 rounded-full" />
                    </div>
                 </div>
                 <div className="pt-4">
                    <LoginTerminal />
                 </div>
              </motion.div>
           </div>
        </div>

        {/* Right Section: Login Form (69) */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 relative">
           <div className="absolute inset-0 cyber-grid opacity-10 lg:hidden" />
           
           <div className="w-full max-w-lg space-y-8 relative z-10">
              
              {/* Session Return Card (61) */}
              <AnimatePresence>
                 {showSessionReturn && (
                   <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-panel p-8 rounded-[3rem] border-none bg-primary/10 border border-primary/20 mb-8 flex items-center justify-between group"
                   >
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 rounded-full p-1 bg-primary relative">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-slate-900">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem('last_user')}`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Identity Recognized</span>
                            <span className="text-xl font-black text-white">Continue as {localStorage.getItem('last_user')}?</span>
                         </div>
                      </div>
                      <div className="flex flex-col gap-2">
                         <Button 
                           onClick={() => navigate('/dashboard')}
                           className="w-12 h-12 rounded-2xl luxury-button flex items-center justify-center p-0"
                         >
                            <ArrowRight className="h-6 w-6" />
                         </Button>
                         <button 
                           onClick={() => {
                             localStorage.removeItem('last_user');
                             setShowSessionReturn(false);
                           }}
                           className="text-[10px] font-bold text-white/30 hover:text-rose-500 transition-colors uppercase tracking-widest"
                         >
                            Switch
                         </button>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>

              <div className="text-center lg:text-left space-y-4">
                 <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
                    SECURE <br /> <span className="text-gradient-primary">AUTHENTICATION</span>
                 </h2>
                 <p className="text-slate-400 font-medium">Identify yourself to enter the SaquMart Ecosystem.</p>
              </div>

              <Card className="glass-panel !rounded-[4rem] border-none shadow-2xl overflow-hidden bg-white/5 backdrop-blur-3xl relative p-12">
                 <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                 
                 <div className="space-y-8 relative z-10">
                    <div className="flex p-1.5 bg-white/5 rounded-2xl">
                       {['credentials', 'qr', 'biometric'].map((m) => (
                         <button
                           key={m}
                           onClick={() => setLoginMethod(m as any)}
                           className={cn(
                             "flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                             loginMethod === m ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/30 hover:text-white"
                           )}
                         >
                           {m}
                         </button>
                       ))}
                    </div>

                    <AnimatePresence mode="wait">
                       {loginMethod === 'credentials' && (
                         <motion.form 
                           key="creds"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           onSubmit={handleLogin} 
                           className="space-y-6"
                         >
                            <div className="space-y-3">
                               <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Neural Identity</Label>
                               <div className="relative group">
                                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 group-focus-within:text-primary transition-colors" />
                                  <Input 
                                     type="text" 
                                     placeholder="USERNAME" 
                                     value={username}
                                     onChange={(e) => setUsername(e.target.value)}
                                     className="h-16 pl-14 bg-white/5 border-white/10 rounded-2xl text-white font-bold tracking-widest focus:ring-primary/20 transition-all"
                                  />
                               </div>
                            </div>

                            <div className="space-y-3">
                               <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Secure Cipher</Label>
                               <div className="relative group">
                                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/10 group-focus-within:text-primary transition-colors" />
                                  <Input 
                                     type={showPassword ? "text" : "password"} 
                                     placeholder="••••••••" 
                                     value={password}
                                     onChange={(e) => setPassword(e.target.value)}
                                     className="h-16 pl-14 pr-14 bg-white/5 border-white/10 rounded-2xl text-white tracking-widest focus:ring-primary/20 transition-all"
                                  />
                                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 hover:text-white">
                                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                  </button>
                               </div>
                            </div>

                            <Button className="w-full h-18 luxury-button rounded-2xl text-xl font-black group" type="submit">
                               AUTHENTICATE <Zap className="ml-3 h-6 w-6 group-hover:scale-125 transition-transform" />
                            </Button>
                         </motion.form>
                       )}

                       {loginMethod === 'qr' && (
                         <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-6 gap-6">
                            <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl relative group overflow-hidden">
                               <QrCode className="h-44 w-44 text-slate-900" />
                               <motion.div animate={{ y: [0, 180, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute top-8 left-8 right-8 h-1 bg-primary shadow-[0_0_20px_#10b981]" />
                            </div>
                            <p className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">Scan via SaquMobile</p>
                         </motion.div>
                       )}

                       {loginMethod === 'biometric' && (
                         <motion.div key="bio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4">
                            {[
                              { id: 'Face', icon: ScanFace, label: 'Face ID' },
                              { id: 'Fingerprint', icon: Fingerprint, label: 'Touch ID' },
                              { id: 'Retina', icon: Eye, label: 'Retina Scan' },
                              { id: 'Palm', icon: Globe, label: 'Palm Print' }
                            ].map(b => (
                              <button key={b.id} onClick={() => simulateBiometric(b.id)} className="h-28 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-primary/10 hover:border-primary/40 transition-all group">
                                 <b.icon className="h-7 w-7 text-white/20 group-hover:text-primary transition-colors" />
                                 <span className="text-[9px] font-black text-white/20 uppercase tracking-widest group-hover:text-white">{b.label}</span>
                              </button>
                            ))}
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              </Card>

              <div className="flex justify-center">
                 <Link to="/register" className="text-[10px] font-black text-white/20 hover:text-primary uppercase tracking-[0.4em] transition-colors">Request Access Credentials</Link>
              </div>
           </div>
        </div>
      </div>

      {/* Biometric Scanning Overlay */}
      <AnimatePresence>
        {isBiometricScanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center">
             <div className="relative flex flex-col items-center gap-12">
                <FaceScanFrame />
                <div className="text-center space-y-4">
                   <h3 className="text-3xl font-black text-white tracking-[0.5em] uppercase">Verification Active</h3>
                   <p className="text-primary font-mono text-xs animate-pulse uppercase tracking-widest">Protocol: Neural_Bio_Sync_v4</p>
                </div>
                <Button variant="outline" onClick={() => setIsBiometricScanning(false)} className="rounded-2xl border-white/10 text-white/50 hover:bg-white/10">CANCEL SCAN</Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
