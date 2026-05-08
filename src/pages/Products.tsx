import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit2, Trash2, Printer } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Barcode from 'react-barcode';
import { useProductStore } from "@/store/useProductStore";
import type { Product } from "@/store/useProductStore";
import { cn } from "@/lib/utils";

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: Math.floor(Math.random() * 1000000000000).toString(),
    category: "Umum",
    price: 0,
    costPrice: 0,
    stock: 0
  });

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      name: editingProduct.name, barcode: editingProduct.barcode,
      category: editingProduct.category, price: editingProduct.price,
      costPrice: editingProduct.costPrice, stock: editingProduct.stock,
    });
    toast.success("Produk berhasil diperbarui!");
    setIsEditOpen(false);
  };

  const handlePrintBarcode = (product: Product) => {
    const printWindow = window.open('', '_blank', 'width=400,height=300');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head><title>Barcode - ${product.name}</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
          <h3 style="margin-bottom:8px;">${product.name}</h3>
          <div id="bc-container"></div>
          <p style="font-size:12px;margin-top:8px;">Rp ${product.price.toLocaleString()}</p>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
          <script>
            const container = document.getElementById('bc-container');
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            container.appendChild(svg);
            JsBarcode(svg, "${product.barcode}", {width:2,height:60,fontSize:14});
            window.print();
            window.close();
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintList = () => {
    window.print();
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Data Produk</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">Kelola daftar produk, stok, dan harga.</p>
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
                        <Label htmlFor="costPrice" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Beli (Rp)</Label>
                        <Input id="costPrice" type="number" value={newProduct.costPrice || ''} onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value === '' ? 0 : Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2 font-bold" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Jual (Rp)</Label>
                        <Input id="price" type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct({...newProduct, price: e.target.value === '' ? 0 : Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2 font-bold text-primary" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stock" className="text-[10px] font-black uppercase tracking-widest text-slate-500">Stok Awal</Label>
                      <Input id="stock" type="number" value={newProduct.stock || ''} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value === '' ? 0 : Number(e.target.value)})} className="h-10 md:h-11 rounded-xl bg-muted/50 border-2 font-bold" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-muted/30 p-4 md:p-6 space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preview Barcode</Label>
                    <div className="bg-white p-3 md:p-4 rounded-xl shadow-inner flex items-center justify-center w-full overflow-hidden">
                      <Barcode value={newProduct.barcode || "123456789012"} width={1} height={40} fontSize={10} />
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] font-bold text-primary hover:bg-primary/5 rounded-lg" onClick={() => setNewProduct({...newProduct, barcode: Math.floor(Math.random() * 1000000000000).toString()})}>
                      Refresh Barcode
                    </Button>
                  </div>
                </div>
                <DialogFooter className="mt-6 flex flex-col md:flex-row gap-2">
                  <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="order-2 md:order-1 font-bold">Batal</Button>
                  <Button className="order-1 md:order-2 font-black rounded-xl h-11 px-8" onClick={() => {
                    if (!newProduct.name || !newProduct.barcode) {
                      toast.error("Nama dan Barcode wajib diisi!");
                      return;
                    }
                    addProduct(newProduct);
                    toast.success("Produk berhasil ditambahkan!");
                    setIsAddOpen(false);
                    setNewProduct({
                      name: "",
                      barcode: Math.floor(Math.random() * 1000000000000).toString(),
                      category: "Umum",
                      price: 0,
                      costPrice: 0,
                      stock: 0
                    });
                  }}>Simpan Produk</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <CardHeader className="pb-4 bg-white/50 backdrop-blur-md border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-black tracking-tight">Katalog Produk</CardTitle>
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="search" 
                placeholder="Cari produk / barcode..." 
                className="pl-10 h-11 rounded-2xl bg-muted/50 border-2 focus-visible:ring-primary/20" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[10px] md:text-xs font-black uppercase tracking-widest pl-6">Produk</TableHead>
                  <TableHead className="text-[10px] md:text-xs font-black uppercase tracking-widest hidden lg:table-cell">Kategori</TableHead>
                  <TableHead className="text-right text-[10px] md:text-xs font-black uppercase tracking-widest">Harga Jual</TableHead>
                  <TableHead className="text-center text-[10px] md:text-xs font-black uppercase tracking-widest">Stok</TableHead>
                  <TableHead className="text-right text-[10px] md:text-xs font-black uppercase tracking-widest pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="font-black text-sm md:text-base text-slate-900 dark:text-white leading-tight">{item.name}</div>
                      <div className="text-[10px] md:text-xs font-mono text-muted-foreground mt-1">{item.barcode}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell"><Badge variant="secondary" className="font-black text-[10px] uppercase tracking-wider">{item.category}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="font-black text-primary text-sm md:text-base">
                        Rp {item.price.toLocaleString()}
                      </div>
                      <div className="text-[9px] md:text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                        HPP: {item.costPrice.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.stock < 10 ? "destructive" : "default"} className={cn("font-black text-[10px] md:text-xs min-w-[32px] justify-center", item.stock >= 10 ? "bg-emerald-500 hover:bg-emerald-600" : "")}>
                        {item.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-lg hover:bg-primary/10 hover:text-primary" onClick={() => handlePrintBarcode(item)} title="Print Barcode">
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-lg hover:bg-blue-500/10 hover:text-blue-600" onClick={() => handleEdit(item)} title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 md:h-9 md:w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                          if (confirm("Hapus produk ini?")) {
                            deleteProduct(item.id);
                            toast.success("Produk dihapus");
                          }
                        }} title="Hapus"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-8 w-8 mb-2 opacity-20" />
                        <p className="font-bold text-sm italic">Produk tidak ditemukan.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>Perbarui detail produk di bawah ini.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-6 py-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Nama Produk</Label>
                  <Input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>Barcode</Label>
                  <Input value={editingProduct.barcode} onChange={(e) => setEditingProduct({...editingProduct, barcode: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>Kategori</Label>
                  <Select value={editingProduct.category} onValueChange={(v) => setEditingProduct({...editingProduct, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                    <Label>Harga Beli</Label>
                    <Input type="number" value={editingProduct.costPrice || ''} onChange={(e) => setEditingProduct({...editingProduct, costPrice: Number(e.target.value)})} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Harga Jual</Label>
                    <Input type="number" value={editingProduct.price || ''} onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Stok</Label>
                  <Input type="number" value={editingProduct.stock || ''} onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center border rounded-lg bg-muted/30 p-6 space-y-4">
                <Label className="text-muted-foreground uppercase text-xs tracking-widest">Preview Barcode</Label>
                <div className="bg-white p-4 rounded shadow-sm">
                  <Barcode value={editingProduct.barcode || "000"} width={1.5} height={60} fontSize={12} />
                </div>
                <p className="text-sm font-bold">{editingProduct.name}</p>
                <p className="text-xs text-muted-foreground">Margin: Rp {(editingProduct.price - editingProduct.costPrice).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
