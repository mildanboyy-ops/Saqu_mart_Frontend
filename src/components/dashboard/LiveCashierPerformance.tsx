import { motion } from 'framer-motion';
import { Trophy, Medal, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LiveCashierPerformance() {
  const performance = [
    { name: 'Siti Aminah', transactions: 142, revenue: 'Rp 8.4M', rating: 4.9, avatar: 'SA' },
    { name: 'Budi Santoso', transactions: 128, revenue: 'Rp 7.1M', rating: 4.8, avatar: 'BS' },
    { name: 'Rina Wijaya', transactions: 115, revenue: 'Rp 6.5M', rating: 4.7, avatar: 'RW' },
  ];

  return (
    <Card className="luxury-card border-none bg-gradient-to-br from-slate-900 to-black text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <Trophy className="h-24 w-24" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
           <Medal className="h-4 w-4 text-yellow-500" /> Leaderboard Kasir
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {performance.map((k, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
          >
            <div className="relative">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-xs">
                  {k.avatar}
               </div>
               {idx === 0 && <div className="absolute -top-1 -right-1 bg-yellow-500 text-[8px] font-black px-1 rounded-full text-black">TOP</div>}
            </div>
            <div className="flex-1">
               <p className="text-sm font-bold">{k.name}</p>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-medium">{k.transactions} Tx</span>
                  <span className="text-[10px] text-primary font-black">{k.revenue}</span>
               </div>
            </div>
            <div className="text-right">
               <div className="flex items-center gap-1 text-yellow-500">
                  <Target className="h-3 w-3" />
                  <span className="text-xs font-black">{k.rating}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
