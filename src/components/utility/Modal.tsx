import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string; // For additional styling
    overlayClassName?: string;
    contentClassName?: string;
    disableOutsideClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className,
    overlayClassName,
    contentClassName,
    disableOutsideClick = false,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                !disableOutsideClick
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, disableOutsideClick]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null; // Or return null, depending on your preference

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 overflow-y-auto ${overlayClassName}`}
                    style={{
                        // Ensure the modal is at the highest layer, above sidebar (z-40)
                        zIndex: 99999,
                    }}
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative ${contentClassName} ${className}`}
                        style={{
                            // Use a higher z-index for the modal content
                            zIndex: 100000,
                        }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                        >
                            <XCircle className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Render modal to document.body using portal to ensure it's above everything
    if (typeof window !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    
    return modalContent;
};

export default Modal;
