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
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Produk</h1>
          <p className="text-muted-foreground">Kelola daftar produk, stok, dan harga.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintList}><Printer className="mr-2 h-4 w-4"/> Cetak Laporan</Button>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4"/> Tambah Produk</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tambah Produk Baru</DialogTitle>
                <DialogDescription>
                  Lengkapi detail produk di bawah ini. Barcode akan digenerate otomatis jika kosong.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Produk</Label>
                    <Input id="name" placeholder="Contoh: Indomie Goreng" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={newProduct.category} onValueChange={(v) => setNewProduct({...newProduct, category: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori" />
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
                      <Label htmlFor="costPrice">Harga Beli</Label>
                      <Input id="costPrice" type="number" value={newProduct.costPrice || ''} onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value === '' ? 0 : Number(e.target.value)})} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Harga Jual</Label>
                      <Input id="price" type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct({...newProduct, price: e.target.value === '' ? 0 : Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stok Awal</Label>
                    <Input id="stock" type="number" value={newProduct.stock || ''} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value === '' ? 0 : Number(e.target.value)})} />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center border rounded-lg bg-muted/30 p-6 space-y-4">
                  <Label className="text-muted-foreground uppercase text-xs tracking-widest">Preview Barcode</Label>
                  <div className="bg-white p-4 rounded shadow-sm">
                    <Barcode value={newProduct.barcode || "123456789012"} width={1.5} height={60} fontSize={12} />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setNewProduct({...newProduct, barcode: Math.floor(Math.random() * 1000000000000).toString()})}>
                    Generate New Barcode
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                <Button onClick={() => {
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
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Produk</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Cari produk / barcode..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barcode</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga Beli</TableHead>
                <TableHead className="text-right">Harga Jual</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.barcode}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.price)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(item.costPrice)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.stock < 10 ? "destructive" : "default"} className={item.stock >= 10 ? "bg-green-600 hover:bg-green-700" : ""}>
                      {item.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handlePrintBarcode(item)} title="Print Barcode">
                      <Printer className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} title="Edit">
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      if (confirm("Hapus produk ini?")) {
                        deleteProduct(item.id);
                        toast.success("Produk dihapus");
                      }
                    }} title="Hapus"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    Produk tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
