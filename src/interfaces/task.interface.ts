import type { SubTask } from "./subTask.interface";

export interface CreateTaskPayload {
  title: string;
  description: string;
  meetingId: string;
  assignedTo?: string;
  priority?: string;
  status?: string;
}

export interface Task {
  id: string
  title: string
  description?: string
  meetingId: string
  assignedToId?: string
  assignedTo?: { name: string }
  priority?: string
  status?: string
  subtasks?: SubTask[]
}

export interface TaskListProps {
  meetingId: string
  initialTasks: Task[]
}