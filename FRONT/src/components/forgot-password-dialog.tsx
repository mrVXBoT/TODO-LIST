
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
import { translations } from "@/lib/translations";
import { Mail } from "lucide-react";

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ForgotPasswordDialog({ isOpen, onOpenChange }: ForgotPasswordDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");

  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations].forgotPasswordDialog;

  React.useEffect(() => {
    if (isOpen) {
      const storedLang = localStorage.getItem('lang') || 'en';
      setLanguage(storedLang);
      setEmail("");
    }
  }, [isOpen]);

  const handleSendLink = () => {
    // In a real app, you'd trigger a password reset flow here.
    // For this demo, we'll just show a toast.
    if (email) {
      toast({
        title: t.toast.title,
        description: t.toast.description,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email-forgot" className="sr-only">
                    {t.emailLabel}
                </Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="email-forgot"
                        type="email"
                        placeholder={t.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleSendLink} disabled={!email}>
            {t.sendLink}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
