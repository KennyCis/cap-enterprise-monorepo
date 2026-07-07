import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Faculties from "./pages/Faculties";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Register from "./pages/Register";

// NEW MODULES IMPORTED HERE
import Backups from "./pages/Backups";
import Audit from "./pages/Audit"; 

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="faculties" element={<Faculties />} />
          <Route path="schedule" element={<Schedule />} />
          
          {/* SYSTEM MANAGEMENT ROUTES */}
          <Route path="audit" element={<Audit />} />
          <Route path="backups" element={<Backups />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;