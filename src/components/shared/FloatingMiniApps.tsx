import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingMiniApp({ 
  title, 
  icon: Icon, 
  children, 
  defaultX = 100, 
  defaultY = 100 
}: { 
  title: string, 
  icon: any, 
  children: React.ReactNode,
  defaultX?: number,
  defaultY?: number
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x: defaultX, y: defaultY, opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        height: isMinimized ? '48px' : 'auto'
      }}
      className="fixed z-[150] w-72 glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10"
    >
      <div className="h-12 bg-slate-900/80 px-4 flex items-center justify-between cursor-move handle">
        <div className="flex items-center gap-2">
           <Icon className="h-4 w-4 text-primary" />
           <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{title}</span>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
              {isMinimized ? <Maximize2 className="h-3 w-3 text-white" /> : <Minus className="h-3 w-3 text-white" />}
           </button>
           <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-red-500/20 rounded-md transition-colors">
              <X className="h-3 w-3 text-red-500" />
           </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 bg-slate-950/40 backdrop-blur-xl min-h-[100px]">
           {children}
        </div>
      )}
    </motion.div>
  );
}

export function MiniCalculator() {
  const [val, setVal] = useState("");
  const btns = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C"];

  const handleCalc = (b: string) => {
    if (b === "C") setVal("");
    else if (b === "=") {
      try { setVal(eval(val).toString()); } catch { setVal("Error"); }
    }
    else setVal(val + b);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-4 bg-black/40 p-3 rounded-xl text-right font-mono text-lg text-emerald-400 mb-2 truncate">
        {val || "0"}
      </div>
      {btns.map(b => (
        <button 
          key={b} 
          onClick={() => handleCalc(b)}
          className={cn(
            "p-2 rounded-lg font-black text-xs transition-all active:scale-90",
            b === "=" ? "bg-primary text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
          )}
        >
          {b}
        </button>
      ))}
    </div>
  );
}

export function MiniNotes() {
  const [note, setNote] = useState("");
  return (
    <textarea 
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Type quick notes here..."
      className="w-full h-32 bg-transparent border-none text-xs text-white/80 placeholder:text-white/20 focus:ring-0 resize-none"
    />
  );
}
