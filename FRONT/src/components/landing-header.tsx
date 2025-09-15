
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
    <aside className="fixed top-0 right-0 h-screen w-20 md:w-24 bg-gradient-to-b from-blue-600 to-purple-700 flex flex-col items-center justify-center py-6 z-30 shadow-2xl">
        <div className="flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-white/80 hover:text-white hover:bg-white/10 interactive-scale"
                >
                    <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{t.landingHeader.toggleTheme}</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 interactive-scale">
                            <Globe className="h-6 w-6" />
                            <span className="sr-only">{t.landingHeader.changeLanguage}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-sm">
                        <DropdownMenuLabel>{t.landingHeader.language}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
                            <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="fa">فارسی</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex flex-col items-center gap-6">
                 <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-8 w-8 text-white" />
                </Link>
                <nav className="flex flex-col items-center gap-4">
                    <Button variant="ghost" asChild className="text-white/80 hover:text-white hover:bg-white/10">
                        <Link href="/login">{t.landingHeader.logIn}</Link>
                    </Button>
                    <Button variant="secondary" asChild className="bg-white/90 text-primary hover:bg-white font-semibold">
                        <Link href="/login">{t.landingHeader.signUp}</Link>
                    </Button>
                </nav>
            </div>
        </div>
    </aside>
  );
}
