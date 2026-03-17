import type { LoginCredentials } from "@/interfaces/login.interface";
import { apiClient } from "./clientApi"; 

export const loginApi = async (credentials: LoginCredentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};