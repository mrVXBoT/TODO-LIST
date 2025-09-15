"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import Logo from "@/components/logo";
import { translations } from "@/lib/translations";

export default function NotFound() {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem('lang') || 'en';
    setLanguage(storedLang);

    const handleStorageChange = () => {
      const newLang = localStorage.getItem('lang') || 'en';
      setLanguage(newLang);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const t = translations[language as keyof typeof translations].notFound;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 pb-6 text-center space-y-6">
          {/* Logo and Title */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">TASK0</h1>
          </div>

          {/* 404 Error */}
          <div className="space-y-2">
            <div className="text-6xl font-bold text-primary/20">404</div>
            <h2 className="text-2xl font-semibold text-foreground">
              {t.title}
            </h2>
            <p className="text-muted-foreground">
              {t.description}
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center py-4">
            <div className="relative">
              <Search className="h-16 w-16 text-muted-foreground/30" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full" size="lg">
                <Home className="h-4 w-4 mr-2" />
                {t.backToDashboard}
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.goBack}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {t.help}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
