import { useState, useEffect } from "react"
import { Users, UserPlus, Trash2, User as UserIcon, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUser } from "@/api/userApi"
import { addAttendeeApi, removeAttendeeApi } from "@/api/meetingsApi"
import type { User as AppUser } from "@/interfaces/users.interface"
import type { Attendance } from "@/interfaces/meeting.interface"

interface AttendanceSectionProps {
  meetingId: string
  attendances: Attendance[]
  onRefresh: () => void
}

export function AttendanceSection({ meetingId, attendances, onRefresh }: AttendanceSectionProps) {
  const [allUsers, setAllUsers] = useState<AppUser[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [customName, setCustomName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const users = await getUser()
        setAllUsers(users)
      } catch (err) {
        console.error("Error al cargar usuarios", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Filter out users who are already in the attendance list
  const availableUsers = allUsers.filter(
    (user) => !attendances.some((att) => att.userId === user.id)
  )

  const handleAddRegistered = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUserId) return

    setIsSubmitting(true)
    setError(null)
    try {
      await addAttendeeApi(meetingId, { userId: selectedUserId })
      setSelectedUserId("")
      onRefresh()
    } catch (err) {
      console.error(err)
      setError("No se pudo agregar al asistente registrado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customName.trim()) return

    setIsSubmitting(true)
    setError(null)
    try {
      await addAttendeeApi(meetingId, { customName: customName.trim() })
      setCustomName("")
      onRefresh()
    } catch (err) {
      console.error(err)
      setError("No se pudo registrar al asistente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (attendanceId: string) => {
    if (!window.confirm("¿Retirar a esta persona de la lista de asistencia?")) return

    try {
      await removeAttendeeApi(meetingId, attendanceId)
      onRefresh()
    } catch (err) {
      console.error("Error al eliminar asistente", err)
      alert("No se pudo eliminar al asistente.")
    }
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm print:hidden">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Asistencia y Participación</h3>
          <p className="text-xs text-slate-500">Manejo de asistentes en la asamblea</p>
        </div>
        <span className="ml-auto bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
          {attendances.length} presentes
        </span>
      </div>

      {error && (
        <div className="mb-4 text-xs bg-red-50 text-red-600 p-3 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {/* Agregar asistente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        {/* Usuario Registrado */}
        <form onSubmit={handleAddRegistered} className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 block">Vocero o Habitante Registrado</label>
          <div className="flex gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isSubmitting || isLoading}
              className="flex-1 h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccionar del sistema...</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !selectedUserId}
              className="h-9 bg-indigo-600 text-white hover:bg-indigo-700 font-medium px-3 shrink-0"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </form>

        {/* Asistente Externo/Invitado */}
        <form onSubmit={handleAddCustom} className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 block">Habitante Externo / Invitado</label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nombre y Apellido..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              disabled={isSubmitting}
              className="h-9 text-xs bg-white"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !customName.trim()}
              className="h-9 bg-slate-900 text-white hover:bg-slate-800 font-medium px-3 shrink-0"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </form>
      </div>

      {/* Lista de Asistentes */}
      {attendances.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
          <UserPlus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-medium">Aún no se ha registrado la asistencia.</p>
          <p className="text-xs text-slate-400 mt-1">Utiliza los buscadores de arriba para añadir presentes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
          {attendances.map((att) => {
            const isRegistered = !!att.userId
            const name = isRegistered ? att.user?.name : att.customName
            const role = isRegistered ? att.user?.role : "HABITANTE EXTERNO"

            // Badges styles based on roles
            let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200"
            if (role === "ADMIN") {
              badgeStyle = "bg-red-50 text-red-700 border-red-100"
            } else if (role === "VOCERO") {
              badgeStyle = "bg-indigo-50 text-indigo-700 border-indigo-100"
            } else if (!isRegistered) {
              badgeStyle = "bg-amber-50 text-amber-700 border-amber-100"
            }

            return (
              <div
                key={att.id}
                className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xs transition-all duration-150"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 bg-slate-50 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 rounded-md transition-colors shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate leading-snug">
                      {name}
                    </p>
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border mt-0.5 uppercase tracking-wide ${badgeStyle}`}>
                      {role}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(att.id)}
                  className="opacity-0 group-hover:opacity-100 h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all shrink-0"
                  title="Retirar asistencia"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
