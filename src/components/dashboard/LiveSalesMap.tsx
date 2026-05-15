import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function LiveSalesMap() {
  const points = [
    { id: 1, name: 'SaquMart Tebet', x: 120, y: 80, val: 'Rp 2.4M' },
    { id: 2, name: 'SaquMart Depok', x: 250, y: 150, val: 'Rp 1.8M' },
    { id: 3, name: 'SaquMart Bekasi', x: 320, y: 100, val: 'Rp 3.1M' },
  ];

  return (
    <div className="relative w-full aspect-[2/1] bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/10 group">
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
       
       {/* Mock Map Grid */}
       <div className="absolute inset-0 cyber-grid opacity-10" />

       <div className="absolute top-6 left-8">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
             <Globe className="h-4 w-4 animate-spin-slow" /> Strategic Operations Map
          </h3>
          <p className="text-[9px] font-black text-white/30 uppercase mt-1">Global Node Synchronized</p>
       </div>

       <svg viewBox="0 0 400 200" className="w-full h-full p-12">
          {points.map(p => (
            <motion.g key={p.id}>
               <motion.circle 
                cx={p.x} cy={p.y} r="4" 
                fill="#10b981" 
                animate={{ scale: [1, 2, 1], opacity: [1, 0.4, 1] }} 
                transition={{ duration: 2, repeat: Infinity }} 
               />
               <motion.circle 
                cx={p.x} cy={p.y} r="12" 
                fill="#10b981" 
                fillOpacity="0.1"
                stroke="#10b981"
                strokeWidth="0.5"
                animate={{ scale: [1, 1.5, 1] }} 
                transition={{ duration: 3, repeat: Infinity }} 
               />
               <foreignObject x={p.x + 8} y={p.y - 20} width="100" height="40">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-lg">
                     <p className="text-[7px] font-black text-white/40 uppercase leading-none">{p.name}</p>
                     <p className="text-[9px] font-black text-white mt-0.5">{p.val}</p>
                  </div>
               </foreignObject>
            </motion.g>
          ))}
       </svg>

       <div className="absolute bottom-6 right-8">
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-white/40 uppercase">Nodes</span>
                <span className="text-xs font-black text-white">12 ACTIVE</span>
             </div>
             <div className="w-[1px] h-6 bg-white/10" />
             <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-white/40 uppercase">Latency</span>
                <span className="text-xs font-black text-emerald-500">2ms</span>
             </div>
          </div>
       </div>
    </div>
  );
}
