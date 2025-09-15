
"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
// @ts-ignore
import moment from "moment-jalaali";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Configure moment-jalaali
moment.loadPersian({ usePersianDigits: false, dialect: 'persian-modern' });
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import type { NoteTopic } from "@/lib/types";
import { translations } from "@/lib/translations";

interface NoteTopicItemProps {
  noteTopic: NoteTopic;
  onAddEntry: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteTopicItem: React.FC<NoteTopicItemProps> = ({ noteTopic, onAddEntry, onEdit, onDelete }) => {
  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations].noteTopicItem;
  
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

  const getRelativeDate = (date: Date | string) => {
    if (!date) {
      console.warn('No date provided:', date);
      return 'تاریخ نامشخص';
    }
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date value:', date);
      return 'تاریخ نامعتبر';
    }
    
    try {
      if (language === 'fa') {
        // Use moment-jalaali for Persian dates
        const momentDate = moment(dateObj);
        const now = moment();
        const diffMinutes = now.diff(momentDate, 'minutes');
        const diffHours = now.diff(momentDate, 'hours');
        const diffDays = now.diff(momentDate, 'days');
        
        if (diffMinutes < 1) return 'اکنون';
        if (diffMinutes < 60) return `${diffMinutes} دقیقه پیش`;
        if (diffHours < 24) return `${diffHours} ساعت پیش`;
        if (diffDays < 30) return `${diffDays} روز پیش`;
        
        return momentDate.format('jYYYY/jMM/jDD');
      } else {
        // Use date-fns for English dates
        return formatDistanceToNow(dateObj, { addSuffix: true });
      }
    } catch (error) {
      console.error('Date formatting error:', error, { date, dateObj });
      return dateObj.toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US');
    }
  }

  const getFullDate = (date: Date | string) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    try {
      if (language === 'fa') {
        return moment(dateObj).format('jYYYY/jMM/jDD - HH:mm');
      } else {
        return dateObj.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('Full date formatting error:', error);
      return dateObj.toLocaleDateString();
    }
  }

  return (
    <Card className="interactive-scale transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex flex-col">
          <CardTitle className="text-xl">{noteTopic.topic}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'fa' ? 'ایجاد شده:' : 'Created:'} {getRelativeDate(noteTopic.createdAt)}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">{t.moreOptions}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              <span>{t.edit}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{t.delete}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        {noteTopic.entries.length > 0 ? (
          noteTopic.entries.map(entry => (
              <div key={entry.id} className="p-3 border rounded-md bg-muted/30">
                <p className="text-sm text-foreground">{entry.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {getRelativeDate(entry.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground opacity-75" title={getFullDate(entry.createdAt)}>
                    {getFullDate(entry.createdAt)}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">{t.noEntries}</p>
        )}
        <Button variant="outline" size="sm" onClick={onAddEntry}>
          <Plus className="mr-2 h-4 w-4" />
          {t.addEntry}
        </Button>
      </CardContent>
    </Card>
  );
};

    