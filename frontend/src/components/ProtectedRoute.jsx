// src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>読み込み中...</p>;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
