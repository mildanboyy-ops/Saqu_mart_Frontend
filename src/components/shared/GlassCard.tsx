import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'primary' | 'gold';
  glow?: boolean;
  hover?: boolean;
}

export default function GlassCard({ children, className, variant = 'light', glow = false, hover = true }: GlassCardProps) {
  const variants = {
    light: 'bg-white/60 dark:bg-slate-900/60 border-white/30 dark:border-white/10',
    dark: 'bg-slate-900/80 border-white/10 text-white',
    primary: 'bg-emerald-500/10 border-emerald-500/20',
    gold: 'bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className={cn(
      'backdrop-blur-2xl rounded-3xl border shadow-xl transition-all duration-500',
      variants[variant],
      glow && 'shadow-[0_0_30px_rgba(16,185,129,0.1)]',
      hover && 'hover:-translate-y-1 hover:shadow-2xl hover:border-primary/30',
      className
    )}>
      {children}
    </div>
  );
}
