import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BusinessHealthScoreProps {
  score: number;
  className?: string;
}

export default function BusinessHealthScore({ score, className }: BusinessHealthScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Attention';
  const textColor = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
          <motion.circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeInOut' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-3xl font-black tracking-tighter', textColor)}>{score}</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Health</span>
        </div>
      </div>
      <div className={cn('mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider', textColor)}>{label}</div>
    </div>
  );
}
