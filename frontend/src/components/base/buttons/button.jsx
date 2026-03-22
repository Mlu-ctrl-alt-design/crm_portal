"use client";

import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { cx } from "@/utils/cx";

// ── Size styles ──────────────────────────────────────────────────────────────

const sizeStyles = {
    sm: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
    md: "h-10 px-4 text-sm gap-2 rounded-lg",
    lg: "h-11 px-[18px] text-md gap-2 rounded-lg",
    xl: "h-12 px-5 text-md gap-2.5 rounded-lg",
};

// ── Colour styles ────────────────────────────────────────────────────────────

const colorStyles = {
    primary: [
        "bg-brand-600 text-white shadow-xs-skeumorphic",
        "hover:bg-brand-700",
        "pressed:bg-brand-700",
        "disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none",
    ].join(" "),

    secondary: [
        "bg-white text-gray-700 shadow-xs ring-1 ring-inset ring-gray-300",
        "hover:bg-gray-50 hover:text-gray-800",
        "pressed:bg-gray-50",
        "disabled:bg-white disabled:text-gray-300 disabled:ring-gray-200 disabled:shadow-none",
    ].join(" "),

    tertiary: [
        "text-gray-600",
        "hover:bg-gray-50 hover:text-gray-700",
        "pressed:bg-gray-50",
        "disabled:text-gray-300",
    ].join(" "),

    "primary-destructive": [
        "bg-error-600 text-white shadow-xs-skeumorphic",
        "hover:bg-error-700",
        "pressed:bg-error-700",
        "disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none",
    ].join(" "),

    "secondary-destructive": [
        "bg-white text-error-600 shadow-xs ring-1 ring-inset ring-gray-300",
        "hover:bg-error-50 hover:text-error-700 hover:ring-error-300",
        "disabled:bg-white disabled:text-gray-300 disabled:shadow-none",
    ].join(" "),

    "tertiary-destructive": [
        "text-error-600",
        "hover:bg-error-50 hover:text-error-700",
        "disabled:text-gray-300",
    ].join(" "),
};

// ── Spinner SVG ──────────────────────────────────────────────────────────────

function Spinner() {
    return (
        <svg
            className="size-4 animate-spin shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962
                   7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
}

// ── Button component ─────────────────────────────────────────────────────────

/**
 * Untitled UI–styled button component.
 *
 * Props:
 *   size          "sm" | "md" | "lg" | "xl"                   (default: "sm")
 *   color         "primary" | "secondary" | "tertiary" |
 *                 "primary-destructive" | "secondary-destructive" |
 *                 "tertiary-destructive"                       (default: "primary")
 *   isDisabled    boolean
 *   isLoading     boolean   — shows spinner, disables interaction
 *   iconLeading   ComponentType
 *   iconTrailing  ComponentType
 *   href          string    — renders as <a> when provided
 *   children      ReactNode
 *   className     string | function
 */
export function Button({
    size = "sm",
    color = "primary",
    children,
    className,
    isDisabled,
    isLoading,
    iconLeading: IconLeading,
    iconTrailing: IconTrailing,
    href,
    ...props
}) {
    const Component = href ? AriaLink : AriaButton;
    const componentProps = href ? { href } : {};

    return (
        <Component
            {...props}
            {...componentProps}
            isDisabled={isDisabled || isLoading}
            isPending={isLoading}
            className={(state) =>
                cx(
                    "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-semibold",
                    "outline-none transition duration-100 ease-linear",
                    "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                    sizeStyles[size] ?? sizeStyles.sm,
                    colorStyles[color] ?? colorStyles.primary,
                    (state.isDisabled) && "cursor-not-allowed",
                    isLoading && !state.isDisabled && "cursor-wait",
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {isLoading ? (
                <Spinner />
            ) : (
                IconLeading && <IconLeading className="size-5 shrink-0" aria-hidden="true" />
            )}
            {children && <span>{children}</span>}
            {IconTrailing && !isLoading && (
                <IconTrailing className="size-5 shrink-0" aria-hidden="true" />
            )}
        </Component>
    );
}

Button.displayName = "Button";
