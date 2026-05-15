import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

export default function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { showNotification } = useUIStore();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showNotification("Sistem Kembali Online", "Koneksi ke server Enterprise berhasil dipulihkan.", "success");
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      showNotification("Sistem Offline", "Masuk ke mode Offline Enterprise. Transaksi akan disimpan di local cache.", "error");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showNotification]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg shadow-destructive/20 font-bold tracking-tight"
        >
          <WifiOff className="h-4 w-4 animate-pulse" />
          Offline Mode - Enterprise Auto Sync Active
        </motion.div>
      )}
    </AnimatePresence>
  );
}
