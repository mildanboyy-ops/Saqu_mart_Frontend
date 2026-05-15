import { motion, AnimatePresence } from 'framer-motion';
import { useIslamicStore } from '@/store/useIslamicStore';
import { Button } from '@/components/ui/button';

export default function AdzanOverlay() {
  const { isAdzanActive, currentPrayer, dismissAdzan } = useIslamicStore();

  return (
    <AnimatePresence>
      {isAdzanActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-emerald-950/95 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            className="text-center max-w-md px-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-8xl mb-8"
            >🕌</motion.div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Waktu {currentPrayer}</h1>
            <p className="text-emerald-400/80 text-lg font-bold mb-2">حَيَّ عَلَى الصَّلَاة</p>
            <p className="text-emerald-400/60 text-sm font-medium mb-8">Mari tinggalkan sejenak aktivitas dan menunaikan ibadah sholat.</p>
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1,2,3,4,5].map(i => (
                <motion.div key={i} animate={{ opacity: [0.2,1,0.2] }} transition={{ repeat: Infinity, duration: 2, delay: i*0.2 }}
                  className="w-2 h-2 bg-emerald-400 rounded-full" />
              ))}
            </div>
            <Button onClick={dismissAdzan} className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl h-14 px-8 font-black text-lg">
              Lanjutkan Aktivitas
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
