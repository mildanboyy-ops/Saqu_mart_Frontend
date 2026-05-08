import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  Menu,
  Moon,
  Sun,
  LogOut,
  Wallet,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users2,
  Truck
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useAuthStore } from '@/store/useAuthStore';

const BANKS = [
  { id: 'BCA', name: 'BCA' },
  { id: 'Mandiri', name: 'Mandiri' },
  { id: 'BRI', name: 'BRI' },
  { id: 'BNI', name: 'BNI' },
  { id: 'BSI', name: 'BSI' },
  { id: 'Jago', name: 'Bank Jago' },
];

const sidebarGroups = [
  {
    title: 'Utama',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['Owner', 'Admin', 'Kasir'] },
      { icon: ShoppingCart, label: 'Kasir POS', path: '/pos', roles: ['Owner', 'Admin', 'Kasir'], badge: 'New' },
    ]
  },
  {
    title: 'Manajemen Stok',
    items: [
      { icon: Package, label: 'Produk', path: '/products', roles: ['Owner', 'Admin'] },
      { icon: ArrowDownToLine, label: 'Stok Masuk', path: '/stock-in', roles: ['Owner', 'Admin'] },
      { icon: ArrowUpFromLine, label: 'Stok Keluar', path: '/stock-out', roles: ['Owner', 'Admin'] },
      { icon: Truck, label: 'Supplier', path: '/suppliers', roles: ['Owner', 'Admin'] },
    ]
  },
  {
    title: 'Analisis & Pelanggan',
    items: [
      { icon: BarChart3, label: 'Laporan', path: '/reports', roles: ['Owner', 'Admin'] },
      { icon: Users2, label: 'Member', path: '/members', roles: ['Owner', 'Admin', 'Kasir'] },
    ]
  },
  {
    title: 'Sistem',
    items: [
      { icon: Users, label: 'Karyawan', path: '/users', roles: ['Owner'] },
      { icon: Settings, label: 'Pengaturan', path: '/settings', roles: ['Owner'] },
    ]
  }
];

