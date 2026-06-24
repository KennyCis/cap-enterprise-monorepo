// frontend/web-app/src/pages/Schedule.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, MapPin, User, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Schedule() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    teacher_email: "admin@uce.edu.ec",
    room_id: "",
    reservation_date: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("cap_token");
      const response = await
        fetch(
          `${import.meta.env.VITE_API_URL}/api/reservations/`
          , {
            headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("cap_token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          start_time: `${formData.start_time}:00`,
          end_time: `${formData.end_time}:00`
        }),
      });

      if (!response.ok) throw new Error("Failed to create reservation");

      await fetchReservations();
      setFormData({ teacher_email: "admin@uce.edu.ec", room_id: "", reservation_date: "", start_time: "", end_time: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 animate-in fade-in duration-500">
      
      {/* Left Column: Reservation Form */}
      <div className="w-full xl:w-[380px] space-y-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Live Schedule</h1>
          <p className="text-zinc-500 mt-1 text-sm">Book rooms and manage class schedules.</p>
        </div>

        <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm shadow-zinc-200/50">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-4 mb-5">
            <div className="bg-zinc-100 p-2 rounded-lg">
              <Plus size={18} className="text-zinc-700" />
            </div>
            <h2 className="font-semibold text-lg text-zinc-900">New Reservation</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="teacher_email" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <User size={14}/> Teacher Email
              </Label>
              <Input 
                id="teacher_email" 
                value={formData.teacher_email}
                onChange={handleInputChange}
                className="bg-zinc-50/50 focus:bg-white transition-colors"
                required 
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="room_id" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <MapPin size={14}/> Room Code
              </Label>
              <Input 
                id="room_id" 
                placeholder="e.g. A-101" 
                value={formData.room_id}
                onChange={handleInputChange}
                className="bg-zinc-50/50 focus:bg-white transition-colors"
                required 
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reservation_date" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <CalendarDays size={14}/> Date
              </Label>
              <Input 
                id="reservation_date" 
                type="date"
                value={formData.reservation_date}
                onChange={handleInputChange}
                className="bg-zinc-50/50 focus:bg-white transition-colors"
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_time" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <Clock size={14}/> Start Time
                </Label>
                <Input 
                  id="start_time" 
                  type="time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="bg-zinc-50/50 focus:bg-white transition-colors"
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end_time" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <Clock size={14}/> End Time
                </Label>
                <Input 
                  id="end_time" 
                  type="time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="bg-zinc-50/50 focus:bg-white transition-colors"
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 mt-6 h-11 transition-all active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Column: Schedule Table */}
      <div className="w-full xl:w-2/3 mt-2 xl:mt-14">
        <div className="bg-white border border-zinc-200/60 rounded-2xl shadow-sm shadow-zinc-200/50 overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="p-5 bg-white border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 text-lg">Active Bookings</h2>
            <div className="text-sm text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full font-medium">
              {reservations.length} total
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-zinc-50/80 sticky top-0 z-10 backdrop-blur-sm">
                <TableRow className="border-zinc-100 hover:bg-transparent">
                  <TableHead className="font-semibold text-zinc-900 py-4 pl-6">Room</TableHead>
                  <TableHead className="font-semibold text-zinc-900">Date</TableHead>
                  <TableHead className="font-semibold text-zinc-900">Time Block</TableHead>
                  <TableHead className="font-semibold text-zinc-900">Teacher</TableHead>
                  <TableHead className="text-right font-semibold text-zinc-900 pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-64 text-zinc-400 font-medium">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Syncing schedules...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : reservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-64 text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="bg-zinc-100 p-4 rounded-full">
                          <CalendarDays size={32} className="text-zinc-400" />
                        </div>
                        <p className="text-zinc-600 font-medium text-base">No active reservations</p>
                        <p className="text-zinc-400 text-sm">Use the form on the left to book a room.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reservations.map((res) => (
                    <TableRow key={res.id} className="hover:bg-zinc-50/80 transition-colors border-zinc-100 group">
                      <TableCell className="font-bold text-zinc-900 pl-6">{res.room_id}</TableCell>
                      <TableCell className="text-zinc-600 font-medium">{new Date(res.reservation_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-zinc-500">
                        <span className="bg-zinc-100 px-2 py-1 rounded-md text-xs font-medium font-mono text-zinc-700">
                          {res.start_time.substring(0, 5)} - {res.end_time.substring(0, 5)}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-sm">{res.teacher_email}</TableCell>
                      <TableCell className="text-right pr-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                          {res.status || 'CONFIRMED'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}