// UNTITLED UI: Replace with Metric Card component —
//   see untitledui.com/react/components/metric-card

/**
 * src/components/ui/StatCard.jsx
 * Simple metric card used on the Dashboard.
 *
 * Props:
 *   label {string}      — description of the metric
 *   value {string|number} — the metric value
 *   icon  {ReactNode}   — optional icon element
 */

export default function StatCard({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value ?? "—"}</p>
      </div>
    </div>
  );
}
