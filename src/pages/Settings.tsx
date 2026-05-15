import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Printer, Database } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useProductStore } from "@/store/useProductStore";
import { toast } from "sonner";
import { useState } from "react";


export default function Settings() {
  const settings = useSettingsStore();
  const { transactions, clearHistory } = useTransactionStore();
  const { products } = useProductStore();

  const [localStore, setLocalStore] = useState({
    storeName: settings.storeName,
    storeAddress: settings.storeAddress,
    storePhone: settings.storePhone,
    receiptFooter: settings.receiptFooter
  });

  const [localPOS, setLocalPOS] = useState({
    taxRate: settings.taxRate,
    printerName: settings.printerName
  });

  const handleSaveStore = async () => {
    try {
      await settings.updateSettings(localStore);
      toast.success("Informasi toko berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan informasi toko.");
    }
  };

  const handleSavePOS = async () => {
    try {
      await settings.updateSettings(localPOS);
      toast.success("Pengaturan POS berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan POS.");
    }
  };

  const handleBackup = () => {
    const data = {
      products, transactions,
      settings: {
        storeName: settings.storeName, storeAddress: settings.storeAddress,
        storePhone: settings.storePhone, taxRate: settings.taxRate,
        printerName: settings.printerName,
      },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-saqumart-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup berhasil diunduh!");
  };

  const handleReset = () => {
    if (confirm("PERINGATAN: Semua data transaksi akan dihapus! Lanjutkan?")) {
      clearHistory();
      toast.success("Data transaksi berhasil direset.");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Konfigurasi toko, printer, dan sistem.</p>
      </div>

      <Tabs defaultValue="store" className="space-y-4">
        <TabsList>
          <TabsTrigger value="store" className="gap-2"><Store className="h-4 w-4" /> Toko</TabsTrigger>
          <TabsTrigger value="pos" className="gap-2"><Printer className="h-4 w-4" /> POS & Printer</TabsTrigger>
          <TabsTrigger value="system" className="gap-2"><Database className="h-4 w-4" /> Sistem</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle>Informasi Toko</CardTitle>
              <CardDescription>Detail identitas toko yang akan muncul di struk.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="store-name">Nama Toko</Label>
                <Input id="store-name" value={localStore.storeName} onChange={(e) => setLocalStore({...localStore, storeName: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" value={localStore.storeAddress} onChange={(e) => setLocalStore({...localStore, storeAddress: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">No. Telepon</Label>
                <Input id="phone" value={localStore.storePhone} onChange={(e) => setLocalStore({...localStore, storePhone: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="footer">Footer Struk</Label>
                <Input id="footer" value={localStore.receiptFooter} onChange={(e) => setLocalStore({...localStore, receiptFooter: e.target.value})} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStore}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="pos">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle>Pengaturan POS</CardTitle>
              <CardDescription>Konfigurasi struk dan printer thermal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="tax">Pajak (%)</Label>
                <Input id="tax" type="number" value={localPOS.taxRate} onChange={(e) => setLocalPOS({...localPOS, taxRate: Number(e.target.value)})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="printer">Printer Thermal</Label>
                <Input id="printer" value={localPOS.printerName} onChange={(e) => setLocalPOS({...localPOS, printerName: e.target.value})} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePOS}>Simpan Perubahan</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle>Maintenance Sistem</CardTitle>
              <CardDescription>Backup data dan log aktivitas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <div className="font-medium">Backup Database</div>
                  <div className="text-sm text-muted-foreground">Unduh salinan data produk dan transaksi ({products.length} produk, {transactions.length} transaksi).</div>
                </div>
                <Button variant="outline" className="gap-2" onClick={handleBackup}><Database className="h-4 w-4" /> Backup Now</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="space-y-0.5">
                  <div className="font-medium text-destructive">Reset Data Transaksi</div>
                  <div className="text-sm text-muted-foreground">Hapus semua data transaksi (Hati-hati! Tidak bisa di-undo).</div>
                </div>
                <Button variant="destructive" onClick={handleReset}>Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
