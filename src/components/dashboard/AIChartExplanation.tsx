import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AIChartExplanation({ data }: { data: any }) {
  const [explanation, setExplanation] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullText = "Berdasarkan data hari ini, sistem mendeteksi lonjakan volume transaksi sebesar 24% pada jam makan siang. Rekomendasi: Alokasikan lebih banyak personil di Kasir A untuk menjaga SLA antrian tetap di bawah 3 menit.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setExplanation(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-slate-900/50 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="h-20 w-20 text-primary" />
       </div>
       
       <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
             <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
             <h3 className="text-sm font-black text-white uppercase tracking-widest">AI Analytical Insight</h3>
             <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter italic">Deep Learning Model v2.1</p>
          </div>
       </div>

       <div className="relative min-h-[4rem]">
          <MessageSquare className="absolute -left-1 -top-1 h-3 w-3 text-primary/30" />
          <p className="text-sm font-medium text-slate-300 leading-relaxed pl-6 italic">
             "{explanation}"
             {isTyping && <span className="w-1.5 h-4 ml-1 bg-primary inline-block animate-pulse" />}
          </p>
       </div>

       <div className="mt-6 flex gap-2">
          <button className="px-4 py-2 bg-primary/20 border border-primary/20 rounded-xl text-[10px] font-black text-primary hover:bg-primary hover:text-white transition-all">
             OPTIMASI STOK
          </button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white hover:bg-white/10 transition-all">
             LIHAT DETAIL LAPORAN
          </button>
       </div>
    </div>
  );
}
