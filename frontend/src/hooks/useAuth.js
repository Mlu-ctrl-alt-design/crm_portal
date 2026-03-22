/**
 * src/hooks/useAuth.js
 * Primary authentication hook used throughout the app.
 *
 * On mount, calls GET /api/method/frappe.auth.get_logged_user to check
 * whether a valid Frappe session cookie is present. If the user is logged in
 * the authStore is populated; otherwise it is cleared. This rehydration step
 * prevents a logged-in user from being redirected to /login on page refresh.
 */

import { useEffect, useCallback } from "react";
import api from "../services/api.js";
import { login as crmLogin, logout as crmLogout } from "../services/crm.js";
import useAuthStore from "../store/authStore.js";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, clearUser, setLoading } =
    useAuthStore();

  // ── Session rehydration on mount ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await api.get(
          "/api/method/frappe.auth.get_logged_user"
        );
        const email = res.data.message;

        if (cancelled) return;

        // Treat "Guest" as unauthenticated
        if (!email || email === "Guest") {
          clearUser();
          return;
        }

        // Fetch minimal user info to populate the store
        const userRes = await api.get("/api/method/frappe.client.get", {
          params: {
            doctype: "User",
            name: email,
            fields: JSON.stringify(["full_name", "email", "user_image"]),
          },
        });

        if (!cancelled) {
          const doc = userRes.data.message;
          setUser({ email: doc.email, full_name: doc.full_name, image: doc.user_image });
        }
      } catch {
        if (!cancelled) clearUser();
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const data = await crmLogin(email, password);
        setUser({ email: data.user, full_name: data.full_name });
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setUser]
  );

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await crmLogout();
    clearUser();
  }, [clearUser]);

  return { user, isAuthenticated, isLoading, login, logout };
}
