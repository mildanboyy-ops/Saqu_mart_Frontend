import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useMemberStore } from '@/store/useMemberStore';
import { useAIStore } from '@/store/useAIStore';
import { useBlockchainStore } from '@/store/useBlockchainStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUserStore } from '@/store/useUserStore';
import { useSupplierStore } from '@/store/useSupplierStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { connectSocket, disconnectSocket, socket } from '@/lib/socket';
import { useRealtimeStore } from '@/store/useRealtimeStore';
import { toast } from 'sonner';

export default function DataInitializer() {
  const { isAuthenticated, token, checkAuth } = useAuthStore();
  const { fetchProducts } = useProductStore();
  const { fetchTransactions } = useTransactionStore();
  const { fetchMembers } = useMemberStore();
  const { fetchInsights } = useAIStore();
  const { fetchBlockchainData } = useBlockchainStore();
  const { fetchNotifications } = useNotificationStore();
  const { fetchSettings } = useSettingsStore();
  const { fetchUsers } = useUserStore();
  const { fetchSuppliers } = useSupplierStore();
  const { fetchMissions, fetchEmployees } = useGamificationStore();

  useEffect(() => {
    const init = async () => {
      if (token) {
        await checkAuth();
      }
    };
    init();
  }, [token, checkAuth]);

  useEffect(() => {
    if (isAuthenticated && token) {
      // Initial data fetch
      fetchProducts();
      fetchTransactions();
      fetchMembers();
      fetchInsights();
      fetchBlockchainData();
      fetchNotifications();
      fetchSettings();
      fetchUsers();
      fetchSuppliers();
      fetchMissions();
      fetchEmployees();

      const { addEvent, setLiveOmzet } = useRealtimeStore.getState();

      // Realtime connection
      connectSocket();

      // Socket listeners
      socket.on('stock_updated', (data: any) => {
        toast.info(`Stok diperbarui: ${data.productName}`);
        fetchProducts(); 
        addEvent({
          type: 'stock',
          message: `Stok ${data.productName} diperbarui`,
          branch: data.branch || 'Utama'
        });
      });

      socket.on('new_transaction', (data: any) => {
        toast.success(`Transaksi baru: Rp ${data.total.toLocaleString()}`);
        fetchTransactions(); 
        addEvent({
          type: 'transaction',
          message: `Transaksi Baru Rp ${data.total.toLocaleString()}`,
          branch: data.branch || 'Utama',
          amount: data.total
        });
        setLiveOmzet(data.todayTotal || 0);
      });

      socket.on('ai_insight', (data: any) => {
        toast.info(`AI Insight: ${data.message}`);
        addEvent({
          type: 'alert',
          message: `AI: ${data.message}`,
        });
      });

      socket.on('fraud_alert', (data: any) => {
        toast.error(`⚠️ Fraud Alert: ${data.message}`, { duration: 5000 });
        addEvent({
          type: 'alert',
          message: `FRAUD: ${data.message}`,
        });
      });

      // Heartbeat Simulation (Demo Mode)
      const heartbeat = setInterval(() => {
        if (!socket.connected) {
          const types: ('stock' | 'transaction' | 'member' | 'alert')[] = ['stock', 'transaction', 'member', 'alert'];
          const type = types[Math.floor(Math.random() * types.length)];
          const branches = ['Cabang Utama', 'Cabang Bandung', 'Cabang Surabaya'];
          
          if (Math.random() > 0.7) {
            addEvent({
              type,
              message: `Simulasi ${type}: Aktivitas sistem terdeteksi`,
              branch: branches[Math.floor(Math.random() * branches.length)]
            });
          }
        }
      }, 10000);

      return () => {
        socket.off('stock_updated');
        socket.off('new_transaction');
        socket.off('ai_insight');
        socket.off('fraud_alert');
        clearInterval(heartbeat);
        disconnectSocket();
      };
    }
  }, [isAuthenticated, token, fetchProducts, fetchTransactions, fetchMembers, fetchInsights, fetchBlockchainData, fetchNotifications, fetchSettings, fetchUsers, fetchSuppliers, fetchMissions, fetchEmployees]);

  return null;
}
