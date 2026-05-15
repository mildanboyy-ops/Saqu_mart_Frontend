import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGamificationStore } from '@/store/useGamificationStore';
import { Trophy, Star, Zap, Target, Flame, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Gamification() {
  const { employees = [], dailyMissions = [], completeMission } = useGamificationStore();
  const sorted = Array.isArray(employees) ? [...employees].sort((a, b) => b.xp - a.xp) : [];


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
          <Trophy className="h-8 w-8 text-amber-500" /> Gamification Center
        </h1>
        <p className="text-muted-foreground font-medium mt-1">Leaderboard karyawan, misi harian, dan penghargaan performa.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leaderboard */}
        <Card className="lg:col-span-2 luxury-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Medal className="h-5 w-5 text-amber-500" /> Employee Ranking Board</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {sorted.map((emp, idx) => (
              <motion.div key={emp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                className={cn('flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md',
                  idx === 0 ? 'bg-amber-500/5 border-amber-500/20' : idx === 1 ? 'bg-slate-100/50 border-slate-200' : 'border-muted'
                )}>
                <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg',
                  idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-slate-400 text-white' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-muted text-muted-foreground'
                )}>#{idx + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm">{emp.name}</span>
                    <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Lv.{emp.level}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted-foreground font-bold">{emp.role}</span>
                    <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5"><Star className="h-3 w-3" />{emp.xp} XP</span>
                    <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5"><Flame className="h-3 w-3" />{emp.streak} Streak</span>
                  </div>
                  {/* XP Bar */}
                  <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(emp.xp % 500) / 5}%` }} transition={{ duration: 1, delay: idx * 0.2 }}
                      className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black">{emp.totalTransactions}</div>
                  <div className="text-[9px] text-muted-foreground font-bold uppercase">Transaksi</div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Missions */}
        <div className="space-y-4">
          <Card className="luxury-card bg-slate-900 text-white">
            <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Target className="h-5 w-5 text-amber-400" /> Misi Harian</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {dailyMissions.map(mission => (
                <div key={mission.id} className={cn('p-4 rounded-2xl border transition-all', mission.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10')}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm">{mission.title}</h4>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-black">+{mission.reward} XP</span>
                  </div>
                  <p className="text-[11px] text-white/50 mb-3">{mission.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(mission.progress / mission.target) * 100}%` }}
                        className={cn('h-full rounded-full', mission.completed ? 'bg-emerald-500' : 'bg-amber-400')} />
                    </div>
                    <span className="text-[10px] font-bold text-white/60">{mission.progress}/{mission.target}</span>
                  </div>
                  {!mission.completed && mission.progress >= mission.target && (
                    <Button size="sm" className="mt-3 w-full h-8 text-[10px] font-black bg-amber-500 hover:bg-amber-400 text-black" onClick={() => completeMission(mission.id)}>
                      <Zap className="h-3 w-3 mr-1" /> Klaim Reward
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
