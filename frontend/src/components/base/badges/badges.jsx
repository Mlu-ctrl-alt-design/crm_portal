"use client";

import { cx } from "@/utils/cx";

// Colour palette for each badge colour token.
// Each entry has classes for root (bg + text + ring), dot/addon text, and hover button.
const colorMap = {
    gray: {
        root: "bg-utility-gray-50 text-utility-gray-700 ring-utility-gray-200",
        dot: "text-utility-gray-500",
        btn: "hover:bg-utility-gray-100 text-utility-gray-400 hover:text-utility-gray-500",
    },
    brand: {
        root: "bg-utility-brand-50 text-utility-brand-700 ring-utility-brand-200",
        dot: "text-utility-brand-500",
        btn: "hover:bg-utility-brand-100 text-utility-brand-400 hover:text-utility-brand-500",
    },
    error: {
        root: "bg-utility-error-50 text-utility-error-700 ring-utility-error-200",
        dot: "text-utility-error-500",
        btn: "hover:bg-utility-error-100 text-utility-error-400 hover:text-utility-error-500",
    },
    warning: {
        root: "bg-utility-warning-50 text-utility-warning-700 ring-utility-warning-200",
        dot: "text-utility-warning-500",
        btn: "hover:bg-utility-warning-100 text-utility-warning-400 hover:text-utility-warning-500",
    },
    success: {
        root: "bg-utility-success-50 text-utility-success-700 ring-utility-success-200",
        dot: "text-utility-success-500",
        btn: "hover:bg-utility-success-100 text-utility-success-400 hover:text-utility-success-500",
    },
    "gray-blue": {
        root: "bg-utility-gray-blue-50 text-utility-gray-blue-700 ring-utility-gray-blue-200",
        dot: "text-utility-gray-blue-500",
        btn: "hover:bg-utility-gray-blue-100 text-utility-gray-blue-400 hover:text-utility-gray-blue-500",
    },
    "blue-light": {
        root: "bg-utility-blue-light-50 text-utility-blue-light-700 ring-utility-blue-light-200",
        dot: "text-utility-blue-light-500",
        btn: "hover:bg-utility-blue-light-100 text-utility-blue-light-400 hover:text-utility-blue-light-500",
    },
    blue: {
        root: "bg-utility-blue-50 text-utility-blue-700 ring-utility-blue-200",
        dot: "text-utility-blue-500",
        btn: "hover:bg-utility-blue-100 text-utility-blue-400 hover:text-utility-blue-500",
    },
    indigo: {
        root: "bg-utility-indigo-50 text-utility-indigo-700 ring-utility-indigo-200",
        dot: "text-utility-indigo-500",
        btn: "hover:bg-utility-indigo-100 text-utility-indigo-400 hover:text-utility-indigo-500",
    },
    purple: {
        root: "bg-utility-purple-50 text-utility-purple-700 ring-utility-purple-200",
        dot: "text-utility-purple-500",
        btn: "hover:bg-utility-purple-100 text-utility-purple-400 hover:text-utility-purple-500",
    },
    pink: {
        root: "bg-utility-pink-50 text-utility-pink-700 ring-utility-pink-200",
        dot: "text-utility-pink-500",
        btn: "hover:bg-utility-pink-100 text-utility-pink-400 hover:text-utility-pink-500",
    },
    orange: {
        root: "bg-utility-orange-50 text-utility-orange-700 ring-utility-orange-200",
        dot: "text-utility-orange-500",
        btn: "hover:bg-utility-orange-100 text-utility-orange-400 hover:text-utility-orange-500",
    },
};

const pillSizes = {
    sm: "py-0.5 px-2 text-xs font-medium",
    md: "py-0.5 px-2.5 text-sm font-medium",
    lg: "py-1 px-3 text-sm font-medium",
};

const badgeSizes = {
    sm: "py-0.5 px-1.5 text-xs font-medium",
    md: "py-0.5 px-2 text-sm font-medium",
    lg: "py-1 px-2.5 text-sm font-medium",
};

/**
 * Badge component matching the Untitled UI design system.
 *
 * Props:
 *   type     "pill-color" | "color" | "modern"  (default: "pill-color")
 *   size     "sm" | "md" | "lg"                 (default: "md")
 *   color    BadgeColors                         (default: "gray")
 *   children ReactNode
 *   className string
 */
export function Badge({ type = "pill-color", size = "md", color = "gray", children, className }) {
    const colors = colorMap[color] ?? colorMap.gray;

    const baseClasses = {
        "pill-color": "inline-flex items-center whitespace-nowrap rounded-full ring-1 ring-inset",
        color: "inline-flex items-center whitespace-nowrap rounded-md ring-1 ring-inset",
        modern: "inline-flex items-center whitespace-nowrap rounded-md ring-1 ring-inset shadow-xs bg-white text-gray-700 ring-gray-200",
    };

    const sizeClasses = type === "pill-color" ? pillSizes : badgeSizes;

    return (
        <span
            className={cx(
                baseClasses[type] ?? baseClasses["pill-color"],
                sizeClasses[size] ?? sizeClasses.md,
                type !== "modern" && colors.root,
                className,
            )}
        >
            {children}
        </span>
    );
}

Badge.displayName = "Badge";
