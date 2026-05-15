import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

export default function DynamicIsland() {
  const { dynamicIsland, hideNotification } = useUIStore();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <AnimatePresence>
        {dynamicIsland.isOpen && (
          <motion.div
            initial={{ width: 120, height: 35, borderRadius: 30, opacity: 0, y: -20 }}
            animate={{ 
              width: dynamicIsland.description ? 320 : 200, 
              height: dynamicIsland.description ? 80 : 45, 
              borderRadius: 24, 
              opacity: 1, 
              y: 0 
            }}
            exit={{ width: 100, height: 20, borderRadius: 30, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-slate-900 text-white shadow-2xl flex items-center px-4 overflow-hidden pointer-events-auto cursor-pointer border border-white/10"
            onClick={hideNotification}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="shrink-0 bg-white/10 p-1.5 rounded-full">
                {icons[dynamicIsland.type]}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm tracking-tight truncate">{dynamicIsland.title}</span>
                {dynamicIsland.description && (
                  <span className="text-[10px] text-slate-400 font-medium leading-tight">{dynamicIsland.description}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
