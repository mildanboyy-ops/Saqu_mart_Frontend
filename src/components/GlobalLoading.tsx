import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

export default function GlobalLoading({ loading }: { loading: boolean }) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/20"
            >
              <ShoppingCart className="w-12 h-12 text-primary" />
            </motion.div>
            
            <motion.div 
              animate={{ 
                rotate: 360,
                borderRadius: ["30%", "50%", "30%"],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute -inset-4 border-2 border-primary/30 border-t-primary rounded-full"
            />
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 text-center"
          >
            <h2 className="text-2xl font-black tracking-tight text-primary">SaquMart</h2>
            <div className="flex items-center gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="w-1.5 h-1.5 bg-primary rounded-full"
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 uppercase tracking-[0.2em] font-bold">
              Menyiapkan Berkah...
            </p>
          </motion.div>

          <div className="absolute bottom-10 left-0 right-0 text-center">
            <p className="text-[10px] text-muted-foreground/50 font-medium">
              &copy; 2026 SaquMart POS System • Premium Version
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
