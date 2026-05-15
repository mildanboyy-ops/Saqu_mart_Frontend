import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAIStore } from '@/store/useAIStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function GlobalAIAssistant() {
  const { isAssistantOpen, toggleAssistant, chatMessages, addChatMessage } = useAIStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const message = input;
    setInput('');
    setIsTyping(true);
    await addChatMessage(message);
    setIsTyping(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  return (
    <>
      {/* Floating Bubble */}
      <motion.div 
        className="fixed bottom-8 right-8 z-[100]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={toggleAssistant}
          className="h-16 w-16 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.3)] premium-button p-0 relative group border-none"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-full animate-pulse opacity-50 group-hover:opacity-100 transition-opacity" />
          <BrainCircuit className="h-8 w-8 text-white relative z-10" />
          <AnimatePresence>
            {!isAssistantOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center z-20"
              >
                <Sparkles className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="fixed bottom-28 right-8 z-[100] w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-10rem)] flex flex-col overflow-hidden rounded-[2.5rem] border border-white/20 bg-slate-900/90 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-600/20 to-teal-400/20 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white leading-none tracking-tight">AI Copilot</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active & Thinking</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleAssistant} className="rounded-full text-white/50 hover:text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                      msg.role === 'user' ? "bg-primary" : "bg-emerald-500"
                    )}>
                      {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                    </div>
                    <div className={cn(
                      "p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm",
                      msg.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                    )}>
                      {msg.text}
                      <p className="text-[10px] opacity-40 mt-2 font-bold uppercase tracking-widest">
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%] mr-auto">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white/5 p-4 rounded-[1.5rem] rounded-tl-none border border-white/10 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 border-t border-white/10 bg-black/20">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya apapun tentang tokomu..."
                  className="h-14 pl-5 pr-14 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-[9px] text-center text-slate-500 mt-4 font-black uppercase tracking-[0.2em]">
                Secured by SaquMart AI Engine
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
