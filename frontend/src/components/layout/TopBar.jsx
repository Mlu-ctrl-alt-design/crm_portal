// UNTITLED UI: Replace with TopBar component —
//   see untitledui.com/react/components/top-bar

/**
 * src/components/layout/TopBar.jsx
 * Top navigation bar showing the logged-in user's name, a notification bell
 * with unread count, and a logout button.
 *
 * Replace with Untitled UI TopBar component once installed.
 */

import { useAuth } from "../../hooks/useAuth.js";
import { useNotifications, useMarkRead } from "../../hooks/useNotifications.js";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: notifData } = useNotifications();
  const unreadCount = notifData?.unread_count ?? 0;

  const { mutate: markRead } = useMarkRead();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleBellClick = () => {
    if (unreadCount > 0) {
      markRead();
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left: breadcrumb placeholder */}
      <div />

      {/* Right: user controls */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button
          onClick={handleBellClick}
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Notifications"
        >
          {/* Bell icon (inline SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* User name */}
        <span className="text-sm font-medium text-gray-700">
          {user?.full_name ?? user?.email ?? ""}
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