function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden md:flex flex-col items-end mr-4">
      <div className="text-sm font-bold text-primary tabular-nums tracking-tight">
        {time.toLocaleTimeString('id-ID')}
      </div>
      <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
        {time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { transactions, addTransaction } = useTransactionStore();
  const totalRevenue = transactions.reduce((acc, tx) => acc + tx.total, 0);

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBank, setWithdrawBank] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (amount <= 0 || amount > totalRevenue) {
      toast.error("Nominal tidak valid atau saldo tidak mencukupi!");
      return;
    }
    if (!withdrawBank || !withdrawAccount) {
      toast.error("Lengkapi data rekening tujuan!");
      return;
    }

    addTransaction({
      items: [{ id: `w-${Date.now()}`, name: `Penarikan Saldo ke ${withdrawBank} (${withdrawAccount})`, price: -amount, qty: 1, costPrice: 0 }],
      total: -amount,
      profit: -amount,
      payment: 0,
      change: 0,
      method: 'Non-Cash'
    });

    toast.success(`Penarikan Rp ${amount.toLocaleString()} berhasil diproses ke ${withdrawBank}`);
    setIsWithdrawOpen(false);
    setWithdrawAmount('');
    setWithdrawAccount('');
  };

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const { theme, setTheme } = useTheme();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside
        className={cn(
          "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out z-20",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <Link to="/profile" className={cn("p-6 flex items-center gap-4 border-b hover:bg-muted/50 transition-all group cursor-pointer", collapsed && "justify-center px-2")}>
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-primary/20 shadow-xl group-hover:scale-105 transition-transform">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-black">
                {user?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm tracking-tight truncate group-hover:text-primary transition-colors">{user?.name || "Admin SaquMart"}</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase tracking-[0.2em] font-black">{user?.role}</p>
            </div>
          )}
        </Link>

        {!collapsed && (user?.role === 'Owner' || user?.role === 'Admin') && (
          <div className="px-4 py-8">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-[2rem] p-5 border border-primary/10 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/20 p-2 rounded-xl">
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                    Income Balance
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Rp {totalRevenue.toLocaleString()}</p>
                <Button 
                  size="sm" 
                  onClick={() => setIsWithdrawOpen(true)} 
                  className="w-full premium-button h-10 text-[11px] font-black"
                >
                  Tarik Saldo
                </Button>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-6 p-4 overflow-y-auto">
          {sidebarGroups.map((group, gIdx) => {
            const filteredItems = group.items.filter(item => item.roles.includes(user?.role || ''));
            if (filteredItems.length === 0) return null;
            
            return (
              <div key={gIdx} className="space-y-2">
                {!collapsed && (
                  <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-3">
                    {group.title}
                  </p>
                )}
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 group relative",
                          active 
                            ? "bg-primary text-primary-foreground shadow-xl shadow-primary/25 scale-[1.02]" 
                            : "text-muted-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1",
                          collapsed && "justify-center px-2 hover:translate-x-0"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0 transition-all duration-300", active ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "group-hover:scale-110")} />
                        {!collapsed && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                        
                        {!collapsed && item.badge && (
                          <span className="ml-auto bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20 animate-pulse">
                            {item.badge}
                          </span>
                        )}

                        {!collapsed && active && !item.badge && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
                        
                        {collapsed && (
                           <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-2 group-hover:translate-x-0 shadow-2xl whitespace-nowrap z-50">
                            {item.label}
                           </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* System Status Indicator */}
        {!collapsed && (
          <div className="px-4 py-4 space-y-3">
            <div className="bg-muted/50 rounded-2xl p-3 border border-border flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1.5">System Status</p>
                <p className="text-[11px] font-bold text-foreground truncate">Server Terhubung</p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10 flex items-center gap-3 group/backup cursor-pointer hover:bg-primary/10 transition-colors">
              <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 group-hover/backup:rotate-12 transition-transform">
                <ArrowDownToLine className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 leading-none mb-1.5">Cloud Backup</p>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Terakhir: 2 Menit Lalu</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t space-y-2">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-3 h-11 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl", collapsed && "justify-center px-0")}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="font-medium">Keluar Sistem</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn("w-full h-11 rounded-xl", !collapsed && "hidden")}
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            {!collapsed && (
               <Button
               variant="ghost"
               size="icon"
               onClick={toggleSidebar}
               className="hover:bg-muted"
             >
               <Menu className="h-5 w-5" />
             </Button>
            )}
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <ShoppingCart className="h-6 w-6" />
              <span className="tracking-tight">SaquMart</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RealTimeClock />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="h-8 w-[1px] bg-border mx-1" />
            <Link to="/profile" className="flex items-center gap-3 pl-1 group cursor-pointer">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold leading-none italic group-hover:text-primary transition-colors">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">{user?.role}</p>
              </div>
              <Avatar className="w-10 h-10 border shadow-inner group-hover:ring-2 ring-primary/20 transition-all">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {user?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tarik Saldo Pendapatan</DialogTitle>
            <DialogDescription>
              Pindahkan saldo pendapatan ke rekening bank Anda. Proses penarikan biasanya memakan waktu 1x24 jam.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw}>
            <div className="grid gap-4 py-4">
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 mb-2">
                <p className="text-sm text-muted-foreground mb-1">Saldo Tersedia</p>
                <p className="text-2xl font-black text-primary">Rp {totalRevenue.toLocaleString()}</p>
              </div>
              <div className="grid gap-2">
                <Label>Bank Tujuan</Label>
                <div className="grid grid-cols-3 gap-2">
                  {BANKS.map(bank => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setWithdrawBank(bank.id)}
                      className={cn(
                        "h-12 border-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center",
                        withdrawBank === bank.id 
                          ? "border-primary bg-primary/10 text-primary shadow-sm" 
                          : "border-muted hover:border-primary/50 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account">Nomor Rekening</Label>
                <Input 
                  id="account" 
                  placeholder="Contoh: 1234567890" 
                  value={withdrawAccount} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWithdrawAccount(e.target.value)}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Nominal Penarikan (Rp)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0" 
                  value={withdrawAmount} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWithdrawAmount(e.target.value)}
                  max={totalRevenue}
                  required 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsWithdrawOpen(false)}>Batal</Button>
              <Button type="submit">Proses Penarikan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
