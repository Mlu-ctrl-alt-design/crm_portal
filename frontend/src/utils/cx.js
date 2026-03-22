import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            text: ["display-xs", "display-sm", "display-md", "display-lg", "display-xl", "display-2xl"],
        },
    },
});

/**
 * Wrapper around tailwind-merge.
 * Merges class names, deduplicating conflicting Tailwind classes.
 */
export const cx = twMerge;

/**
 * Identity helper that lets Tailwind IntelliSense sort classes
 * inside sortCx() object literals.
 */
export function sortCx(classes) {
    return classes;
}
