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

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['Owner', 'Admin', 'Kasir'] },
  { icon: ShoppingCart, label: 'Kasir POS', path: '/pos', roles: ['Owner', 'Admin', 'Kasir'] },
  { icon: Package, label: 'Produk', path: '/products', roles: ['Owner', 'Admin'] },
  { icon: ArrowDownToLine, label: 'Stok Masuk', path: '/stock-in', roles: ['Owner', 'Admin'] },
  { icon: ArrowUpFromLine, label: 'Stok Keluar', path: '/stock-out', roles: ['Owner', 'Admin'] },
  { icon: BarChart3, label: 'Laporan', path: '/reports', roles: ['Owner', 'Admin'] },
  { icon: Users2, label: 'Member', path: '/members', roles: ['Owner', 'Admin', 'Kasir'] },
  { icon: Truck, label: 'Supplier', path: '/suppliers', roles: ['Owner', 'Admin'] },
  { icon: Users, label: 'Karyawan', path: '/users', roles: ['Owner'] },
  { icon: Settings, label: 'Pengaturan', path: '/settings', roles: ['Owner'] },
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

  const filteredItems = sidebarItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside
        className={cn(
          "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out z-20",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <Link to="/profile" className={cn("p-6 flex items-center gap-3 border-b hover:bg-muted/50 transition-colors cursor-pointer", collapsed && "justify-center px-2")}>
          <Avatar className="w-10 h-10 border border-primary/20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-bold truncate">{user?.name || "Admin SaquMart"}</p>
              <p className="text-xs text-muted-foreground truncate uppercase tracking-widest font-semibold">{user?.role}</p>
            </div>
          )}
        </Link>

        {!collapsed && (user?.role === 'Owner' || user?.role === 'Admin') && (
          <div className="px-4 py-6">
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Wallet className="h-3 w-3" />
                <span>Saldo Pendapatan</span>
              </div>
              <p className="text-xl font-bold text-primary">Rp {totalRevenue.toLocaleString()}</p>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center text-[10px] text-green-600 bg-green-500/10 w-fit px-2 py-0.5 rounded-full font-medium">
                  Active Session
                </div>
                <Button size="sm" onClick={() => setIsWithdrawOpen(true)} className="h-8 text-xs font-bold w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20">
                  Tarik Saldo
                </Button>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {filteredItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  active 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", active && "scale-110")} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
                {!collapsed && active && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
                
                {collapsed && (
                   <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border shadow-md whitespace-nowrap z-50">
                    {item.label}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

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
