import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ChevronLeft, Store } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/store/useAuthStore"
import type { UserRole } from "@/store/useAuthStore"
import { toast } from "sonner"

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Admin");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    login({
      id: `usr-${Date.now()}`,
      name: email.split('@')[0] || "User",
      email: email || "user@saqumart.com",
      role: role
    });

    toast.success(`Selamat datang, ${role}!`);
    navigate("/dashboard");
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#0a2e1f] p-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -ml-64 -mb-64" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-sm text-white/60 hover:text-white transition-all mb-8 group bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 font-bold text-4xl text-primary mb-2 drop-shadow-[0_0_15px_rgba(22,163,74,0.3)]">
            <Store className="h-10 w-10 text-emerald-400" />
            <span className="text-white">Saqu<span className="text-primary">Mart</span></span>
          </div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Sistem Manajemen & Kasir POS</p>
        </div>
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Pilih peran Anda untuk simulasi login
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Akses Sebagai</Label>
                <Select value={role} onValueChange={(v: UserRole) => setRole(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner (Full Access)</SelectItem>
                    <SelectItem value="Admin">Admin (Kelola Produk)</SelectItem>
                    <SelectItem value="Kasir">Kasir (Hanya POS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full h-11 text-lg" type="submit">Masuk</Button>
              <div className="text-sm text-center text-muted-foreground">
                Belum punya akun?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Daftar
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </motion.div>
  )
}
