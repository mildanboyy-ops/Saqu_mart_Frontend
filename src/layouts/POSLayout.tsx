import type { ReactNode } from 'react';

export default function POSLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col w-full h-screen overflow-hidden">
      {children}
    </div>
  );
}
