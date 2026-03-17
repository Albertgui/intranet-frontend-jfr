import { useState } from "react"
import { Trash2, Plus, Loader2, GripVertical, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createTask, deleteTask } from "@/api/tasksApi"
import type { TaskListProps, Task } from "@/interfaces/task.interface"
import { SubTaskList } from "./SubTaskList"

export function TaskList({ meetingId, initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta tarea y todos sus pasos?")) return;

    const previousTasks = [...tasks]
    setTasks((current) => current.filter((t) => t.id !== taskId))

    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error("Error al eliminar la tarea principal:", error)
      alert("Hubo un error al eliminar la tarea.")
      setTasks(previousTasks)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    setIsAdding(true)
    try {
      const newTask = await createTask({ 
        title: newTaskTitle, 
        meetingId 
      })
      setTasks((current) => [...current, { ...newTask, subTasks: [] }])
      setNewTaskTitle("") 
    } catch (error) {
      console.error("Error al crear la tarea principal:", error)
      alert("Hubo un error al crear la tarea.")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      {tasks.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No hay acuerdos ni tareas registradas aún.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="group bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-5 h-5 text-slate-300 mt-0.5 cursor-grab hidden sm:block hover:text-slate-500" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-opacity -mr-2 -mt-2"
                  title="Eliminar tarea principal"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <SubTaskList 
                taskId={task.id} 
                initialSubTasks={task.subTasks || []} 
              />
            </div>
          ))}
        </div>
      )}
      <div className="pt-4 border-t border-slate-100">
        <form onSubmit={handleAddTask} className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Buscar..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={isAdding}
            className="flex-1 bg-slate-50 border-slate-200 focus-visible:bg-white"
          />
          <Button 
            type="submit" 
            disabled={isAdding || !newTaskTitle.trim()}
            className="bg-slate-900 hover:bg-slate-800 text-white shrink-0"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isAdding ? "Guardando..." : "Agregar Tarea"}
          </Button>
        </form>
      </div>

    </div>
  )
}