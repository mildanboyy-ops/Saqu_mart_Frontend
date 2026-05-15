import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, BrainCircuit, Shield, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/store/useNotificationStore';
import { cn } from '@/lib/utils';

const typeIcons = {
  info: Bell,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: X,
  ai: BrainCircuit,
  security: Shield,
  islamic: Sparkles,
};

const typeColors = {
  info: 'text-blue-500 bg-blue-500/10',
  success: 'text-emerald-500 bg-emerald-500/10',
  warning: 'text-amber-500 bg-amber-500/10',
  error: 'text-red-500 bg-red-500/10',
  ai: 'text-emerald-400 bg-emerald-500/10',
  security: 'text-indigo-500 bg-indigo-500/10',
  islamic: 'text-amber-500 bg-amber-500/10',
};

export default function NotificationCenter() {
  const { notifications, isOpen, togglePanel, markAsRead, markAllRead, clearAll } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Trigger Button */}
      <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9" onClick={togglePanel}>
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center border-2 border-card"
          >
            {unreadCount}
          </motion.span>
        )}
      </Button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80]"
              onClick={togglePanel}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-full mt-2 w-[400px] max-h-[70vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[81] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm tracking-tight">Notifications</h3>
                  <p className="text-[10px] text-muted-foreground font-bold">{unreadCount} belum dibaca</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold" onClick={markAllRead}>Baca Semua</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-destructive" onClick={clearAll}>Hapus</Button>
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto max-h-[50vh]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">Tidak ada notifikasi.</div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = typeIcons[notif.type];
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          'flex items-start gap-3 p-4 border-b hover:bg-muted/30 transition-colors cursor-pointer',
                          !notif.read && 'bg-primary/5'
                        )}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <div className={cn('p-2 rounded-xl shrink-0', typeColors[notif.type])}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs">{notif.title}</h4>
                            {!notif.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                          <span className="text-[9px] text-muted-foreground/60 mt-1 block font-mono">
                            {new Date(notif.timestamp).toLocaleTimeString('id-ID')}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
