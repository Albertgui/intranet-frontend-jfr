import { useState } from "react"
import { createMeetingApi } from "@/api/meetingsApi"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Loader2, Plus, Type, Calendar, MapPin, AlignLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const meetingSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  date: z.string().min(1, "La fecha y hora son obligatorias"),
  location: z.string().optional(),
  description: z.string().optional(),
})

type MeetingFormValues = z.infer<typeof meetingSchema>

interface CreateMeetingDialogProps {
  onSuccess: () => void;
}

export function CreateMeetingDialog({ onSuccess }: CreateMeetingDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      description: "",
    },
  })

  const onSubmit = async (data: MeetingFormValues) => {
    try {
      setLoading(true)
      
      const payload = {
        ...data,
        date: new Date(data.date).toISOString() 
      }

      await createMeetingApi(payload)
      setOpen(false)
      reset()
      onSuccess() 
    } catch (error) {
      console.error("Error al crear la reunión:", error)
      alert("Hubo un error al guardar el acta.")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Nueva Acta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-slate-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 py-5 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-slate-900">Registrar Nueva Acta</DialogTitle>
            <DialogDescription className="text-slate-500">
              Ingresa los detalles de la nueva asamblea o reunión comunal.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5 px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700 font-semibold">
                Título de la reunión <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Type className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  id="title" 
                  placeholder="Ej. Asamblea de Ciudadanos"
                  disabled={loading}
                  {...register("title")}
                  className={cn(
                    "pl-9 bg-slate-50/50 focus-visible:bg-white",
                    errors.title && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-700 font-semibold">
                  Fecha y Hora <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    id="date" 
                    type="datetime-local" 
                    disabled={loading}
                    {...register("date")}
                    className={cn(
                      "pl-9 bg-slate-50/50 focus-visible:bg-white",
                      errors.date && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-700 font-semibold">Lugar</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    id="location" 
                    placeholder="Ej. El Club"
                    disabled={loading}
                    {...register("location")}
                    className="pl-9 bg-slate-50/50 focus-visible:bg-white"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 font-semibold">
                Descripción o Puntos a Tratar
              </Label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea 
                  id="description" 
                  rows={3}
                  placeholder="Escribe un breve resumen..."
                  disabled={loading}
                  {...register("description")}
                  className="w-full pl-9 py-2 rounded-md border border-slate-200 bg-slate-50/50 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:bg-white resize-none"
                />
              </div>
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
                  Guardando...
                </>
              ) : (
                "Guardar Acta"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}