/**
 * src/services/crm.js
 * Named async functions for every backend endpoint.
 * All calls go through the shared `call` helper which targets the
 * Frappe whitelisted method convention:
 *   POST /api/method/custom_crm_api.api.<module>.<function>
 */

import api from "./api.js";

/**
 * Shared helper — POST to a Frappe whitelisted method.
 * Frappe wraps every successful response in { message: <actual data> }.
 */
const call = (method, params = {}) =>
  api
    .post(`/api/method/custom_crm_api.api.${method}`, params)
    .then((r) => r.data.message);

// ── Auth ────────────────────────────────────────────────────────────────────

/** Login.jsx — authenticate and start session */
export const login = (email, password) =>
  call("auth.login", { email, password });

/** Register.jsx — create a new portal account */
export const register = (full_name, email, password, company = null, phone = null) =>
  call("auth.register", { full_name, email, password, company, phone });

/** ForgotPassword.jsx — trigger password-reset email */
export const requestPasswordReset = (email) =>
  call("auth.request_password_reset", { email });

/** TopBar.jsx — destroy session */
export const logout = () => call("auth.logout");

// ── Dashboard ───────────────────────────────────────────────────────────────

/** Dashboard.jsx — aggregated stats + recent activity */
export const getDashboard = () => call("portal.get_dashboard_summary");

// ── Tickets ─────────────────────────────────────────────────────────────────

/** Tickets.jsx — paginated ticket list with optional status filter */
export const getTickets = (status = null, page = 1, page_size = 20) =>
  call("portal.get_my_tickets", { status, page, page_size });

/** TicketDetail.jsx — single ticket + thread */
export const getTicket = (ticket_id) =>
  call("portal.get_ticket_detail", { ticket_id });

/** NewTicket.jsx — create a ticket */
export const createTicket = (subject, description, priority = "Medium") =>
  call("portal.create_ticket", { subject, description, priority });

/** TicketDetail.jsx — post a reply */
export const replyToTicket = (ticket_id, message) =>
  call("portal.reply_to_ticket", { ticket_id, message });

// ── Profile ─────────────────────────────────────────────────────────────────

/** Profile.jsx — get current user profile */
export const getProfile = () => call("portal.get_my_profile");

/** Profile.jsx — save profile changes */
export const updateProfile = (full_name, phone, company) =>
  call("portal.update_my_profile", { full_name, phone, company });

// ── Notifications ────────────────────────────────────────────────────────────

/** TopBar.jsx / useNotifications — fetch notifications */
export const getNotifications = () => call("portal.get_notifications");

/** TopBar.jsx / useNotifications — mark all read */
export const markNotificationsRead = () =>
  call("portal.mark_notifications_read");
