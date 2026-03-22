/**
 * src/services/api.js
 * Configured Axios instance for all Frappe API calls.
 *
 * withCredentials: true  — sends the session cookie on every request.
 * X-Frappe-CSRF-Token   — Frappe injects window.csrf_token into the page on
 *                          the very first page load (see frappe/www/login.html).
 *                          In a decoupled SPA that never loads a Frappe page,
 *                          fetch the token once from /api/method/frappe.auth.get_logged_user
 *                          and store it (useAuth.js does this on mount).
 */

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach CSRF token from window.csrf_token on every request.
api.interceptors.request.use((config) => {
  const token = window.csrf_token;
  if (token && token !== "{{ csrf_token }}") {
    config.headers["X-Frappe-CSRF-Token"] = token;
  }
  return config;
});

// Response interceptor — handle auth-related errors globally.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 403 Forbidden — user is not logged in or lacks permission.
    if (status === 403) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 417 Expectation Failed — Frappe uses this for session-expired responses.
    if (status === 417) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
