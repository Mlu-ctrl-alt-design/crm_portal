/**
 * src/store/authStore.js
 * Zustand store for authentication state.
 *
 * isLoading starts as `true` on every page mount. useAuth.js performs a
 * lightweight GET to Frappe (/api/method/frappe.auth.get_logged_user) to
 * check whether a valid session cookie exists. Only after that request
 * resolves is isLoading set to false. This prevents ProtectedRoute from
 * flashing the login redirect before the session check completes.
 */

import { create } from "zustand";

const useAuthStore = create((set) => ({
  // ── State ─────────────────────────────────────────────────────────────────
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Call after a successful login or session rehydration. */
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  /** Call after logout or when session is confirmed absent. */
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  /** Used by useAuth.js to toggle the loading state. */
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
