import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, Sparkles, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", icon: <LayoutDashboard className="h-full w-full" />, href: "/dashboard" },
  { title: "POS", icon: <ShoppingCart className="h-full w-full" />, href: "/pos" },
  { title: "Products", icon: <Package className="h-full w-full" />, href: "/products" },
  { title: "AI Assistant", icon: <BrainCircuit className="h-full w-full" />, href: "#", isAI: true },
  { title: "Members", icon: <Users className="h-full w-full" />, href: "/users" },
  { title: "Islamic", icon: <Sparkles className="h-full w-full" />, href: "#", isIslamic: true },
  { title: "Settings", icon: <Settings className="h-full w-full" />, href: "/settings" },
];

export default function FloatingDock() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] hidden md:block">
      <div className="flex h-16 items-end gap-4 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl px-4 pb-3 border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        {items.map((item, idx) => (
          <IconContainer key={idx} {...item} />
        ))}
      </div>
    </div>
  );
}

function IconContainer({ title, icon, href, isAI, isIslamic }: any) {
  let mouseX = useMotionValue(Infinity);
  const navigate = useNavigate();

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  let height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      onMouseEnter={() => setHovered(true)}
      onClick={() => href !== "#" && navigate(href)}
      style={{ width, height }}
      className={cn(
        "relative flex aspect-square items-center justify-center rounded-2xl transition-colors cursor-pointer group",
        isAI ? "bg-primary shadow-[0_0_20px_rgba(22,163,74,0.4)]" : "bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300 dark:hover:bg-slate-700",
        isIslamic && "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
      )}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-12 left-1/2 w-fit px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest whitespace-pre shadow-xl"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      <div className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isAI || isIslamic ? "text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-primary")}>
        {icon}
      </div>
    </motion.div>
  );
}
