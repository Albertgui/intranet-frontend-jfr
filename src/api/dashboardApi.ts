import { apiClient } from "./clientApi"

export const getDashboardData = async() => {
  const response = await apiClient.get('/dashboard/summary');
  return response.data;
}