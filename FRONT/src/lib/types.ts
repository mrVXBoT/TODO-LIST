
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  notifyAt?: Date;
  priority: Priority;
  isCompleted: boolean;
}

export interface NoteEntry {
  id: string;
  content: string;
  createdAt: Date;
}

export interface NoteTopic {
  id: string;
  topic: string;
  entries: NoteEntry[];
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

    