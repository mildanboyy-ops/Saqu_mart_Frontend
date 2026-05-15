import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit2, Trash2, Printer, DollarSign, ArrowDownToLine, ArrowUpFromLine, AlertCircle, Activity } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Barcode from 'react-barcode';
import { useProductStore } from "@/store/useProductStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import type { Product } from "@/store/useProductStore";
import { cn } from "@/lib/utils";
import { printReceipt as runPrint } from "@/lib/printer";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function Products() {
  const products = useProductStore(state => state.products);
  const addProduct = useProductStore(state => state.addProduct);
  const updateProduct = useProductStore(state => state.updateProduct);
  const deleteProduct = useProductStore(state => state.deleteProduct);
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const isLoading = useProductStore(state => state.isLoading);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const settings = useSettingsStore();

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Umum",
    price: 0,
    costPrice: 0,
    stock: 0,
  });

  const totalValue = useMemo(() => products.reduce((acc, p) => acc + (Number(p.price) * p.stock), 0), [products]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock < 10).length, [products]);
  
  const transactions = useTransactionStore(state => state.transactions);
  
  const stockStats = useMemo(() => {
    // Calculate real stats from transactions if possible
    const out = transactions.reduce((acc, tx) => acc + tx.items.reduce((sum, item) => sum + item.qty, 0), 0);
    // For "In", we'd ideally fetch from stock transactions, but let's at least make it stable
    const inCount = products.reduce((acc, p) => acc + p.stock, 0); 
    return { in: inCount, out };
  }, [transactions, products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async () => {
    try {
      const data = {
        ...newProduct,
        barcode: `BRC-${Date.now()}`,
        price: Number(newProduct.price),
        costPrice: Number(newProduct.costPrice),
        stock: Number(newProduct.stock)
      };
      await addProduct(data);
      toast.success("Produk berhasil ditambahkan!");
      setIsAddOpen(false);
      setNewProduct({ name: "", category: "Umum", price: 0, costPrice: 0, stock: 0 });
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambahkan produk.");
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    try {
      // Clean up data before sending
      const { id, category, createdAt, updatedAt, ...rest } = selectedProduct as any;
      
      const updateData = {
        ...rest,
        category: typeof category === 'object' ? category.name : category
      };

      await updateProduct(id, updateData);
      toast.success("Produk berhasil diperbarui!");
      setIsEditOpen(false);
    } catch (error: any) {
      console.error("Gagal memperbarui produk:", error.response?.data || error);
      toast.error("Gagal memperbarui produk.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus produk ini?")) {
      try {
        await deleteProduct(id);
        toast.success("Produk berhasil dihapus!");
      } catch (error) {
        toast.error("Gagal menghapus produk.");
      }
    }
  };

  const handlePrintBarcode = (p: Product) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>Print Barcode</title></head>
        <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
          <h3>${p.name}</h3>
          <div id="barcode"></div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <script>
            JsBarcode("#barcode", "${p.barcode}", { format: "CODE128", width: 2, height: 100 });
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintList = () => {
    const html = `
      <html>
        <head>
          <title>Laporan Inventaris - ${settings.storeName}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 4px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 20pt; font-weight: 900; color: #16a34a; margin: 0; }
            .meta { font-size: 10pt; color: #64748b; margin-top: 5px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th { background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; text-align: left; font-size: 10pt; font-weight: 800; text-transform: uppercase; }
            .table td { padding: 10px; border: 1px solid #e2e8f0; font-size: 10pt; }
            .table tr:nth-child(even) { background: #fcfcfc; }
            .total-section { margin-top: 30px; border-top: 2px solid #e2e8f0; pt: 20px; text-align: right; }
            .total-box { display: inline-block; background: #f8fafc; padding: 15px 25px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .total-label { font-size: 9pt; font-weight: 800; color: #64748b; text-transform: uppercase; }
            .total-value { font-size: 16pt; font-weight: 900; color: #0f172a; }
            .footer { margin-top: 50px; font-size: 8pt; color: #94a3b8; text-align: center; }
            @media print {
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${settings.storeName.toUpperCase()}</h1>
            <div class="title" style="font-size: 14pt; color: #333; margin-top: 5px;">LAPORAN INVENTARIS BARANG</div>
            <div class="meta">
              Dicetak pada: ${new Date().toLocaleString('id-ID')} | Total Item: ${products.length}
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th style="width: 40px;">No</th>
                <th>Nama Produk</th>
                <th>Barcode</th>
                <th>Kategori</th>
                <th style="text-align: right;">Harga</th>
                <th style="text-align: center;">Stok</th>
              </tr>
            </thead>
            <tbody>
              ${products.map((p, i) => `
                <tr>
                  <td style="text-align: center;">${i + 1}</td>
                  <td style="font-weight: 700;">${p.name}</td>
                  <td style="font-family: monospace;">${p.barcode}</td>
                  <td>${typeof p.category === 'object' ? (p.category as any).name : p.category}</td>
                  <td style="text-align: right;">Rp ${p.price.toLocaleString()}</td>
                  <td style="text-align: center; font-weight: 800; ${p.stock < 10 ? 'color: #ef4444' : ''}">${p.stock}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
              <div class="total-label">Estimasi Nilai Inventaris</div>
              <div class="total-value">Rp ${totalValue.toLocaleString()}</div>
            </div>
          </div>

          <div class="footer">
            <p>${settings.storeAddress} | Telp: ${settings.storePhone}</p>
            <p>Halaman 1 dari 1 - Dokumen Sah SaquMart Enterprise System</p>
          </div>
        </body>
      </html>
    `;
    runPrint(html);
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Data Produk</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500 animate-pulse" /> Live Inventory System
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={handlePrintList} className="flex-1 md:flex-none h-10 md:h-11 font-bold border-2 rounded-xl">
            <Printer className="mr-2 h-4 w-4"/> Cetak
          </Button>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 md:flex-none h-10 md:h-11 font-black rounded-xl">
                <Plus className="mr-2 h-4 w-4"/> Tambah
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
              <DialogHeader className="p-6 bg-slate-900 text-white">
                <DialogTitle className="text-xl md:text-2xl font-black tracking-tight">Tambah Produk Baru</DialogTitle>
                <DialogDescription className="text-slate-400 text-xs md:text-sm">
                  Lengkapi detail produk di bawah ini. Barcode akan digenerate otomatis.
                </DialogDescription>
              </DialogHeader>
              <div className="p-6">
                <div className="grid gap-6 py-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nama Produk</Label>
                      <Input id="name" placeholder="Contoh: Indomie Goreng" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kategori</Label>
                      <Select value={newProduct.category} onValueChange={(v) => setNewProduct({...newProduct, category: v})}>
                        <SelectTrigger className="h-10 md:h-11 rounded-xl bg-muted/50 border-2">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2">
                          <SelectItem value="Makanan">Makanan</SelectItem>
                          <SelectItem value="Minuman">Minuman</SelectItem>
                          <SelectItem value="Sembako">Sembako</SelectItem>
                          <SelectItem value="Umum">Umum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Harga Jual</Label>
                        <Input id="price" type="number" placeholder="0" value={newProduct.price || ""} onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stok Awal</Label>
                        <Input id="stock" type="number" placeholder="0" value={newProduct.stock || ""} onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="costPrice" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Harga Beli (Modal)</Label>
                        <Input id="costPrice" type="number" placeholder="0" value={newProduct.costPrice || ""} onChange={(e) => setNewProduct({...newProduct, costPrice: Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2" />
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Preview Barcode</p>
                     <div className="bg-white p-4 rounded-xl shadow-sm">
                        <Barcode value={newProduct.name || "SAQU-MART"} width={1.5} height={50} fontSize={10} />
                     </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="p-6 bg-slate-50">
                <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold">Batal</Button>
                <Button onClick={handleAdd} className="rounded-xl font-black px-8">Simpan Produk</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Real-time Inventory Stats Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="luxury-card border-none shadow-sm bg-white/50 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-primary/10 rounded-lg"><DollarSign className="h-5 w-5 text-primary" /></div>
              <Badge variant="outline" className="text-[9px] font-black uppercase text-primary border-primary/20">Asset Value</Badge>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Nilai Produk</p>
            <div className="text-xl md:text-2xl font-black tracking-tighter mt-1 text-slate-900 dark:text-white">Rp {totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="luxury-card border-none shadow-sm bg-white/50 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg"><ArrowDownToLine className="h-5 w-5 text-emerald-500" /></div>
              <Badge variant="outline" className="text-[9px] font-black uppercase text-emerald-600 border-emerald-500/20">Realtime</Badge>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Barang Masuk (Hari Ini)</p>
            <div className="text-xl md:text-2xl font-black text-emerald-600 tracking-tighter mt-1">+{stockStats.in} <span className="text-xs font-bold text-muted-foreground">Unit</span></div>
          </CardContent>
        </Card>

        <Card className="luxury-card border-none shadow-sm bg-white/50 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-destructive/10 rounded-lg"><ArrowUpFromLine className="h-5 w-5 text-destructive" /></div>
              <Badge variant="outline" className="text-[9px] font-black uppercase text-destructive border-destructive/20">Realtime</Badge>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Barang Keluar (Hari Ini)</p>
            <div className="text-xl md:text-2xl font-black text-destructive tracking-tighter mt-1">-{stockStats.out} <span className="text-xs font-bold text-muted-foreground">Unit</span></div>
          </CardContent>
        </Card>

        <Card className="luxury-card border-none shadow-sm bg-white/50 backdrop-blur-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg"><AlertCircle className="h-5 w-5 text-amber-500" /></div>
              <Badge variant={lowStockCount > 0 ? "destructive" : "outline"} className="text-[9px] font-black uppercase tracking-widest">
                {lowStockCount > 0 ? "Critical" : "Healthy"}
              </Badge>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stok Menipis</p>
            <div className="text-xl md:text-2xl font-black tracking-tighter mt-1 text-slate-900 dark:text-white">{lowStockCount} <span className="text-xs font-bold text-muted-foreground">Produk</span></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari produk berdasarkan nama atau barcode..." 
            className="pl-10 h-12 rounded-2xl bg-white border-2 border-slate-100 shadow-sm focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="luxury-card border-none shadow-xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow className="hover:bg-slate-900 border-none">
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px] py-6">Produk</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px]">Kategori</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px]">Harga Jual</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px]">Harga Beli</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px] text-center">Stok</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px] text-right pr-8">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-bold italic">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      Memuat data produk...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-bold italic">Tidak ada produk ditemukan.</TableCell>
                </TableRow>
              ) : filtered.map((product) => (
                <TableRow key={product.id} className="group hover:bg-slate-50/80 transition-colors border-slate-100">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 dark:text-white tracking-tight">{product.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-tighter uppercase">{product.barcode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-lg font-black text-[9px] uppercase tracking-widest bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-white/10 dark:text-slate-300">
                      {typeof product.category === 'object' ? (product.category as any).name : product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-slate-900 dark:text-white">Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell className="font-bold text-slate-400 dark:text-slate-500">Rp {product.costPrice?.toLocaleString() || 0}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "rounded-lg font-black px-3 py-1",
                      product.stock < 10 ? "bg-destructive text-white" : product.stock < 20 ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
                    )}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2 transition-all">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 text-slate-400 hover:text-primary transition-colors" onClick={() => handlePrintBarcode(product)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-emerald-100/50 text-slate-400 hover:text-emerald-500 transition-colors" onClick={() => { setSelectedProduct(product); setIsEditOpen(true); }}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-destructive/10 text-slate-400 hover:text-destructive transition-colors" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
          <DialogHeader className="p-6 bg-emerald-600 text-white">
            <DialogTitle className="text-xl md:text-2xl font-black tracking-tight">Edit Produk</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {selectedProduct && (
              <div className="grid gap-6 py-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nama Produk</Label>
                    <Input value={selectedProduct.name} onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kategori</Label>
                    <Select value={typeof selectedProduct.category === 'object' ? (selectedProduct.category as any).name : selectedProduct.category} onValueChange={(v) => setSelectedProduct({...selectedProduct, category: v})}>
                      <SelectTrigger className="h-10 md:h-11 rounded-xl bg-muted/50 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Makanan">Makanan</SelectItem>
                        <SelectItem value="Minuman">Minuman</SelectItem>
                        <SelectItem value="Sembako">Sembako</SelectItem>
                        <SelectItem value="Umum">Umum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Harga Jual</Label>
                      <Input type="number" placeholder="0" value={selectedProduct.price || ""} onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stok</Label>
                      <Input type="number" placeholder="0" value={selectedProduct.stock || ""} onChange={(e) => setSelectedProduct({...selectedProduct, stock: Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Harga Beli (Modal)</Label>
                      <Input type="number" placeholder="0" value={selectedProduct.costPrice || ""} onChange={(e) => setSelectedProduct({...selectedProduct, costPrice: Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2" />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Barcode Preview</p>
                   <div className="bg-white p-4 rounded-xl shadow-sm">
                      <Barcode value={selectedProduct.barcode} width={1.5} height={50} fontSize={10} />
                   </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="p-6 bg-slate-50">
            <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl font-bold">Batal</Button>
            <Button onClick={handleUpdate} className="rounded-xl font-black px-8 bg-emerald-600 hover:bg-emerald-700 text-white">Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
