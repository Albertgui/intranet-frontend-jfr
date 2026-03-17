import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MeetingListProps } from "@/interfaces/meeting.interface"
import { MapPin, RotateCcw, ChevronRight, FileText, Clock, AlignLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export function MeetingList({ meetings, loading, error, onRefresh }: MeetingListProps) {

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-VE', options);
  };

  const isNew = (dateString: string) => {
    const meetingDate = new Date(dateString);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return meetingDate > sevenDaysAgo;
  };
  
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
        <RotateCcw className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
        <p className="text-slate-500 font-medium">Sincronizando actas del consejo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50/50 border border-red-100 rounded-xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-1">Error de conexión</h3>
        <p className="text-sm text-red-600 max-w-md mx-auto mb-6">{error}</p>
        <Button onClick={onRefresh} variant="outline" className="bg-white hover:bg-red-50 hover:text-red-700 border-red-200">
          <RotateCcw className="w-4 h-4 mr-2" /> Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Bandeja limpia</h3>
        <p className="text-slate-500 mt-2 mb-8 max-w-sm mx-auto">
          El consejo comunal aún no tiene reuniones documentadas en el sistema.
        </p>
        <Button onClick={onRefresh} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-[0.98]">
          <RotateCcw className="w-4 h-4 mr-2" /> Recargar vista
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <Card 
            key={meeting.id} 
            className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-300 cursor-pointer bg-white"
            onClick={() => navigate(`/meetings/${meeting.id}`)}
          >
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1 transition-colors duration-200",
              isNew(meeting.createdAt) ? "bg-indigo-500" : "bg-slate-200 group-hover:bg-indigo-300"
            )} />
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-6 ml-1">
                <div className="space-y-3 flex-1 min-w-0 pr-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                      {meeting.title}
                    </h3>
                    {isNew(meeting.createdAt) && (
                      <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mt-0.5">
                        Nueva
                      </span>
                    )}
                  </div>
                  {meeting.description && (
                     <div className="flex items-start gap-2 text-sm text-slate-600 line-clamp-2">
                       <AlignLeft className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                       <p>{meeting.description}</p>
                     </div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      {formatDate(meeting.date)}
                    </div>
                    {meeting.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate max-w-[200px]">{meeting.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-center shrink-0 pl-4 border-l border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:shadow-inner transition-all duration-200">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> 
        ))}
      </div>
      <div className="flex justify-center pt-4 border-t border-slate-100">
        <Button 
          onClick={onRefresh} 
          variant="ghost" 
          className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full px-6"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> 
          Actualizar registros
        </Button>
      </div>
    </div>
  );
}