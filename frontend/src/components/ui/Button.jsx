/**
 * src/components/ui/Button.jsx
 * Thin wrapper that maps the app's variant API to the Untitled UI Button component.
 *
 * Props:
 *   children  {ReactNode}
 *   variant   {string}   — "primary" | "secondary" | "danger"  (default: "primary")
 *   onClick   {function}
 *   disabled  {boolean}
 *   type      {string}   — "button" | "submit" | "reset"       (default: "button")
 *   isLoading {boolean}  — shows spinner and disables interaction
 */

import { Button as UUIButton } from "../base/buttons/button";

const variantToColor = {
    primary: "primary",
    secondary: "secondary",
    danger: "primary-destructive",
};

export default function Button({
    children,
    variant = "primary",
    onClick,
    disabled = false,
    type = "button",
    isLoading = false,
}) {
    return (
        <UUIButton
            color={variantToColor[variant] ?? "primary"}
            isDisabled={disabled || isLoading}
            isLoading={isLoading}
            type={type}
            onPress={onClick}
        >
            {children}
        </UUIButton>
    );
}
