import type { Task } from "./task.interface";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string | null;
  createdAt: string;
}

export interface MeetingListProps {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export interface MeetingDetail {
  id: string
  title: string
  description?: string
  date: string
  location?: string
  tasks?: Task[]
}