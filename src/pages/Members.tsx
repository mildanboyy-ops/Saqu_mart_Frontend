import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMemberStore } from "@/store/useMemberStore";

import type { Member } from "@/store/useMemberStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, UserPlus, Trash2, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTransactionStore } from "@/store/useTransactionStore";

export default function Members() {
  const navigate = useNavigate();
  const members = useMemberStore(state => state.members);

  const addMember = useMemberStore(state => state.addMember);
  const updateMember = useMemberStore(state => state.updateMember);
  const deleteMember = useMemberStore(state => state.deleteMember);
  const updateBalance = useMemberStore(state => state.updateBalance);
  const payDebt = useMemberStore(state => state.payDebt);
  const addTransaction = useTransactionStore(state => state.addTransaction);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  const [newMember, setNewMember] = useState<Omit<Member, 'id' | 'balance'>>({ name: "", phone: "", debt: 0, debtLimit: 500000, transactionCount: 0 });
  
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  const [isPayDebtOpen, setIsPayDebtOpen] = useState(false);
  const [payDebtAmount, setPayDebtAmount] = useState("");

  const filtered = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  const handleAdd = async () => {
    if (!newMember.name || !newMember.phone) return;
    try {
      await addMember(newMember);
      setNewMember({ name: "", phone: "", debt: 0, debtLimit: 500000, transactionCount: 0 });
      setIsAddOpen(false);
      toast.success("Member berhasil didaftarkan");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mendaftarkan member.");
    }
  };

  const handleEdit = (m: Member) => {
    setEditingMember({ ...m });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMember) return;
    try {
      await updateMember(editingMember.id, { name: editingMember.name, phone: editingMember.phone });
      setIsEditOpen(false);
      toast.success("Data member berhasil diperbarui");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui member.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus member ini? Semua riwayat deposit akan hilang.")) {
      try {
        await deleteMember(id);
        toast.success("Member berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus member.");
      }
    }
  };

  const handleDeposit = async () => {
    if (!selectedMember || !depositAmount) return;
    try {
      await updateBalance(selectedMember.phone, Number(depositAmount));
      toast.success(`Deposit Rp ${Number(depositAmount).toLocaleString()} berhasil untuk ${selectedMember.name}`);
      setIsDepositOpen(false);
      setDepositAmount("");
    } catch (error) {
      toast.error("Gagal memproses deposit.");
    }
  };

  const handlePayDebt = async () => {
    if (!selectedMember || !payDebtAmount) return;
    const amount = Number(payDebtAmount);
    if (amount <= 0 || amount > selectedMember.debt) {
      toast.error("Nominal tidak valid!");
      return;
    }
    
    try {
      await payDebt(selectedMember.phone, amount);
      await addTransaction({
        items: [{ id: `pd-${Date.now()}`, name: `Pembayaran Hutang: ${selectedMember.name}`, price: amount, costPrice: 0, qty: 1 }],
        total: amount,
        profit: amount,
        payment: amount,
        change: 0,
        method: 'Cash'
      });
      toast.success(`Pembayaran hutang Rp ${amount.toLocaleString()} berhasil! Masuk ke Kas Tunai.`);
      setIsPayDebtOpen(false);
      setPayDebtAmount("");
    } catch (error) {
      toast.error("Gagal memproses pembayaran hutang.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Member & Deposit</h1>
          <p className="text-muted-foreground">Kelola saldo simpanan dan data pelanggan setia.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl"><UserPlus className="mr-2 h-4 w-4" /> Tambah Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Daftar Member Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} placeholder="Contoh: Budi Santoso" />
              </div>
              <div className="space-y-2">
                <Label>No. WhatsApp</Label>
                <Input value={newMember.phone} onChange={(e) => setNewMember({...newMember, phone: e.target.value})} placeholder="0812..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Daftarkan Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="luxury-card rounded-2xl border-none overflow-hidden">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Daftar Pelanggan ({members.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari nama atau no. telp..." 
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
                <TableHead className="pl-6">Nama Member</TableHead>
                <TableHead>No. Telepon</TableHead>
                <TableHead className="text-center">Loyalty</TableHead>
                <TableHead className="text-right">Saldo Deposit</TableHead>
                <TableHead className="text-right">Hutang</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id} className="table-row-hover group">
                  <TableCell className="pl-6 font-bold">{m.name}</TableCell>
                  <TableCell className="font-mono text-sm">{m.phone}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-primary">{m.transactionCount}x</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black bg-green-500/10 text-green-600 border border-green-500/20">
                      Rp {(m.balance || 0).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black ${(m.debt || 0) > 0 ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'text-slate-400'}`}>
                      Rp {(m.debt || 0).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-1">
                    {(m.debt || 0) > 0 && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="rounded-lg h-8 px-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => { setSelectedMember(m); setIsPayDebtOpen(true); }}
                      >
                        Bayar Hutang
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg h-8 px-2"
                      onClick={() => { setSelectedMember(m); setIsDepositOpen(true); }}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Top Up
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={() => navigate(`/members/${m.id}`)}
                    >
                      <Plus className="w-4 h-4 rotate-45" /> 
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600 hover:bg-blue-500/10"
                      onClick={() => handleEdit(m)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(m.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">Tidak ada member ditemukan.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Data Member</DialogTitle></DialogHeader>
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={editingMember.name} onChange={(e) => setEditingMember({...editingMember, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>No. WhatsApp</Label>
                <Input value={editingMember.phone} onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Saldo Deposit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-xs font-bold text-primary uppercase mb-1">Member</p>
              <p className="text-lg font-black">{selectedMember?.name}</p>
              <p className="text-xs text-muted-foreground">{selectedMember?.phone}</p>
            </div>
            <div className="space-y-2">
              <Label>Nominal Deposit (Rp)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="h-12 text-xl font-bold"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full h-12 text-lg" onClick={handleDeposit}>Proses Top Up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isPayDebtOpen} onOpenChange={setIsPayDebtOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pembayaran Hutang (Cicilan)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
              <p className="text-xs font-bold text-destructive uppercase mb-1">Total Hutang</p>
              <p className="text-2xl font-black text-destructive">Rp {(selectedMember?.debt || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Sisa limit hutang: Rp {((selectedMember?.debtLimit || 500000) - (selectedMember?.debt || 0)).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <Label>Nominal Dibayar (Rp)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                value={payDebtAmount}
                onChange={(e) => setPayDebtAmount(e.target.value)}
                className="h-12 text-xl font-bold"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700" onClick={handlePayDebt}>Bayar Hutang ke Kas Tunai</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
