import type { Meeting } from "@/interfaces/meeting.interface"
import { apiClient } from "./clientApi"

export const meetingsApi = async() => {
    try {
        const response = await apiClient.get<Meeting[]>('/meetings')
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const createMeetingApi = async (meetingData: Partial<Meeting>) => {
  try {
    const response = await apiClient.post<Meeting>('/meetings', meetingData)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const addAttendeeApi = async (meetingId: string, payload: { userId?: string; customName?: string }) => {
  const response = await apiClient.post(`/meetings/${meetingId}/attendance`, payload);
  return response.data;
};

export const removeAttendeeApi = async (meetingId: string, attendanceId: string) => {
  const response = await apiClient.delete(`/meetings/${meetingId}/attendance/${attendanceId}`);
  return response.data;
};