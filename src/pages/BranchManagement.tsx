import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, Users, MapPin } from 'lucide-react';
import { useBranchStore } from '@/store/useBranchStore';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import PulseIndicator from '@/components/shared/PulseIndicator';

export default function BranchManagement() {
  const { branches, activeBranchId, setActiveBranch } = useBranchStore();
  const totalRevenue = branches.reduce((s, b) => s + b.todayRevenue, 0);
  const totalTx = branches.reduce((s, b) => s + b.totalTransactions, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" /> Multi-Branch Command
        </h1>
        <p className="text-muted-foreground font-medium mt-1">Monitor dan kelola seluruh cabang SaquMart secara real-time.</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="luxury-card"><CardContent className="p-5 text-center">
          <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
          <AnimatedCounter value={totalRevenue} prefix="Rp " className="text-2xl font-black tracking-tighter block" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Global Revenue Today</p>
        </CardContent></Card>
        <Card className="luxury-card"><CardContent className="p-5 text-center">
          <Building2 className="h-5 w-5 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-black">{branches.filter(b => b.status === 'online').length}/{branches.length}</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Branches Online</p>
        </CardContent></Card>
        <Card className="luxury-card"><CardContent className="p-5 text-center">
          <Users className="h-5 w-5 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-black">{totalTx}</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Total Transactions</p>
        </CardContent></Card>
      </div>

      {/* Branch Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch, idx) => (
          <motion.div key={branch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className={cn('luxury-card cursor-pointer transition-all', activeBranchId === branch.id && 'ring-2 ring-primary shadow-lg')}
              onClick={() => setActiveBranch(branch.id)}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-black">{branch.name}</CardTitle>
                  <PulseIndicator status={branch.status === 'online' ? 'online' : 'offline'} label={branch.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {branch.address}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-muted/30 rounded-xl">
                    <div className="text-sm font-black">Rp {(branch.todayRevenue / 1000000).toFixed(1)}M</div>
                    <div className="text-[8px] font-bold uppercase text-muted-foreground">Revenue</div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-xl">
                    <div className="text-sm font-black">{branch.totalTransactions}</div>
                    <div className="text-[8px] font-bold uppercase text-muted-foreground">Trans</div>
                  </div>
                  <div className="text-center p-2 bg-muted/30 rounded-xl">
                    <div className="text-sm font-black">{branch.employees}</div>
                    <div className="text-[8px] font-bold uppercase text-muted-foreground">Staff</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
