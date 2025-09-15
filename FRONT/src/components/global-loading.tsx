"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    setProgress(20);

    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(50), 100);
    const timer2 = setTimeout(() => setProgress(80), 200);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <Progress value={progress} className="h-1 rounded-none" />
      <div className="flex items-center justify-center py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          در حال بارگذاری...
        </div>
      </div>
    </div>
  );
}
