import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface TaskCreateInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  notifyAt?: string; // When to send notification
}

export interface TaskUpdateInput extends Partial<TaskCreateInput> {
  isCompleted?: boolean;
}

export interface NoteTopicCreateInput {
  topic: string;
}

export interface NoteEntryCreateInput {
  content: string;
}

export interface UserProfile {
  name: string;
  habits?: string;
  profilePicture?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface JournalEntryCreateInput {
  content: string;
}

export interface JournalEntryUpdateInput {
  content: string;
}
