import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Users, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function RealtimeTeamChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: 'Kasir B', text: 'Stok Kopi di rak depan habis nih.', time: '14:20' },
    { id: 2, user: 'Admin', text: 'Oke, personil gudang lagi otw restock.', time: '14:22' },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'Super Admin', text: msg, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
    setMsg("");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-[100] w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold border-2 border-white flex items-center justify-center">2</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-40 right-6 z-[200] w-80 h-[450px] glass-panel rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
          >
            <div className="p-5 bg-slate-900 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center">
                     <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                     <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Team Internal</h3>
                     <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">4 Active Now</span>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="h-4 w-4 text-white" />
               </button>
            </div>

            <div className="flex-1 p-5 space-y-4 overflow-y-auto scrollbar-hide">
               {messages.map(m => (
                 <div key={m.id} className={cn("flex flex-col gap-1", m.user === 'Super Admin' ? 'items-end' : 'items-start')}>
                    <span className="text-[9px] font-black text-muted-foreground uppercase">{m.user}</span>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-2xl text-xs font-medium",
                      m.user === 'Super Admin' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-white/80 rounded-tl-none border border-white/10'
                    )}>
                       {m.text}
                    </div>
                    <span className="text-[8px] text-white/20 font-mono">{m.time}</span>
                 </div>
               ))}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-slate-900/50 backdrop-blur-3xl border-t border-white/5 flex gap-2 items-center">
               <button type="button" className="p-2 text-white/40 hover:text-white transition-colors">
                  <Paperclip className="h-4 w-4" />
               </button>
               <input 
                type="text" 
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type message..."
                className="flex-1 h-10 bg-white/5 border-none text-xs text-white rounded-xl focus:ring-1 ring-primary/50"
               />
               <button type="submit" className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                  <Send className="h-4 w-4" />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
