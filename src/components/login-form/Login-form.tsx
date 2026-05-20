import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertCircle, Eye, EyeOff, Mail, Lock, CheckCircle2, FileText, Users, Sparkles } from "lucide-react"
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
  const [isFocusedField, setIsFocusedField] = useState<string | null>(null)

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
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Panel Izquierdo: Visual & Estético con Glassmorphism */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden bg-slate-900 p-12 text-white">
        {/* Gradiente y Orbes Animados */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 opacity-95" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" />

        {/* Encabezado */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
            <Sparkles className="h-6 w-6 text-indigo-400" />
          </div>
          <span className="font-bold text-lg tracking-wider text-white/90">JFR Zona 2</span>
        </div>

        {/* Tarjeta Glassmorphic de Estadísticas */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Sistema de Control de Reuniones
            </h1>
            <p className="text-base text-indigo-200/80 leading-relaxed">
              Plataforma integral para la gestión de actas, compromisos y participación comunitaria.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="text-white/70 font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Gestión Comunitaria Activa
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                <FileText className="w-6 h-6 text-indigo-400 mb-2 transition-transform group-hover:scale-110" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-xs text-white/50">Actas Registradas</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2 transition-transform group-hover:scale-110" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-white/50">Compromisos Logrados</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-300 group">
                <Users className="w-6 h-6 text-sky-400 mb-2 transition-transform group-hover:scale-110" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs text-white/50">Participación Activa</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-300 group flex flex-col justify-between">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-2">⚡</div>
                <div>
                  <div className="text-base font-bold leading-tight">Voceros</div>
                  <div className="text-[11px] text-white/50">Directorio Integrado</div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-white/40 italic text-center pt-1">
              "Organización vecinal para el bienestar de todos"
            </p>
          </div>
        </div>

        {/* Pie de página izquierdo */}
        <div className="relative z-10 text-xs text-indigo-200/60 font-medium">
          © 2026 Consejo Comunal JFR Zona 2. Todos los derechos reservados.
        </div>
      </div>

      {/* Panel Derecho: Formulario Estilizado Premium */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border border-slate-100/80 rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300">
          
          {/* Logo JFR con marco de diseño */}
          <div className="flex justify-center mb-6">
            <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md">
              <div className="bg-white rounded-xl p-2">
                <img 
                  src={logoJFR} 
                  alt="Logo JFR" 
                  className="h-16 w-auto rounded-lg object-contain" 
                />
              </div>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent">
              Bienvenido de nuevo
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Ingresa tus credenciales para acceder a la intranet
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {globalError && (
              <div className="flex items-center gap-3 p-4 text-sm text-red-700 bg-red-50/80 border border-red-200 rounded-xl shadow-sm animate-bounce">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <p className="font-medium">{globalError}</p>
              </div>
            )}
            
            <FieldGroup className="space-y-4">
              {/* Campo Correo */}
              <Field className="space-y-2">
                <FieldLabel htmlFor="email" className="text-slate-700 font-semibold text-sm">
                  Correo electrónico
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    disabled={loading}
                    {...register("email")}
                    onFocus={() => setIsFocusedField("email")}
                    onBlur={() => setIsFocusedField(null)}
                    className={cn(
                      "pl-10 h-11 rounded-xl bg-slate-50 border-slate-200/80 text-slate-900 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 shadow-sm",
                      errors.email && "border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400",
                      isFocusedField === "email" && "shadow-indigo-500/10 shadow-md"
                    )}
                  />
                  <Mail className={cn(
                    "absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 pointer-events-none",
                    isFocusedField === "email" ? "text-indigo-500" : "text-slate-400"
                  )} />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </Field>

              {/* Campo Contraseña */}
              <Field className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-slate-700 font-semibold text-sm">
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
                    onFocus={() => setIsFocusedField("password")}
                    onBlur={() => setIsFocusedField(null)}
                    className={cn(
                      "pl-10 pr-12 h-11 rounded-xl bg-slate-50 border-slate-200/80 text-slate-900 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 shadow-sm",
                      errors.password && "border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400",
                      isFocusedField === "password" && "shadow-indigo-500/10 shadow-md"
                    )}
                  />
                  <Lock className={cn(
                    "absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 pointer-events-none",
                    isFocusedField === "password" ? "text-indigo-500" : "text-slate-400"
                  )} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password.message}
                  </p>
                )}
              </Field>

              {/* Botón de Entrada */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Iniciando sesión...
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