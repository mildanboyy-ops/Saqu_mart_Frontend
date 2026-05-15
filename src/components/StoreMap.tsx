import { motion } from "framer-motion";
import { useProductStore } from "@/store/useProductStore";
import { Hover3DCard } from "@/components/ui/Hover3DCard";

export default function StoreMap() {
  const { products } = useProductStore();

  const sections = [
    { id: 'food', name: 'Makanan & Minuman', x: 20, y: 20, w: 150, h: 100, color: '#10b981' },
    { id: 'non-food', name: 'Non-Makanan', x: 200, y: 20, w: 150, h: 100, color: '#3b82f6' },
    { id: 'cashier', name: 'Area Kasir', x: 110, y: 150, w: 150, h: 60, color: '#f59e0b' },
  ];

  return (
    <Hover3DCard>
      <div className="relative w-full h-[350px] bg-slate-950 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl group">
        {/* Holographic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-emerald-500/10" />

        <div className="absolute top-6 left-8 z-10">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Store Digital Twin
          </h3>
        </div>
        
        <div className="relative w-full h-full flex items-center justify-center p-8">
          <svg viewBox="0 0 400 250" className="w-full h-full max-w-lg drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <defs>
              <filter id="neon-glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {sections.map((s) => {
              const count = products.filter(p => p.category === (s.id === 'food' ? 'Makanan' : 'Elektronik')).length;
              const isLow = products.some(p => p.category === (s.id === 'food' ? 'Makanan' : 'Elektronik') && p.stock < 10);

              return (
                <motion.g key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                  {/* Section Area */}
                  <motion.rect 
                    x={s.x} y={s.y} width={s.w} height={s.h} 
                    fill={s.color} fillOpacity={0.05}
                    stroke={s.color} strokeWidth={1}
                    strokeDasharray="5 5"
                    rx={12}
                    whileHover={{ fillOpacity: 0.1, strokeWidth: 2 }}
                    className="cursor-pointer transition-all"
                  />
                  
                  {/* Heatmap Pulsing Points */}
                  {[...Array(3)].map((_, i) => (
                    <motion.circle 
                      key={i}
                      cx={s.x + s.w/2 + (i-1)*20} cy={s.y + s.h/2} r={isLow ? 6 : 3} 
                      fill={s.color} 
                      filter="url(#neon-glow)"
                      animate={{ 
                        scale: [1, 1.5, 1], 
                        opacity: isLow ? [0.4, 0.8, 0.4] : [0.2, 0.5, 0.2] 
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.3 
                      }}
                    />
                  ))}
                  
                  <text 
                    x={s.x + s.w/2} y={s.y + s.h/2 + 35} 
                    textAnchor="middle" 
                    className="text-[9px] font-black fill-white/40 uppercase tracking-widest"
                  >
                    {s.name}
                  </text>
                  <text 
                    x={s.x + s.w/2} y={s.y + s.h/2 + 45} 
                    textAnchor="middle" 
                    className="text-[8px] font-bold fill-white/20 uppercase tracking-[0.2em]"
                  >
                    {count} Units Detected
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Optimal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Restock Needed</span>
            </div>
          </div>
          <div className="text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">
            Holographic Sync Active
          </div>
        </div>
      </div>
    </Hover3DCard>
  );
}
