import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">System Overview</h1>
          <p className="text-zinc-500">Real-time campus metrics and alerts</p>
        </div>
        <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
          New Reservation
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Classrooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-zinc-800">124</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Active Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">38</div>
          </CardContent>
        </Card>
        <Card className="border-red-100 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Detected Conflicts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Search</CardTitle>
          <CardDescription>Find available classrooms immediately.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input placeholder="e.g. Engineering Faculty..." className="max-w-md bg-white" />
          <Button variant="outline">Search</Button>
        </CardContent>
      </Card>
    </div>
  );
}