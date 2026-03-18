import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createUser } from "@/api/userApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus, User, Mail, Lock, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const userSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Debe ser un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["ADMIN", "VOCERO", "USER"], {
    message: "Debes seleccionar un rol para el usuario",
  }),
})

type UserFormValues = z.infer<typeof userSchema>

interface CreateUserDialogProps {
  onSuccess: () => void;
}

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "VOCERO",
    },
  })

  const onSubmit = async (data: UserFormValues) => {
    try {
      setLoading(true)
      await createUser(data)
      setOpen(false)
      reset()
      onSuccess()
    } catch (error) {
      console.error("Error al crear usuario:", error)
      const errorMessage = "Hubo un error al registrar el usuario."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Vocero
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-slate-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <DialogHeader className="px-6 py-5 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-slate-900">Registrar Vocero</DialogTitle>
            <DialogDescription className="text-slate-500">
              Crea una cuenta nueva para dar acceso al sistema del consejo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 px-6 py-6">
            
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-semibold">Nombre Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="name" 
                  placeholder="Ej. María Pérez"
                  disabled={loading}
                  {...register("name")}
                  className={cn("pl-9 bg-slate-50/50", errors.name && "border-red-500 focus-visible:ring-red-500")}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>            
            
            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="email" 
                  type="email"
                  placeholder="maria@ejemplo.com"
                  disabled={loading}
                  {...register("email")}
                  className={cn("pl-9 bg-slate-50/50", errors.email && "border-red-500 focus-visible:ring-red-500")}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold">Contraseña Inicial</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                  {...register("password")}
                  className={cn("pl-9 pr-10 bg-slate-50/50", errors.password && "border-red-500 focus-visible:ring-red-500")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-xs font-medium text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Rol (Usamos un select nativo estilizado para no depender de librerías extra) */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-700 font-semibold">Rol en el Sistema</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  id="role"
                  disabled={loading}
                  {...register("role")}
                  className={cn(
                    "flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50/50 px-3 pl-9 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                    errors.role && "border-red-500 focus:ring-red-500"
                  )}
                >
                  <option value="VOCERO">Vocero (Acceso estándar)</option>
                  <option value="ADMIN">Administrador (Control total)</option>
                </select>
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>
            
          </div>
          
          <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="mr-auto sm:mr-0"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}