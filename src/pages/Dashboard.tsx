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
            className="relative overflow-hidden bg-[#0a2e1f] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl shadow-emerald-900/20 border border-white/10"
          >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-32 -mb-32" />
            
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
              <Button variant="ghost" size="icon" onClick={closeWelcome} className="text-white/40 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 md:h-10 md:w-10 transition-all">
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
            
            <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 md:gap-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8">
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-primary rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative w-16 h-16 md:w-24 md:h-24 bg-white/5 backdrop-blur-2xl rounded-2xl md:rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
                    <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-emerald-400 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md text-emerald-400">
                    <Shield className="h-3 w-3 md:h-3.5 md:w-3.5" /> Akses {user?.role} Aktif
                  </div>
                  <h2 className="text-2xl md:text-5xl font-black tracking-tight leading-tight">
                    Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">{user?.name.split(' ')[0]}!</span>
                  </h2>
                  <div className="flex items-center gap-2 md:gap-3 text-white/60">
                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                    <p className="text-xs md:text-sm font-medium italic">"Kejujuran adalah kunci keberkahan setiap transaksi."</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full xl:w-auto">
                <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-center">
                  <p className="text-[9px] md:text-[10px] font-bold uppercase text-white/40 mb-1 md:mb-2 tracking-widest">Omzet Hari Ini</p>
                  <div className="flex items-end gap-1">
                    <span className="text-xl md:text-2xl font-black text-emerald-400 group-hover:scale-110 transition-transform inline-block">Rp</span>
                    <span className="text-2xl md:text-3xl font-black">{revenueToday.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group flex flex-col justify-center">
                  <p className="text-[9px] md:text-[10px] font-bold uppercase text-white/40 mb-1 md:mb-2 tracking-widest">Target Tercapai</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-3xl font-black text-primary group-hover:scale-110 transition-transform inline-block">75%</span>
                    <div className="h-1.5 md:h-2 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-primary rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
            <CardTitle className="text-[10px] md:text-sm font-medium">Pemasukan Total</CardTitle>
            <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-lg md:text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
            <p className="text-[9px] md:text-xs text-muted-foreground mt-1">Laba: Rp {totalProfit.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
            <CardTitle className="text-[10px] md:text-sm font-medium">Transaksi Hari Ini</CardTitle>
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-lg md:text-2xl font-bold">+{transactionsToday}</div>
            <p className="text-[9px] md:text-xs text-muted-foreground mt-1">Total {transactions.length} transaksi</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
            <CardTitle className="text-[10px] md:text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-lg md:text-2xl font-bold">{totalProducts}</div>
            <p className="text-[9px] md:text-xs text-muted-foreground mt-1">{products.length} item aktif</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 md:px-6">
            <CardTitle className="text-[10px] md:text-sm font-medium text-destructive">Stok Menipis</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
          </CardHeader>
          <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="text-lg md:text-2xl font-bold text-destructive">{lowStockProducts.length}</div>
            <p className="text-[9px] md:text-xs text-muted-foreground mt-1">Butuh restock segera</p>
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

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-7">
        <Card className="xl:col-span-4 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-black">Grafik Penjualan 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 md:pl-2">
            <div className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp${v / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: 'var(--color-secondary)' }}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: any) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value)}
                  />
                  <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Penjualan" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-black">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 md:space-y-8">
              {transactions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">Belum ada aktivitas.</p>
              )}
              {transactions.slice(0, 5).map((tx, i) => (
                <div className="flex items-center" key={i}>
                  <div className="space-y-1">
                    <p className="text-xs md:text-sm font-bold leading-none truncate max-w-[150px] md:max-w-none">{tx.id}</p>
                    <p className="text-[10px] md:text-sm text-muted-foreground">
                      {tx.method} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="ml-auto font-black text-primary text-sm md:text-base">Rp {tx.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {lowStockProducts.length > 0 && (
        <Card className="border-destructive/30 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive text-lg md:text-xl font-black">
              <AlertTriangle className="h-5 w-5" />
              Produk Stok Menipis ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-[10px] md:text-sm uppercase font-black">Barcode</TableHead>
                    <TableHead className="text-[10px] md:text-sm uppercase font-black">Nama Produk</TableHead>
                    <TableHead className="text-[10px] md:text-sm uppercase font-black hidden sm:table-cell">Kategori</TableHead>
                    <TableHead className="text-center text-[10px] md:text-sm uppercase font-black">Sisa Stok</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-[10px] md:text-xs">{p.barcode}</TableCell>
                      <TableCell className="font-bold text-xs md:text-sm">{p.name}</TableCell>
                      <TableCell className="hidden sm:table-cell"><Badge variant="secondary" className="text-[9px] md:text-[10px] font-black uppercase">{p.category}</Badge></TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive" className="text-[10px] md:text-xs font-black">{p.stock}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
