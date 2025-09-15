
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bot, Save, Pencil, Trash2, TestTube } from "lucide-react";
import { TelegramIcon } from "./telegram-icon";
import { translations } from "@/lib/translations";
import { telegramAPI } from "@/lib/api";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  const { toast } = useToast();
  const [telegramToken, setTelegramToken] = React.useState("");
  const [numericId, setNumericId] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);

  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations].settingsDialog;

  React.useEffect(() => {
    if (isOpen) {
      const storedLang = localStorage.getItem('lang') || 'en';
      setLanguage(storedLang);
      loadTelegramSettings();
    }
  }, [isOpen]);

  const loadTelegramSettings = async () => {
    try {
      setIsLoading(true);
      const response = await telegramAPI.getSettings();
      if (response.success && response.data) {
        setTelegramToken(response.data.telegramBotToken || '');
        setNumericId(response.data.telegramUserId || '');
      }
    } catch (error) {
      console.error('Error loading telegram settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await telegramAPI.updateSettings({
        telegramBotToken: telegramToken,
        telegramUserId: numericId,
      });

      if (response.success) {
        toast({
          title: t.toast.title,
          description: t.toast.description,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "خطا",
          description: response.message || "خطا در ذخیره تنظیمات",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطا در ذخیره تنظیمات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!telegramToken || !numericId) {
      toast({
        title: "خطا",
        description: "لطفاً ابتدا توکن و شناسه کاربری را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsTesting(true);
      
      // First save the settings
      const saveResponse = await telegramAPI.updateSettings({
        telegramBotToken: telegramToken,
        telegramUserId: numericId,
      });

      if (!saveResponse.success) {
        toast({
          title: "خطا",
          description: saveResponse.message || "خطا در ذخیره تنظیمات",
          variant: "destructive",
        });
        return;
      }

      // Then test the connection
      const testResponse = await telegramAPI.testConnection();
      
      if (testResponse.success) {
        toast({
          title: "موفق! 🎉",
          description: "پیام تست به تلگرام ارسال شد. اتصال برقرار است!",
        });
      } else {
        toast({
          title: "خطا",
          description: testResponse.message || "خطا در تست اتصال",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.message || "خطا در تست اتصال",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    setTelegramToken("");
    setNumericId("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
            <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold">{t.telegram.title}</h3>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="telegram-token">{t.telegram.tokenLabel}</Label>
                    <Input 
                      id="telegram-token" 
                      type="password" 
                      value={telegramToken} 
                      onChange={(e) => setTelegramToken(e.target.value)} 
                      placeholder={t.telegram.tokenPlaceholder}
                      disabled={isLoading || isTesting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="numeric-id">{t.telegram.userIdLabel}</Label>
                    <Input 
                      id="numeric-id" 
                      value={numericId} 
                      onChange={(e) => setNumericId(e.target.value)} 
                      placeholder={t.telegram.userIdPlaceholder}
                      disabled={isLoading || isTesting}
                    />
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                     <Button 
                       size="sm" 
                       className="bg-blue-500 hover:bg-blue-600 text-white"
                       onClick={handleTestConnection}
                       disabled={isLoading || isTesting || !telegramToken || !numericId}
                     >
                        {isTesting ? (
                          <>
                            <TestTube className="mr-2 h-4 w-4 animate-spin" />
                            در حال تست...
                          </>
                        ) : (
                          <>
                            <TelegramIcon className="mr-2 h-4 w-4" />
                            تست اتصال
                          </>
                        )}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleClear}
                      disabled={isLoading || isTesting}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        پاک کردن
                    </Button>
                </div>
                {telegramToken && numericId && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    <strong>توجه:</strong> برای اطمینان از کارکرد صحیح، روی "تست اتصال" کلیک کنید تا پیام تستی به تلگرام ارسال شود.
                  </div>
                )}
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || isTesting}>
            {t.cancel}
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isTesting}>
            {isLoading ? (
              <>
                <TestTube className="mr-2 h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t.save}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
