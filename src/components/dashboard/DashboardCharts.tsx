import { useState } from "react"
import { BarChart3, PieChart, ShieldAlert } from "lucide-react"
import type { DashboardStats } from "@/interfaces/dashboard.interface"

interface DashboardChartsProps {
  stats: DashboardStats
}

export function DashboardCharts({ stats }: DashboardChartsProps) {
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null)

  // 1. Completion Rate calculation
  const totalSubtasks = stats.totalTasks
  const completedSubtasks = stats.completedTasks
  const completionRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

  // SVG parameters for the progress ring
  const size = 160
  const strokeWidth = 14
  const center = size / 2
  const radius = center - strokeWidth
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (completionRate / 100) * circumference

  // 2. Main Task status mapping
  const statuses = [
    { key: "PENDIENTE", label: "Pendientes", value: stats.taskStatusCounts.PENDIENTE, color: "bg-slate-200 text-slate-800 border-slate-300", barColor: "bg-slate-400" },
    { key: "EN_PROGRESO", label: "En Progreso", value: stats.taskStatusCounts.EN_PROGRESO, color: "bg-indigo-50 text-indigo-700 border-indigo-100", barColor: "bg-indigo-500" },
    { key: "COMPLETADA", label: "Completadas", value: stats.taskStatusCounts.COMPLETADA, color: "bg-emerald-50 text-emerald-700 border-emerald-100", barColor: "bg-emerald-500" },
    { key: "BLOQUEADA", label: "Bloqueadas", value: stats.taskStatusCounts.BLOQUEADA, color: "bg-rose-50 text-rose-700 border-rose-100", barColor: "bg-rose-500" },
  ]

  const maxStatusValue = Math.max(...statuses.map(s => s.value), 1)

  // 3. Priorities mapping
  const priorities = [
    { label: "Baja", value: stats.taskPriorityCounts.BAJA, theme: "emerald" },
    { label: "Media", value: stats.taskPriorityCounts.MEDIA, theme: "blue" },
    { label: "Alta", value: stats.taskPriorityCounts.ALTA, theme: "orange" },
    { label: "Urgente", value: stats.taskPriorityCounts.URGENTE, theme: "rose" },
  ]
  const totalPriorityTasks = priorities.reduce((sum, p) => sum + p.value, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Progress Ring Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center justify-between min-h-[300px]">
        <div className="w-full flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <PieChart className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Resolución de Pasos</h3>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative my-4 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
            />
            {/* Animated progress ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* Gradients */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tighter">
              {completionRate}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Completado
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          <p className="text-slate-800 font-semibold">{completedSubtasks} de {totalSubtasks} pasos resueltos</p>
          <p className="mt-1 text-[11px] text-slate-400">Total acumulado de acuerdos y tareas</p>
        </div>
      </div>

      {/* 2. Status Bars Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px]">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Estado de Compromisos</h3>
        </div>

        <div className="space-y-3.5 flex-1 flex flex-col justify-center">
          {statuses.map((status) => {
            const percentage = maxStatusValue > 0 ? (status.value / maxStatusValue) * 100 : 0
            const isHovered = hoveredStatus === status.key

            return (
              <div
                key={status.key}
                className="space-y-1 relative"
                onMouseEnter={() => setHoveredStatus(status.key)}
                onMouseLeave={() => setHoveredStatus(null)}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">{status.label}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${status.color}`}>
                    {status.value}
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-100/50">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full ${status.barColor} rounded-full transition-all duration-1000 ease-out`}
                  />
                </div>

                {/* Styled Hover Tooltip */}
                {isHovered && (
                  <div className="absolute -top-7 right-0 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-20 transition-all">
                    {Math.round(percentage)}% del máximo
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-[10px] text-slate-400 text-center font-medium mt-3 border-t border-slate-50 pt-2">
          Representa el estado actual de los acuerdos principales
        </div>
      </div>

      {/* 3. Priorities Grid Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[300px] md:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Carga de Trabajo / Urgencia</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1 items-center">
          {priorities.map((p) => {
            const ratio = totalPriorityTasks > 0 ? (p.value / totalPriorityTasks) * 100 : 0
            
            // Map theme color variables manually
            let ringColor = "bg-slate-100 border-slate-200 text-slate-700"
            let barColor = "bg-slate-300"
            if (p.theme === "emerald") {
              ringColor = "bg-emerald-50 text-emerald-800 border-emerald-100"
              barColor = "bg-emerald-500"
            } else if (p.theme === "blue") {
              ringColor = "bg-blue-50 text-blue-800 border-blue-100"
              barColor = "bg-blue-500"
            } else if (p.theme === "orange") {
              ringColor = "bg-amber-50 text-amber-800 border-amber-100"
              barColor = "bg-amber-500"
            } else if (p.theme === "rose") {
              ringColor = "bg-rose-50 text-rose-800 border-rose-100"
              barColor = "bg-rose-500"
            }

            return (
              <div
                key={p.label}
                className="p-3 border border-slate-100 rounded-xl flex flex-col justify-between h-[100px] hover:border-slate-200 transition-colors bg-slate-50/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{p.label}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border ${ringColor}`}>
                    {p.value}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-end justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Carga</span>
                    <span className="text-[10px] font-extrabold text-slate-700">{Math.round(ratio)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${ratio}%` }}
                      className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-[10px] text-slate-400 text-center font-medium mt-3 border-t border-slate-50 pt-2">
          Prioridades registradas en el sistema comunal
        </div>
      </div>
    </div>
  )
}
