import { useState, useEffect } from "react"
import { Trash2, Plus, Loader2, GripVertical, CheckSquare, UserCircle, Flag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createTask, deleteTask } from "@/api/tasksApi"
import type { User } from "@/interfaces/users.interface"
import { getUser } from "@/api/userApi"
import type { Task, TaskListProps } from "@/interfaces/task.interface"
import { SubTaskList } from "./SubTaskList"

export function TaskList({ meetingId, initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [users, setUsers] = useState<User[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [selectedPriority, setSelectedPriority] = useState<string>("")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const fetchVoceros = async () => {
      try {
        const voceros = await getUser();
        setUsers(voceros);
      } catch (error) {
        console.error("Error cargando voceros", error);
      }
    };
    fetchVoceros();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar esta tarea y todos sus pasos?")) return;
    const previousTasks = [...tasks]
    setTasks((current) => current.filter((t) => t.id !== taskId))
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error("Error al eliminar la tarea:", error)
      setTasks(previousTasks) 
    }
  }

  const formatLocalDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) return

    setIsAdding(true)
    try {
      const payload = {
        title: newTaskTitle,
        description: newTaskDescription,
        meetingId,
        assignedTo: selectedUserId || undefined,
        priority: selectedPriority || undefined,
        dueDate: newTaskDueDate || undefined,
      };

      const newTask = await createTask(payload)
      const assignedUser = users.find(u => u.id === selectedUserId);
      
      setTasks((current) => [...current, { ...newTask, assignedTo: assignedUser, subtasks: [] }])
      setNewTaskTitle("") 
      setNewTaskDescription("")
      setSelectedUserId("")
      setSelectedPriority("")
      setNewTaskDueDate("")
    } catch (error) {
      console.error("Error al crear la tarea:", error)
      alert("Hubo un error al crear la tarea. Verifica los datos.")
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
            <div key={task.id} className="group bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-5 h-5 text-slate-300 mt-1 hidden sm:block print:hidden" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {task.assignedTo && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                          <UserCircle className="w-4 h-4" />
                          {task.assignedTo.name}
                        </div>
                      )}
                      {task.priority && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md">
                          <Flag className="w-3.5 h-3.5" />
                          {task.priority}
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Límite: {formatLocalDate(task.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 hover:bg-red-50 -mr-2 -mt-2 transition-opacity print:hidden"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="pl-0 sm:pl-8">
                <SubTaskList taskId={task.id} initialSubTasks={task.subtasks || []} />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="pt-6 border-t border-slate-100 print:hidden">
        <form onSubmit={handleAddTask} className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Registrar Nuevo Acuerdo</h4>
          <div className="grid grid-cols-1 gap-3">
            <Input
              type="text"
              placeholder="Título de la tarea..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isAdding}
              className="bg-white"
            />
            <Input
              type="text"
              placeholder="Descripción detallada (Obligatorio)..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              disabled={isAdding}
              className="bg-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isAdding || users.length === 0}
              className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Responsable (Opcional)</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              disabled={isAdding}
              className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Prioridad (Opcional)</option>
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
              <option value="URGENTE">Urgente</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium shrink-0">Fecha Límite:</span>
              <Input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                disabled={isAdding}
                className="bg-white flex-1 h-10"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              disabled={isAdding || !newTaskTitle.trim() || !newTaskDescription.trim()} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
            >
              {isAdding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Guardar Tarea
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}