import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    const token = useAuthStore.getState().token;
    cb({ token });
  },
});

// Helper to connect with current token
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
