/**
 * src/components/ui/Badge.jsx
 * Thin wrapper that maps the app's variant API to the Untitled UI Badge component.
 *
 * Props:
 *   label   {string}  — text to display
 *   variant {string}  — "open" | "resolved" | "pending" | "closed"
 */

import { Badge as UUIBadge } from "../base/badges/badges";

const variantToColor = {
    open: "blue",
    resolved: "success",
    pending: "warning",
    closed: "gray",
};

export default function Badge({ label, variant = "open" }) {
    return (
        <UUIBadge color={variantToColor[variant] ?? "gray"} type="pill-color" size="sm">
            {label}
        </UUIBadge>
    );
}
