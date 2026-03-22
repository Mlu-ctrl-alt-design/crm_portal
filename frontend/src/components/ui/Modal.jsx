/**
 * src/components/ui/Modal.jsx
 * Thin wrapper that delegates to the Untitled UI–styled ControlledModal component.
 *
 * Props:
 *   isOpen   {boolean}
 *   onClose  {function}
 *   title    {string}
 *   children {ReactNode}
 */

import { ControlledModal } from "../application/modals/modal";

export default function Modal({ isOpen, onClose, title, children }) {
    return (
        <ControlledModal isOpen={isOpen} onClose={onClose} title={title}>
            {children}
        </ControlledModal>
    );
}
