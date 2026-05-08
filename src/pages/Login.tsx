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
import GlobalLoading from "@/components/GlobalLoading"

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("admin@saqumart.com");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState<UserRole>("Admin");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    setTimeout(() => {
      login({
        id: `usr-${Date.now()}`,
        name: email.split('@')[0] || "User",
        email: email || "user@saqumart.com",
        role: role
      });

      toast.success(`Selamat datang, ${role}!`);
      navigate("/dashboard");
    }, 1500);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center bg-[#051c12] p-4 relative overflow-hidden"
    >
      <GlobalLoading loading={isLoggingIn} />
      {/* Dynamic Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" 
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] mix-blend-overlay" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-sm text-white/50 hover:text-white transition-all mb-10 group bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1.5 transition-transform" />
          <span className="font-semibold tracking-wide">Kembali ke Beranda</span>
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 font-bold text-4xl text-primary mb-2 drop-shadow-[0_0_15px_rgba(22,163,74,0.3)]">
            <Store className="h-10 w-10 text-emerald-400" />
            <span className="text-white">Saqu<span className="text-primary">Mart</span></span>
          </div>
          <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Sistem Manajemen & Kasir POS</p>
        </div>
        <Card className="premium-card !border-none !shadow-2xl">
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-3xl font-black text-center tracking-tight text-slate-900">Login</CardTitle>
            <CardDescription className="text-center font-medium text-slate-500">
              Pilih peran Anda untuk simulasi login
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="grid gap-6">
              <div className="grid gap-2.5">
                <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nama@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 shadow-sm"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="password" className="text-slate-700 font-bold ml-1">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 px-4 shadow-sm"
                />
              </div>
              <div className="grid gap-2.5">
                <Label className="text-slate-700 font-bold ml-1">Akses Sebagai</Label>
                <Select value={role} onValueChange={(v: UserRole) => setRole(v)}>
                  <SelectTrigger className="h-12 px-4 shadow-sm bg-white border-slate-200 text-slate-900 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner" className="font-medium">Owner</SelectItem>
                    <SelectItem value="Admin" className="font-medium">Admin</SelectItem>
                    <SelectItem value="Kasir" className="font-medium">Kasir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pt-6">
              <Button className="w-full premium-button h-14 text-lg font-black" type="submit">
                Masuk Sekarang
              </Button>
              <div className="text-sm text-center font-medium text-slate-500">
                Belum punya akun?{" "}
                <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">
                  Daftar di sini
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </motion.div>
  )
}
