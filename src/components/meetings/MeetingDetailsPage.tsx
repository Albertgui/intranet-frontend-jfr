import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient } from "@/api/clientApi"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, AlignLeft, CheckSquare, Loader2 } from "lucide-react"
import { TaskList } from "../task/TaskList"
import type { MeetingDetail } from "@/interfaces/meeting.interface"

export function MeetingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-VE', options);
  };

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`/meetings/${id}`)
        setMeeting(response.data)
      } catch (err) {
        console.error(err)
        setError("No se pudo cargar la información del acta")
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchMeetingDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Cargando detalles del acta...</p>
      </div>
    )
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlignLeft className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Oops, algo salió mal</h2>
        <p className="text-slate-600 mb-6 max-w-md">{error || "El acta que buscas no existe o fue eliminada."}</p>
        <Button onClick={() => navigate('/meetings')} className="bg-slate-900 text-white hover:bg-slate-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la lista
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/meetings')}
          className="text-slate-500 hover:text-indigo-600 pl-0 hover:bg-transparent -ml-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a las actas
        </Button>
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {meeting.title}
            </h1>            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm text-slate-600">
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium border border-indigo-100/50 capitalize">
                <Calendar className="w-4 h-4" />
                {formatDateTime(meeting.date)}
              </div>
              {meeting.location && (
                <div className="flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {meeting.location}
                </div>
              )}
            </div>
          </div>
          {meeting.description && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">
                <AlignLeft className="w-4 h-4 text-indigo-500" />
                Puntos tratados / Descripción
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm sm:text-base">
                {meeting.description}
              </p>
            </div>
          )}
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <CheckSquare className="w-6 h-6 text-indigo-500" />
                Acuerdos y Tareas
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Gestiona los compromisos adquiridos en esta asamblea.
              </p>
            </div>
          </div>
          <TaskList 
            meetingId={meeting.id} 
            initialTasks={meeting.tasks || []} 
          />
        </div>
      </div>
    </div>
  )
}