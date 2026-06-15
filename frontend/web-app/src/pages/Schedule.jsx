import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
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
  
  // Default admin email for demo purposes
  const [formData, setFormData] = useState({
    teacher_email: "admin@uce.edu.ec",
    room_id: "",
    reservation_date: "",
    start_time: "",
    end_time: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("cap_token");
      
      // Request goes through Nginx API Gateway to Node.js reservation-service
      const response = await fetch("http://localhost:8000/api/reservations/", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("cap_token");
      
      // POST request to create a new reservation via API Gateway
      const response = await fetch("http://localhost:8000/api/reservations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          // Format times by appending seconds to match PostgreSQL TIME data type
          start_time: `${formData.start_time}:00`,
          end_time: `${formData.end_time}:00`
        }),
      });

      if (!response.ok) throw new Error("Failed to create reservation");

      // Refresh the table to display the newly created reservation
      await fetchReservations();
      
      // Reset form fields while preserving the default teacher email
      setFormData({ 
        teacher_email: "admin@uce.edu.ec", 
        room_id: "", 
        reservation_date: "", 
        start_time: "", 
        end_time: "" 
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Left Column: Reservation Form */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Live Schedule</h1>
          <p className="text-zinc-500 mt-1">Book rooms and manage class schedules.</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg border-b border-zinc-100 pb-3 mb-4">New Reservation</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher_email" className="flex items-center gap-2 text-zinc-600">
                <User size={16}/> Teacher Email
              </Label>
              <Input 
                id="teacher_email" 
                value={formData.teacher_email}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="room_id" className="flex items-center gap-2 text-zinc-600">
                <MapPin size={16}/> Room Code (e.g. A-101)
              </Label>
              <Input 
                id="room_id" 
                placeholder="A-101" 
                value={formData.room_id}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation_date" className="flex items-center gap-2 text-zinc-600">
                <CalendarDays size={16}/> Date
              </Label>
              <Input 
                id="reservation_date" 
                type="date"
                value={formData.reservation_date}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time" className="flex items-center gap-2 text-zinc-600">
                  <Clock size={16}/> Start Time
                </Label>
                <Input 
                  id="start_time" 
                  type="time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time" className="flex items-center gap-2 text-zinc-600">
                  <Clock size={16}/> End Time
                </Label>
                <Input 
                  id="end_time" 
                  type="time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking..." : "Book Room"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Column: Schedule Table */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden h-full">
          <div className="p-4 bg-zinc-50 border-b border-zinc-200">
            <h2 className="font-semibold text-zinc-800">Active Bookings</h2>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-zinc-900">Room</TableHead>
                <TableHead className="font-semibold text-zinc-900">Date</TableHead>
                <TableHead className="font-semibold text-zinc-900">Time Block</TableHead>
                <TableHead className="font-semibold text-zinc-900">Teacher</TableHead>
                <TableHead className="text-right font-semibold text-zinc-900">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-48 text-zinc-500">
                    Loading schedules...
                  </TableCell>
                </TableRow>
              ) : reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-48 text-zinc-500">
                    No reservations found. Book a room to get started.
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((res) => (
                  <TableRow key={res.id} className="hover:bg-zinc-50 transition-colors">
                    <TableCell className="font-bold text-zinc-900">{res.room_id}</TableCell>
                    <TableCell>{new Date(res.reservation_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-zinc-600">
                      {res.start_time.substring(0, 5)} - {res.end_time.substring(0, 5)}
                    </TableCell>
                    <TableCell className="text-zinc-500 text-sm">{res.teacher_email}</TableCell>
                    <TableCell className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
  );
}