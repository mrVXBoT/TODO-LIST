
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckSquare, StickyNote, Plus, ArrowRight } from "lucide-react";
import { translations } from "@/lib/translations";

interface AddSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelect: (type: 'task' | 'note') => void;
}

export function AddSelectionDialog({ isOpen, onOpenChange, onSelect }: AddSelectionDialogProps) {
  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations].addSelectionDialog;

  React.useEffect(() => {
    if (isOpen) {
      const storedLang = localStorage.getItem('lang') || 'en';
      setLanguage(storedLang);
    }
  }, [isOpen]);

  const handleSelect = (type: 'task' | 'note') => {
    onSelect(type);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">{t.title}</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {t.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          <div className="grid gap-3">
            <Card 
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-2 hover:border-blue-200 group"
              onClick={() => handleSelect('task')}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <CheckSquare className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {t.addTask}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t.addTaskDescription}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-2 hover:border-purple-200 group"
              onClick={() => handleSelect('note')}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <StickyNote className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 transition-colors">
                        {t.addNote}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t.addNoteDescription}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-sm">
              انصراف
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

    