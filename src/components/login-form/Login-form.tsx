import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertCircle, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import logoJFR from "../../assets/logoJFR.jpeg"
import { loginApi } from "@/api/loginApi"

const loginSchema = z.object({
  email: z.email({ message: "Formato de correo inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(null)
    setLoading(true)
    try {
      const response = await loginApi(data)
      localStorage.setItem('token', response.access_token)
      navigate('/meetings')
    } catch (err) {
      console.error(err)
      setGlobalError("Credenciales inválidas. Verifica tu correo y contraseña.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden bg-slate-900 p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-slate-900 opacity-90" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
            Sistema de Control de Reuniones
          </h1>
          <p className="text-lg text-indigo-100 max-w-md leading-relaxed">
            Plataforma integral para la gestión de actas, asignación de tareas y seguimiento de objetivos comunitarios.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-12 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <img 
              src={logoJFR} 
              alt="Logo JFR" 
              className="h-60 w-auto shadow-md" 
            />
          </div>
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Bienvenido de nuevo
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {globalError && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{globalError}</p>
              </div>
            )}
            <FieldGroup className="space-y-4">
              <Field className="space-y-2">
                <FieldLabel htmlFor="email" className="text-slate-700 font-semibold">
                  Correo electrónico
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    disabled={loading}
                    {...register("email")}
                    className={cn(
                      "pl-10 h-12 rounded-lg bg-slate-50 border-slate-200 text-slate-900 transition-colors focus-visible:bg-white focus-visible:ring-indigo-500",
                      errors.email && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-slate-700 font-semibold">
                    Contraseña
                  </FieldLabel>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="off"
                    disabled={loading}
                    {...register("password")}
                    className={cn(
                      "pl-10 pr-12 h-12 rounded-lg bg-slate-50 border-slate-200 text-slate-900 transition-colors focus-visible:bg-white focus-visible:ring-indigo-500",
                      errors.password && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </Field>
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Autenticando...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  )
}