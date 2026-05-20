import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { apiClient } from "../../api/clientApi"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, AlignLeft, CheckSquare, Loader2, Printer } from "lucide-react"
import { TaskList } from "../task/TaskList"
import { AttendanceSection } from "./AttendanceSection"
import type { MeetingDetail } from "@/interfaces/meeting.interface"

export function MeetingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-VE', options);
  };

  const fetchMeetingDetails = useCallback(async () => {
    try {
      const response = await apiClient.get(`/meetings/${id}`)
      setMeeting(response.data)
    } catch (err) {
      setError("No se pudo cargar la información del acta.")
      console.error(err)
    }
  }, [id])

  useEffect(() => {
    const initFetch = async () => {
      try {
        setLoading(true)
        await fetchMeetingDetails()
      } finally {
        setLoading(false)
      }
    }
    if (id) initFetch()
  }, [id, fetchMeetingDetails])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>
  if (error || !meeting) return <div className="text-center mt-20">{error}</div>

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10 print:bg-white print:p-0">
      <div className="mx-auto space-y-6 print:space-y-4">
        <div className="hidden print:block text-center border-b-2 border-slate-800 pb-4 mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wide text-black">República Bolivariana de Venezuela</h2>
          <h3 className="text-lg font-semibold uppercase text-black">Consejo Comunal José Félix Ribas</h3>
          <p className="text-sm text-slate-600 mt-1">RIF: C-299904503 | Estado Miranda</p>
          <h1 className="text-2xl font-bold mt-6 underline underline-offset-4">ACTA DE ASAMBLEA / REUNIÓN</h1>
        </div>
        <div className="flex items-center justify-between print:hidden">
          <Button variant="ghost" onClick={() => navigate('/meetings')} className="text-slate-500 hover:text-indigo-600 pl-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver a las actas
          </Button>
          <Button onClick={() => window.print()} className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
            <Printer className="w-4 h-4 mr-2" /> Imprimir / Guardar PDF
          </Button>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight print:text-2xl print:text-black">
              {meeting.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 text-sm text-slate-600 print:text-black">
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium border border-indigo-100/50 print:bg-transparent print:border-none print:px-0 print:text-black capitalize">
                <Calendar className="w-4 h-4 print:hidden" />
                <strong>Fecha:</strong> {formatDateTime(meeting.date)}
              </div>
              {meeting.location && (
                <div className="flex items-center gap-2 font-medium print:text-black">
                  <MapPin className="w-4 h-4 text-slate-400 print:hidden" />
                  <strong>Lugar:</strong> {meeting.location}
                </div>
              )}
            </div>
          </div>
          {meeting.description && (
            <div className="pt-6 mt-6 border-t border-slate-100 print:border-slate-300">
              <h3 className="flex items-center gap-2 font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider print:text-black">
                <AlignLeft className="w-4 h-4 text-indigo-500 print:hidden" />
                Puntos tratados / Descripción
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-transparent print:border-none print:p-0 print:text-black text-sm sm:text-base">
                {meeting.description}
              </p>
            </div>
          )}
        </div>
        <AttendanceSection
          meetingId={meeting.id}
          attendances={meeting.attendances || []}
          onRefresh={fetchMeetingDetails}
        />
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm mt-6 print:border-none print:shadow-none print:p-0 print:break-inside-avoid">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 print:text-black">
                <CheckSquare className="w-6 h-6 text-indigo-500 print:hidden" />
                Acuerdos y Compromisos
              </h3>
            </div>
          </div>
          <TaskList meetingId={meeting.id} initialTasks={meeting.tasks || []} />
        </div>
        <div className="hidden print:block mt-12 pt-8 border-t border-slate-300 print:break-inside-avoid">
          <h3 className="text-base font-bold text-black uppercase tracking-wide mb-4">
            Registro de Asistencia y Firmas de la Asamblea
          </h3>
          {(!meeting.attendances || meeting.attendances.length === 0) ? (
            <p className="text-sm text-slate-500 italic">No se registraron asistentes digitalmente para esta reunión.</p>
          ) : (
            <table className="w-full border-collapse border border-slate-400 text-sm mb-8">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 px-3 py-1.5 text-left w-12">#</th>
                  <th className="border border-slate-400 px-3 py-1.5 text-left">Nombre y Apellido</th>
                  <th className="border border-slate-400 px-3 py-1.5 text-left w-36">Rol / Condición</th>
                  <th className="border border-slate-400 px-3 py-1.5 text-center w-56">Firma / Rúbrica / Huella</th>
                </tr>
              </thead>
              <tbody>
                {meeting.attendances.map((att, idx) => {
                  const name = att.userId ? att.user?.name : att.customName;
                  const role = att.userId ? att.user?.role : "Habitante Externo";
                  return (
                    <tr key={att.id}>
                      <td className="border border-slate-400 px-3 py-2 text-slate-800">{idx + 1}</td>
                      <td className="border border-slate-400 px-3 py-2 font-medium text-black">{name}</td>
                      <td className="border border-slate-400 px-3 py-2 text-slate-800 uppercase text-xs font-semibold">{role}</td>
                      <td className="border border-slate-400 px-3 py-2 text-center">
                        <div className="border-b border-dotted border-slate-500 w-44 mx-auto h-5"></div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          
          <div className="grid grid-cols-2 gap-16 text-center mt-16 print:break-inside-avoid">
            <div>
              <div className="border-b border-black w-48 mx-auto mb-2"></div>
              <p className="font-bold text-black text-sm">Vocero Responsable</p>
              <p className="text-xs text-slate-500">Firma</p>
            </div>
            <div>
              <div className="border-b border-black w-48 mx-auto mb-2"></div>
              <p className="font-bold text-black text-sm">Secretario / Testigo</p>
              <p className="text-xs text-slate-500">Firma</p>
            </div>
          </div>
          
          <p className="text-center text-xs text-slate-400 mt-16">
            Documento generado a través del Sistema JFR Comunal el {new Date().toLocaleDateString('es-VE')}
          </p>
        </div>
      </div>
    </div>
  )
}