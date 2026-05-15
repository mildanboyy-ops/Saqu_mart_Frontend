import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useVoiceAssistant() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Browser tidak mendukung fitur suara.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Mendengarkan...");
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log('Voice Command:', command);
      
      processCommand(command);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Gagal mengenali suara.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processCommand = (command: string) => {
    if (command.includes('dashboard')) navigate('/dashboard');
    else if (command.includes('kasir') || command.includes('pos')) navigate('/pos');
    else if (command.includes('produk') || command.includes('stok')) navigate('/products');
    else if (command.includes('laporan')) navigate('/reports');
    else if (command.includes('member')) navigate('/members');
    else if (command.includes('pengaturan')) navigate('/settings');
    else if (command.includes('ai') || command.includes('analisis')) navigate('/ai-analytics');
    else {
      toast.error(`Perintah "${command}" tidak dikenali.`);
      return;
    }
    
    toast.success(`Navigasi ke ${command}`);
  };

  return { isListening, startListening };
}
