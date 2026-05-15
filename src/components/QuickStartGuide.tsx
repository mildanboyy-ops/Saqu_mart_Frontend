import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { 
  Printer, BrainCircuit, ShieldCheck, 
  Zap, Keyboard, HelpCircle, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

interface QuickStartGuideProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ isOpen, onOpenChange }) => {
  const features = [
    {
      icon: Printer,
      title: "Realistic Printing",
      desc: "Klik 'Cetak Struk Fisik' di POS atau 'Cetak Laporan' di Reports. Anda akan mendengar suara printer mekanik dan melihat simulasi kertas keluar.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Keyboard,
      title: "Shortcut POS (Cepat)",
      desc: "Gunakan F1/F2 untuk fokus ke barcode, F4 untuk bayar langsung, dan ESC untuk membatalkan modal apapun. Sangat cepat!",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: BrainCircuit,
      title: "AI Object Scan",
      desc: "Di halaman POS, klik ikon Chip (CPU) di sebelah input barcode untuk memicu pemindaian barang berbasis AI secara otomatis.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: ShieldCheck,
      title: "Blockchain Security",
      desc: "Setiap transaksi diverifikasi oleh jaringan blockchain SaquChain. Anda bisa melihat hash transaksi di struk belanja.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      icon: Zap,
      title: "System Lightness",
      desc: "Aplikasi sudah dioptimasi untuk kecepatan tinggi. Transisi antar menu sekarang 2x lebih cepat dan hemat daya perangkat.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
        <DialogHeader className="p-8 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <HelpCircle className="w-32 h-32 rotate-12" />
          </div>
          <div className="relative z-10">
            <DialogTitle className="text-3xl font-black tracking-tighter mb-2">Panduan Penggunaan</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Pelajari fitur-fitur "God-Tier" SaquMart untuk memaksimalkan operasional toko Anda.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="p-6 bg-white dark:bg-slate-900 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {f.title}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            SaquMart Enterprise v4.0 • Built with Excellence
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
