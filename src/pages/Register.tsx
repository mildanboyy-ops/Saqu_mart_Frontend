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

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registrasi berhasil! Silakan login.");
    navigate("/login");
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
          <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Pendaftaran Akun Baru</p>
        </div>
        <Card className="shadow-lg border-primary/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Daftar</CardTitle>
            <CardDescription className="text-center">
              Lengkapi data di bawah ini untuk membuat akun
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Budi Santoso" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="budi@email.com" 
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" type="submit">Daftar</Button>
              <div className="text-sm text-center text-muted-foreground">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </motion.div>
  )
}
