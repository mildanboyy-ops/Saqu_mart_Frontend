import { cn } from '@/lib/utils';

interface PulseIndicatorProps {
  status: 'online' | 'offline' | 'syncing' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export default function PulseIndicator({ status, size = 'md', label, className }: PulseIndicatorProps) {
  const colors = {
    online: 'bg-emerald-500',
    offline: 'bg-red-500',
    syncing: 'bg-amber-500',
    warning: 'bg-orange-500',
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={cn('rounded-full', sizes[size], colors[status])} />
        {(status === 'online' || status === 'syncing') && (
          <div className={cn(
            'absolute inset-0 rounded-full animate-ping opacity-75',
            sizes[size],
            colors[status]
          )} />
        )}
      </div>
      {label && (
        <span className={cn(
          'text-xs font-bold uppercase tracking-wider',
          status === 'online' ? 'text-emerald-600' :
          status === 'offline' ? 'text-red-500' :
          status === 'syncing' ? 'text-amber-600' : 'text-orange-500'
        )}>
          {label}
        </span>
      )}
    </div>
  );
}
