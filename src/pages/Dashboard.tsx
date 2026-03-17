import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText,
  TrendingUp, 
  ArrowRight, 
  Loader2,
  Activity
} from "lucide-react"
import type { DashboardStats } from "@/interfaces/dashboard.interface"
import { getDashboardData } from "@/api/dashboardApi"
import { InfoCards } from "@/components/dashboard/InfoCards"

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getDashboardData();
        setStats(response);
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Cargando métricas del sistema...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 mt-2">
            Resumen de actividad y gestión del Consejo Comunal.
          </p>
        </div>
        {stats && <InfoCards stats={stats} />}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" />
                <CardTitle className="text-lg text-slate-900">Actividad Reciente</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/meetings')} className="text-indigo-600 hover:text-indigo-700">
                Ver todas <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {stats?.recentMeetings.map((meeting) => (
                  <div 
                    key={meeting.id} 
                    onClick={() => navigate(`/meetings/${meeting.id}`)}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{meeting.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {new Date(meeting.date).toLocaleDateString('es-VE', { 
                          weekday: 'long', day: 'numeric', month: 'long' 
                        })}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-slate-200 bg-indigo-600 text-white overflow-hidden relative">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
            <CardHeader>
              <CardTitle className="text-lg text-white">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <Button 
                onClick={() => navigate('/meetings')} 
                className="w-full bg-white text-indigo-600 hover:bg-indigo-50 justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Gestionar Actas
              </Button>
              <Button 
                onClick={() => alert("Próximamente: Módulo de Usuarios")} 
                variant="outline"
                className="w-full bg-transparent border-indigo-400 text-white hover:bg-indigo-500 hover:text-white justify-start"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Directorio de Voceros
              </Button>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}