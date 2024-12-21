import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  isFadingOut: boolean;
  onTransitionEnd: () => void;
}

export const MessageModal: React.FC<ModalProps> = ({ children, isFadingOut, onTransitionEnd }) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    // If no modal-root is found, return null or handle it gracefully.
    return null;
  }

  // The inline styles are adjusted to use a CSS class for transitions.
  // We'll rely on a className that toggles for the fade-out effect.
  return createPortal(
    <div 
      className={`modal-overlay ${isFadingOut ? 'fade-out' : ''}`}
      onTransitionEnd={onTransitionEnd}
    >
      <div className="modal-content">
        {children}
      </div>
    </div>,
    modalRoot
  );
};

