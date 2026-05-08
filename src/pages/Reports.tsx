import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Filter, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { useTransactionStore } from "@/store/useTransactionStore";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export default function Reports() {
  const [period, setPeriod] = useState("weekly");
  const { transactions } = useTransactionStore();

  const stats = useMemo(() => {
    const totalSales = transactions.reduce((acc, tx) => acc + tx.total, 0);
    const totalProfit = transactions.reduce((acc, tx) => acc + tx.profit, 0);
    const cashCount = transactions.filter(t => t.method === "Cash").length;
    return { totalSales, totalProfit, count: transactions.length, cashCount };
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
    doc.setFontSize(18);
    doc.text("Laporan Penjualan - SaquMart", 14, 22);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 14, 30);
    doc.setFontSize(12);
    doc.text(`Total Penjualan: Rp ${stats.totalSales.toLocaleString()}`, 14, 42);
    doc.text(`Total Profit: Rp ${stats.totalProfit.toLocaleString()}`, 14, 50);
    doc.text(`Jumlah Transaksi: ${stats.count}`, 14, 58);

    let y = 72;
    doc.setFontSize(14);
    doc.text("Riwayat Transaksi", 14, y);
    y += 8;
    doc.setFontSize(9);
    doc.text("ID", 14, y); doc.text("Metode", 60, y); doc.text("Total", 100, y); doc.text("Profit", 140, y); doc.text("Waktu", 170, y);
    y += 6;
    transactions.slice(0, 30).forEach(tx => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(tx.id, 14, y);
      doc.text(tx.method, 60, y);
      doc.text(`Rp ${tx.total.toLocaleString()}`, 100, y);
      doc.text(`Rp ${tx.profit.toLocaleString()}`, 140, y);
      doc.text(new Date(tx.timestamp).toLocaleString("id-ID"), 170, y);
      y += 6;
    });
    doc.save(`laporan-saqumart-${Date.now()}.pdf`);
    toast.success("PDF berhasil diunduh!");
  };

  const handleExportCSV = () => {
    const header = "ID,Metode,Total,Profit,Kembalian,Waktu\n";
    const rows = transactions.map(tx =>
      `${tx.id},${tx.method},${tx.total},${tx.profit},${tx.change},${tx.timestamp}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `transaksi-saqumart-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV berhasil diunduh!");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Penjualan</h1>
          <p className="text-muted-foreground">Analisis performa penjualan dan profit toko Anda.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}><FileDown className="mr-2 h-4 w-4" /> Export PDF</Button>
          <Button variant="outline" onClick={handleExportCSV}><FileDown className="mr-2 h-4 w-4" /> Export CSV</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Pilih Periode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Harian</SelectItem>
            <SelectItem value="weekly">Mingguan</SelectItem>
            <SelectItem value="monthly">Bulanan</SelectItem>
            <SelectItem value="yearly">Tahunan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4" /> Total Penjualan</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">Rp {stats.totalSales.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Total Profit</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600 dark:text-green-400">Rp {stats.totalProfit.toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Transaksi</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.count}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Cash vs Non-Cash</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.cashCount} / {stats.count - stats.cashCount}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Tren Penjualan & Profit</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value)}
                  />
                  <Area type="monotone" dataKey="sales" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorSales)" name="Penjualan" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" name="Profit" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Belum ada data transaksi.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Riwayat Transaksi</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaksi</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Metode</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead>Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Belum ada transaksi.</TableCell></TableRow>
              )}
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                  <TableCell>
                    <div className="text-sm">{tx.items.map(i => `${i.name} x${i.qty}`).join(", ")}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tx.method === "Cash" ? "default" : "secondary"} className={tx.method === "Cash" ? "bg-green-600" : ""}>
                      {tx.method}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">Rp {tx.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-green-600 font-medium">Rp {tx.profit.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
