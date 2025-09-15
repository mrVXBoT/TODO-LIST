
"use client";

import * as React from 'react';
import Link from "next/link";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Sun, Moon } from 'lucide-react';
import { translations } from '@/lib/translations';

export default function LandingHeader() {
    const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
    const [language, setLanguage] = React.useState('en');
    const t = translations[language as keyof typeof translations];

    React.useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setTheme(isDarkMode ? 'dark' : 'light');
        const storedLang = localStorage.getItem('lang') || 'en';
        setLanguage(storedLang);

        const handleStorageChange = () => {
          const newLang = localStorage.getItem('lang') || 'en';
          setLanguage(newLang);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleLanguageChange = (lang: string) => {
      setLanguage(lang);
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
      window.dispatchEvent(new Event('storage')); // To trigger updates in other components
    };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <span className="font-bold text-lg md:text-xl text-primary">TASK0</span>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t.landingHeader.toggleTheme}</span>
          </Button>

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Globe className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">{t.landingHeader.changeLanguage}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm">
              <DropdownMenuLabel>{t.landingHeader.language}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="fa">فارسی</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/login">{t.landingHeader.logIn}</Link>
            </Button>
            <Button asChild className="text-sm md:text-base px-3 md:px-4">
              <Link href="/login">{t.landingHeader.signUp}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
