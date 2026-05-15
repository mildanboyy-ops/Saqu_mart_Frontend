import { Maximize2, RefreshCw, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LiveStoreCameraPanel() {
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(new Date().toISOString()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border border-white/10 group">
       {/* Mock Video Stream */}
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534452286302-2f5631f68581?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" />
       
       {/* Scanline Overlay */}
       <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_2px,3px_100%]" />

       <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 bg-red-600/80 px-2 py-0.5 rounded text-[8px] font-black text-white animate-pulse">
                <Radio className="h-3 w-3" /> REC
             </div>
             <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md">
                <p className="text-[10px] font-mono text-white/90">CAM_01_FRONT_DESK</p>
                <p className="text-[8px] font-mono text-emerald-400">STATUS: ACTIVE_FEED</p>
             </div>
          </div>
          <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md font-mono text-[8px] text-white">
             {timestamp}
          </div>
       </div>

       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
             <Maximize2 className="h-5 w-5 text-white" />
          </div>
       </div>

       <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/5 space-y-1">
             <p className="text-[8px] font-black text-white/40 uppercase">AI Object Detection</p>
             <div className="flex gap-2">
                <span className="text-[10px] font-bold text-emerald-400">Customer: 2</span>
                <span className="text-[10px] font-bold text-blue-400">Queue: Low</span>
             </div>
          </div>
          <button className="bg-white/10 p-2 rounded-xl backdrop-blur-md hover:bg-white/20 transition-colors">
             <RefreshCw className="h-4 w-4 text-white" />
          </button>
       </div>
    </div>
  );
}
