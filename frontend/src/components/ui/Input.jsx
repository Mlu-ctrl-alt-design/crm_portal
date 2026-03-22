// UNTITLED UI: Replace with Input component —
//   see untitledui.com/react/components/input

/**
 * src/components/ui/Input.jsx
 * Labeled form input with error message support.
 *
 * Props:
 *   label       {string}
 *   name        {string}
 *   type        {string}   — default "text"
 *   value       {string}
 *   onChange    {function}
 *   error       {string}   — displays below input when provided
 *   placeholder {string}
 *   readOnly    {boolean}
 *   required    {boolean}
 */

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  readOnly = false,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        className={[
          "rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
          readOnly
            ? "cursor-not-allowed bg-gray-50 text-gray-500"
            : "bg-white text-gray-900",
          error ? "border-red-400" : "border-gray-300",
        ].join(" ")}
      />
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
