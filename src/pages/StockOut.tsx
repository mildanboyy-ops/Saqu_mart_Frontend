import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpFromLine, Search, Minus } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { useRealtimeStore } from "@/store/useRealtimeStore";
import { toast } from "sonner";

export default function StockOut() {
  const { products, updateStock } = useProductStore();
  const [barcode, setBarcode] = useState("");
  const [amount, setAmount] = useState(0);
  const [history, setHistory] = useState<{name: string, qty: number, time: string}[]>([]);

  const foundProduct = products.find(p => p.barcode === barcode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundProduct) {
      toast.error("Barcode tidak ditemukan!");
      return;
    }
    if (amount <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }
    if (foundProduct.stock < amount) {
      toast.error(`Stok tidak cukup! (Sisa: ${foundProduct.stock})`);
      return;
    }

    try {
      await updateStock(barcode, -amount);
      setHistory([{ name: foundProduct.name, qty: amount, time: new Date().toLocaleTimeString() }, ...history]);
      
      const { addEvent } = useRealtimeStore.getState();
      addEvent({
        type: 'stock',
        message: `Stok Keluar: ${foundProduct.name} (-${amount})`,
        branch: 'Cabang Utama'
      });
      
      toast.success(`Berhasil mengurangi ${amount} stok untuk ${foundProduct.name}`);
      setBarcode("");
      setAmount(0);
    } catch (error) {
      toast.error("Gagal memperbarui stok di server.");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Barang Keluar</h1>
          <p className="text-muted-foreground">Kurangi stok barang (Rusak, Expired, dll).</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-destructive" />
              Input Stok Keluar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="barcode">Scan / Input Barcode</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="barcode" 
                    placeholder="Contoh: 899999..." 
                    className="pl-9"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </div>
              </div>

              {foundProduct && (
                <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg animate-in zoom-in-95">
                  <p className="text-xs text-destructive font-bold uppercase tracking-wider">Produk Terdeteksi</p>
                  <p className="font-bold text-lg">{foundProduct.name}</p>
                  <p className="text-sm text-muted-foreground">Stok Saat Ini: <span className="font-bold text-foreground">{foundProduct.stock}</span></p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Keluar</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <Button type="submit" variant="destructive" className="w-full h-12 text-lg">
                <ArrowUpFromLine className="mr-2 h-5 w-5" />
                Simpan Stok Keluar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader>
            <CardTitle>Riwayat Pengurangan (Sesi Ini)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                      Belum ada aktivitas.
                    </TableCell>
                  </TableRow>
                )}
                {history.map((h, i) => (
                  <TableRow key={i} className="table-row-hover">
                    <TableCell className="font-medium">{h.name}</TableCell>
                    <TableCell className="text-destructive font-bold">-{h.qty}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{h.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
