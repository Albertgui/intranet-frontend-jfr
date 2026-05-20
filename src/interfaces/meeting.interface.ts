import type { Task } from "./task.interface";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string | null;
  createdAt: string;
  tasks?: Task[];
}

export interface MeetingListProps {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export interface Attendance {
  id: string;
  meetingId: string;
  userId?: string | null;
  customName?: string | null;
  user?: {
    id: string;
    name: string;
    role: string;
    email: string;
  } | null;
  createdAt: string;
}

export interface MeetingDetail {
  id: string
  title: string
  description?: string
  date: string
  location?: string
  tasks?: Task[]
  attendances?: Attendance[]
}
