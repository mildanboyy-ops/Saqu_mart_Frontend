import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export function PageLoader() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px] rounded-xl" />
          <Skeleton className="h-4 w-[150px] rounded-lg" />
        </div>
        <Skeleton className="h-12 w-[180px] rounded-2xl" />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-[2rem]" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="lg:col-span-2 h-[450px] rounded-[2rem]" />
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-[2rem]" />
          <Skeleton className="h-48 rounded-[2rem]" />
        </div>
      </div>
    </div>
  );
}

export function AIThinkingLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-4 border-emerald-500/20 rounded-full border-t-emerald-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-emerald-500 rounded-full" />
          </motion.div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-black tracking-tighter">AI sedang berpikir...</h3>
        <p className="text-sm text-muted-foreground font-medium">Menganalisis data intelijen tokomu</p>
      </div>
    </div>
  );
}
