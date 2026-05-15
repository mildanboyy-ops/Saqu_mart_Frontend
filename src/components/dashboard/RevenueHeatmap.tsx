import { useMemo } from 'react';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { useTransactionStore } from '@/store/useTransactionStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function RevenueHeatmap() {
  const transactions = useTransactionStore(state => state.transactions);

  const heatmapData = useMemo(() => {
    const grid = Array(7).fill(0).map(() => Array(24).fill(0));
    
    transactions.forEach(tx => {
      const date = new Date(tx.timestamp);
      const day = date.getDay();
      const hour = date.getHours();
      
      if (!isNaN(day) && !isNaN(hour) && grid[day] && grid[day][hour] !== undefined) {
        grid[day][hour] += tx.total || 0;
      }
    });

    return grid;
  }, [transactions]);

  const days = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

  const getIntensity = (val: number) => {
    if (val === 0) return 'bg-slate-200 dark:bg-white/5';
    if (val < 500000) return 'bg-primary/20';
    if (val < 1000000) return 'bg-primary/40 shadow-[0_0_8px_rgba(var(--primary),0.2)]';
    if (val < 5000000) return 'bg-primary/70 shadow-[0_0_12px_rgba(var(--primary),0.4)]';
    return 'bg-primary shadow-[0_0_20px_rgba(var(--primary),0.6)] border-white/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
         <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(v => (
              <div key={v} className={cn("w-3 h-3 rounded-sm", v === 0 ? 'bg-slate-200 dark:bg-white/5' : `bg-primary`)} style={{ opacity: v === 0 ? 1 : v * 0.2 }} />
            ))}
         </div>
         <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Global Density Scale</span>
      </div>
      
      <div className="flex gap-4">
        <div className="flex flex-col justify-between py-1 shrink-0">
           {days.map(d => <span key={d} className="text-[8px] font-black text-muted-foreground/60 h-3 leading-none">{d}</span>)}
        </div>
        
        <TooltipProvider delayDuration={0}>
          <div 
            className="flex-1 grid gap-1.5"
            style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
          >
            {heatmapData.map((day, dIdx) => (
              day.map((val, hIdx) => (
                <Tooltip key={`${dIdx}-${hIdx}`}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (dIdx * 24 + hIdx) * 0.001 }}
                      className={cn(
                        "h-3.5 rounded-sm cursor-crosshair transition-all hover:scale-150 hover:z-50 border border-transparent",
                        getIntensity(val)
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-slate-900 border-none text-white rounded-xl px-3 py-1.5 shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5">{days[dIdx]} @ {hIdx}:00</p>
                    <p className="text-sm font-black">Rp {val.toLocaleString()}</p>
                  </TooltipContent>
                </Tooltip>
              ))
            ))}
          </div>
        </TooltipProvider>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-white/5">
         <span className="text-[8px] font-bold text-muted-foreground uppercase">00:00</span>
         <span className="text-[8px] font-bold text-muted-foreground uppercase">Tactical Timeline</span>
         <span className="text-[8px] font-bold text-muted-foreground uppercase">23:59</span>
      </div>
    </div>
  );
}



