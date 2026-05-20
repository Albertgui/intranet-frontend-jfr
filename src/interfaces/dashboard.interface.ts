export interface DashboardStats {
  totalMeetings: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  recentMeetings: { id: string, title: string, date: string }[];
  taskStatusCounts: {
    PENDIENTE: number;
    EN_PROGRESO: number;
    COMPLETADA: number;
    BLOQUEADA: number;
  };
  taskPriorityCounts: {
    BAJA: number;
    MEDIA: number;
    ALTA: number;
    URGENTE: number;
  };
}

export interface InfoCardsProps {
  stats: DashboardStats
}