/**
 * src/components/ui/Input.jsx
 * Thin wrapper that delegates to the Untitled UI–styled Input component.
 *
 * Props:
 *   label       {string}
 *   name        {string}
 *   type        {string}   — default "text"
 *   value       {string}
 *   onChange    {function} — receives a DOM-like synthetic event { target: { name, value } }
 *   error       {string}   — displays below input when provided
 *   placeholder {string}
 *   readOnly    {boolean}
 *   required    {boolean}
 */

import { Input as UUIInput } from "../base/input/input";

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
        <UUIInput
            label={label}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            error={error}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
        />
    );
}
