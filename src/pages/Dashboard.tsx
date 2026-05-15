import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, ShoppingCart, Users, Package,
  Download, Mic, MicOff, Layout, Calculator, StickyNote, Camera, Map as MapIcon, Sparkles, Zap, Cpu
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";
import LiveActivityFeed from "@/components/realtime/LiveActivityFeed";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useProductStore } from "@/store/useProductStore";
import { useMemberStore } from "@/store/useMemberStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import StoreMap from "@/components/StoreMap";
import LiveAIInsightPanel from "@/components/dashboard/LiveAIInsightPanel";
import RevenueHeatmap from "@/components/dashboard/RevenueHeatmap";
import DraggableWidgetSystem from "@/components/dashboard/DraggableWidgetSystem";
import LiveCashierPerformance from "@/components/dashboard/LiveCashierPerformance";
import LiveSystemStatus from "@/components/dashboard/LiveSystemStatus";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import ErrorBoundary from "@/components/ErrorBoundary";
import LiveSalesMap from "@/components/dashboard/LiveSalesMap";
import LiveStoreCameraPanel from "@/components/dashboard/LiveStoreCameraPanel";
import AIChartExplanation from "@/components/dashboard/AIChartExplanation";
import FloatingMiniApp, { MiniCalculator, MiniNotes } from "@/components/shared/FloatingMiniApps";
import RealtimeTeamChat from "@/components/shared/RealtimeTeamChat";
import { useSmartShortcuts } from "@/hooks/useSmartShortcuts";

