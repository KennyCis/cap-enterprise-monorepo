import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Building2, CalendarDays, Settings } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-zinc-50 font-sans">
      <aside className="w-64 bg-zinc-900 text-zinc-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800 font-bold text-white text-xl">
          CAP System
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-2 px-3">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/faculties" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <Building2 size={20} />
            Faculties
          </Link>
          <Link to="/schedule" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
            <CalendarDays size={20} />
            Schedule
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-zinc-800 hover:text-white transition-colors text-left">
            <Settings size={20} />
            Settings
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}