import { apiClient } from "./clientApi";
import type { CreateSubTaskPayload, UpdateSubTaskPayload } from "../interfaces/subTask.interface";

export const getSubTasksByTask = async (taskId: string) => {
  const response = await apiClient.get(`/sub-tasks/task/${taskId}`);
  return response.data;
};

export const createSubTask = async (data: CreateSubTaskPayload) => {
  const response = await apiClient.post('/sub-tasks', data);
  return response.data;
};

export const updateSubTask = async (id: string, data: UpdateSubTaskPayload) => {
  const response = await apiClient.patch(`/sub-tasks/${id}`, data);
  return response.data;
};

export const deleteSubTask = async (id: string) => {
  const response = await apiClient.delete(`/sub-tasks/${id}`);
  return response.data;
};