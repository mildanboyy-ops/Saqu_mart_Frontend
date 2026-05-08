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
import { toast } from "sonner"
import GlobalLoading from "@/components/GlobalLoading"

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    setTimeout(() => {
      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
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
      <GlobalLoading loading={isRegistering} />
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
          <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Pendaftaran Akun Baru</p>
        </div>
        <Card className="premium-card !border-none !shadow-2xl">
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-3xl font-black text-center tracking-tight text-slate-900">Buat Akun</CardTitle>
            <CardDescription className="text-center font-medium text-slate-500">
              Lengkapi data kamu buat bikin akun baru.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="grid gap-6">
              <div className="grid gap-2.5">
                <Label htmlFor="name" className="text-slate-700 font-bold ml-1">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Budi Santoso" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 px-4 shadow-sm"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="email" className="text-slate-700 font-bold ml-1">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="budi@email.com" 
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
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pt-6">
              <Button className="w-full premium-button h-14 text-lg font-black" type="submit">
                Daftar Sekarang
              </Button>
              <div className="text-sm text-center font-medium text-slate-500">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
                  Login di sini
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </motion.div>
  )
}
