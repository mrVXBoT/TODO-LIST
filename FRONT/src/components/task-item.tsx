
"use client";

import * as React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";
import { format as formatJalali, formatDistanceToNow as formatDistanceToNowJalali } from 'date-fns-jalali';
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { translations } from "@/lib/translations";

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: (isCompleted: boolean) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const [isCompleted, setIsCompleted] = React.useState(task.isCompleted);
  const [language, setLanguage] = React.useState('en');
  
  const t = translations[language as keyof typeof translations].taskItem;
  const priorityMap: { [key in Task["priority"]]: { className: string; label: string } } = {
    high: { className: "bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30 dark:text-red-400 dark:border-red-400/30", label: t.priorities.high },
    medium: { className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/30 dark:text-yellow-400 dark:border-yellow-400/30", label: t.priorities.medium },
    low: { className: "bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30 dark:text-green-400 dark:border-green-400/30", label: t.priorities.low },
  };

  // Safe priority mapping with fallback
  const getPriorityInfo = (priority: string) => {
    const normalizedPriority = priority?.toLowerCase() as Task["priority"];
    return priorityMap[normalizedPriority] || priorityMap.medium;
  };

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


  const handleCheckedChange = (checked: boolean) => {
    setIsCompleted(checked);
    onToggleComplete(checked);
  };
  
  React.useEffect(() => {
    setIsCompleted(task.isCompleted);
  }, [task.isCompleted]);

  const getFullDate = (date: Date | string) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    try {
      return language === 'fa' ? formatJalali(dateObj, "PPP p") : format(dateObj, "PPP p");
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateObj.toLocaleDateString();
    }
  }

  const getRelativeDate = (date: Date | string) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    try {
      return language === 'fa' 
        ? formatDistanceToNowJalali(dateObj, { addSuffix: true }) 
        : formatDistanceToNow(dateObj, { addSuffix: true, locale: language === 'fa' ? faIR : undefined });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateObj.toLocaleDateString();
    }
  }

  return (
    <Card className={cn("interactive-scale transition-all duration-300", isCompleted ? "bg-card/60" : "bg-card")}>
      <CardContent className="p-4 flex items-start gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={isCompleted}
          onCheckedChange={handleCheckedChange}
          className="mt-1 h-5 w-5"
          aria-label={`Mark task "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-grow grid gap-2">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              "font-medium text-lg cursor-pointer transition-all",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </label>
          {task.description && (
            <p className={cn("text-muted-foreground text-sm", isCompleted && "line-through")}>
              {task.description}
            </p>
          )}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1">
            <Badge variant="outline" className={cn("py-1 px-2 text-xs font-semibold", getPriorityInfo(task.priority).className)}>
              {getPriorityInfo(task.priority).label}
            </Badge>
            {task.dueDate && (
              <div className="flex items-center gap-1.5" title={getFullDate(task.dueDate)}>
                <Calendar className="h-4 w-4" />
                <span>
                  {getRelativeDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>
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
      </CardContent>
    </Card>
  );
};
