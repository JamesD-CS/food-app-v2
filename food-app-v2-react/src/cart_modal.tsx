import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import  CartView  from './cart_view';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void
}

export const CartViewModal: React.FC<CartModalProps> = ({onClose, isOpen})  =>{
    const [internalOpen, setInternalOpen] = useState(isOpen);
   
    useEffect(() => {
          if (isOpen) {
            // When the modal first opens, ensure we’re fully visible.
            setInternalOpen(true);
      
          } else {
            // If the parent sets `isOpen` to false, close the modal immediately.
            setInternalOpen(false);
          }
        }, [isOpen]);
      
    
      const modalRoot = document.getElementById('modal-root');
        if (!modalRoot) return null;
      
        // If the modal is not open internally, render nothing.
        if (!internalOpen) return null;
      
        return ReactDOM.createPortal(
          <div
            className={`modal-overlay `}>
            <div
              className="modal-content"
              
            >
            <CartView onClose={onClose} />
    
            </div>
          </div>,
          modalRoot
        );
  }