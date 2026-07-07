import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Settings,
  UserCircle,
  ShieldCheck,
  DatabaseBackup,
} from "lucide-react";

export default function MainLayout() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("cap_user") || "{}");

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-zinc-100 font-sans overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col shadow-xl z-10">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 font-bold text-white text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Building2 size={18} className="text-white" />
            </div>
            CAP System
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-6 flex flex-col gap-1.5 px-4 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>

          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/dashboard")
                ? "bg-zinc-800 text-white shadow-sm"
                : "hover:bg-zinc-800/50 hover:text-zinc-100"
            }`}
          >
            <LayoutDashboard
              size={18}
              className={isActive("/dashboard") ? "text-blue-400" : ""}
            />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          {/* Faculties */}
          <Link
            to="/faculties"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/faculties")
                ? "bg-zinc-800 text-white shadow-sm"
                : "hover:bg-zinc-800/50 hover:text-zinc-100"
            }`}
          >
            <Building2
              size={18}
              className={isActive("/faculties") ? "text-blue-400" : ""}
            />
            <span className="font-medium text-sm">Faculties</span>
          </Link>

          {/* Schedule */}
          <Link
            to="/schedule"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/schedule")
                ? "bg-zinc-800 text-white shadow-sm"
                : "hover:bg-zinc-800/50 hover:text-zinc-100"
            }`}
          >
            <CalendarDays
              size={18}
              className={isActive("/schedule") ? "text-blue-400" : ""}
            />
            <span className="font-medium text-sm">Schedule</span>
          </Link>

          {/* ================= SYSTEM MANAGEMENT ================= */}
          <div className="mt-4 mb-1 border-t border-zinc-800/50 pt-5">
            <p className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              System Mgmt
            </p>
          </div>

          {/* Audit */}
          <Link
            to="/audit"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/audit")
                ? "bg-zinc-800 text-white shadow-sm"
                : "hover:bg-zinc-800/50 hover:text-zinc-100"
            }`}
          >
            <ShieldCheck
              size={18}
              className={isActive("/audit") ? "text-blue-400" : ""}
            />
            <span className="font-medium text-sm">Security Audit</span>
          </Link>

          {/* Backups */}
          <Link
            to="/backups"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive("/backups")
                ? "bg-zinc-800 text-white shadow-sm"
                : "hover:bg-zinc-800/50 hover:text-zinc-100"
            }`}
          >
            <DatabaseBackup
              size={18}
              className={isActive("/backups") ? "text-blue-400" : ""}
            />
            <span className="font-medium text-sm">Cloud Backups</span>
          </Link>

        </nav>

        {/* ================= FOOTER / USER ================= */}
        <div className="p-4 border-t border-zinc-800/50 space-y-2">

          {/* Settings */}
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-zinc-800/50 hover:text-zinc-100 transition-colors text-left">
            <Settings size={18} />
            <span className="font-medium text-sm">Settings</span>
          </button>

          {/* USER CARD */}
          <div className="flex items-center gap-3 px-3 py-2 mt-2 bg-zinc-900 rounded-lg border border-zinc-800">
            <UserCircle size={24} className="text-zinc-400" />
            <div className="flex flex-col">

              <span className="text-sm font-medium text-zinc-200">
                {user.email || "User"}
              </span>

              <span className="text-xs text-zinc-500 mt-1">
                {user.role || "ROLE"}
              </span>

            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 overflow-y-auto bg-zinc-50">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}