import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Shield, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "0812-3456-7890",
    address: user?.address || "Jl. Berkah No. 123, Jakarta Selatan",
    avatar: user?.avatar || "",
  });

  const handleSave = () => {
    if (user) {
      login({ ...user, ...formData });
      toast.success("Profil berhasil diperbarui!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative group">
            <Avatar className="w-40 h-40 border-4 border-slate-800 shadow-2xl">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="text-4xl font-black bg-primary text-white">
                {formData.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-2 right-2 p-3 bg-emerald-500 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform border-4 border-slate-900">
              <Camera className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-white">{formData.name}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-3 h-3" />
                {user?.role}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 border border-white/5">
                ID: {user?.id.substring(0, 8)}
              </span>
            </div>
            <p className="text-slate-400 font-medium italic text-sm">Atur profil dan keamanan akun kamu di sini untuk menjaga keberkahan tokomu.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                Data Diri
              </h2>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Nama Lengkap</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-white focus:border-primary transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email</Label>
                  <Input 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-white focus:border-primary transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">No. Telepon</Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-white focus:border-primary transition-all px-6"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Alamat</Label>
                  <Input 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-2xl h-14 font-bold text-white focus:border-primary transition-all px-6"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button onClick={handleSave} className="premium-button px-10 h-16 rounded-[1.5rem] font-black text-lg text-white shadow-xl shadow-primary/20">
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5 text-center">
                <h2 className="text-lg font-black text-white tracking-tight flex items-center justify-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  Keamanan
                </h2>
              </div>
              <div className="p-8 space-y-4">
                <Button variant="outline" className="w-full justify-start rounded-2xl h-14 font-black border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all px-6">
                  Ubah Kata Sandi
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-2xl h-14 font-black border-white/5 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all px-6">
                  Autentikasi 2 Faktor
                </Button>
              </div>
            </div>

            <div className="bg-[#0a2e1f] border-2 border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">Status Akun</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" />
                  <span className="font-black text-white text-xl tracking-tight">Akun Aktif</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                  Akun kamu sudah terhubung dengan sistem SaquMart. Pastikan data kamu selalu benar ya!
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
