"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import LandingHeader from "@/components/landing-header";
import { translations } from "@/lib/translations";
import { Bot, Zap, Plus, Check, Sparkles, Target, Users, ArrowRight, Star, Trophy, Rocket } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [language, setLanguage] = React.useState('en');
  const [isLoading, setIsLoading] = React.useState(true);
  const [demoTasks, setDemoTasks] = React.useState<Array<{id: number; text: string; completed: boolean}>>([]);
  const [newTask, setNewTask] = React.useState('');
  const t = translations[language as keyof typeof translations];

  React.useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      router.push('/dashboard');
      return;
    }
    
    const storedLang = localStorage.getItem('lang') || 'en';
    setLanguage(storedLang);
    
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('lang') || 'en';
      setLanguage(newLang);
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Initialize demo tasks
    setDemoTasks([
      { id: 1, text: t.landingPage.interactiveDemo.task1, completed: false },
      { id: 2, text: t.landingPage.interactiveDemo.task2, completed: true },
      { id: 3, text: t.landingPage.interactiveDemo.task3, completed: false },
    ]);
    
    setIsLoading(false);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, t]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setDemoTasks([...demoTasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setDemoTasks(demoTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center px-4">
          <div className="animate-spin rounded-full h-24 w-24 md:h-32 md:w-32 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-base md:text-lg text-muted-foreground animate-pulse">
            {language === 'fa' ? 'در حال بارگذاری...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <LandingHeader />
      
      <main className="w-full">{/* Remove right margin that causes mobile issues */}
        {/* Hero Section with Floating Elements */}
        <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
            <div className="absolute bottom-32 left-20 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-60"></div>
            <div className="absolute bottom-20 right-40 w-5 h-5 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center animate-fade-in-up relative z-10">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                AI-Powered Task Management
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 md:mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight px-2">
              {t.landingPage.hero.title}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 md:mb-12 max-w-4xl mx-auto font-light leading-relaxed px-4">
              {t.landingPage.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16 px-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-6 md:py-8 interactive-scale bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                onClick={() => router.push('/login')}
              >
                <Rocket className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                {t.landingPage.hero.cta}
                <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-6 md:py-8 interactive-scale border-2 hover:bg-white/50 dark:hover:bg-gray-800/50"
                onClick={() => router.push('/login')}
              >
                {language === 'fa' ? 'مشاهده دمو' : 'Watch Demo'}
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'fa' ? 'کاربر فعال' : 'Active Users'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">100K+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'fa' ? 'وظیفه تکمیل شده' : 'Tasks Completed'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-indigo-600 mb-2">4.9★</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'fa' ? 'امتیاز کاربران' : 'User Rating'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Carousel */}
        <section className="py-16 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                {language === 'fa' ? 'ویژگی‌های قدرتمند' : 'Powerful Features'}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                {language === 'fa' ? 'همه چیزی که برای سازماندهی و بهره‌وری نیاز دارید' : 'Everything you need to stay organized and productive'}
              </p>
            </div>
            
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent className="-ml-1">
                {/* Feature 1 */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                        <Bot className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg md:text-2xl">{t.landingPage.robot.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {t.landingPage.robot.p1.slice(0, 80)}...
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                
                {/* Feature 2 */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                        <Target className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg md:text-2xl">
                        {language === 'fa' ? 'اولویت‌بندی هوشمند' : 'Smart Priorities'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {language === 'fa' ? 'اولویت‌بندی وظایف با کمک هوش مصنوعی برای تمرکز بر مهم‌ترین کارها' : 'AI-powered task prioritization helps you focus on what matters most'}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                
                {/* Feature 3 */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                        <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg md:text-2xl">
                        {language === 'fa' ? 'همکاری تیمی' : 'Team Collaboration'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {language === 'fa' ? 'اشتراک‌گذاری وظایف و همکاری با تیم در زمان واقعی' : 'Share tasks and collaborate with your team in real-time'}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                
                {/* Feature 4 */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-yellow-200 dark:border-yellow-800">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                        <Trophy className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                      <CardTitle className="text-lg md:text-2xl">
                        {language === 'fa' ? 'ردیابی اهداف' : 'Goal Tracking'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {language === 'fa' ? 'تعیین و ردیابی اهداف با تحلیل‌های دقیق پیشرفت' : 'Set and track your goals with detailed progress analytics'}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-16 md:py-32 px-4 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-900 dark:to-purple-950/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="order-2 lg:order-1">
                <Card className="p-4 md:p-8 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <div className="text-center mb-6 md:mb-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <Zap className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{t.landingPage.interactiveDemo.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {language === 'fa' ? 'یک وظیفه اضافه کنید و جادو را ببینید' : 'Add a task below and see the magic happen'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 md:gap-3 mb-4 md:mb-6">
                    <Input
                      placeholder={t.landingPage.interactiveDemo.placeholder}
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                      className="text-sm md:text-lg py-4 md:py-6"
                    />
                    <Button onClick={handleAddTask} size="lg" className="px-4 md:px-6 shrink-0">
                      <Plus className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {demoTasks.map((task, index) => (
                      <div 
                        key={task.id} 
                        className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          task.completed 
                            ? 'bg-green-50 border-green-300 text-green-800 dark:bg-green-950/50 dark:border-green-700' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => toggleTask(task.id)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 md:border-3 flex items-center justify-center transition-all shrink-0 ${
                          task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
                        }`}>
                          {task.completed && <Check className="h-3 w-3 md:h-4 md:w-4 text-white" />}
                        </div>
                        <span className={`text-sm md:text-lg flex-1 ${task.completed ? 'line-through opacity-70' : ''}`}>
                          {task.text}
                        </span>
                        {task.completed && <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-500 animate-pulse shrink-0" />}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight">{t.landingPage.capture.title}</h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                  {t.landingPage.capture.p1}
                </p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {t.landingPage.capture.p2}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-32 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              {language === 'fa' ? 'آماده تحول در بهره‌وری خود هستید؟' : 'Ready to Transform Your Productivity?'}
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              {language === 'fa' ? 
                'به هزاران کاربری بپیوندید که نحوه مدیریت وظایف خود را متحول کرده‌اند' : 
                'Join thousands of users who have already revolutionized the way they manage tasks'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-8 md:mb-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-6 md:py-8 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl interactive-scale"
                onClick={() => router.push('/login')}
              >
                <Rocket className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                {language === 'fa' ? 'امروز رایگان شروع کنید' : 'Start Free Today'}
                <ArrowRight className="ml-2 h-4 md:h-5 w-4 md:w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-base md:text-lg px-8 md:px-12 py-6 md:py-8 border-white text-white hover:bg-white/10 interactive-scale"
                onClick={() => router.push('/login')}
              >
                {language === 'fa' ? 'بیشتر بدانید' : 'Learn More'}
              </Button>
            </div>
            
            <p className="text-xs md:text-sm opacity-70 px-4">
              {language === 'fa' ? 
                '✨ بدون نیاز به کارت اعتباری • 🚀 راه‌اندازی در کمتر از ۲ دقیقه • 🔒 داده‌های شما امن است' :
                '✨ No credit card required • 🚀 Setup in under 2 minutes • 🔒 Your data is secure'
              }
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}