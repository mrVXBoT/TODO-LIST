
"use client";

import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { GlobalLoading } from "@/components/global-loading"
import { usePathname } from 'next/navigation';
import { Inter, Vazirmatn } from 'next/font/google';
import { useEffect, useState, useLayoutEffect } from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const vazirmatn = Vazirmatn({ subsets: ['latin'], variable: '--font-vazirmatn' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [lang, setLang] = useState('en');

  // This effect runs on the client and ensures that the language is set
  // from localStorage as soon as the component mounts.
  useEffect(() => {
    const storedLang = localStorage.getItem('lang');
    if (storedLang && ['en', 'fa'].includes(storedLang)) {
      setLang(storedLang);
    }
  }, []);

  // This effect listens for changes in localStorage and updates the language.
  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem('lang') || 'en';
      setLang(storedLang);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // This effect updates the document's lang and dir attributes.
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <html lang={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <title>TASK0</title>
        <meta name="description" content="Intelligently manage your tasks." />
      </head>
      <body className={`${inter.variable} ${vazirmatn.variable} ${lang === 'fa' ? 'font-rtl' : 'font-body'} antialiased`}>
        <GlobalLoading />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
