import { useEffect, useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

interface LiveAIInsightPanelProps {
  insights: string[];
}

export default function LiveAIInsightPanel({ insights }: LiveAIInsightPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!insights || insights.length === 0) return;
    const text = insights[currentIndex];
    if (!text) return;

    let i = 0;
    setDisplayText("");
    setIsTyping(true);
    
    const interval = setInterval(() => {
      setDisplayText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % insights.length);
        }, 5000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, insights]);

  return (
    <div className="relative group">
       <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
       <div className="relative flex items-start gap-4 p-5 bg-card/80 backdrop-blur-xl border border-primary/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-primary/20 p-3 rounded-2xl">
             <BrainCircuit className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div className="flex-1 space-y-1">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Autonomous Intelligence</span>
                <Sparkles className="h-3 w-3 text-yellow-500" />
             </div>
             <p className="text-sm font-bold text-card-foreground leading-relaxed min-h-[3rem]">
                {displayText}
                {isTyping && <span className="w-1.5 h-4 ml-1 bg-primary inline-block animate-pulse" />}
             </p>
          </div>
       </div>
    </div>
  );
}
