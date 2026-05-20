import { useState, useEffect } from "react";
import { MeetingList } from "@/components/meetings/MeetingList";
import { apiClient } from "@/api/clientApi";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog"; 
import { Search, CalendarDays, Filter, X, RefreshCw, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Meeting } from "@/interfaces/meeting.interface";

export function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("ALL");

  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/meetings');
      setMeetings(response.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las actas de reuniones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Filtrado dinámico local
  const filteredMeetings = meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.date);
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meeting.description && meeting.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (meeting.location && meeting.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesYear = selectedYear === "ALL" || meetingDate.getFullYear().toString() === selectedYear;
    const matchesMonth = selectedMonth === "ALL" || meetingDate.getMonth().toString() === selectedMonth;
    
    return matchesSearch && matchesYear && matchesMonth;
  });

  // Años disponibles de forma dinámica
  const availableYears = Array.from(
    new Set(meetings.map(m => new Date(m.date).getFullYear().toString()))
  ).sort((a, b) => b.localeCompare(a));

  const months = [
    { value: "ALL", label: "Todos los meses" },
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" }
  ];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedYear("ALL");
    setSelectedMonth("ALL");
  };

  const hasActiveFilters = searchTerm !== "" || selectedYear !== "ALL" || selectedMonth !== "ALL";

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 transition-all duration-300">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Cabecera Principal Premium */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-indigo-600" />
          <div className="space-y-1 relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-indigo-600 shrink-0" />
              Actas y Reuniones
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Historial de asambleas, actas oficiales de decisión y control de compromisos acordados en el consejo comunal.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-center">
            <button 
              onClick={fetchMeetings} 
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 active:scale-95 transition-all text-slate-500 shadow-sm"
              title="Recargar actas"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
            </button>
            <CreateMeetingDialog onSuccess={fetchMeetings} />
          </div>
        </div>

        {/* Barra de Filtros e Inteligencia */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Buscar actas por título, descripción o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-10 h-11 bg-slate-50/50 border-slate-200/80 rounded-xl focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all duration-200 shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Selectores de Mes y Año */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Año */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                <CalendarDays className="w-4 h-4 text-indigo-500 shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Todos los años</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Mes */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                <Filter className="w-4 h-4 text-indigo-500 shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Botón de limpiar filtros */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* Estadísticas de filtrado */}
          {hasActiveFilters && (
            <div className="text-xs text-slate-500 font-medium">
              Mostrando <span className="text-indigo-600 font-bold">{filteredMeetings.length}</span> de <span className="font-bold">{meetings.length}</span> actas encontradas.
            </div>
          )}
        </div>

        {/* Listado de Actas */}
        <MeetingList 
          meetings={filteredMeetings} 
          loading={loading} 
          error={error} 
          onRefresh={fetchMeetings} 
        />
      </div>
    </div>
  );
}