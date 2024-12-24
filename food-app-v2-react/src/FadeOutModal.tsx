import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface FadeOutModalProps {
  /** Controls whether the modal is currently open. */
  isOpen: boolean;
  /** Callback to run when the modal has fully closed (after fade-out). */
  onClose: () => void;
  /** Content of the modal. */
  children: React.ReactNode;
  /** How long (in ms) to wait before starting the fade-out. Default is 2000ms (2s). */
  showDuration?: number;
  /** How long (in ms) the fade-out transition should last. Default is 500ms. */
  fadeDuration?: number;
}

const FadeOutModal: React.FC<FadeOutModalProps> = ({
  isOpen,
  onClose,
  children,
  showDuration = 2000,
  fadeDuration = 500,
}) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // When the modal first opens, ensure we’re fully visible.
      setInternalOpen(true);
      setIsFadingOut(false);

      // After `showDuration` ms, trigger the fade-out animation.
      const timer = setTimeout(() => {
        setIsFadingOut(true);
      }, showDuration);

      // Cleanup any pending timer if the modal closes early.
      return () => clearTimeout(timer);
    } else {
      // If the parent sets `isOpen` to false, close the modal immediately.
      setInternalOpen(false);
    }
  }, [isOpen, showDuration]);

  const handleTransitionEnd = () => {
    if (isFadingOut) {
      // Once the fade-out transition finishes, call `onClose` to fully remove the modal.
      onClose();
    }
  };

  // Portal target
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  // If the modal is not open internally, render nothing.
  if (!internalOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`modal-overlay ${isFadingOut ? 'fade-out' : ''}`}
      
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className="modal-content"
        
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default FadeOutModal;
