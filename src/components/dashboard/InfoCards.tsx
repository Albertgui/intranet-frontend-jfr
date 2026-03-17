import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import type { InfoCardsProps } from "@/interfaces/dashboard.interface"

export function InfoCards({ stats }: InfoCardsProps) {
  const progressPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Actas Registradas</CardTitle>
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900">{stats.totalMeetings}</div>
          <p className="text-xs text-slate-500 mt-1">Histórico completo</p>
        </CardContent>
      </Card>
      <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Tareas Pendientes</CardTitle>
          <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900">{stats.pendingTasks}</div>
          <p className="text-xs text-amber-600 font-medium mt-1">Requieren atención</p>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Acuerdos Logrados</CardTitle>
          <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900">{stats.completedTasks}</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Trabajo completado</p>
        </CardContent>
      </Card>
      <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Efectividad</CardTitle>
          <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-900">{progressPercentage}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}