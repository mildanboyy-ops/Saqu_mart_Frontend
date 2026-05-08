import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Shield, Camera } from "lucide-react";
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
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 premium-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative group">
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                {formData.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-black tracking-tight">{formData.name}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Shield className="w-3 h-3" />
                {user?.role}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border">
                ID: {user?.id.substring(0, 8)}
              </span>
            </div>
            <p className="text-muted-foreground">Kelola informasi pribadi dan pengaturan keamanan akun Anda.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 premium-card">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-lg">Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Nama Lengkap
                  </Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </Label>
                  <Input 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    No. Telepon
                  </Label>
                  <Input 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Alamat
                  </Label>
                  <Input 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} className="premium-button px-8 h-12 font-bold">
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="premium-card">
              <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="text-lg">Keamanan</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button variant="outline" className="w-full justify-start rounded-xl h-12 font-semibold">
                  Ganti Password
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl h-12 font-semibold">
                  Autentikasi 2 Faktor
                </Button>
              </CardContent>
            </Card>

            <Card className="premium-card bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Status Akun</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-bold">Aktif & Terverifikasi</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Akun Anda telah terhubung dengan sistem pusat SaquMart. Pastikan data selalu diperbarui untuk kemudahan pelaporan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
