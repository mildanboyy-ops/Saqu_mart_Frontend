import { useState } from "react";
import { useMemberStore } from "@/store/useMemberStore";
import type { Member } from "@/store/useMemberStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, UserPlus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Members() {
  const { members, addMember, updateBalance } = useMemberStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", phone: "" });
  
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  const filtered = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  const handleAdd = () => {
    if (!newMember.name || !newMember.phone) return;
    addMember(newMember);
    setNewMember({ name: "", phone: "" });
    setIsAddOpen(false);
    toast.success("Member berhasil didaftarkan");
  };

  const handleDeposit = () => {
    if (!selectedMember || !depositAmount) return;
    updateBalance(selectedMember.phone, Number(depositAmount));
    toast.success(`Deposit Rp ${Number(depositAmount).toLocaleString()} berhasil untuk ${selectedMember.name}`);
    setIsDepositOpen(false);
    setDepositAmount("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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

      <Card className="rounded-2xl border-none shadow-lg overflow-hidden">
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
                <TableHead className="text-right">Saldo Deposit</TableHead>
                <TableHead className="text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-bold">{m.name}</TableCell>
                  <TableCell className="font-mono text-sm">{m.phone}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black bg-green-500/10 text-green-600 border border-green-500/20">
                      Rp {m.balance.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg h-9"
                      onClick={() => { setSelectedMember(m); setIsDepositOpen(true); }}
                    >
                      <Plus className="w-4 h-4 mr-1.5" /> Top Up
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10">
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
    </div>
  );
}
