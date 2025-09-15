
"use client";

import * as React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Search } from "lucide-react";
import type { Priority } from "@/lib/types";
import { translations } from '@/lib/translations';

interface TaskFiltersProps {
  statusFilter: "all" | "completed" | "incomplete";
  onStatusFilterChange: (value: "all" | "completed" | "incomplete") => void;
  priorityFilter: "all" | Priority;
  onPriorityFilterChange: (value: "all" | Priority) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSmartSort: () => void;
  isSorting: boolean;
  hasTasks: boolean;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter, onStatusFilterChange,
  priorityFilter, onPriorityFilterChange,
  searchTerm, onSearchTermChange,
  onSmartSort, isSorting,
  hasTasks,
}) => {
  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations].taskFilters;

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

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full md:flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t.searchPlaceholder}
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          disabled={!hasTasks}
        />
      </div>
      <div className="flex w-full md:w-auto items-center gap-4">
        <Select value={statusFilter} onValueChange={onStatusFilterChange} disabled={!hasTasks} dir={language === 'fa' ? 'rtl' : 'ltr'}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder={t.status.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.status.all}</SelectItem>
            <SelectItem value="incomplete">{t.status.incomplete}</SelectItem>
            <SelectItem value="completed">{t.status.completed}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={onPriorityFilterChange} disabled={!hasTasks} dir={language === 'fa' ? 'rtl' : 'ltr'}>
          <SelectTrigger className="w-full md:w-[160px]">
            <SelectValue placeholder={t.priority.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.priority.all}</SelectItem>
            <SelectItem value="high">{t.priority.high}</SelectItem>
            <SelectItem value="medium">{t.priority.medium}</SelectItem>
            <SelectItem value="low">{t.priority.low}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        onClick={onSmartSort} 
        disabled={isSorting || !hasTasks}
        className="w-full md:w-auto interactive-scale bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isSorting ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-5 w-5" />
        )}
        {t.smartSort}
      </Button>
    </div>
  );
};

export default TaskFilters;
