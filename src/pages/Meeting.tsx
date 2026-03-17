import { useState, useEffect } from "react";
import { MeetingList } from "@/components/meetings/MeetingList";
import { apiClient } from "@/api/clientApi";
import { CreateMeetingDialog } from "@/components/meetings/CreateMeetingDialog"; 

export function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/meetings');
      setMeetings(response.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las actas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Actas y Reuniones</h1>
            <p className="text-sm text-slate-500 mt-1">
              Gestiona los registros de las asambleas del consejo comunal
            </p>
          </div>
          <CreateMeetingDialog onSuccess={fetchMeetings} />
        </div>
        <MeetingList 
          meetings={meetings} 
          loading={loading} 
          error={error} 
          onRefresh={fetchMeetings} 
        />
      </div>
    </div>
  );
}