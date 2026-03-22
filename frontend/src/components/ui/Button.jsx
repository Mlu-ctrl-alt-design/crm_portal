// UNTITLED UI: Replace with Button component —
//   see untitledui.com/react/components/button

/**
 * src/components/ui/Button.jsx
 * General-purpose button with variant support and loading state.
 *
 * Props:
 *   children  {ReactNode}
 *   variant   {string}   — "primary" | "secondary" | "danger"  (default: "primary")
 *   onClick   {function}
 *   disabled  {boolean}
 *   type      {string}   — "button" | "submit" | "reset"  (default: "button")
 *   isLoading {boolean}  — shows spinner and disables interaction
 */

const variantClasses = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
  secondary:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button",
  isLoading = false,
}) {
  const classes = variantClasses[variant] ?? variantClasses.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${classes}`}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {isLoading ? "Loading…" : children}
    </button>
  );
}
