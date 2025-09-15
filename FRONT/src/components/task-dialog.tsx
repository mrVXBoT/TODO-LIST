
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import type { Task, Priority } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersianDatePicker } from "@/components/ui/persian-date-picker";
import { Calendar as CalendarIcon, Flag, Type, Text, Bell } from "lucide-react";
import { translations } from "@/lib/translations";

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(100, "Title is too long."),
  description: z.string().max(500, "Description is too long.").optional(),
  dueDate: z.date().optional(),
  notifyAt: z.date().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (taskData: Omit<Task, "id" | "isCompleted">, id?: string) => void;
  task: Task | null;
  isLoading?: boolean;
}

export function TaskDialog({ isOpen, onOpenChange, onSave, task, isLoading = false }: TaskDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      notifyAt: undefined,
      priority: "medium",
    },
  });
  
  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations].taskDialog;

  React.useEffect(() => {
    if (isOpen) {
        const storedLang = localStorage.getItem('lang') || 'en';
        setLanguage(storedLang);

        if (task) {
          form.reset({
            title: task.title,
            description: task.description || "",
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            notifyAt: (task as any).notifyAt ? new Date((task as any).notifyAt) : undefined,
            priority: task.priority,
          });
        } else {
          form.reset({
            title: "",
            description: "",
            dueDate: undefined,
            notifyAt: undefined,
            priority: "medium",
          });
        }
    }
  }, [task, form, isOpen]);

  const onSubmit = (data: TaskFormValues) => {
    // Ensure priority is normalized
    const taskData = {
      ...data,
      priority: data.priority?.toLowerCase() as Priority,
      dueDate: data.dueDate || undefined,
      notifyAt: data.notifyAt || undefined,
      description: data.description || undefined,
    };
    onSave(taskData, task?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{task ? t.editTask : t.addTask}</DialogTitle>
          <DialogDescription>
            {task ? t.editDescription : t.addDescription}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Type className="h-4 w-4 text-muted-foreground" /> {t.title}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.titlePlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Text className="h-4 w-4 text-muted-foreground" /> {t.description}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t.descriptionPlaceholder} className="resize-none h-24" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" /> 
                      {t.dueDate}
                    </FormLabel>
                    <FormControl>
                      <PersianDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t.pickDate}
                        language={language as 'fa' | 'en'}
                        includeTime={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Flag className="h-4 w-4 text-muted-foreground" /> {t.priority}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} dir={language === 'fa' ? 'rtl' : 'ltr'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectPriority} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">{t.priorities.low}</SelectItem>
                        <SelectItem value="medium">{t.priorities.medium}</SelectItem>
                        <SelectItem value="high">{t.priorities.high}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notifyAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" /> 
                    زمان اعلان (اختیاری)
                  </FormLabel>
                  <FormControl>
                    <PersianDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="زمان ارسال اعلان را انتخاب کنید"
                      language={language as 'fa' | 'en'}
                      includeTime={true}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground">
                    {language === 'fa' 
                      ? 'اعلان تلگرام در زمان مشخص شده ارسال خواهد شد'
                      : 'Telegram notification will be sent at the specified time'
                    }
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                {t.cancel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    {task ? "در حال ذخیره..." : "در حال اضافه کردن..."}
                  </div>
                ) : (
                  task ? t.saveChanges : t.addTask
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
