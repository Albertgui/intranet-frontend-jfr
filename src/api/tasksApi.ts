import type { CreateTaskPayload } from '@/interfaces/task.interface';
import { apiClient } from './clientApi';

export const createTask = async (data: CreateTaskPayload) => {
  const response = await apiClient.post('/tasks', data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response.data;
};