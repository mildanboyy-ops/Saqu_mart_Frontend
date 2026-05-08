import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownToLine, Search, Plus } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { toast } from "sonner";

export default function StockIn() {
  const { products, updateStock } = useProductStore();
  const [barcode, setBarcode] = useState("");
  const [amount, setAmount] = useState(0);
  const [history, setHistory] = useState<{name: string, qty: number, time: string}[]>([]);

  const foundProduct = products.find(p => p.barcode === barcode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundProduct) {
      toast.error("Barcode tidak ditemukan!");
      return;
    }
    if (amount <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      return;
    }

    updateStock(barcode, amount);
    setHistory([{ name: foundProduct.name, qty: amount, time: new Date().toLocaleTimeString() }, ...history]);
    toast.success(`Berhasil menambah ${amount} stok untuk ${foundProduct.name}`);
    setBarcode("");
    setAmount(0);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Barang Masuk</h1>
          <p className="text-muted-foreground">Tambah stok barang ke inventaris.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500" />
              Input Stok Masuk
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
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg animate-in zoom-in-95">
                  <p className="text-xs text-primary font-bold uppercase tracking-wider">Produk Terdeteksi</p>
                  <p className="font-bold text-lg">{foundProduct.name}</p>
                  <p className="text-sm text-muted-foreground">Stok Saat Ini: <span className="font-bold text-foreground">{foundProduct.stock}</span></p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah Masuk</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg">
                <ArrowDownToLine className="mr-2 h-5 w-5" />
                Simpan Stok Masuk
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Input (Sesi Ini)</CardTitle>
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
                  <TableRow key={i}>
                    <TableCell className="font-medium">{h.name}</TableCell>
                    <TableCell className="text-green-600 font-bold">+{h.qty}</TableCell>
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
