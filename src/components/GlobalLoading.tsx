import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";

export default function GlobalLoading({ loading }: { loading: boolean }) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a2e1f]"
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -150, 0],
                y: [0, 150, 0],
                scale: [1, 1.5, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" 
            />
          </div>

          <div className="relative">
            {/* Spinning Ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border-4 border-white/5 border-t-primary rounded-full relative z-10"
            />
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="w-20 h-20 bg-white/5 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl"
              >
                <ShoppingCart className="w-10 h-10 text-primary" />
              </motion.div>
            </div>

            {/* Sparkles */}
            <motion.div
              animate={{ 
                scale: [0.5, 1, 0.5],
                opacity: [0.2, 1, 0.2],
                rotate: [0, 45, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </motion.div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center relative z-20"
          >
            <h2 className="text-4xl font-black tracking-tighter text-white mb-2">SaquMart</h2>
            <div className="flex justify-center items-center gap-1.5 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -10, 0],
                    backgroundColor: ["#16a34a", "#4ade80", "#16a34a"]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity, 
                    delay: i * 0.15 
                  }}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black">
              Menyiapkan Berkah Transaksi
            </p>
          </motion.div>

          <div className="absolute bottom-12 text-center">
            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
              &copy; 2026 SaquMart Ecosystem • Powered by Quranic Values
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
