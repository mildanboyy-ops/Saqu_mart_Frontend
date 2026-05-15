import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity, Wifi, BarChart2 } from 'lucide-react';

export default function SystemPerformanceHUD() {
  const [metrics, setMetrics] = useState({
    fps: 60,
    latency: 12,
    cpu: 18,
    memory: 42
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        fps: Math.floor(Math.random() * 5) + 55,
        latency: Math.floor(Math.random() * 10) + 8,
        cpu: Math.floor(Math.random() * 20) + 10,
        memory: Math.floor(Math.random() * 5) + 40
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
       {[
         { icon: Activity, label: 'UI_RENDER', value: `${metrics.fps} FPS`, color: 'emerald' },
         { icon: Wifi, label: 'SOCKET_PING', value: `${metrics.latency}ms`, color: 'blue' },
         { icon: Cpu, label: 'AI_LOAD', value: `${metrics.cpu}%`, color: 'amber' },
         { icon: BarChart2, label: 'MEM_BUFFER', value: `${metrics.memory}MB`, color: 'rose' },
       ].map((m, i) => (
         <motion.div
          key={i}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl"
         >
            <m.icon className={`h-3 w-3 text-${m.color}-500`} />
            <div className="flex flex-col">
               <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{m.label}</span>
               <span className="text-[10px] font-black text-white tabular-nums">{m.value}</span>
            </div>
         </motion.div>
       ))}
    </div>
  );
}
