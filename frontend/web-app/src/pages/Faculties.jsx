import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Faculties() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    campus_location: "",
  });

  useEffect(() => {
    fetchFaculties();
  }, []);

  // 🚀 ACTUALIZADO: Apuntando al API Gateway y enviando JWT
  const fetchFaculties = async () => {
    try {
      const token = localStorage.getItem("cap_token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/faculties/`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
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

  // 🚀 ACTUALIZADO: POST a través del API Gateway con JWT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("cap_token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/faculties/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Inyectamos seguridad
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create faculty");

      // Refrescamos la tabla para ver el nuevo registro
      await fetchFaculties();
      
      // Cerramos el modal y limpiamos el form
      setIsModalOpen(false);
      setFormData({ name: "", description: "", campus_location: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Faculties Management</h1>
          <p className="text-zinc-500">Manage university faculties and campus locations.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Create New Faculty</DialogTitle>
              <DialogDescription>
                Enter the details of the new faculty. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Faculty Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Science Faculty" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="e.g. Main building for applied sciences" 
                  value={formData.description}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus_location">Campus Location</Label>
                <Input 
                  id="campus_location" 
                  placeholder="e.g. South Campus" 
                  value={formData.campus_location}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-zinc-900 text-white hover:bg-zinc-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Faculty"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>

      <div className="border border-zinc-200 rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="w-[100px] font-semibold text-zinc-900">ID</TableHead>
              <TableHead className="font-semibold text-zinc-900">Faculty Name</TableHead>
              <TableHead className="font-semibold text-zinc-900">Description</TableHead>
              <TableHead className="font-semibold text-zinc-900">Campus Location</TableHead>
              <TableHead className="text-right font-semibold text-zinc-900">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-zinc-500">
                  Loading data from server...
                </TableCell>
              </TableRow>
            ) : faculties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-zinc-500">
                  No faculties found in the database.
                </TableCell>
              </TableRow>
            ) : (
              faculties.map((faculty) => (
                <TableRow key={faculty.id} className="hover:bg-zinc-50 transition-colors">
                  <TableCell className="font-medium text-zinc-900">{faculty.id}</TableCell>
                  <TableCell>{faculty.name}</TableCell>
                  <TableCell className="text-zinc-500">{faculty.description}</TableCell>
                  <TableCell>{faculty.campus_location}</TableCell>
                  <TableCell className="text-right">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        faculty.is_active !== false 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {faculty.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}