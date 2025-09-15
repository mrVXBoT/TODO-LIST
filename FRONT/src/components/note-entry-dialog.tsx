
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { NoteTopic } from "@/lib/types";
import { translations } from "@/lib/translations";

interface NoteEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAddEntry: (topicId: string, content: string) => void;
  noteTopic: NoteTopic;
}

export function NoteEntryDialog({ isOpen, onOpenChange, onAddEntry, noteTopic }: NoteEntryDialogProps) {
  const { toast } = useToast();
  const [content, setContent] = React.useState("");

  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations].noteEntryDialog;

  React.useEffect(() => {
    if (isOpen) {
      const storedLang = localStorage.getItem('lang') || 'en';
      setLanguage(storedLang);
      setContent("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (content.trim()) {
      onAddEntry(noteTopic.id, content.trim());
      toast({ title: translations[language as keyof typeof translations].dashboard.toast.noteEntryAdded });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t.title} "{noteTopic.topic}"</DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder={t.placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px]"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t.cancel}</Button>
          <Button onClick={handleSave} disabled={!content.trim()}>{t.addEntry}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    