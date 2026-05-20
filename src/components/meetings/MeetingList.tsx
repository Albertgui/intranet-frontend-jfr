import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MeetingListProps } from "@/interfaces/meeting.interface"
import { MapPin, RotateCcw, ArrowUpRight, FolderClosed, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export function MeetingList({ meetings, loading, error, onRefresh }: MeetingListProps) {
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString('es-VE', options);
  };

  const isNew = (dateString: string) => {
    const meetingDate = new Date(dateString);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return meetingDate > sevenDaysAgo;
  };

  const getCalendarSheet = (dateString: string) => {
    const d = new Date(dateString);
    const month = d.toLocaleDateString('es-VE', { month: 'short' }).toUpperCase().replace('.', '');
    const day = d.toLocaleDateString('es-VE', { day: '2-digit' });
    return (
      <div className="flex flex-col items-center justify-center w-14 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0 bg-white group-hover:border-indigo-200 transition-all duration-300">
        <div className="bg-indigo-600 text-white text-[10px] font-extrabold py-0.5 w-full text-center tracking-wider">
          {month}
        </div>
        <div className="bg-slate-50/50 flex-1 w-full flex items-center justify-center text-slate-800 text-lg font-extrabold leading-none">
          {day}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <FolderClosed className="w-5 h-5 text-indigo-500 absolute" />
        </div>
        <p className="text-slate-500 font-semibold animate-pulse text-sm">Sincronizando actas del consejo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50/30 border border-red-100 rounded-2xl text-center max-w-lg mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-red-950 mb-1">Error de conexión</h3>
        <p className="text-sm text-red-600 mb-6 leading-relaxed">{error}</p>
        <Button onClick={onRefresh} variant="outline" className="bg-white hover:bg-red-50 hover:text-red-700 border-red-200 rounded-xl px-5 shadow-sm font-semibold">
          <RotateCcw className="w-4 h-4 mr-2" /> Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-500 animate-pulse">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Bandeja de actas vacía</h3>
        <p className="text-slate-500 mt-2 mb-6 text-sm max-w-xs leading-relaxed">
          No se encontraron actas que coincidan con la búsqueda o filtros aplicados.
        </p>
        <Button onClick={onRefresh} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md shadow-indigo-600/10 transition-all active:scale-95 duration-200">
          <RotateCcw className="w-4 h-4 mr-2" /> Recargar actas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {meetings.map((meeting) => {
          const totalTasks = meeting.tasks?.length || 0
          const completedTasks = meeting.tasks?.filter(t => t.status === "COMPLETADA").length || 0
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

          return (
            <Card 
              key={meeting.id} 
              className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 cursor-pointer bg-white border border-slate-100 flex flex-col justify-between"
              onClick={() => navigate(`/meetings/${meeting.id}`)}
            >
              {/* Indicador Izquierdo de Novedad */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300",
                isNew(meeting.createdAt) ? "bg-indigo-500" : "bg-slate-100 group-hover:bg-indigo-300"
              )} />
              
              <CardContent className="p-6 ml-1 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Encabezado de Tarjeta (Hoja de Calendario + Novedad) */}
                  <div className="flex items-start justify-between gap-3">
                    {getCalendarSheet(meeting.date)}
                    {isNew(meeting.createdAt) && (
                      <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 tracking-wider">
                        Nueva
                      </span>
                    )}
                  </div>

                  {/* Título y Descripción */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1 flex items-center justify-between">
                      {meeting.title}
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                    </h3>
                    {meeting.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {meeting.description}
                      </p>
                    )}
                  </div>

                  {/* Metadatos (Hora y Ubicación) */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{formatDate(meeting.date)} hs</span>
                    </div>
                    {meeting.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="truncate max-w-[150px]">{meeting.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Barra de progreso de compromisos en tiempo real */}
                {totalTasks > 0 ? (
                  <div className="space-y-1.5 mt-5 pt-3 border-t border-slate-50">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Compromisos
                      </span>
                      <span className="text-indigo-600 font-bold">{completedTasks}/{totalTasks} ({progress}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Sin compromisos pendientes</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px]">Limpio</span>
                  </div>
                )}
              </CardContent>
            </Card> 
          );
        })}
      </div>
      
      {/* Botón de actualizar registros */}
      <div className="flex justify-center pt-2">
        <Button 
          onClick={onRefresh} 
          variant="ghost" 
          className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl px-5 font-semibold text-xs transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-2" /> 
          Sincronizar registros del sistema
        </Button>
      </div>
    </div>
  );
}