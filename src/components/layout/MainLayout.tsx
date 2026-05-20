import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { LayoutDashboard, FileText, Users, Menu, X, Calendar } from "lucide-react"
import { LogoutButton } from "../shared/LogoutButton"
import { cn } from "@/lib/utils"
import logoJFR from "../../assets/logoJFR.jpeg"

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Panel de Control", path: "/dashboard", icon: LayoutDashboard },
    { name: "Calendario", path: "/calendar", icon: Calendar },
    { name: "Actas y Acuerdos", path: "/meetings", icon: FileText },
    { name: "Directorio", path: "/users", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg text-slate-800">
          <img src={logoJFR} alt="Logo JFR" className="h-10 w-auto" />
          <span>JFR Zona 2</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-slate-500 hover:bg-slate-50 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out print:hidden", 
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="hidden md:flex items-center gap-3 h-20 px-6 border-b border-slate-100">
          <img src={logoJFR} alt="Logo JFR" className="h-10 w-auto" />
          <span className="font-bold text-lg tracking-tight text-slate-900 truncate">
            JFR Zona 2
          </span>
        </div>
        <nav className="flex-1 px-4 pb-6 pt-20 md:pt-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible">
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <Outlet />
      </main>

    </div>
  )
}