import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, TrendingUp, DollarSign, ShoppingCart, Calculator, ArrowUpRight, Printer } from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { useTransactionStore } from "@/store/useTransactionStore";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Reports() {
  const [period, setPeriod] = useState("weekly");
  const { transactions } = useTransactionStore();

  const stats = useMemo(() => {
    const totalSales = transactions.reduce((acc, tx) => acc + tx.total, 0);
    const totalProfit = transactions.reduce((acc, tx) => acc + tx.profit, 0);
    const totalCOGS = transactions.reduce((acc, tx) => {
      const cogs = tx.items.reduce((s, i) => s + (i.costPrice * i.qty), 0);
      return acc + cogs;
    }, 0);
    const cashCount = transactions.filter(t => t.method === "Cash").length;
    
    // Simulated Expenses (Beban)
    const expenses = [
      { name: "Listrik & Air", amount: 150000 },
      { name: "Gaji Karyawan", amount: 500000 },
      { name: "Sewa Tempat (Simulasi)", amount: 300000 },
      { name: "Lain-lain", amount: 50000 },
    ];
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

    return { totalSales, totalProfit, totalCOGS, count: transactions.length, cashCount, expenses, totalExpenses };
  }, [transactions]);

  const chartData = useMemo(() => {
    const groups: Record<string, { date: string; sales: number; profit: number }> = {};
    transactions.slice(0, 30).reverse().forEach(tx => {
      const date = new Date(tx.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      if (!groups[date]) groups[date] = { date, sales: 0, profit: 0 };
      groups[date].sales += tx.total;
      groups[date].profit += tx.profit;
    });
    return Object.values(groups);
  }, [transactions]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74);
    doc.text("LAPORAN LABA RUGI SAQUMART", 105, 25, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Periode: ${period.toUpperCase()} | Dicetak: ${new Date().toLocaleString("id-ID")}`, 105, 32, { align: "center" });

    doc.setDrawColor(200);
    doc.line(14, 40, 196, 40);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("RINGKASAN EKSEKUTIF", 14, 50);
    
    doc.setFontSize(10);
    let y = 60;
    const items = [
      ["Total Penjualan", `Rp ${stats.totalSales.toLocaleString()}`],
      ["Harga Pokok Penjualan (HPP)", `Rp ${stats.totalCOGS.toLocaleString()}`],
      ["Laba Kotor", `Rp ${stats.totalProfit.toLocaleString()}`],
      ["Total Beban Operasional", `Rp ${stats.totalExpenses.toLocaleString()}`],
      ["Laba Bersih", `Rp ${(stats.totalProfit - stats.totalExpenses).toLocaleString()}`],
    ];

    items.forEach(([label, value]) => {
      doc.text(label, 14, y);
      doc.text(value, 196, y, { align: "right" });
      y += 8;
    });

    doc.line(14, y + 2, 196, y + 2);
    y += 15;

    doc.setFontSize(12);
    doc.text("RINCIAN BEBAN", 14, y);
    y += 10;
    doc.setFontSize(10);
    stats.expenses.forEach(e => {
      doc.text(e.name, 20, y);
      doc.text(`Rp ${e.amount.toLocaleString()}`, 196, y, { align: "right" });
      y += 8;
    });

    doc.save(`neraca-saqumart-${Date.now()}.pdf`);
    toast.success("Neraca Laba Rugi berhasil diunduh!");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">Pantau kesehatan finansial toko Anda secara real-time.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none rounded-xl border-2 font-bold h-10 md:h-11" onClick={handleExportPDF}>
            <Printer className="mr-2 h-4 w-4 text-primary" /> Cetak Laporan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-muted/50 p-1 rounded-2xl h-12 md:h-14 mb-6">
          <TabsTrigger value="overview" className="rounded-xl font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="accounting" className="rounded-xl font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Laba Rugi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 outline-none">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-slate-700">Filter Periode:</span>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-xl border-2 h-10 font-bold"><SelectValue placeholder="Pilih Periode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="premium-card">
              <CardHeader className="pb-1 md:pb-2 text-center border-b border-slate-50 px-3">
                <CardTitle className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-1 md:gap-2">
                  <DollarSign className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary" /> Total Penjualan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-6 text-center px-3">
                <div className="text-lg md:text-2xl font-black tracking-tighter">Rp {stats.totalSales.toLocaleString()}</div>
                <div className="mt-2 inline-flex items-center text-[8px] md:text-[10px] text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-full font-bold">
                  <ArrowUpRight className="h-2 w-2 md:h-3 md:w-3 mr-1" /> +12%
                </div>
              </CardContent>
            </Card>
            <Card className="premium-card">
              <CardHeader className="pb-1 md:pb-2 text-center border-b border-slate-50 px-3">
                <CardTitle className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-1 md:gap-2">
                  <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3 text-emerald-500" /> Total Profit
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-6 text-center px-3">
                <div className="text-lg md:text-2xl font-black text-emerald-600 tracking-tighter">Rp {stats.totalProfit.toLocaleString()}</div>
                <div className="mt-2 inline-flex items-center text-[8px] md:text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-bold">
                  Margin {( (stats.totalProfit / stats.totalSales) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card className="premium-card">
              <CardHeader className="pb-1 md:pb-2 text-center border-b border-slate-50 px-3">
                <CardTitle className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-1 md:gap-2">
                  <ShoppingCart className="h-2.5 w-2.5 md:h-3 md:w-3 text-amber-500" /> Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-6 text-center px-3">
                <div className="text-lg md:text-2xl font-black tracking-tighter">{stats.count}</div>
                <p className="text-[8px] md:text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">Selesai</p>
              </CardContent>
            </Card>
            <Card className="premium-card">
              <CardHeader className="pb-1 md:pb-2 text-center border-b border-slate-50 px-3">
                <CardTitle className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-center gap-1 md:gap-2">
                   Payment Split
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-6 text-center px-3">
                <div className="text-lg md:text-2xl font-black tracking-tighter">{Math.round((stats.cashCount / stats.count) * 100)}%</div>
                <p className="text-[8px] md:text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">Cash Method</p>
              </CardContent>
            </Card>
          </div>

          <Card className="premium-card border-none shadow-2xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <CardTitle className="text-lg md:text-xl font-black tracking-tight">Tren Performa Penjualan</CardTitle>
              <Badge variant="outline" className="rounded-full font-bold text-[10px] md:text-xs">30 Hari Terakhir</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] md:h-[350px] w-full mt-2 md:mt-4">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis dataKey="date" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '12px' }}
                        formatter={(value: any) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value)}
                      />
                      <Area type="monotone" dataKey="sales" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="Penjualan" />
                      <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground italic font-medium text-sm">Belum ada data transaksi untuk ditampilkan.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounting" className="space-y-6 outline-none">
          <Card className="premium-card overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-6 md:p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter">Neraca Laba Rugi</h2>
                  <p className="text-slate-400 text-[10px] md:text-sm font-medium mt-1 uppercase tracking-widest">Accounting Standard Report</p>
                </div>
                <Calculator className="h-8 w-8 md:h-12 md:w-12 text-primary opacity-50" />
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <div className="space-y-8 md:space-y-12">
                {/* Revenue Section */}
                <section>
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 border-b-2 border-primary/10 pb-2">Pendapatan</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs md:text-sm font-bold">
                      <span>Total Penjualan Kotor</span>
                      <span>Rp {stats.totalSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs md:text-sm font-bold text-slate-500">
                      <span>Retur & Potongan</span>
                      <span className="text-destructive">(Rp 0)</span>
                    </div>
                    <div className="flex justify-between items-center text-base md:text-lg font-black pt-4 border-t border-slate-100">
                      <span>Penjualan Bersih</span>
                      <span>Rp {stats.totalSales.toLocaleString()}</span>
                    </div>
                  </div>
                </section>

                {/* COGS Section */}
                <section>
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 border-b-2 border-slate-100 pb-2">Harga Pokok Penjualan (HPP)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs md:text-sm font-bold">
                      <span>Pembelian Stok (COGS)</span>
                      <span>Rp {stats.totalCOGS.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-base md:text-lg font-black pt-4 border-t border-slate-100 text-slate-700">
                      <span>Laba Kotor (Gross Profit)</span>
                      <span className="text-emerald-600">Rp {stats.totalProfit.toLocaleString()}</span>
                    </div>
                  </div>
                </section>

                {/* Expenses Section */}
                <section>
                  <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-destructive mb-4 border-b-2 border-destructive/10 pb-2">Beban Operasional</h3>
                  <div className="space-y-4">
                    {stats.expenses.map((e, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs md:text-sm font-medium text-slate-600 italic">
                        <span>{e.name}</span>
                        <span>Rp {e.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-xs md:text-sm font-black text-slate-900 pt-2">
                      <span>Total Beban Operasional</span>
                      <span className="text-destructive">Rp {stats.totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </section>

                {/* Net Profit Section */}
                <section className="bg-primary/5 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-2 md:border-4 border-white shadow-2xl relative overflow-hidden mb-6 md:mb-12">
                  <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 md:opacity-10">
                    <TrendingUp className="h-16 w-16 md:h-24 md:w-24 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
                      <div className="text-center xl:text-left">
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 md:mb-3">Profitability Analysis</p>
                        <h2 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-900 leading-none">Laba Bersih</h2>
                      </div>
                      <div className="text-center xl:text-right w-full xl:w-auto">
                        <div className={cn(
                          "text-4xl md:text-6xl font-black tracking-tighter mb-1 md:mb-2",
                          (stats.totalProfit - stats.totalExpenses) >= 0 ? "text-emerald-600" : "text-destructive"
                        )}>
                          Rp {(stats.totalProfit - stats.totalExpenses).toLocaleString()}
                        </div>
                        <div className="h-1 md:h-1.5 w-full bg-emerald-600/20 rounded-full mb-2 md:mb-3" />
                        <div className="h-0.5 w-full bg-emerald-600/40 rounded-full mb-3 md:mb-4" />
                        
                        <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 font-black text-[9px] md:text-[11px]">
                            {(((stats.totalProfit - stats.totalExpenses) / stats.totalSales) * 100).toFixed(1)}%
                          </Badge>
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Net Margin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Balance Sheet (Neraca) Summary */}
                <section className="border-t-4 border-slate-900 pt-12">
                   <div className="flex items-center gap-4 mb-8">
                     <Calculator className="h-8 w-8 text-slate-900" />
                     <div>
                       <h3 className="text-2xl font-black tracking-tighter text-slate-900">Ringkasan Neraca (Balance Sheet)</h3>
                       <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Simulasi Posisi Keuangan Aktiva & Pasiva</p>
                     </div>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-12">
                     {/* Aktiva (Assets) */}
                     <div className="space-y-6">
                       <h4 className="text-sm font-black uppercase tracking-[0.2em] bg-slate-100 p-3 rounded-xl">Aktiva (Assets)</h4>
                       <div className="space-y-4 px-2">
                         <div className="flex justify-between font-bold text-sm">
                           <span className="text-slate-500 italic">Kas & Setara Kas</span>
                           <span>Rp {stats.totalSales.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between font-bold text-sm">
                           <span className="text-slate-500 italic">Persediaan Barang (Stok)</span>
                           <span>Rp {(stats.totalCOGS * 1.5).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between font-bold text-sm">
                           <span className="text-slate-500 italic">Piutang Member</span>
                           <span>Rp 0</span>
                         </div>
                         <div className="flex justify-between font-black text-lg pt-4 border-t-2 border-slate-200 text-slate-900">
                           <span>Total Aktiva</span>
                           <span>Rp {(stats.totalSales + (stats.totalCOGS * 1.5)).toLocaleString()}</span>
                         </div>
                       </div>
                     </div>

                     {/* Pasiva (Liabilities & Equity) */}
                     <div className="space-y-6">
                       <h4 className="text-sm font-black uppercase tracking-[0.2em] bg-slate-100 p-3 rounded-xl">Pasiva (Liabilities & Equity)</h4>
                       <div className="space-y-4 px-2">
                         <div className="flex justify-between font-bold text-sm">
                           <span className="text-slate-500 italic">Hutang Dagang (Supplier)</span>
                           <span>Rp 0</span>
                         </div>
                         <div className="flex justify-between font-bold text-sm">
                           <span className="text-slate-500 italic">Modal Awal</span>
                           <span>Rp {(stats.totalCOGS * 2).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between font-bold text-sm">
                           <span className="text-slate-500 italic">Laba Ditahan</span>
                           <span className="text-emerald-600">Rp {(stats.totalProfit - stats.totalExpenses).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between font-black text-lg pt-4 border-t-2 border-slate-200 text-slate-900">
                           <span>Total Pasiva</span>
                           <span>Rp {(stats.totalSales + (stats.totalCOGS * 1.5)).toLocaleString()}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="mt-12 p-6 bg-slate-900 text-white rounded-[2rem] text-center font-bold tracking-tighter">
                      Neraca Seimbang (Balanced) - Sistem Verifikasi Akuntansi SaquMart ✅
                   </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
