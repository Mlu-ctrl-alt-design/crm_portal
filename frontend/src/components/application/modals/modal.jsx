"use client";

import {
    Dialog as AriaDialog,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { cx } from "@/utils/cx";

/**
 * Controlled modal that accepts isOpen / onClose props.
 * Wraps React Aria's ModalOverlay + Modal + Dialog with UUI visual styling.
 *
 * Props:
 *   isOpen    boolean
 *   onClose   function
 *   title     string
 *   children  ReactNode
 */
export function ControlledModal({ isOpen, onClose, title, children }) {
    return (
        <AriaModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose?.();
            }}
            className={({ isEntering, isExiting }) =>
                cx(
                    "fixed inset-0 z-50 flex min-h-dvh w-full items-end justify-center overflow-y-auto",
                    "bg-black/50 px-4 pt-4 pb-[clamp(16px,8vh,64px)] outline-hidden backdrop-blur-sm",
                    "sm:items-center sm:justify-center sm:p-8",
                    "transition-opacity duration-200",
                    (isEntering || isExiting) ? "opacity-0" : "opacity-100",
                )
            }
        >
            <AriaModal
                className={({ isEntering, isExiting }) =>
                    cx(
                        "max-h-full w-full max-w-lg outline-hidden",
                        "transition-all duration-200",
                        (isEntering || isExiting) ? "opacity-0 scale-95" : "opacity-100 scale-100",
                    )
                }
            >
                <AriaDialog className="outline-hidden">
                    <div className="w-full rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-200 ring-inset">
                        {/* Header */}
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                            <button
                                onClick={onClose}
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                                aria-label="Close modal"
                            >
                                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Body */}
                        <div>{children}</div>
                    </div>
                </AriaDialog>
            </AriaModal>
        </AriaModalOverlay>
    );
}

ControlledModal.displayName = "ControlledModal";
