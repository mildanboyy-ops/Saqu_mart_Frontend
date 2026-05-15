import { motion } from 'framer-motion';
import { BrainCircuit, TrendingUp, AlertTriangle, Package, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIInsightCardProps {
  type: 'recommendation' | 'prediction' | 'fraud' | 'pricing' | 'restock' | 'forecast';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const typeConfig = {
  recommendation: { icon: BrainCircuit, color: 'emerald', label: 'AI RECOMMENDATION' },
  prediction: { icon: TrendingUp, color: 'blue', label: 'AI PREDICTION' },
  fraud: { icon: AlertTriangle, color: 'red', label: 'FRAUD ALERT' },
  pricing: { icon: DollarSign, color: 'amber', label: 'SMART PRICING' },
  restock: { icon: Package, color: 'indigo', label: 'RESTOCK INTELLIGENCE' },
  forecast: { icon: TrendingUp, color: 'cyan', label: 'AI FORECAST' },
};

const severityColors = {
  low: 'border-slate-200 dark:border-slate-700',
  medium: 'border-amber-300/50',
  high: 'border-orange-400/50',
  critical: 'border-red-500/50 bg-red-500/5',
};

export default function AIInsightCard({ type, title, description, confidence, severity, actionLabel, onAction, onDismiss }: AIInsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={cn(
        'relative p-5 rounded-2xl border-2 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg group',
        severityColors[severity]
      )}
    >
      {onDismiss && (
        <button onClick={onDismiss} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
      
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
          `bg-${config.color}-500/10`
        )}>
          <Icon className={cn('h-6 w-6', `text-${config.color}-500`)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn(
              'text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full',
              `bg-${config.color}-500/10 text-${config.color}-600`
            )}>
              {config.label}
            </span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              {Math.round(confidence * 100)}% confidence
            </span>
          </div>
          
          <h4 className="font-black text-sm tracking-tight mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          
          {actionLabel && (
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-3 h-8 rounded-xl text-[11px] font-bold border-2 hover:bg-primary/5 hover:border-primary/30 hover:text-primary"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
      
      {/* Confidence Bar */}
      <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence * 100}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className={cn('h-full rounded-full', `bg-${config.color}-500`)}
        />
      </div>
    </motion.div>
  );
}
