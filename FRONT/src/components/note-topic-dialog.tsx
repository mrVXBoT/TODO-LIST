
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
import type { NoteTopic } from "@/lib/types";
import { translations } from "@/lib/translations";

interface NoteTopicDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (topic: string, id?: string) => void;
  noteTopic: NoteTopic | null;
  isLoading?: boolean;
}

export function NoteTopicDialog({ isOpen, onOpenChange, onSave, noteTopic, isLoading = false }: NoteTopicDialogProps) {
  const [topic, setTopic] = React.useState("");

  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations].noteTopicDialog;
  
  React.useEffect(() => {
    if (isOpen) {
      const storedLang = localStorage.getItem('lang') || 'en';
      setLanguage(storedLang);
      setTopic(noteTopic?.topic || "");
    }
  }, [isOpen, noteTopic]);

  const handleSave = () => {
    if (topic.trim()) {
      onSave(topic.trim(), noteTopic?.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{noteTopic ? t.editTitle : t.addTitle}</DialogTitle>
          <DialogDescription>
            {noteTopic ? t.editDescription : t.addDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="note-topic">{t.topic}</Label>
          <Input
            id="note-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t.topicPlaceholder}
            className="mt-2"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {t.cancel}
          </Button>
          <Button onClick={handleSave} disabled={!topic.trim() || isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {noteTopic ? "در حال ذخیره..." : "در حال اضافه کردن..."}
              </div>
            ) : (
              noteTopic ? t.save : t.add
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    