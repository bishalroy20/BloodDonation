// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthProvider";
import AdminHome from "../Components/DashBoard/AdminHome";

export default function AdminRoute({ children }) {
  const { profile } = useAuth();

  // If profile is still loading, you can show a loader/spinner
  if (!profile) {
    return <AdminHome/>;
  }

  // Allow only admins
  if (profile?.role === "admin") {
    return children;
  }

  // Redirect non-admins
  return <Navigate to="/dashboard" replace />;
}