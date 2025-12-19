// src/routes/RoleRoutes.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthProvider";

export function AdminOrVolunteerRoute({ children }) {
  const { profile } = useAuth();
  if (profile?.role === "admin" || profile?.role === "volunteer") {
    return <Navigate to="/dashboard/all-blood-donation-request" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}