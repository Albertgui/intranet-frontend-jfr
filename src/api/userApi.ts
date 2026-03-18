import type { CreateUserPayload, User } from "@/interfaces/users.interface";
import { apiClient } from "./clientApi"

export const getUser = async() => {
  const response = await apiClient.get('/users');
  return response.data;
}

export const deleteUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: CreateUserPayload) => {
  const response = await apiClient.post('/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: User) => {
  const response = await apiClient.patch(`/users/${id}`, data);
  return response.data;
};