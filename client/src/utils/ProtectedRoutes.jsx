import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ requiredRole, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Role mismatch
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === "admin") return <Navigate to="/admin/home" />;
    return <Navigate to="/user/home" />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
