import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Truck, Phone, MapPin, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
  category: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'S1', name: 'Indofood Sukses Makmur', contact: '021-123456', address: 'Jakarta', category: 'Makanan' },
    { id: 'S2', name: 'Unilever Indonesia', contact: '021-654321', address: 'Tangerang', category: 'Kebutuhan Rumah' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", contact: "", address: "", category: "" });

  const filtered = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newSupplier.name) return;
    setSuppliers([...suppliers, { ...newSupplier, id: `S${Date.now()}` }]);
    setNewSupplier({ name: "", contact: "", address: "", category: "" });
    setIsAddOpen(false);
    toast.success("Supplier berhasil ditambahkan");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Supplier</h1>
          <p className="text-muted-foreground">Kelola mitra pemasok barang toko Anda.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Tambah Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Supplier Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Perusahaan/Supplier</Label>
                <Input value={newSupplier.name} onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})} placeholder="PT. ABC Jaya" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori Barang</Label>
                  <Input value={newSupplier.category} onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})} placeholder="Makanan/Minuman" />
                </div>
                <div className="space-y-2">
                  <Label>No. Telepon</Label>
                  <Input value={newSupplier.contact} onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})} placeholder="021-xxx" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alamat</Label>
                <Input value={newSupplier.address} onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})} placeholder="Alamat lengkap..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Simpan Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Supplier</p>
              <h3 className="text-2xl font-bold">{suppliers.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Daftar Pemasok</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari supplier..." 
                className="pl-9 h-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Nama Supplier</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="group">
                  <TableCell className="pl-6 font-bold">{s.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-muted rounded-md text-xs font-semibold">{s.category}</span>
                  </TableCell>
                  <TableCell className="text-sm"><Phone className="inline w-3 h-3 mr-1 opacity-50" /> {s.contact}</TableCell>
                  <TableCell className="text-sm"><MapPin className="inline w-3 h-3 mr-1 opacity-50" /> {s.address}</TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
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