export default function Dashboard() {
  useSmartShortcuts();
  const transactions = useTransactionStore(state => state.transactions);
  const products = useProductStore(state => state.products);
  const members = useMemberStore(state => state.members);
  const { user } = useAuthStore();

  const { isListening, startListening } = useVoiceAssistant();

  const isKasir = user?.role === 'Kasir';

  const [activeMiniApps, setActiveMiniApps] = useState<string[]>([]);

  const toggleMiniApp = (app: string) => {
    setActiveMiniApps(prev => prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]);
  };

  const stats = useMemo(() => {
    // AI Role-Based Logic
    if (isKasir) return [
      { label: 'Today Orders', value: transactions.length, icon: ShoppingCart, color: 'emerald', badge: 'ACTIVE' },
      { label: 'Avg Process Time', value: '45s', icon: Zap, color: 'blue', badge: 'ELITE' },
    ];

    return [
      { label: 'Revenue Today', value: transactions.reduce((acc, t) => acc + t.total, 0), icon: TrendingUp, color: 'emerald', badge: '+12.5%', prefix: 'Rp ' },
      { label: 'Total Sales', value: transactions.length, icon: ShoppingCart, color: 'blue', badge: 'LIVE' },
      { label: 'Total Members', value: members.length, icon: Users, color: 'violet', badge: 'STABLE' },
      { label: 'Low Stock', value: products.filter(p => p.stock < 10).length, icon: Package, color: 'rose', badge: 'CRITICAL' },
    ];
  }, [transactions, members, products, isKasir]);

  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      sales: Math.floor(Math.random() * 5000000) + 1000000,
    }));
  }, []);

  const insights = [
    "AI: Penjualan meningkat 32% malam ini.",
    "AI: Member 'Budi' memiliki CLV Score 8.4/10.",
    "Sistem: Sinkronisasi Global Berhasil."
  ];

  return (
    <div className="space-y-10 pb-32 cyber-grid min-h-screen relative overflow-x-hidden">

      {/* Floating Mini Apps Container */}
      <AnimatePresence>
        {activeMiniApps.includes('calc') && (
          <FloatingMiniApp title="Calculator" icon={Calculator} defaultX={window.innerWidth - 350} defaultY={200}>
            <MiniCalculator />
          </FloatingMiniApp>
        )}
        {activeMiniApps.includes('notes') && (
          <FloatingMiniApp title="Quick Notes" icon={StickyNote} defaultX={window.innerWidth - 350} defaultY={500}>
            <MiniNotes />
          </FloatingMiniApp>
        )}
      </AnimatePresence>

      <RealtimeTeamChat />

      {/* Dynamic Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 command-header-glow">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
            <Layout className="h-8 w-8 text-primary" /> COMMAND <span className="text-gradient-primary">CENTER</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm ml-11">Unified Enterprise Intelligence & Global Operations</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            <Button onClick={() => toggleMiniApp('calc')} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/20"><Calculator className="h-4 w-4" /></Button>
            <Button onClick={() => toggleMiniApp('notes')} variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/20"><StickyNote className="h-4 w-4" /></Button>
          </div>
          <Button onClick={startListening} variant={isListening ? "default" : "outline"} className={cn("h-12 px-6 rounded-2xl font-black gap-2 transition-all", isListening && "bg-red-500 border-none animate-pulse")}>
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />} AI VOICE
          </Button>
          <Button className="h-12 px-6 rounded-2xl luxury-button gap-2"><Download className="h-4 w-4" /> EXPORT</Button>
        </div>
      </div>

      {/* Stats Cockpit */}
      <div className={cn("grid gap-6", isKasir ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {stats.map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card className="glass-stats-card group cursor-pointer hover:neon-glow-primary">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn('p-3 rounded-2xl', `bg-${stat.color}-500/10 text-${stat.color}-500`)}><stat.icon className="h-6 w-6" /></div>
                  <Badge className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-none">{stat.badge}</Badge>
                </div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                {typeof stat.value === 'number' ? (
                  <AnimatedCounter value={stat.value} prefix={(stat as any).prefix || ''} className="text-3xl font-black tracking-tighter" />
                ) : (
                  <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <ErrorBoundary><LiveAIInsightPanel insights={insights} /></ErrorBoundary>

      {/* Strategic Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">

          {!isKasir && (
            <div className="grid gap-8 md:grid-cols-2">
              <ErrorBoundary><Card className="glass-panel rounded-[3rem] overflow-hidden border-none shadow-2xl"><StoreMap /></Card></ErrorBoundary>
              <ErrorBoundary><Card className="glass-panel rounded-[3rem] border-none shadow-2xl p-6"><RevenueHeatmap /></Card></ErrorBoundary>
            </div>
          )}

          <Card className="glass-panel rounded-[3rem] border-none shadow-2xl overflow-hidden p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2"><MapIcon className="h-5 w-5 text-primary" /> LIVE SALES MAP</h2>
              <Badge className="bg-emerald-500/10 text-emerald-500 animate-pulse">3 NODES ACTIVE</Badge>
            </div>
            <LiveSalesMap />
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="glass-panel rounded-[3rem] border-none shadow-2xl overflow-hidden">
              <CardHeader><CardTitle className="text-lg font-black flex items-center gap-2"><Camera className="h-5 w-5 text-rose-500" /> LIVE STORE FEED</CardTitle></CardHeader>
              <CardContent><LiveStoreCameraPanel /></CardContent>
            </Card>
            <AIChartExplanation data={chartData} />
          </div>

          <Card className="glass-panel rounded-[3rem] border-none shadow-2xl overflow-hidden p-8">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                <AreaChart data={chartData}>
                  <defs><linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', background: 'rgba(0,0,0,0.8)', color: '#fff' }} />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <ErrorBoundary><DraggableWidgetSystem /></ErrorBoundary>

          <Card className="glass-panel rounded-[3rem] border-none shadow-2xl overflow-hidden p-6 bg-slate-950/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center"><Cpu className="h-5 w-5 text-primary" /></div>
              <h3 className="text-white text-sm font-black uppercase tracking-widest">System Telemetry</h3>
            </div>
            <LiveSystemStatus />
          </Card>

          <Card className="glass-panel rounded-[3rem] border-none shadow-2xl p-6">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Cashier Performance</h3>
            <LiveCashierPerformance />
          </Card>

          <Card className="glass-panel rounded-[3rem] border-none shadow-2xl p-6">
            <LiveActivityFeed maxItems={6} />
          </Card>
        </div>
      </div>
    </div>
  );
}
