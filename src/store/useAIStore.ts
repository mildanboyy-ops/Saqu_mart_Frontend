import { create } from 'zustand';
import api from '@/lib/axios';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'prediction' | 'fraud' | 'pricing' | 'restock' | 'forecast';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  actionLabel?: string;
  dismissed: boolean;
}

interface AIState {
  insights: AIInsight[];
  isAssistantOpen: boolean;
  healthScore: number;
  chatMessages: { role: 'user' | 'ai'; text: string; time: string }[];
  fetchInsights: () => Promise<void>;
  addInsight: (insight: Omit<AIInsight, 'id' | 'timestamp' | 'dismissed'>) => void;
  dismissInsight: (id: string) => void;
  toggleAssistant: () => void;
  addChatMessage: (text: string) => Promise<void>;
  setHealthScore: (score: number) => void;
  analyzeImage: (source: string) => Promise<{ barcode?: string; [key: string]: any }>;
}

export const useAIStore = create<AIState>((set, _get) => ({
  insights: [],
  isAssistantOpen: false,
  healthScore: 94,
  chatMessages: [
    { role: 'ai', text: 'Assalamu\'alaikum! Saya AI Assistant SaquMart. Ada yang bisa saya bantu hari ini?', time: new Date().toLocaleTimeString() },
  ],
  fetchInsights: async () => {
    try {
      const response = await api.get('/ai/insights');
      set({ insights: response.data.data });
    } catch (error) {
      console.error('Failed to fetch AI insights');
    }
  },
  addInsight: (insight) => set((state) => ({
    insights: [{
      ...insight,
      id: `ai-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dismissed: false,
    }, ...state.insights]
  })),
  dismissInsight: (id) => set((state) => ({
    insights: state.insights.map(i => i.id === id ? { ...i, dismissed: true } : i)
  })),
  toggleAssistant: () => set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),
  addChatMessage: async (text) => {
    const newMessage = { role: 'user' as const, text, time: new Date().toLocaleTimeString() };
    set((state) => ({ chatMessages: [...state.chatMessages, newMessage] }));

    try {
      const response = await api.post('/ai/chat', { message: text });
      const aiResponse = { role: 'ai' as const, text: response.data.data.response, time: new Date().toLocaleTimeString() };
      set((state) => ({ chatMessages: [...state.chatMessages, aiResponse] }));
    } catch (error) {
      const errorResponse = { role: 'ai' as const, text: 'Maaf, saya sedang mengalami kendala teknis.', time: new Date().toLocaleTimeString() };
      set((state) => ({ chatMessages: [...state.chatMessages, errorResponse] }));
    }
  },
  setHealthScore: (score) => set({ healthScore: score }),
  analyzeImage: async (_source) => {
    // Simulate AI image analysis
    await new Promise(r => setTimeout(r, 1000));
    return { barcode: '123456789' };
  },
}));
