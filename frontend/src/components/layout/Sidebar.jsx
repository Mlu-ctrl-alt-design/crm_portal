// UNTITLED UI: Replace with SideNav component —
//   see untitledui.com/react/components/side-nav

/**
 * src/components/layout/Sidebar.jsx
 * Navigation sidebar with links to all authenticated views.
 * Uses React Router NavLink for automatic active-state styling.
 *
 * Replace with Untitled UI SideNav component once installed.
 */

import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Tickets", to: "/tickets" },
  { label: "New Ticket", to: "/tickets/new" },
  { label: "Profile", to: "/profile" },
];

export default function Sidebar() {
  return (
    <aside className="flex w-56 flex-col border-r border-gray-200 bg-white">
      {/* Logo / App name */}
      <div className="flex h-16 items-center border-b border-gray-200 px-5">
        <span className="text-lg font-semibold text-gray-900">CRM Portal</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
