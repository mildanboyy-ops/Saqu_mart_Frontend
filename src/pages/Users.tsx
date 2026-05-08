import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Shield, Search, Power } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserStore } from "@/store/useUserStore";
import type { ManagedUser } from "@/store/useUserStore";
import type { UserRole } from "@/store/useAuthStore";
import { toast } from "sonner";

const emptyForm = { name: "", email: "", role: "Kasir" as UserRole, status: "Active" as "Active" | "Inactive", phone: "" };

export default function Users() {
  const { users, addUser, updateUser, deleteUser, toggleStatus } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState("");

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.email) { toast.error("Nama dan Email wajib diisi!"); return; }
    addUser(form);
    toast.success("User berhasil ditambahkan!");
    setForm(emptyForm);
    setIsAddOpen(false);
  };

  const handleEditOpen = (u: ManagedUser) => {
    setEditId(u.id);
    setForm({ name: u.name, email: u.email, role: u.role, status: u.status as "Active" | "Inactive", phone: u.phone || "" });
    setIsEditOpen(true);
  };

  const handleEditSave = () => {
    if (!form.name || !form.email) { toast.error("Nama dan Email wajib diisi!"); return; }
    updateUser(editId, form);
    toast.success("User berhasil diperbarui!");
    setIsEditOpen(false);
  };

  const roleColor = (role: string) => {
    if (role === "Owner") return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    if (role === "Admin") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-green-500/10 text-green-600 border-green-500/20";
  };

  const UserFormFields = () => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label>Nama Lengkap</Label>
        <Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Nama karyawan" />
      </div>
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="email@saqumart.com" />
      </div>
      <div className="grid gap-2">
        <Label>No. Telepon</Label>
        <Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="0812..." />
      </div>
      <div className="grid gap-2">
        <Label>Role</Label>
        <Select value={form.role} onValueChange={(v: UserRole) => setForm({...form, role: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Owner">Owner (Full Access)</SelectItem>
            <SelectItem value="Admin">Admin (Kelola Produk)</SelectItem>
            <SelectItem value="Kasir">Kasir (Hanya POS)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">Kelola akun karyawan dan hak akses mereka.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Tambah User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
              <DialogDescription>Lengkapi data karyawan baru.</DialogDescription>
            </DialogHeader>
            <UserFormFields />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
              <Button onClick={handleAdd}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Daftar User ({users.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Cari user..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">User</TableHead>
                <TableHead>Nama & Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tgl Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar><AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleColor(user.role)}`}>
                      <Shield className="h-3 w-3" />
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"} className={user.status === "Active" ? "bg-green-600" : ""}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(user.id)} title="Toggle Status">
                      <Power className="h-4 w-4 text-amber-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditOpen(user)} title="Edit">
                      <Edit2 className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      if (confirm(`Hapus user ${user.name}?`)) { deleteUser(user.id); toast.success("User dihapus"); }
                    }} title="Hapus"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">User tidak ditemukan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Perbarui data karyawan.</DialogDescription>
          </DialogHeader>
          <UserFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button onClick={handleEditSave}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
