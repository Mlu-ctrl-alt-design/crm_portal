// UNTITLED UI: Replace table with Table component —
//   see untitledui.com/react/components/table

/**
 * src/views/end_user/Tickets.jsx
 * Paginated ticket list with optional status filter.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../../hooks/useTickets.js";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";

const STATUS_OPTIONS = ["", "Open", "Replied", "Resolved", "Closed"];

/** Map Frappe Issue status to Badge variant */
function statusVariant(status) {
  switch (status) {
    case "Open": return "open";
    case "Replied": return "pending";
    case "Resolved": return "resolved";
    case "Closed": return "closed";
    default: return "closed";
  }
}

export default function Tickets() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useTickets({ status: status || null, page });

  const tickets = data?.tickets ?? [];
  const total = data?.total ?? 0;
  const pageSize = 20;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Tickets</h1>
        <Button variant="primary" onClick={() => navigate("/tickets/new")}>
          New Ticket
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600" htmlFor="status-filter">
          Filter by status:
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || "All"}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {isError && (
        <p className="text-red-600">Failed to load tickets.</p>
      )}

      {!isLoading && !isError && (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Subject", "Status", "Priority", "Created", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.name} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{t.name}</td>
                      <td className="px-5 py-3 font-medium text-gray-800">{t.subject}</td>
                      <td className="px-5 py-3">
                        <Badge label={t.status} variant={statusVariant(t.status)} />
                      </td>
                      <td className="px-5 py-3 text-gray-600">{t.priority}</td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(t.creation).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <Button
                          variant="secondary"
                          onClick={() => navigate(`/tickets/${t.name}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={page * pageSize >= total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
