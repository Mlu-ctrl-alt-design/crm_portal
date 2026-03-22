// UNTITLED UI: Replace with Shell component —
//   see untitledui.com/react/components/shell

/**
 * src/components/layout/AppShell.jsx
 * Top-level authenticated layout: sidebar on the left, top bar at the top,
 * main content area on the right.
 *
 * Replace layout divs with Untitled UI Shell component once installed —
 * see untitledui.com/react/components/shell
 */

import Sidebar from "./Sidebar.jsx";
import TopBar from "./TopBar.jsx";

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
