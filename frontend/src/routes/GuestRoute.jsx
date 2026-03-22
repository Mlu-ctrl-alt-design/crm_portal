/**
 * src/routes/GuestRoute.jsx
 * Wrapper for routes that should only be accessible to unauthenticated users.
 * Redirects to /dashboard if the user is already logged in.
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
