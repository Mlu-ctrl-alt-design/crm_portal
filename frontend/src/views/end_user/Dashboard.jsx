// UNTITLED UI: Replace StatCards with Metric Cards, activity list with Feed component —
//   see untitledui.com/react/components/metric-card
//   see untitledui.com/react/components/feed

/**
 * src/views/end_user/Dashboard.jsx
 * Portal home page showing summary statistics and recent activity.
 */

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../../services/crm.js";
import StatCard from "../../components/ui/StatCard.jsx";

function TicketIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DealIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-600">Failed to load dashboard. Please refresh.</p>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Open Tickets"
          value={data?.open_tickets ?? 0}
          icon={<TicketIcon />}
        />
        <StatCard
          label="Resolved Tickets"
          value={data?.resolved_tickets ?? 0}
          icon={<CheckIcon />}
        />
        <StatCard
          label="Active Deals"
          value={data?.active_deals ?? 0}
          icon={<DealIcon />}
        />
      </div>

      {/* Recent activity */}
      <section>
        <h2 className="mb-3 text-lg font-medium text-gray-800">Recent Activity</h2>
        {data?.recent_activity?.length ? (
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {data.recent_activity.map((item) => (
              <li key={item.name} className="px-5 py-3">
                <p className="text-sm font-medium text-gray-800">{item.subject}</p>
                <p className="text-xs text-gray-500">
                  {item.reference_name} &mdash;{" "}
                  {new Date(item.creation).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </section>
    </div>
  );
}
