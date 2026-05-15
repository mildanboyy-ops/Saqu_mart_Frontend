import { motion } from 'framer-motion';
import { Activity, ShoppingCart, Package, Users, Zap } from 'lucide-react';
import { useRealtimeStore } from '@/store/useRealtimeStore';
import { cn } from '@/lib/utils';

const eventIcons = {
  transaction: ShoppingCart,
  stock: Package,
  member: Users,
  alert: Zap,
  sync: Activity,
  device: Activity,
};

const eventColors = {
  transaction: 'text-emerald-500 bg-emerald-500/10',
  stock: 'text-amber-500 bg-amber-500/10',
  member: 'text-blue-500 bg-blue-500/10',
  alert: 'text-red-500 bg-red-500/10',
  sync: 'text-indigo-500 bg-indigo-500/10',
  device: 'text-slate-500 bg-slate-500/10',
};

export default function LiveActivityFeed({ maxItems = 8 }: { maxItems?: number }) {
  const { events } = useRealtimeStore();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Activity className="h-4 w-4 text-primary" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Live Activity</span>
      </div>
      
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {events.slice(0, maxItems).map((event, idx) => {
          const Icon = eventIcons[event.type] || Activity;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors group"
            >
              <div className={cn('p-1.5 rounded-lg shrink-0', eventColors[event.type])}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium truncate">{event.message}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-muted-foreground/60 font-mono">
                    {new Date(event.timestamp).toLocaleTimeString('id-ID')}
                  </span>
                  {event.branch && (
                    <span className="text-[8px] bg-muted px-1.5 py-0.5 rounded font-bold">{event.branch}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
