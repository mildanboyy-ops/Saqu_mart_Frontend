import { useIslamicStore } from '@/store/useIslamicStore';
import { cn } from '@/lib/utils';

export default function PrayerTimeWidget({ className }: { className?: string }) {
  const { prayerTimes } = useIslamicStore();
  const now = new Date();
  const currentHHMM = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  
  const nextPrayer = prayerTimes.find(p => p.time > currentHHMM) || prayerTimes[0];

  return (
    <div className={cn('p-4 rounded-2xl bg-emerald-900/90 text-white border border-emerald-700/30', className)}>
      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400/60 mb-2">🕌 Jadwal Sholat</div>
      <div className="space-y-1.5">
        {prayerTimes.map(p => (
          <div key={p.name} className={cn(
            'flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-bold transition-all',
            p.name === nextPrayer.name ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/60'
          )}>
            <span>{p.name} <span className="text-[9px] opacity-50">{p.nameAr}</span></span>
            <span className="font-mono">{p.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
