/**
 * src/routes/index.jsx
 * Top-level React Router v6 route configuration.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import GuestRoute from "./GuestRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Guest views
import Login from "../views/guest/Login.jsx";
import Register from "../views/guest/Register.jsx";
import ForgotPassword from "../views/guest/ForgotPassword.jsx";

// Authenticated views
import Dashboard from "../views/end_user/Dashboard.jsx";
import Tickets from "../views/end_user/Tickets.jsx";
import TicketDetail from "../views/end_user/TicketDetail.jsx";
import NewTicket from "../views/end_user/NewTicket.jsx";
import Profile from "../views/end_user/Profile.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Guest routes ───────────────────────────────────────────── */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />

      {/* ── Authenticated routes ───────────────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        }
      />
      {/* /tickets/new must come before /tickets/:id so it doesn't get captured */}
      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute>
            <NewTicket />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ── Redirects ──────────────────────────────────────────────── */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
