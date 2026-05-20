import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  UserCircle, 
  FileText, 
  ArrowRight, 
  Loader2,
  Clock,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { meetingsApi } from "@/api/meetingsApi"
import { getTasksApi } from "@/api/tasksApi"
import type { Meeting } from "@/interfaces/meeting.interface"
import type { Task } from "@/interfaces/task.interface"

type EventFilter = "all" | "meetings" | "tasks"

export function CalendarPage() {
  const navigate = useNavigate()
  
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [filter, setFilter] = useState<EventFilter>("all")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [meetingsData, tasksData] = await Promise.all([
          meetingsApi(),
          getTasksApi()
        ])
        setMeetings(meetingsData || [])
        setTasks(tasksData || [])
      } catch (err) {
        console.error("Error al cargar datos del calendario:", err)
        setError("No se pudieron cargar los eventos. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Helper: Obtener cadena de fecha local en formato YYYY-MM-DD
  const getLocalDateString = (dateInput: string | Date) => {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return ""
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const selectedDateKey = getLocalDateString(selectedDate)

  // Diccionarios agrupados por YYYY-MM-DD
  const meetingsByDate: Record<string, Meeting[]> = {}
  meetings.forEach(m => {
    const key = getLocalDateString(m.date)
    if (key) {
      if (!meetingsByDate[key]) meetingsByDate[key] = []
      meetingsByDate[key].push(m)
    }
  })

  const tasksByDate: Record<string, Task[]> = {}
  tasks.forEach(t => {
    if (t.dueDate) {
      const key = getLocalDateString(t.dueDate)
      if (key) {
        if (!tasksByDate[key]) tasksByDate[key] = []
        tasksByDate[key].push(t)
      }
    }
  })

  // Navegación mensual
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleGoToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Generación de cuadrícula del mes (Lunes a Domingo)
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 = Domingo, 1 = Lunes...
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const gridCells: { day: number; isCurrentMonth: boolean; date: Date }[] = []

  // Rellenar días del mes anterior
  for (let i = startOffset - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i
    const prevDate = new Date(year, month - 1, prevDay)
    gridCells.push({ day: prevDay, isCurrentMonth: false, date: prevDate })
  }

  // Rellenar días del mes actual
  for (let i = 1; i <= daysInMonth; i++) {
    const currDate = new Date(year, month, i)
    gridCells.push({ day: i, isCurrentMonth: true, date: currDate })
  }

  // Rellenar días del mes siguiente hasta completar múltiplos de 7 (generalmente 35 o 42 celdas)
  const totalCellsNeeded = gridCells.length <= 35 ? 35 : 42
  const nextMonthDaysNeeded = totalCellsNeeded - gridCells.length
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    const nextDate = new Date(year, month + 1, i)
    gridCells.push({ day: i, isCurrentMonth: false, date: nextDate })
  }

  // Obtener eventos filtrados para un día específico
  const getDayEvents = (dateObj: Date) => {
    const key = getLocalDateString(dateObj)
    const dayMeetings = meetingsByDate[key] || []
    const dayTasks = tasksByDate[key] || []
    
    return {
      meetings: filter === "tasks" ? [] : dayMeetings,
      tasks: filter === "meetings" ? [] : dayTasks,
      total: (filter === "tasks" ? 0 : dayMeetings.length) + (filter === "meetings" ? 0 : dayTasks.length)
    }
  }

  // Eventos para el día seleccionado en detalle
  const selectedDayEvents = getDayEvents(selectedDate)

  // Contadores del mes actual
  const currentMonthMeetingsCount = meetings.filter(m => {
    const d = new Date(m.date)
    return d.getFullYear() === year && d.getMonth() === month
  }).length

  const currentMonthPendingTasksCount = tasks.filter(t => {
    if (!t.dueDate) return false
    const d = new Date(t.dueDate)
    return d.getFullYear() === year && d.getMonth() === month && t.status !== "COMPLETADA"
  }).length

  // Estilo de badge según la prioridad de la tarea
  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case "URGENTE":
        return "bg-rose-50 text-rose-700 border-rose-100"
      case "ALTA":
        return "bg-amber-50 text-amber-700 border-amber-100"
      case "MEDIA":
        return "bg-blue-50 text-blue-700 border-blue-100"
      default:
        return "bg-slate-50 text-slate-700 border-slate-100"
    }
  }

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "COMPLETADA":
        return "bg-emerald-50 text-emerald-700 border-emerald-100"
      case "EN_PROGRESO":
        return "bg-indigo-50 text-indigo-700 border-indigo-100"
      case "BLOQUEADA":
        return "bg-red-50 text-red-700 border-red-100"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Cargando eventos del calendario...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-8 h-8 text-indigo-600" />
              Calendario Comunitario
            </h1>
            <p className="text-slate-500 mt-1">
              Visualiza asambleas, reuniones y plazos límite de los compromisos comunitarios.
            </p>
          </div>
          
          {/* Tarjetas de Resumen en Cabecera */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                {currentMonthMeetingsCount}
              </div>
              <span className="text-xs font-semibold text-slate-600">Reuniones este mes</span>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 font-bold">
                {currentMonthPendingTasksCount}
              </div>
              <span className="text-xs font-semibold text-slate-600">Acuerdos pendientes</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
            <Info className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Secciones de Calendario (Columna Principal - 2/3) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Controles de Calendario */}
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                
                {/* Mes / Año Navegación */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-9 w-9">
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </Button>
                  
                  <span className="text-lg font-bold text-slate-800 w-44 text-center select-none capitalize">
                    {currentDate.toLocaleDateString("es-VE", { month: "long", year: "numeric" })}
                  </span>
                  
                  <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-9 w-9">
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </Button>
                  
                  <Button variant="ghost" onClick={handleGoToToday} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 ml-2">
                    Hoy
                  </Button>
                </div>

                {/* Filtro de Eventos */}
                <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                  <button 
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={() => setFilter("meetings")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      filter === "meetings" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Asambleas
                  </button>
                  <button 
                    onClick={() => setFilter("tasks")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      filter === "tasks" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Compromisos
                  </button>
                </div>

              </CardContent>
            </Card>

            {/* Cuadrícula Mensual */}
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <CardContent className="p-0">
                {/* Días de la semana */}
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                  {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((dayName, idx) => (
                    <div key={idx} className="py-2.5 text-center text-xs font-bold text-slate-500 tracking-wider">
                      {dayName}
                    </div>
                  ))}
                </div>

                {/* Días del Calendario */}
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100/30">
                  {gridCells.map((cell, idx) => {
                    const isSelected = getLocalDateString(cell.date) === selectedDateKey
                    const isToday = getLocalDateString(cell.date) === getLocalDateString(new Date())
                    const { meetings: dayMeetings, tasks: dayTasks, total: dayTotal } = getDayEvents(cell.date)
                    
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(cell.date)}
                        className={`min-h-[100px] p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                          cell.isCurrentMonth ? "bg-white text-slate-800" : "bg-slate-50/40 text-slate-400"
                        } ${
                          isSelected 
                            ? "ring-2 ring-indigo-500 ring-inset bg-indigo-50/10 z-10" 
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {/* Indicador de número de día */}
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                            isToday 
                              ? "bg-indigo-600 text-white shadow-sm" 
                              : isSelected
                                ? "text-indigo-600"
                                : ""
                          }`}>
                            {cell.day}
                          </span>
                          
                          {/* Dot Indicators en Móviles */}
                          <div className="flex gap-0.5 md:hidden">
                            {dayMeetings.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>}
                            {dayTasks.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                          </div>
                        </div>

                        {/* Listado de Eventos Compactos (Pantallas Medianas/Grandes) */}
                        <div className="hidden md:flex flex-col gap-1 flex-1 justify-end">
                          {dayMeetings.slice(0, 1).map(m => (
                            <div 
                              key={m.id}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 truncate"
                              title={m.title}
                            >
                              🤝 {m.title}
                            </div>
                          ))}
                          
                          {dayTasks.slice(0, 1).map(t => (
                            <div 
                              key={t.id}
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-100 truncate"
                              title={t.title}
                            >
                              📌 {t.title}
                            </div>
                          ))}

                          {dayTotal > 2 && (
                            <div className="text-[9px] font-semibold text-slate-500 text-right pr-1">
                              +{dayTotal - 2} más
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Panel Lateral de Detalle del Día Seleccionado (1/3) */}
          <div className="space-y-4">
            <Card className="shadow-sm border-slate-200 sticky top-6">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg text-slate-900 flex items-center justify-between">
                  <span>Detalle del Día</span>
                  <span className="text-xs text-indigo-600 font-semibold px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                    {selectedDate.toLocaleDateString("es-VE", { day: "numeric", month: "short" })}
                  </span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-1 capitalize font-medium">
                  {selectedDate.toLocaleDateString("es-VE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </CardHeader>
              
              <CardContent className="p-5 max-h-[500px] overflow-y-auto space-y-5">
                
                {selectedDayEvents.total === 0 ? (
                  <div className="text-center py-10">
                    <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-700">Sin actividades</p>
                    <p className="text-xs text-slate-400 mt-1">No hay asambleas ni plazos programados para esta fecha.</p>
                  </div>
                ) : (
                  <>
                    {/* Sección de Asambleas / Reuniones */}
                    {selectedDayEvents.meetings.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                          🤝 Asambleas y Reuniones ({selectedDayEvents.meetings.length})
                        </h4>
                        
                        <div className="space-y-2">
                          {selectedDayEvents.meetings.map(m => (
                            <div 
                              key={m.id} 
                              onClick={() => navigate(`/meetings/${m.id}`)}
                              className="group bg-white border border-slate-200 rounded-xl p-3.5 hover:shadow-md cursor-pointer transition-all duration-200"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h5 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {m.title}
                                </h5>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                              </div>
                              
                              {m.description && (
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                  {m.description}
                                </p>
                              )}
                              
                              <div className="flex flex-col gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                                {m.location && (
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                    <span className="truncate">{m.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                  <span>
                                    {new Date(m.date).toLocaleTimeString("es-VE", { hour: "numeric", minute: "2-digit", hour12: true })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sección de Compromisos / Tareas */}
                    {selectedDayEvents.tasks.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                          📌 Plazos de Compromiso ({selectedDayEvents.tasks.length})
                        </h4>
                        
                        <div className="space-y-2.5">
                          {selectedDayEvents.tasks.map(t => (
                            <div 
                              key={t.id}
                              className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2"
                            >
                              <div>
                                <h5 className="text-sm font-bold text-slate-900">
                                  {t.title}
                                </h5>
                                {t.description && (
                                  <p className="text-xs text-slate-600 mt-0.5">
                                    {t.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {t.priority && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getPriorityStyle(t.priority)}`}>
                                    Prioridad: {t.priority}
                                  </span>
                                )}
                                {t.status && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusStyle(t.status)}`}>
                                    {t.status.replace("_", " ")}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-1.5 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                                {t.assignedTo && (
                                  <div className="flex items-center gap-1.5">
                                    <UserCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                                    <span className="font-semibold text-slate-700">{t.assignedTo.name}</span>
                                  </div>
                                )}
                                
                                {t.meeting && (
                                  <div 
                                    onClick={() => navigate(`/meetings/${t.meetingId}`)}
                                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium"
                                  >
                                    <FileText className="w-3.5 h-3.5 shrink-0" />
                                    <span className="underline truncate">Surgió de: {t.meeting.title}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  )
}
