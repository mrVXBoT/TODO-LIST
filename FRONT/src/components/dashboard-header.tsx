import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Settings, 
  LogOut, 
  Plus, 
  Moon, 
  Sun, 
  Globe, 
  Menu, 
  X,
  Shield
} from 'lucide-react';
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProfileDialog } from "@/components/profile-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { translations } from "@/lib/translations";
import { authAPI } from "@/lib/api";

interface DashboardHeaderProps {
  onAdd: () => void;
  userHabits: string;
  onUserHabitsChange: (habits: string) => void;
  user?: {id: string; name: string; email: string; habits?: string; profilePicture?: string; role?: string} | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAdd, userHabits, onUserHabitsChange, user }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [language, setLanguage] = React.useState('en');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = React.useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = React.useState(false);
  const { setTheme: setSystemTheme } = useTheme();

  const t = translations[language as keyof typeof translations];

  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const storedLang = localStorage.getItem('lang') || 'en';
    
    setTheme(storedTheme);
    setLanguage(storedLang);
    setSystemTheme(storedTheme);
    
    // Apply theme to document immediately
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
      const newLang = localStorage.getItem('lang') || 'en';
      setTheme(newTheme);
      setLanguage(newLang);
      setSystemTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setSystemTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setSystemTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('storage'));
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fa' : 'en';
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogout = () => {
    authAPI.logout();
  };

  return (
    <>
    <aside className="fixed inset-y-0 right-0 z-50 w-20 md:w-24 bg-card border-l border-border">
        <div className="flex flex-col items-center justify-between h-full py-6">
            <div className="flex flex-col items-center space-y-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={onAdd}
                      size="lg"
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg interactive-scale"
                    >
                      <Plus className="w-6 h-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{t.dashboardHeader.add}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-12 h-12 rounded-full hover:bg-accent interactive-scale"
                      onClick={toggleTheme}
                    >
                      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{t.dashboardHeader.toggleTheme}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-12 h-12 rounded-full hover:bg-accent interactive-scale"
                      onClick={toggleLanguage}
                    >
                      <Globe className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{t.dashboardHeader.changeLanguage}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-12 h-12 rounded-full p-0 hover:bg-accent interactive-scale">
                  <Avatar className="w-10 h-10">
                    <AvatarImage 
                      src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=3b82f6&color=ffffff&size=40`} 
                      alt={user?.name || 'User'} 
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56 bg-background/80 backdrop-blur-sm mr-4" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "کاربر سیستم"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsProfileDialogOpen(true)} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t.dashboardHeader.profile}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsSettingsDialogOpen(true)} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t.dashboardHeader.settings}</span>
                </DropdownMenuItem>
                {user?.role === 'ADMIN' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>پنل ادمین</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t.dashboardHeader.logOut}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div></div>
    </aside>
        <ProfileDialog 
          isOpen={isProfileDialogOpen} 
          onOpenChange={setIsProfileDialogOpen}
          userHabits={userHabits}
          onUserHabitsChange={onUserHabitsChange}
          user={user}
        />
    <SettingsDialog
        isOpen={isSettingsDialogOpen}
        onOpenChange={setIsSettingsDialogOpen}
    />
    </>
  );
};

export default DashboardHeader;