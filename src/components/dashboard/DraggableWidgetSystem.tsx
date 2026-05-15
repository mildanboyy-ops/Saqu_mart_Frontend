import { useState } from 'react';
import { cn } from '@/lib/utils';

import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, AlertTriangle, Zap, Clock, TrendingUp, Sun, Wind, Droplets } from 'lucide-react';



interface Widget {
  id: string;
  type: string;
  title: string;
  icon: any;
  color: string;
}

export default function DraggableWidgetSystem() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'revenue', type: 'revenue', title: 'Live Revenue', icon: TrendingUp, color: 'emerald' },
    { id: 'prayer', type: 'prayer', title: 'Next Prayer', icon: Clock, color: 'blue' },
    { id: 'stock', type: 'stock', title: 'Stock Alert', icon: AlertTriangle, color: 'rose' },
    { id: 'weather', type: 'weather', title: 'Store Climate', icon: Cloud, color: 'sky' },
  ]);

  const renderContent = (widget: Widget) => {
    switch (widget.type) {
      case 'revenue':
        return (
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">Rp 4.2M</span>
              <span className="text-[10px] text-emerald-500 font-black">+12.5%</span>
            </div>
            <div className="w-full h-1 bg-emerald-500/10 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: '70%' }} className="h-full bg-emerald-500" />
            </div>
          </div>
        );
      case 'prayer':
        return (
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <span className="text-xl font-black text-slate-900 dark:text-white">Ashar</span>
               <span className="text-[10px] text-muted-foreground font-bold">Waktu Indonesia Barat</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-lg font-black text-blue-500">15:12</span>
               <span className="text-[8px] font-black uppercase text-blue-400/60 tracking-widest">Incoming</span>
            </div>
          </div>
        );
      case 'stock':
        return (
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-rose-500">Critical</span>
                  <span className="text-slate-900 dark:text-white">5 Items</span>
               </div>
               <div className="w-full h-1 bg-rose-500/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-rose-500" />
               </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
               <AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse" />
            </div>
          </div>
        );
      case 'weather':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                  <Sun className="h-6 w-6 text-sky-500" />
               </div>
               <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">28°C</p>
                  <p className="text-[10px] text-muted-foreground font-bold">Jakarta Pusat</p>
               </div>
            </div>
            <div className="flex gap-3">
               <div className="flex flex-col items-center">
                  <Wind className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[8px] font-bold">12km/h</span>
               </div>
               <div className="flex flex-col items-center">
                  <Droplets className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[8px] font-bold">65%</span>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Zap className="h-4 w-4 text-primary" />
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Smart Floating Widgets</h3>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black">ADAPTIVE_DASHBOARD</Badge>
      </div>
      
      <Reorder.Group axis="y" values={widgets} onReorder={setWidgets} className="space-y-4">
        <AnimatePresence>
          {widgets.map((widget) => (
            <Reorder.Item 
              key={widget.id} 
              value={widget}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileDrag={{ scale: 1.05, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}
              className="cursor-grab active:cursor-grabbing"
            >
              <Card className="glass-panel border-none rounded-[2rem] hover:border-primary/30 transition-all group overflow-hidden">
                <div className={cn("absolute top-0 left-0 w-1 h-full", `bg-${widget.color}-500`)} />
                <CardContent className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                       <widget.icon className={cn("h-3.5 w-3.5", `text-${widget.color}-500`)} />
                       <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{widget.title}</span>
                    </div>
                    <div className="flex gap-1.5">
                       <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />
                       <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />
                       <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />
                    </div>
                  </div>
                  {renderContent(widget)}
                </CardContent>
              </Card>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}
