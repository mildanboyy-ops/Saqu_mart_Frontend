import { useState, useEffect, useMemo } from "react"
import DashboardSkeleton from "@/components/dashboard-skeleton"
import { useProductStore } from "@/store/useProductStore"
import { useTransactionStore } from "@/store/useTransactionStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, ShoppingCart, TrendingUp, AlertTriangle, Sparkles, X, Shield, Users2, Wallet2 } from "lucide-react"
import {
  Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip,
} from "recharts"
import { useAuthStore } from "@/store/useAuthStore"
import { useMemberStore } from "@/store/useMemberStore"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { products } = useProductStore();
  const { transactions } = useTransactionStore();
  const { members } = useMemberStore();
  const [loading, setLoading] = useState(true);

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10);
  const totalRevenue = transactions.reduce((acc, tx) => acc + tx.total, 0);
  const totalProfit = transactions.reduce((acc, tx) => acc + tx.profit, 0);
  const totalDeposits = members.reduce((acc, m) => acc + m.balance, 0);
  
  const transactionsToday = transactions.filter(tx =>
    new Date(tx.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const revenueToday = transactions
    .filter(tx => new Date(tx.timestamp).toDateString() === new Date().toDateString())
    .reduce((acc, tx) => acc + tx.total, 0);

  const weeklyData = useMemo(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const data: { name: string; total: number; profit: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dayStr = d.toDateString();
      const dayTx = transactions.filter(tx => new Date(tx.timestamp).toDateString() === dayStr);
      data.push({
        name: days[d.getDay()],
        total: dayTx.reduce((s, tx) => s + tx.total, 0),
        profit: dayTx.reduce((s, tx) => s + tx.profit, 0),
      });
    }
    return data;
  }, [transactions]);

  const { user } = useAuthStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    
    const hasShownWelcome = sessionStorage.getItem('welcome-shown');
    if (!hasShownWelcome) {
      const welcomeTimer = setTimeout(() => setShowWelcome(true), 1500);
      return () => {
        clearTimeout(timer);
        clearTimeout(welcomeTimer);
      };
    }
    return () => clearTimeout(timer);
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('welcome-shown', 'true');
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="relative overflow-hidden bg-[#0a2e1f] p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-900/20 border border-white/10"
          >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-32 -mb-32" />
            
            <div className="absolute top-6 right-6 z-20">
              <Button variant="ghost" size="icon" onClick={closeWelcome} className="text-white/40 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 transition-all">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-primary rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
                    <Sparkles className="h-12 w-12 text-emerald-400 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-[11px] font-bold uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md text-emerald-400">
                    <Shield className="h-3.5 w-3.5" /> Akses {user?.role} Aktif
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                    Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">{user?.name.split(' ')[0]}!</span>
                  </h2>
                  <div className="flex items-center gap-3 text-white/60">
                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                    <p className="text-sm font-medium italic">"Kejujuran adalah kunci keberkahan setiap transaksi."</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group">
                  <p className="text-[10px] font-bold uppercase text-white/40 mb-2 tracking-widest">Omzet Hari Ini</p>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-black text-emerald-400 group-hover:scale-110 transition-transform inline-block">Rp</span>
                    <span className="text-3xl font-black">{revenueToday.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group">
                  <p className="text-[10px] font-bold uppercase text-white/40 mb-2 tracking-widest">Target Tercapai</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-primary group-hover:scale-110 transition-transform inline-block">75%</span>
                    <div className="h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-primary rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Laba: Rp {totalProfit.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Hari Ini</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{transactionsToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Total {transactions.length} transaksi</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">{products.length} item aktif</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Stok Menipis</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Butuh restock segera</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-primary/5 border-primary/20 overflow-hidden relative group">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
              <Users2 className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Jumlah Member</p>
              <h3 className="text-4xl font-black text-primary">{members.length} <span className="text-lg font-normal text-muted-foreground">Orang</span></h3>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20 overflow-hidden relative group">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors" />
          <CardContent className="p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 border border-green-500/20 shadow-inner">
              <Wallet2 className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Tabungan Member</p>
              <h3 className="text-4xl font-black text-green-600">Rp {totalDeposits.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Grafik Penjualan 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp${v / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: 'var(--color-secondary)' }}
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(value: any) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value)}
                  />
                  <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Penjualan" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {transactions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">Belum ada aktivitas.</p>
              )}
              {transactions.slice(0, 5).map((tx, i) => (
                <div className="flex items-center" key={i}>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{tx.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {tx.method} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-primary">Rp {tx.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Produk Stok Menipis ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Nama Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-center">Sisa Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.barcode}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Badge variant="destructive">{p.stock}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
