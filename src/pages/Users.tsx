import { useState, useEffect } from "react"
import { deleteUser, getUser } from "@/api/userApi"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  ShieldCheck, 
  User as UserIcon, 
  Trash2,
  Loader2, 
  Search
} from "lucide-react"
import { Input } from "@/components/ui/input"
import type { User } from "@/interfaces/users.interface"
import { CreateUserDialog } from "@/components/user/CreateUserDialog"
import { useAuth } from "@/hooks/useAuth"

export function UsersPage() {
  const { role } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUser()
      setUsers(data)
    } catch (err) {
      console.error("Error cargando usuarios:", err)
      setError("No se pudo cargar el directorio de voceros.")
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-500" />
              Directorio de Voceros
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gestiona los accesos y roles de los miembros del consejo comunal.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar por nombre o correo..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-slate-50"
              />
            </div>
            {role === 'ADMIN' && (
              <CreateUserDialog onSuccess={fetchUsers} />
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
              <p className="text-slate-500 font-medium">Cargando directorio...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500 font-medium">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No se encontraron usuarios que coincidan con tu búsqueda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                    <th className="font-semibold py-4 px-6">Usuario</th>
                    <th className="font-semibold py-4 px-6">Rol de Sistema</th>
                    <th className="font-semibold py-4 px-6">Fecha de Registro</th>
                    {role === 'ADMIN' && <th className="font-semibold py-4 px-6 text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {user.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                            <ShieldCheck className="w-3.5 h-3.5" /> Administrador
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <UserIcon className="w-3.5 h-3.5" /> Vocero
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('es-VE')}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {role === 'ADMIN' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(user.id, user.name)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Eliminar usuario"
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
          )}
        </div>

      </div>
    </div>
  )
}