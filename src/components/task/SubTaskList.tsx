import { useState } from "react"
import { Trash2, Plus, Loader2, Square, CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateSubTask, deleteSubTask, createSubTask } from "../../api/subTaskApi"
import type { SubTaskListProps, SubTask } from "@/interfaces/subTask.interface"

export function SubTaskList({ taskId, initialSubTasks }: SubTaskListProps) {
  const [subTasks, setSubTasks] = useState<SubTask[]>(initialSubTasks)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleToggle = async (subTask: SubTask) => {
    const updatedStatus = !subTask.isCompleted
    setSubTasks((current) =>
      current.map((st) => (st.id === subTask.id ? { ...st, isCompleted: updatedStatus } : st))
    )

    try {
      await updateSubTask(subTask.id, { isCompleted: updatedStatus })
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      setSubTasks((current) =>
        current.map((st) => (st.id === subTask.id ? { ...st, isCompleted: !updatedStatus } : st))
      )
    }
  }

  const handleDelete = async (id: string) => {
    const previousSubTasks = [...subTasks]
    setSubTasks((current) => current.filter((st) => st.id !== id))

    try {
      await deleteSubTask(id)
    } catch (error) {
      console.error("Error al eliminar:", error)
      setSubTasks(previousSubTasks)
    }
  }
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    setIsAdding(true)
    try {
      const newSubTask = await createSubTask({ title: newTaskTitle, taskId })
      setSubTasks((current) => [...current, newSubTask])
      setNewTaskTitle("")
    } catch (error) {
      console.error("Error al crear subtarea:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-3 mt-4 ml-2 sm:ml-8 pl-4 border-l-2 border-slate-100">
      <ul className="space-y-2">
        {subTasks.map((subTask) => (
          <li 
            key={subTask.id} 
            className="flex items-start justify-between group py-1"
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => handleToggle(subTask)}
                className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                {subTask.isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <span 
                className={cn(
                  "text-sm transition-all duration-200 cursor-pointer select-none",
                  subTask.isCompleted ? "text-slate-400 line-through" : "text-slate-700"
                )}
                onClick={() => handleToggle(subTask)}
              >
                {subTask.title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(subTask.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all focus:opacity-100 focus:outline-none print:hidden"
              title="Eliminar subtarea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-2 print:hidden">
        <Plus className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <Input
          type="text"
          placeholder="Añadir un nuevo paso..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          disabled={isAdding}
          className="h-8 text-sm bg-transparent border-transparent hover:border-slate-200 focus-visible:bg-white focus-visible:border-indigo-500 focus-visible:ring-1 shadow-none px-2"
        />
        {newTaskTitle.trim() && (
          <Button 
            type="submit" 
            size="sm" 
            disabled={isAdding}
            className="h-8 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3"
          >
            {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : "Guardar"}
          </Button>
        )}
      </form>

    </div>
  )
}