export interface CreateSubTaskPayload {
  title: string;
  taskId: string;
}

export interface UpdateSubTaskPayload {
  title?: string;
  isCompleted?: boolean;
}

export interface SubTask {
  id: string
  title: string
  isCompleted: boolean
  taskId: string
}

export interface SubTaskListProps {
  taskId: string
  initialSubTasks: SubTask[]
}