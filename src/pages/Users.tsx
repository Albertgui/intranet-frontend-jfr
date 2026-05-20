import { useState, useEffect } from "react"
import { deleteUser, getUser } from "@/api/userApi"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Users, 
  ShieldCheck, 
  User as UserIcon, 
  Trash2,
  Loader2, 
  Search,
  LayoutGrid,
  List,
  Mail,
  CalendarDays,
  X
} from "lucide-react"
import { Input } from "@/components/ui/input"
import type { User } from "@/interfaces/users.interface"
import { CreateUserDialog } from "@/components/user/CreateUserDialog"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

export function UsersPage() {
  const { role } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUser()
      setUsers(data)
    } catch (err) {
      console.error("Error cargando usuarios:", err)
      setError("No se pudo cargar el directorio de voceros del sistema.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el acceso a ${name}?`)) return;
    
    try {
      await deleteUser(id)
      setUsers(users.filter(user => user.id !== id))
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      alert("No se pudo eliminar al usuario. Verifica tus permisos.")
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const getAvatarGradient = (name: string) => {
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    const gradients = [
      "from-indigo-500 to-purple-600 shadow-indigo-100",
      "from-purple-500 to-pink-600 shadow-pink-100",
      "from-blue-500 to-indigo-600 shadow-blue-100",
      "from-teal-400 to-emerald-600 shadow-teal-100",
      "from-amber-400 to-orange-600 shadow-orange-100",
      "from-rose-500 to-red-600 shadow-rose-100"
    ];
    return gradients[code % gradients.length];
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 transition-all duration-300">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Cabecera Principal Premium */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-indigo-600" />
          <div className="space-y-1 relative z-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600 shrink-0" />
              Directorio de Voceros
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Gestiona los accesos, roles comunitarios y datos de contacto de los miembros acreditados del consejo comunal.
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-start md:self-center">
            {/* Toggle de vistas */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/40">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-bold",
                  viewMode === "grid" 
                    ? "bg-white text-indigo-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Vista de cuadrícula"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Tarjetas</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-bold",
                  viewMode === "table" 
                    ? "bg-white text-indigo-700 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Vista de lista"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Tabla</span>
              </button>
            </div>

            {role === 'ADMIN' && (
              <CreateUserDialog onSuccess={fetchUsers} />
            )}
          </div>
        </div>

        {/* Buscador de Voceros */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Buscar voceros por nombre completo o dirección de correo..." 
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
        </div>

        {/* Renderizado de Voceros */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
            <p className="text-slate-500 font-semibold animate-pulse text-sm">Cargando directorio de voceros...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4 bg-red-50/30 border border-red-100 rounded-2xl max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600 mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-red-950 mb-1">Error de conexión</h3>
            <p className="text-sm text-red-600 mb-6 leading-relaxed">{error}</p>
            <Button onClick={fetchUsers} className="bg-white hover:bg-red-50 text-red-600 border-red-200 rounded-xl px-5 shadow-sm font-semibold">
              Intentar cargar de nuevo
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-500">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Sin coincidencias</h3>
            <p className="text-slate-500 mt-2 mb-6 text-sm max-w-xs leading-relaxed">
              No se encontraron voceros registrados que coincidan con la búsqueda "{searchTerm}".
            </p>
            <Button onClick={() => setSearchTerm("")} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 font-semibold text-sm shadow-md shadow-indigo-600/10 transition-all active:scale-95 duration-200">
              Ver todos los voceros
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          /* Vista de Cuadrícula (Cards Premium) */
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.map((user) => (
              <Card 
                key={user.id} 
                className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 bg-white border border-slate-100 flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  {/* Avatar & Rol */}
                  <div className="flex items-start justify-between gap-2">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl bg-gradient-to-tr flex items-center justify-center font-extrabold text-white text-base shadow-md shrink-0 border border-white/20 transition-all duration-300 group-hover:scale-105",
                      getAvatarGradient(user.name)
                    )}>
                      {getInitials(user.name)}
                    </div>
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-100 tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 tracking-wider">
                        <UserIcon className="w-3.5 h-3.5 shrink-0" /> Vocero
                      </span>
                    )}
                  </div>

                  {/* Nombre & Contacto */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1 text-sm sm:text-base">
                      {user.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      {user.email}
                    </p>
                  </div>

                  {/* Registro */}
                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                    <CalendarDays className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Miembro desde {new Date(user.createdAt).toLocaleDateString('es-VE')}</span>
                  </div>
                </div>

                {/* Acciones */}
                {role === 'ADMIN' && (
                  <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(user.id, user.name)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl px-2.5 h-8 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar acceso
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          /* Vista de Tabla Refinada (Dashboard Style) */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Usuario Vocero</th>
                    <th className="py-4 px-6">Rol de Sistema</th>
                    <th className="py-4 px-6">Fecha de Registro</th>
                    {role === 'ADMIN' && <th className="py-4 px-6 text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl bg-gradient-to-tr flex items-center justify-center font-extrabold text-white text-xs border border-white/20 shadow-sm shrink-0",
                            getAvatarGradient(user.name)
                          )}>
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{user.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-300" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {user.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> Administrador
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <UserIcon className="w-3.5 h-3.5 shrink-0" /> Vocero Autorizado
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString('es-VE', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {role === 'ADMIN' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(user.id, user.name)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Eliminar acceso de usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}