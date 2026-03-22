// UNTITLED UI: Replace with Badge component —
//   see untitledui.com/react/components/badge

/**
 * src/components/ui/Badge.jsx
 * Status badge for ticket status display.
 *
 * Props:
 *   label   {string}  — text to display
 *   variant {string}  — "open" | "resolved" | "pending" | "closed"
 */

const variantClasses = {
  open: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function Badge({ label, variant = "open" }) {
  const classes = variantClasses[variant] ?? variantClasses.closed;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
