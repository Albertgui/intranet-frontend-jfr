import type { SubTask } from "./subTask.interface";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  meetingId: string;
}

export interface Task {
  id: string
  title: string
  description?: string
  meetingId: string
  subTasks?: SubTask[]
}

export interface TaskListProps {
  meetingId: string
  initialTasks: Task[]
}