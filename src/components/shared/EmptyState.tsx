import { motion } from 'framer-motion';
import { Search, Package, ShoppingCart, Users, FileText } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'search' | 'package' | 'cart' | 'users' | 'file';
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const icons = {
  search: Search,
  package: Package,
  cart: ShoppingCart,
  users: Users,
  file: FileText,
};

export default function EmptyState({ icon = 'search', title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
        className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6 relative"
      >
        <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
        <Icon className="h-12 w-12 text-muted-foreground/40" />
      </motion.div>
      <h3 className="text-xl font-black tracking-tight text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md font-medium">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
