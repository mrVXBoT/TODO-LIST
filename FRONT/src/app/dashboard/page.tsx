
"use client";

import * as React from "react";
import Link from "next/link";
import { DUMMY_TASKS, DUMMY_NOTES } from "@/lib/dummy-data";
import type { Task, Priority, NoteTopic, NoteEntry } from "@/lib/types";
import { tasksAPI, notesAPI, authAPI, isAuthenticated } from "@/lib/api";
import DashboardHeader from "@/components/dashboard-header";
import TaskFilters from "@/components/task-filters";
import TaskList from "@/components/task-list";
import { TaskDialog } from "@/components/task-dialog";
import { TaskSkeleton } from "@/components/task-skeleton";
import { NoteSkeleton } from "@/components/note-skeleton";
import { getSortedTasks } from "@/app/actions/ai.actions";
import { useToast } from "@/hooks/use-toast";
import { FilePlus2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { translations } from "@/lib/translations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoteTopicList from "@/components/note-topic-list";
import { NoteTopicDialog } from "@/components/note-topic-dialog";
import { NoteEntryDialog } from "@/components/note-entry-dialog";
import { AddSelectionDialog } from "@/components/add-selection-dialog";


export default function DashboardPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [notes, setNotes] = React.useState<NoteTopic[]>([]);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSorting, setIsSorting] = React.useState(false);
  const [isTaskSaving, setIsTaskSaving] = React.useState(false);
  const [isNoteTopicSaving, setIsNoteTopicSaving] = React.useState(false);
  const { toast } = useToast();

  // Task states
  const [statusFilter, setStatusFilter] = React.useState<"all" | "completed" | "incomplete">("all");
  const [priorityFilter, setPriorityFilter] = React.useState<"all" | Priority>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // Dialog states
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [isNoteTopicDialogOpen, setIsNoteTopicDialogOpen] = React.useState(false);
  const [editingNoteTopic, setEditingNoteTopic] = React.useState<NoteTopic | null>(null);
  const [isNoteEntryDialogOpen, setIsNoteEntryDialogOpen] = React.useState(false);
  const [activeNoteTopic, setActiveNoteTopic] = React.useState<NoteTopic | null>(null);
  const [isAddSelectionDialogOpen, setIsAddSelectionDialogOpen] = React.useState(false);

  const [userHabits, setUserHabits] = React.useState("I am a morning person and prefer to tackle complex, high-priority tasks first. I like to clear my plate of quick wins in the afternoon.");
  const [user, setUser] = React.useState<{id: string; name: string; email: string; habits?: string} | null>(null);
  
  const [language, setLanguage] = React.useState('en');
  const t = translations[language as keyof typeof translations];

  // Load data from API
  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        setUserHabits(response.data.habits || userHabits);
      }
    } catch (error: any) {
      console.error('Failed to load user:', error);
      const errorMessage = error.message?.includes('401') || error.message?.includes('Unauthorized')
        ? "نشست شما منقضی شده است، لطفاً دوباره وارد شوید"
        : "خطا در بارگیری اطلاعات کاربر";
      toast({ title: "⚠️ خطا", description: errorMessage, variant: "destructive" });
    }
  };

  const loadTasks = async () => {
    try {
      const response = await tasksAPI.getAll();
      if (response.success) {
        // Normalize dates for frontend consistency
        const normalizedTasks = (response.data || []).map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          notifyAt: task.notifyAt ? new Date(task.notifyAt) : undefined,
        }));
        setTasks(normalizedTasks);
      }
    } catch (error: any) {
      console.error('Failed to load tasks:', error);
      // Do NOT fallback to dummy data for security reasons
      setTasks([]);
      
      if (error.message?.includes('سرور در دسترس نیست')) {
        // Server is down
        toast({ 
          title: "⚠️ خطا در اتصال", 
          description: "سرور در دسترس نیست. لطفاً بعداً تلاش کنید.", 
          variant: "destructive" 
        });
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        toast({ 
          title: "⚠️ خطا", 
          description: "نشست شما منقضی شده است، لطفاً دوباره وارد شوید", 
          variant: "destructive" 
        });
        window.location.href = '/login';
      } else {
        toast({ 
          title: "⚠️ خطا", 
          description: "خطا در بارگذاری وظایف", 
          variant: "destructive" 
        });
      }
    }
  };

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      if (response.success) {
        // Normalize dates for notes and their entries
        const normalizedNotes = (response.data || []).map((noteTopic: any) => ({
          ...noteTopic,
          createdAt: noteTopic.createdAt ? new Date(noteTopic.createdAt) : new Date(),
          entries: (noteTopic.entries || []).map((entry: any) => ({
            ...entry,
            createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
          })),
        }));
        setNotes(normalizedNotes);
      }
    } catch (error: any) {
      console.error('Failed to load notes:', error);
      // Do NOT fallback to dummy data for security reasons
      setNotes([]);
      
      if (error.message?.includes('سرور در دسترس نیست')) {
        // Server is down - error already shown by loadTasks
        return;
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        // Already handled by loadTasks
        return;
      } else {
        toast({ 
          title: "⚠️ خطا", 
          description: "خطا در بارگذاری یادداشت‌ها", 
          variant: "destructive" 
        });
      }
    }
  };

  React.useEffect(() => {
    const initializeData = async () => {
      if (!isAuthenticated()) {
        // Redirect to login if no valid token
        window.location.href = '/login';
        return;
      }

      setIsLoading(true);
      await Promise.all([loadUser(), loadTasks(), loadNotes()]);
      setIsLoading(false);
    };

    initializeData();

    const storedLang = localStorage.getItem('lang') || 'en';
    setLanguage(storedLang);

    const handleStorageChange = () => {
      const newLang = localStorage.getItem('lang') || 'en';
      setLanguage(newLang);
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleOpenAddTaskDialog = (task: Task | null = null) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };
  
  const handleOpenAddNoteTopicDialog = (noteTopic: NoteTopic | null = null) => {
      setEditingNoteTopic(noteTopic);
      setIsNoteTopicDialogOpen(true);
  };

  const handleOpenAddNoteEntryDialog = (noteTopic: NoteTopic) => {
      setActiveNoteTopic(noteTopic);
      setIsNoteEntryDialogOpen(true);
  };


  const handleSaveTask = async (taskData: Omit<Task, "id" | "isCompleted">, id?: string) => {
    setIsTaskSaving(true);
    try {
      if (id) {
        // Update existing task
        const response = await tasksAPI.update(id, taskData);
        if (response.success) {
          setTasks(tasks.map(t => t.id === id ? response.data : t));
          toast({ title: t.dashboard.toast.taskUpdated, description: `"${taskData.title}" ${t.dashboard.toast.hasBeenUpdated}` });
        }
      } else {
        // Create new task
        const response = await tasksAPI.create(taskData);
        if (response.success) {
          setTasks([response.data, ...tasks]);
          toast({ title: t.dashboard.toast.taskAdded, description: `"${taskData.title}" ${t.dashboard.toast.hasBeenCreated}` });
        }
      }
      setIsTaskDialogOpen(false);
      setEditingTask(null);
    } catch (error: any) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    } finally {
      setIsTaskSaving(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;

    try {
      const response = await tasksAPI.delete(id);
      if (response.success) {
        setTasks(tasks.filter(t => t.id !== id));
        toast({ title: t.dashboard.toast.taskDeleted, description: `"${taskToDelete.title}" ${t.dashboard.toast.hasBeenRemoved}`, variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    }
  };

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    try {
      const response = await tasksAPI.toggleComplete(id);
      if (response.success) {
        // Normalize dates for frontend consistency
        const normalizedTask = {
          ...response.data,
          dueDate: response.data.dueDate ? new Date(response.data.dueDate) : undefined,
          notifyAt: response.data.notifyAt ? new Date(response.data.notifyAt) : undefined,
        };
        setTasks(tasks.map(t => t.id === id ? normalizedTask : t));
      }
    } catch (error: any) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    }
  };
  
  const handleSmartSort = async () => {
    setIsSorting(true);
    try {
      const sorted = await getSortedTasks(filteredTasks, userHabits);
      setTasks(prevTasks => {
        const originalTasksById = new Map(prevTasks.map(t => [t.id, t]));
        const sortedTasks = sorted.map(st => originalTasksById.get(st.id)).filter(Boolean) as Task[];
        const unsortedTasks = prevTasks.filter(pt => !sorted.find(st => st.id === pt.id));
        return [...sortedTasks, ...unsortedTasks];
      });
      toast({ title: t.dashboard.toast.tasksSorted, description: t.dashboard.toast.tasksReordered });
    } catch (error) {
      console.error(error);
      toast({ title: t.dashboard.toast.sortingFailed, description: t.dashboard.toast.couldNotSort, variant: "destructive" });
    } finally {
      setIsSorting(false);
    }
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = statusFilter === 'all' || (statusFilter === 'completed' ? task.isCompleted : !task.isCompleted);
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
      const searchMatch = searchTerm === '' || task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && priorityMatch && searchMatch;
    });
  }, [tasks, statusFilter, priorityFilter, searchTerm]);

  const handleSaveNoteTopic = async (topic: string, id?: string) => {
      setIsNoteTopicSaving(true);
      try {
        if (id) {
          // Update existing note topic
          const response = await notesAPI.update(id, { topic });
          if (response.success) {
            // Normalize dates for updated note topic
            const normalizedNoteTopic = {
              ...response.data,
              createdAt: response.data.createdAt ? new Date(response.data.createdAt) : new Date(),
              entries: (response.data.entries || []).map((entry: any) => ({
                ...entry,
                createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
              })),
            };
            setNotes(notes.map(n => n.id === id ? normalizedNoteTopic : n));
            toast({ title: t.dashboard.toast.noteTopicUpdated, description: `"${topic}" ${t.dashboard.toast.hasBeenUpdated}`});
          }
        } else {
          // Create new note topic
          const response = await notesAPI.create({ topic });
          if (response.success) {
            // Normalize dates for new note topic
            const normalizedNoteTopic = {
              ...response.data,
              createdAt: response.data.createdAt ? new Date(response.data.createdAt) : new Date(),
              entries: (response.data.entries || []).map((entry: any) => ({
                ...entry,
                createdAt: entry.createdAt ? new Date(entry.createdAt) : new Date(),
              })),
            };
            setNotes([normalizedNoteTopic, ...notes]);
            toast({ title: t.dashboard.toast.noteTopicAdded, description: `"${topic}" ${t.dashboard.toast.hasBeenCreated}` });
          }
        }
        setIsNoteTopicDialogOpen(false);
        setEditingNoteTopic(null);
      } catch (error: any) {
        toast({ title: "خطا", description: error.message, variant: "destructive" });
      } finally {
        setIsNoteTopicSaving(false);
      }
  };
  
  const handleDeleteNoteTopic = async (id: string) => {
      const noteTopicToDelete = notes.find(n => n.id === id);
      if (!noteTopicToDelete) return;

      try {
        const response = await notesAPI.delete(id);
        if (response.success) {
          setNotes(notes.filter(n => n.id !== id));
          toast({ title: t.dashboard.toast.noteTopicDeleted, description: `"${noteTopicToDelete.topic}" ${t.dashboard.toast.hasBeenRemoved}`, variant: "destructive" });
        }
      } catch (error: any) {
        toast({ title: "خطا", description: error.message, variant: "destructive" });
      }
  };

  const handleAddNoteEntry = async (topicId: string, content: string) => {
      try {
        const response = await notesAPI.addEntry(topicId, { content });
        if (response.success) {
          // Reload notes to get updated entries
          await loadNotes();
          toast({ title: "موفق", description: "یادداشت اضافه شد" });
        }
      } catch (error: any) {
        toast({ title: "خطا", description: error.message, variant: "destructive" });
      }
      
      setIsNoteEntryDialogOpen(false);
      setActiveNoteTopic(null);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <div className="mr-20 md:mr-24">
        <main className="w-full max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="flex items-center gap-2">
                      <Logo className="h-8 w-8 text-primary" />
                      <h1 className="text-2xl font-bold tracking-tight">TASK0</h1>
                  </Link>
              </div>
          </div>
          
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tasks">{t.dashboard.tabs.tasks}</TabsTrigger>
              <TabsTrigger value="notes">{t.dashboard.tabs.notes}</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="mt-8">
              <div className="space-y-8">
                <TaskFilters
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  priorityFilter={priorityFilter}
                  onPriorityFilterChange={setPriorityFilter}
                  searchTerm={searchTerm}
                  onSearchTermChange={setSearchTerm}
                  onSmartSort={handleSmartSort}
                  isSorting={isSorting}
                  hasTasks={tasks.length > 0}
                />
                {isLoading ? (
                  <TaskSkeleton />
                ) : filteredTasks.length > 0 ? (
                  <TaskList
                    tasks={filteredTasks}
                    onEditTask={handleOpenAddTaskDialog}
                    onDeleteTask={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                  />
                ) : (
                  <div className="text-center py-16 px-4 border-2 border-dashed border-muted-foreground/30 rounded-xl">
                    <div className="flex justify-center mb-4">
                        <FilePlus2 className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                    <h2 className="text-2xl font-semibold text-muted-foreground">{t.dashboard.noTasks.title}</h2>
                    <p className="text-muted-foreground/80 mt-2 mb-6">{t.dashboard.noTasks.description}</p>
                    <Button onClick={() => handleOpenAddTaskDialog()} className="interactive-scale">
                      {t.dashboard.noTasks.addTask}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="notes" className="mt-8">
                {isLoading ? (
                  <NoteSkeleton />
                ) : notes.length > 0 ? (
                  <NoteTopicList 
                    noteTopics={notes}
                    onAddEntry={handleOpenAddNoteEntryDialog}
                    onEditTopic={handleOpenAddNoteTopicDialog}
                    onDeleteTopic={handleDeleteNoteTopic}
                  />
                ) : (
                   <div className="text-center py-16 px-4 border-2 border-dashed border-muted-foreground/30 rounded-xl">
                    <div className="flex justify-center mb-4">
                        <StickyNote className="w-16 h-16 text-muted-foreground/50" />
                    </div>
                    <h2 className="text-2xl font-semibold text-muted-foreground">{t.dashboard.noNotes.title}</h2>
                    <p className="text-muted-foreground/80 mt-2 mb-6">{t.dashboard.noNotes.description}</p>
                    <Button onClick={() => handleOpenAddNoteTopicDialog()} className="interactive-scale">
                      {t.dashboard.noNotes.addNote}
                    </Button>
                  </div>
                )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <DashboardHeader 
        onAdd={() => setIsAddSelectionDialogOpen(true)} 
        userHabits={userHabits} 
        onUserHabitsChange={setUserHabits}
        user={user}
      />
      <AddSelectionDialog
        isOpen={isAddSelectionDialogOpen}
        onOpenChange={setIsAddSelectionDialogOpen}
        onSelect={(type) => {
          if (type === 'task') handleOpenAddTaskDialog();
          if (type === 'note') handleOpenAddNoteTopicDialog();
        }}
      />
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onSave={handleSaveTask}
        task={editingTask}
        isLoading={isTaskSaving}
      />
      <NoteTopicDialog
        isOpen={isNoteTopicDialogOpen}
        onOpenChange={setIsNoteTopicDialogOpen}
        onSave={handleSaveNoteTopic}
        noteTopic={editingNoteTopic}
        isLoading={isNoteTopicSaving}
      />
      {activeNoteTopic && (
        <NoteEntryDialog 
            isOpen={isNoteEntryDialogOpen}
            onOpenChange={(isOpen) => {
                if (!isOpen) setActiveNoteTopic(null);
                setIsNoteEntryDialogOpen(isOpen);
            }}
            onAddEntry={handleAddNoteEntry}
            noteTopic={activeNoteTopic}
        />
      )}
    </div>
  );
}

    