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