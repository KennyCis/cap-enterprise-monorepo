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
    const WS_URL = `ws://${wsHost}/ws?email=${encodeURIComponent(user.email)}`;
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

      // Skip the initial "connected" handshake message
      if (data.type === "connected") return;

      setNotifications((prev) => [
        { id: Date.now(), ...data },
        ...prev.slice(0, 9), // keep max 10 notifications
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
    online: {
      color: "bg-emerald-100 text-emerald-700",
      icon: <Wifi size={14} />,
      label: "Live",
    },
    offline: {
      color: "bg-red-100 text-red-700",
      icon: <WifiOff size={14} />,
      label: "Offline — reconnecting",
    },
    connecting: {
      color: "bg-yellow-100 text-yellow-700",
      icon: <Wifi size={14} />,
      label: "Connecting...",
    },
  };

  const status = statusConfig[wsStatus];

  // ── Notification card color by type ────────────────────
  const notificationStyle = (type) => {
    if (type === "emergency")
      return "bg-red-50 border-red-200";
    if (type === "booking_confirmed")
      return "bg-emerald-50 border-emerald-200";
    return "bg-yellow-50 border-yellow-200";
  };

  return (
    <div className="space-y-8">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            Welcome back 👋
          </h1>
          <p className="text-zinc-500 mt-1">
            {user.email || "User"} — here is what's happening today
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${status.color}`}
          >
            {status.icon}
            {status.label}
          </div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* ── Stats Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card className="hover:shadow-xl transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-zinc-500">
              Total Classrooms
            </CardTitle>
            <Building2 size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-800">124</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-zinc-500">
              Active Classes
            </CardTitle>
            <Activity size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">38</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200 hover:shadow-xl transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-red-600">
              Conflicts Detected
            </CardTitle>
            <AlertTriangle size={18} className="text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">2</div>
          </CardContent>
        </Card>

      </div>

      {/* ── Real-Time Notifications Panel ──────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} />
            Real-Time Alerts
            {notifications.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </CardTitle>

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
            >
              Clear all
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              No alerts yet — system is running smoothly ✅
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${notificationStyle(n.type)}`}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{n.title}</p>
                    <p className="text-zinc-600">{n.message}</p>
                    <p className="text-zinc-400 text-xs mt-1">
                      {new Date(n.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}