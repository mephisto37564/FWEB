import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return children;
}