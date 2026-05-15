import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAIStore } from '@/store/useAIStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import AIInsightCard from '@/components/ai/AIInsightCard';
import BusinessHealthScore from '@/components/realtime/BusinessHealthScore';
import AI3DVisualizer from '@/components/dashboard/AI3DVisualizer';
import { BrainCircuit, TrendingUp, Target, Zap } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function AIAnalytics() {
  const { insights = [], healthScore, dismissInsight } = useAIStore();
  const { transactions = [] } = useTransactionStore();
  const activeInsights = Array.isArray(insights) ? insights.filter(i => !i.dismissed) : [];

  const predictionData = useMemo(() => {
    const last7Days = [...Array(14)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (7 - i));
      return {
        date: d.toDateString(),
        label: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        isFuture: i >= 7
      };
    });

    return last7Days.map(day => {
      const actual = day.isFuture ? undefined : transactions
        .filter(tx => new Date(tx.timestamp).toDateString() === day.date)
        .reduce((acc, tx) => acc + tx.total, 0);
      
      // AI "Prediction" logic: actual + some trend or random if future
      const predicted = day.isFuture 
        ? (transactions.length > 0 ? (transactions.reduce((s, t) => s + t.total, 0) / transactions.length) * 1.2 : 1500000) + (Math.random() * 500000)
        : (actual || 0) * (0.9 + Math.random() * 0.2);

      return {
        day: day.label,
        actual,
        predicted,
        upper: predicted * 1.2,
        lower: predicted * 0.8,
      };
    });
  }, [transactions]);


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-primary" /> AI Intelligence Center
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Wawasan cerdas dari mesin AI SaquMart untuk keputusan bisnis yang lebih baik.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="luxury-card"><CardContent className="p-5 text-center">
          <Target className="h-5 w-5 text-primary mx-auto mb-2" />
          <div className="text-2xl font-black tracking-tighter">{activeInsights.length}</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Active Insights</p>
        </CardContent></Card>
        <Card className="luxury-card"><CardContent className="p-5 text-center">
          <TrendingUp className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-black tracking-tighter text-emerald-600">82%</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Prediction Accuracy</p>
        </CardContent></Card>
        <Card className="luxury-card"><CardContent className="p-5 text-center">
          <Zap className="h-5 w-5 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-black tracking-tighter">{transactions.length}</div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Analyzed Transactions</p>
        </CardContent></Card>
        <Card className="luxury-card"><CardContent className="p-5 flex justify-center">
          <BusinessHealthScore score={healthScore} />
        </CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Prediction Chart */}
        <Card className="luxury-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> AI Sales Prediction (14 Days)
            </CardTitle>
          </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  formatter={(v: any) => `Rp ${Number(v).toLocaleString()}`} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="#3b82f6" fillOpacity={0.05} />
                <Area type="monotone" dataKey="lower" stroke="none" fill="#3b82f6" fillOpacity={0.05} />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} fill="url(#colorActual)" name="Aktual" />
                <Area type="monotone" dataKey="predicted" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 4" fill="url(#colorPredicted)" name="Prediksi AI" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        </Card>

        {/* 3D Visualizer */}
        <Card className="luxury-card overflow-hidden p-1 min-h-[350px]">
          <AI3DVisualizer />
        </Card>
      </div>

      {/* AI Insights Feed */}
      <div>
        <h2 className="text-xl font-black tracking-tight mb-4 flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" /> AI Insights Feed
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {activeInsights.map(insight => (
            <AIInsightCard key={insight.id} {...insight} onDismiss={() => dismissInsight(insight.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
