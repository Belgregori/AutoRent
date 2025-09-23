
import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, requiredRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
