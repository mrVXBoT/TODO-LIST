"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X } from "lucide-react";
import { translations } from "@/lib/translations";

interface ProfilePictureUploadProps {
  currentPicture?: string | null;
  userName?: string;
  onPictureChange: (picture: string | null) => void;
  disabled?: boolean;
}

export function ProfilePictureUpload({ 
  currentPicture, 
  userName = "کاربر", 
  onPictureChange,
  disabled = false 
}: ProfilePictureUploadProps) {
  const [language, setLanguage] = React.useState('en');
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const t = translations[language as keyof typeof translations];

  React.useEffect(() => {
    const storedLang = localStorage.getItem('lang') || 'en';
    setLanguage(storedLang);
    
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('lang') || 'en';
      setLanguage(newLang);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطا",
        description: "لطفاً فقط فایل‌های تصویری انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onPictureChange(result);
      toast({
        title: "موفق",
        description: "عکس پروفایل تغییر کرد",
      });
    };
    reader.onerror = () => {
      toast({
        title: "خطا",
        description: "خطا در خواندن فایل",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePicture = () => {
    onPictureChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: "موفق",
      description: "عکس پروفایل حذف شد",
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24 ring-2 ring-border">
          <AvatarImage src={currentPicture || undefined} alt={userName} />
          <AvatarFallback className="text-lg font-semibold">
            {getUserInitials(userName)}
          </AvatarFallback>
        </Avatar>
        
        {/* Camera overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {currentPicture ? "تغییر عکس" : "افزودن عکس"}
        </Button>
        
        {currentPicture && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemovePicture}
            disabled={disabled}
            className="flex items-center gap-2 text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4" />
            حذف عکس
          </Button>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <p className="text-xs text-muted-foreground text-center">
        فرمت‌های مجاز: JPG, PNG, GIF<br />
        حداکثر حجم: ۵ مگابایت
      </p>
    </div>
  );
}
