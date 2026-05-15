import { useParams, useNavigate } from 'react-router-dom';
import { useMemberStore } from '@/store/useMemberStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wallet, TrendingUp, ShoppingBag, BrainCircuit, Star } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import PageTransition from '@/components/shared/PageTransition';

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const members = useMemberStore(state => state.members);
  const transactions = useTransactionStore(state => state.transactions);

  const member = useMemo(() => members.find(m => m.id === id), [members, id]);
  
  const memberTransactions = useMemo(() => 
    transactions.filter(tx => tx.memberId === id),
  [transactions, id]);

  const spendingData = useMemo(() => {
    // Last 6 months or similar
    return [
      { month: 'Jan', amount: 450000 },
      { month: 'Feb', amount: 520000 },
      { month: 'Mar', amount: 380000 },
      { month: 'Apr', amount: 610000 },
      { month: 'Mei', amount: memberTransactions.reduce((acc, tx) => acc + tx.total, 0) },
    ];
  }, [memberTransactions]);

  if (!member) return <div className="p-8">Member tidak ditemukan.</div>;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
             <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
             <h1 className="text-2xl font-black tracking-tight">{member.name}</h1>
             <p className="text-muted-foreground font-medium">Member Premium ID: {member.id.substring(0, 8)}</p>
          </div>
          <div className="ml-auto flex gap-2">
             <Badge className="bg-primary/20 text-primary border-none px-4 py-1.5 rounded-full text-xs font-black">GOLD MEMBER</Badge>
             <Badge className="bg-yellow-500/20 text-yellow-600 border-none px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> {member.transactionCount} Points
             </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
           {[
             { label: 'Total Spending', value: `Rp ${memberTransactions.reduce((acc, tx) => acc + tx.total, 0).toLocaleString()}`, icon: Wallet, color: 'emerald' },
             { label: 'Total Visits', value: `${member.transactionCount}x`, icon: TrendingUp, color: 'blue' },
             { label: 'Current Debt', value: `Rp ${member.debt.toLocaleString()}`, icon: ShoppingBag, color: 'rose' },
             { label: 'CLV Score', value: '8.4', icon: BrainCircuit, color: 'purple' },
           ].map((stat, idx) => (
             <Card key={idx} className="luxury-card border-none bg-white dark:bg-slate-900 shadow-xl overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500`} />
                <CardContent className="p-6">
                   <stat.icon className={`h-5 w-5 text-${stat.color}-500 mb-3`} />
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                   <p className="text-xl font-black mt-1">{stat.value}</p>
                </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
           <Card className="luxury-card border-none bg-white dark:bg-slate-900 shadow-xl">
              <CardHeader>
                 <CardTitle className="text-lg font-black">Spending Behavior</CardTitle>
                 <CardDescription>Analisis pengeluaran bulanan member.</CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={spendingData}>
                          <defs>
                             <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                          <YAxis hide />
                          <Tooltip 
                             contentStyle={{ borderRadius: '16px', border: 'none', background: 'rgba(0,0,0,0.8)', color: '#fff' }}
                          />
                          <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpent)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>

           <Card className="luxury-card border-none bg-slate-950 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <CardHeader>
                 <CardTitle className="text-lg font-black flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" /> AI Personal Insights
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-2">Favorite Category</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center font-black text-primary">S</div>
                       <div>
                          <p className="font-bold">Sembako & Kebutuhan Dapur</p>
                          <p className="text-[10px] text-slate-500">Membeli produk ini 12x dalam sebulan.</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-2">AI Upsell Recommendation</p>
                    <p className="text-sm font-medium italic text-slate-300">
                      "Member ini sering membeli beras 5kg. Sarankan member untuk mendaftar langganan bulanan agar mendapatkan diskon 5%."
                    </p>
                 </div>

                 <Button className="w-full h-12 rounded-2xl font-black bg-primary text-white hover:opacity-90">
                    Terapkan Penawaran Khusus
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </PageTransition>
  );
}
