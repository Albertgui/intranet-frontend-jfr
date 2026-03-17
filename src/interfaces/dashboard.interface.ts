export interface DashboardStats {
  totalMeetings: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  recentMeetings: { id: string, title: string, date: string }[];
}

export interface InfoCardsProps {
  stats: DashboardStats
}