import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"
import Faculties from "./pages/Faculties"
import Schedule from "./pages/Schedule"
import Login from "./pages/Login" 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Public (Sin Sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* Rutes Privates (Con Sidebar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="faculties" element={<Faculties />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App