
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Logo from "@/components/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from 'lucide-react';
import LandingHeader from "@/components/landing-header";
import * as React from "react";
import { translations } from "@/lib/translations";
import { ForgotPasswordDialog } from "@/components/forgot-password-dialog";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
    const router = useRouter();
    const [language, setLanguage] = React.useState('en');
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState('login');
    const [loginEmail, setLoginEmail] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    const [registerName, setRegisterName] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const { toast } = useToast();
    const t = translations[language as keyof typeof translations];

    React.useEffect(() => {
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

    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            toast({ title: "خطا", description: "لطفاً همه فیلدها را پر کنید", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            const response = await authAPI.login({ email: loginEmail, password: loginPassword });
            if (response.success) {
                toast({ title: "ورود موفق", description: "خوش آمدید!" });
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            let errorMessage = "خطا در ورود";
            
            if (error.message?.includes('کاربری با این ایمیل یافت نشد') || error.message?.includes('USER_NOT_FOUND')) {
                errorMessage = "کاربری با این ایمیل ثبت نشده است";
            } else if (error.message?.includes('رمز عبور اشتباه است') || error.message?.includes('INVALID_PASSWORD')) {
                errorMessage = "رمز عبور اشتباه است";
            } else if (error.message?.includes('سرور در دسترس نیست')) {
                errorMessage = "سرور در دسترس نیست، لطفاً بعداً تلاش کنید";
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast({ 
                title: "❌ خطا در ورود", 
                description: errorMessage, 
                variant: "destructive" 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!registerName || !registerEmail || !registerPassword) {
            toast({ title: "خطا", description: "لطفاً همه فیلدها را پر کنید", variant: "destructive" });
            return;
        }

        if (registerPassword.length < 6) {
            toast({ title: "خطا", description: "رمز عبور باید حداقل 6 کاراکتر باشد", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            const response = await authAPI.register({ 
                name: registerName, 
                email: registerEmail, 
                password: registerPassword 
            });
            if (response.success) {
                // پاک کردن فیلدهای ثبت نام
                setRegisterName('');
                setRegisterEmail('');
                setRegisterPassword('');
                
                // انتقال اطلاعات به فیلدهای ورود
                setLoginEmail(registerEmail);
                setLoginPassword(registerPassword);
                
                // تغییر به تب ورود
                setActiveTab('login');
                
                toast({ 
                    title: "✅ ثبت نام موفق", 
                    description: "حالا می‌توانید وارد شوید", 
                    duration: 4000 
                });
            }
        } catch (error: any) {
            const errorMessage = error.message?.includes('already exists') 
                ? "این ایمیل قبلاً ثبت شده است" 
                : error.message?.includes('validation')
                ? "اطلاعات وارد شده معتبر نیست"
                : error.message?.includes('password')
                ? "رمز عبور باید حداقل 6 کاراکتر باشد"
                : error.message || "خطا در ثبت نام";
            toast({ 
                title: "❌ خطا در ثبت نام", 
                description: errorMessage, 
                variant: "destructive",
                duration: 5000 
            });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <>
    <div className="mr-20 md:mr-24">
        <div className="flex items-center justify-center min-h-dvh p-4 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 animate-gradient">
          <div className="w-full max-w-md animate-fade-in-up">
            <div className="flex justify-center mb-6">
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold tracking-tight text-foreground">TASK0</span>
                </Link>
            </div>
            <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-white/20">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                        <TabsTrigger value="login">{t.login.logIn}</TabsTrigger>
                        <TabsTrigger value="signup">{t.login.signUp}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <CardHeader className="text-center">
                            <CardTitle>{t.login.welcomeBack}</CardTitle>
                            <CardDescription>{t.login.enterCredentials}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    id="email-login" 
                                    type="email" 
                                    placeholder="user@example.com" 
                                    required 
                                    className="pl-10"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    id="password-login" 
                                    type="password" 
                                    required 
                                    className="pl-10" 
                                    placeholder={t.login.password}
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                             <div className="flex items-center text-xs">
                                <button onClick={() => setIsForgotPasswordOpen(true)} className="ml-auto inline-block text-muted-foreground hover:text-primary hover:underline">
                                    {t.login.forgotPassword}
                                </button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full interactive-scale" 
                                onClick={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? "در حال ورود..." : t.login.logIn}
                            </Button>
                        </CardFooter>
                    </TabsContent>
                    <TabsContent value="signup">
                        <CardHeader className="text-center">
                            <CardTitle>{t.login.createAccount}</CardTitle>
                            <CardDescription>{t.login.fillDetails}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Input 
                                    id="name-signup" 
                                    placeholder={t.login.yourName} 
                                    required 
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                />
                            </div>
                             <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    id="email-signup" 
                                    type="email" 
                                    placeholder="user@example.com" 
                                    required 
                                    className="pl-10" 
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                               <Input 
                                   id="password-signup" 
                                   type="password" 
                                   required 
                                   className="pl-10" 
                                   placeholder={t.login.password}
                                   value={registerPassword}
                                   onChange={(e) => setRegisterPassword(e.target.value)}
                               />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full interactive-scale" 
                                onClick={handleRegister}
                                disabled={isLoading}
                            >
                                {isLoading ? "در حال ثبت نام..." : t.login.signUp}
                            </Button>
                        </CardFooter>
                    </TabsContent>
                </Tabs>
            </Card>
          </div>
          <style jsx>{`
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.6s ease-out forwards;
            }
          `}</style>
        </div>
    </div>
    <LandingHeader />
    <ForgotPasswordDialog isOpen={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen} />
    </>
  );
}
