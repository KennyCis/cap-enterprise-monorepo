import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  AlertTriangle,
  Activity,
  LogOut,
  Bell,
  Wifi,
  WifiOff,
  ShieldCheck,
  DatabaseBackup,
  ChevronRight
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("cap_user") || "{}");

  const [notifications, setNotifications] = useState([]);
  const [wsStatus, setWsStatus] = useState("connecting");
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  // ── WebSocket Connection ────────────────────────────────
  const connectWebSocket = () => {
    if (!user.email) return;

    const isDev = window.location.port === '5173';
    const wsHost = isDev ? 'localhost' : window.location.host;
    const WS_URL = isDev 
      ? `ws://localhost:3003/ws?email=${encodeURIComponent(user.email)}`
      : `ws://${window.location.host}/ws?email=${encodeURIComponent(user.email)}`;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setWsStatus("online");
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "connected") return;

      setNotifications((prev) => [
        { id: Date.now(), ...data },
        ...prev.slice(0, 9), 
      ]);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket disconnected — retrying in 5s");
      setWsStatus("offline");
      reconnectTimer.current = setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = () => {
      setWsStatus("offline");
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [user.email]);

  // ── Handlers ────────────────────────────────────────────
  const handleLogout = () => {
    wsRef.current?.close();
    localStorage.removeItem("cap_token");
    localStorage.removeItem("cap_user");
    navigate("/login");
  };

  const clearNotifications = () => setNotifications([]);

  // ── Status badge config ─────────────────────────────────
  const statusConfig = {
    online: { color: "bg-emerald-100 text-emerald-700", icon: <Wifi size={14} />, label: "Live" },
    offline: { color: "bg-red-100 text-red-700", icon: <WifiOff size={14} />, label: "Offline — reconnecting" },
    connecting: { color: "bg-yellow-100 text-yellow-700", icon: <Wifi size={14} />, label: "Connecting..." },
  };
  const status = statusConfig[wsStatus] || statusConfig.offline;

  const notificationStyle = (type) => {
    if (type === "emergency") return "bg-red-50 border-red-200";
    if (type === "booking_confirmed") return "bg-emerald-50 border-emerald-200";
    return "bg-yellow-50 border-yellow-200";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Welcome back 👋</h1>
          <p className="text-zinc-500 mt-1">
            {user.email || "Administrator"} — here is what's happening today
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${status.color}`}>
            {status.icon}
            {status.label}
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-zinc-200 text-zinc-700 hover:bg-zinc-100">
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* ── Stats Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-all hover:scale-[1.02] border-zinc-200/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Total Classrooms</CardTitle>
            <Building2 size={18} className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-zinc-800">124</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all hover:scale-[1.02] border-zinc-200/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Active Classes</CardTitle>
            <Activity size={18} className="text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-600">38</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200 hover:shadow-xl transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-red-600 uppercase tracking-wider">Conflicts Detected</CardTitle>
            <AlertTriangle size={18} className="text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">2</div>
          </CardContent>
        </Card>
      </div>

      {/* ── Lower Section (Notifications & Quick Actions) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Notifications Panel */}
        <Card className="lg:col-span-2 border-zinc-200/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell size={20} className="text-zinc-700" />
              Real-Time Alerts
              {notifications.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  {notifications.length}
                </span>
              )}
            </CardTitle>

            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-zinc-500 hover:text-zinc-900">
                Clear all
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-4 min-h-[300px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[250px] text-zinc-400 space-y-3">
                <div className="bg-emerald-50 p-4 rounded-full">
                  <ShieldCheck size={32} className="text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-emerald-700">System is running smoothly</p>
                <p className="text-xs">No alerts detected at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${notificationStyle(n.type)}`}>
                    <div className="flex-1">
                      <p className="font-semibold text-zinc-900">{n.title}</p>
                      <p className="text-zinc-600 mt-0.5">{n.message}</p>
                      <p className="text-zinc-400 text-xs mt-2 font-mono">
                        {new Date(n.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="border-zinc-200/60 shadow-sm">
          <CardHeader className="border-b border-zinc-100 pb-4">
            <CardTitle className="text-lg text-zinc-800">System Management</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            
            <button 
              onClick={() => navigate("/audit")}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-lg text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-zinc-900 text-sm">Security Audit</p>
                  <p className="text-xs text-zinc-500">View Kafka event logs</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-400 group-hover:text-blue-600" />
            </button>

            <button 
              onClick={() => navigate("/backups")}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:border-purple-300 hover:bg-purple-50 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2.5 rounded-lg text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <DatabaseBackup size={20} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-zinc-900 text-sm">Cloud Backups</p>
                  <p className="text-xs text-zinc-500">Trigger manual dumps</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-400 group-hover:text-purple-600" />
            </button>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}