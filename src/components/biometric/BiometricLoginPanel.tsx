import { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, Eye, Hand, Mic, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BiometricLoginPanelProps {
  onSuccess: () => void;
}

type BiometricMethod = 'face' | 'retina' | 'palm' | 'voice';

export default function BiometricLoginPanel({ onSuccess }: BiometricLoginPanelProps) {
  const [activeMethod, setActiveMethod] = useState<BiometricMethod | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  const methods = [
    { id: 'face' as BiometricMethod, label: 'Face ID', icon: Scan, color: 'emerald' },
    { id: 'retina' as BiometricMethod, label: 'Retina', icon: Eye, color: 'cyan' },
    { id: 'palm' as BiometricMethod, label: 'Palm', icon: Hand, color: 'amber' },
    { id: 'voice' as BiometricMethod, label: 'Voice', icon: Mic, color: 'indigo' },
  ];

  const startScan = (method: BiometricMethod) => {
    setActiveMethod(method);
    setScanStatus('scanning');
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus('success');
          setTimeout(() => onSuccess(), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 justify-center mb-4">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Biometric Authentication</span>
      </div>

      {/* Method Selector */}
      <div className="grid grid-cols-4 gap-2">
        {methods.map(m => (
          <button key={m.id} onClick={() => startScan(m.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all hover:scale-105',
              activeMethod === m.id ? 'border-primary bg-primary/10 shadow-lg' : 'border-muted hover:border-primary/30'
            )}>
            <m.icon className={cn('h-6 w-6', activeMethod === m.id ? 'text-primary' : 'text-muted-foreground')} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Scan Animation */}
      {scanStatus !== 'idle' && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto w-48 h-48 rounded-full border-4 border-primary/20 flex items-center justify-center overflow-hidden bg-slate-900"
        >
          {/* Scanning Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="90" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="4" />
            <motion.circle cx="96" cy="96" r="90" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={565} animate={{ strokeDashoffset: 565 - (scanProgress / 100) * 565 }}
              transition={{ duration: 0.1 }} />
          </svg>

          {/* Scan Line */}
          {scanStatus === 'scanning' && (
            <motion.div animate={{ y: [-80, 80, -80] }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          )}

          {/* Center Content */}
          <div className="relative z-10 text-center">
            {scanStatus === 'scanning' && (
              <div>
                <span className="text-3xl font-black text-white">{scanProgress}%</span>
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Scanning...</p>
              </div>
            )}
            {scanStatus === 'success' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                <div className="text-4xl mb-1">✅</div>
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Verified</p>
              </motion.div>
            )}
          </div>

          {/* Grid overlay */}
          {activeMethod === 'face' && scanStatus === 'scanning' && (
            <div className="absolute inset-4 border border-emerald-500/30 rounded-full">
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20">
                {[...Array(9)].map((_, i) => <div key={i} className="border border-emerald-500/40" />)}
              </div>
            </div>
          )}
          {activeMethod === 'retina' && scanStatus === 'scanning' && (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              className="absolute inset-8 border-2 border-dashed border-cyan-500/40 rounded-full" />
          )}
        </motion.div>
      )}
    </div>
  );
}
