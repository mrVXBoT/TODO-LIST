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
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground animate-pulse">Loading TASK0...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <LandingHeader />
      
      <main className="mr-20 md:mr-24">
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
            
            <h1 className="text-6xl md:text-9xl font-bold tracking-tight mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              {t.landingPage.hero.title}
            </h1>
            
            <p className="text-xl md:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              {t.landingPage.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                size="lg" 
                className="text-lg px-12 py-8 interactive-scale bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                onClick={() => router.push('/login')}
              >
                <Rocket className="mr-2 h-5 w-5" />
                {t.landingPage.hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-12 py-8 interactive-scale border-2 hover:bg-white/50 dark:hover:bg-gray-800/50"
                onClick={() => router.push('/login')}
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100K+</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">4.9★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Carousel */}
        <section className="py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                Powerful Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to stay organized and productive
              </p>
            </div>
            
            <Carousel className="w-full max-w-6xl mx-auto">
              <CarouselContent className="-ml-1">
                {/* Feature 1 */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                        <Bot className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{t.landingPage.robot.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {t.landingPage.robot.p1.slice(0, 120)}...
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                
                {/* Feature 2 */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
                    <CardHeader>
                      <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4">
                        <Target className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Smart Priorities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        AI-powered task prioritization helps you focus on what matters most
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                
                {/* Feature 3 */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
                    <CardHeader>
                      <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Team Collaboration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        Share tasks and collaborate with your team in real-time
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
                
                {/* Feature 4 */}
                <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-yellow-200 dark:border-yellow-800">
                    <CardHeader>
                      <div className="w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mb-4">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">Goal Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        Set and track your goals with detailed progress analytics
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
        <section className="py-32 px-4 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-gray-900 dark:to-purple-950/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <Card className="p-8 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{t.landingPage.interactiveDemo.title}</h3>
                    <p className="text-muted-foreground">Add a task below and see the magic happen</p>
                  </div>
                  
                  <div className="flex gap-3 mb-6">
                    <Input
                      placeholder={t.landingPage.interactiveDemo.placeholder}
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                      className="text-lg py-6"
                    />
                    <Button onClick={handleAddTask} size="lg" className="px-6">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {demoTasks.map((task, index) => (
                      <div 
                        key={task.id} 
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          task.completed 
                            ? 'bg-green-50 border-green-300 text-green-800 dark:bg-green-950/50 dark:border-green-700' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => toggleTask(task.id)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className={`w-6 h-6 rounded-full border-3 flex items-center justify-center transition-all ${
                          task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
                        }`}>
                          {task.completed && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <span className={`text-lg ${task.completed ? 'line-through opacity-70' : ''}`}>
                          {task.text}
                        </span>
                        {task.completed && <Star className="h-5 w-5 text-yellow-500 ml-auto animate-pulse" />}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-5xl font-bold mb-8 leading-tight">{t.landingPage.capture.title}</h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {t.landingPage.capture.p1}
                </p>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t.landingPage.capture.p2}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
              Join thousands of users who have already revolutionized the way they manage tasks
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-12 py-8 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl interactive-scale"
                onClick={() => router.push('/login')}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-12 py-8 border-white text-white hover:bg-white/10 interactive-scale"
                onClick={() => router.push('/login')}
              >
                Learn More
              </Button>
            </div>
            
            <p className="text-sm opacity-70">
              ✨ No credit card required • 🚀 Setup in under 2 minutes • 🔒 Your data is secure
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}