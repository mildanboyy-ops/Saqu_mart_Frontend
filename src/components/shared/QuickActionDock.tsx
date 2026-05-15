import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BrainCircuit, 
  Settings,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const dockItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ShoppingCart, label: 'POS', path: '/pos' },
  { icon: Package, label: 'Inventory', path: '/products' },
  { icon: Users, label: 'Customers', path: '/members' },
  { icon: BrainCircuit, label: 'AI Analytics', path: '/ai-analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

function DockIcon({ icon: Icon, mouseX, path }: { icon: any, mouseX: any, path: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={() => navigate(path)}
      className="aspect-square rounded-2xl bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors group relative"
    >
      <Icon className="h-1/2 w-1/2 text-white/70 group-hover:text-primary transition-colors" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 whitespace-nowrap">
        {path.replace('/', '').toUpperCase() || 'HOME'}
      </div>
    </motion.div>
  );
}

export default function QuickActionDock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] h-16 flex items-end gap-3 px-4 pb-3 rounded-[2rem] bg-black/20 backdrop-blur-3xl border border-white/10 shadow-2xl"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {dockItems.map((item, i) => (
        <DockIcon key={i} icon={item.icon} mouseX={mouseX} path={item.path} />
      ))}
    </motion.div>
  );
}
