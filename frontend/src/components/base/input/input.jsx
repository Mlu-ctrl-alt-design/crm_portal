"use client";

import {
    Input as AriaInput,
    TextField as AriaTextField,
} from "react-aria-components";
import { cx } from "@/utils/cx";

/**
 * Untitled UI–styled input with label and error message.
 *
 * Props:
 *   label       string
 *   name        string
 *   type        string     (default: "text")
 *   value       string
 *   onChange    function   — called with a DOM-like synthetic event { target: { name, value } }
 *   error       string     — displays below the input when provided
 *   placeholder string
 *   readOnly    boolean
 *   required    boolean
 *   size        "sm" | "md" (default: "sm")
 *   className   string
 */
export function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    readOnly = false,
    required = false,
    size = "sm",
    className,
}) {
    const handleChange = (val) => {
        onChange?.({ target: { name, value: val } });
    };

    return (
        <AriaTextField
            name={name}
            value={value}
            onChange={handleChange}
            isRequired={required}
            isReadOnly={readOnly}
            isInvalid={!!error}
            className={cx("flex flex-col gap-1.5", className)}
        >
            {({ isRequired, isInvalid }) => (
                <>
                    {label && (
                        <label
                            htmlFor={name}
                            className="text-sm font-medium text-gray-700"
                        >
                            {label}
                            {isRequired && (
                                <span className="ml-0.5 text-error-600" aria-hidden="true">
                                    *
                                </span>
                            )}
                        </label>
                    )}

                    <div
                        className={cx(
                            "relative flex w-full rounded-lg bg-white shadow-xs",
                            "ring-1 ring-inset ring-gray-300",
                            "transition-shadow duration-100 ease-linear",
                            "focus-within:ring-2 focus-within:ring-brand-500",
                            readOnly && "cursor-not-allowed bg-gray-50 ring-gray-200",
                            isInvalid && "ring-error-400",
                            isInvalid && "focus-within:ring-2 focus-within:ring-error-500",
                        )}
                    >
                        <AriaInput
                            id={name}
                            type={type}
                            placeholder={placeholder}
                            className={cx(
                                "w-full bg-transparent outline-none",
                                "text-sm text-gray-900 placeholder:text-gray-500",
                                size === "md" ? "px-3.5 py-2.5" : "px-3 py-2",
                                readOnly && "cursor-not-allowed text-gray-500",
                            )}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-error-600">{error}</p>
                    )}
                </>
            )}
        </AriaTextField>
    );
}

Input.displayName = "Input";
