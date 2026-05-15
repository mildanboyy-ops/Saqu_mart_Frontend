import * as React from "react"
import { Command } from "cmdk"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  LayoutDashboard,
  LogOut,
  BrainCircuit
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"
import { useProductStore } from "@/store/useProductStore"


export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const { products } = useProductStore()
  const [search, setSearch] = React.useState("")

  const filteredProducts = React.useMemo(() => {
    if (!search) return []
    const lowerSearch = search.toLowerCase()
    
    return products.filter(p => {
       const matchesName = p.name.toLowerCase().includes(lowerSearch)
       const matchesCategory = p.category?.toLowerCase().includes(lowerSearch)
       
       // AI Semantic Logic
       const isCheap = lowerSearch.includes('murah') && p.price < 5000
       const isLowStock = lowerSearch.includes('stok rendah') && p.stock < 10
       const isExpensive = lowerSearch.includes('mahal') && p.price > 50000
       
       return matchesName || matchesCategory || isCheap || isLowStock || isExpensive
    }).slice(0, 5)
  }, [search, products])


  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[20vh] bg-slate-950/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/20 bg-slate-900/80 shadow-2xl backdrop-blur-2xl"
          >
            <Command className="flex h-full w-full flex-col">
              <div className="flex items-center border-b border-white/10 px-4 py-3">
                <Search className="mr-3 h-5 w-5 text-slate-400" />
                <Command.Input
                  autoFocus
                  placeholder="Ketik perintah atau cari (contoh: 'minuman murah')..."
                  className="flex-1 bg-transparent text-lg text-white outline-none placeholder:text-slate-500"
                  onValueChange={setSearch}
                />

                <div className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-400">
                  ESC
                </div>
              </div>
              <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
                <Command.Empty className="py-6 text-center text-sm text-slate-400">
                  Hasil tidak ditemukan. Coba ketik "produk murah" atau "stok rendah".
                </Command.Empty>

                {filteredProducts.length > 0 && (
                  <Command.Group heading="Hasil Pencarian AI" className="px-2 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    {filteredProducts.map(product => (
                      <CommandItem key={product.id} onSelect={() => runCommand(() => navigate("/products"))}>
                        <Package className="mr-3 h-4 w-4" />
                        <div className="flex flex-col">
                           <span className="font-bold">{product.name}</span>
                           <span className="text-[10px] text-slate-500">Rp {product.price.toLocaleString()} • Stok: {product.stock}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </Command.Group>
                )}

                
                <Command.Group heading="Navigasi Utama" className="px-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => navigate("/pos"))}>
                    <ShoppingCart className="mr-3 h-4 w-4" />
                    <span>Kasir POS</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => navigate("/products"))}>
                    <Package className="mr-3 h-4 w-4" />
                    <span>Produk & Inventori</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => navigate("/members"))}>
                    <Users className="mr-3 h-4 w-4" />
                    <span>Manajemen Member</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => navigate("/reports"))}>
                    <TrendingUp className="mr-3 h-4 w-4" />
                    <span>Laporan Keuangan</span>
                  </CommandItem>
                </Command.Group>

                <Command.Group heading="Pusat Intelijen AI" className="px-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 mt-2">
                  <CommandItem onSelect={() => runCommand(() => navigate("/ai-insights"))}>
                    <BrainCircuit className="mr-3 h-4 w-4 text-emerald-400" />
                    <span>Tanya AI Assistant</span>
                  </CommandItem>
                </Command.Group>

                <Command.Group heading="Sistem" className="px-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 mt-2">
                  <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Pengaturan Toko</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => navigate("/help"))}>
                    <HelpCircle className="mr-3 h-4 w-4" />
                    <span>Pusat Bantuan</span>
                  </CommandItem>
                  <CommandItem onSelect={() => runCommand(() => logout())} className="text-rose-400">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Keluar Sistem</span>
                  </CommandItem>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setOpen(false)} 
          />
        </div>
      )}
    </AnimatePresence>
  )
}

function CommandItem({ children, onSelect, className = "" }: { children: React.ReactNode, onSelect: () => void, className?: string }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className={`flex cursor-pointer items-center rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-colors hover:bg-white/5 data-[selected=true]:bg-white/10 ${className}`}
    >
      {children}
    </Command.Item>
  )
}
