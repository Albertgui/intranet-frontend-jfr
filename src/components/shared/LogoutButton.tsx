import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login", { replace: true })
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="text-slate-500 hover:text-red-600 hover:bg-red-50 w-full justify-start transition-colors"
    >
      <LogOut className="w-4 h-4 mr-2 text-red-600" />
      <span className="text-red-600">Cerrar Sesión</span>
    </Button>
  )
}