import React,  { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Address } from './app_types';
import AddressForm from './add_address';
import './App.css';

interface NewAddressModalProps {
    /** Controls whether the modal is currently open. */
     isOpen: boolean;
     /** Callback to run when the modal has fully closed (after fade-out). */
     address:Address | null;
     onClose:() => void;
    
}

export const NewAddressModal: React.FC<NewAddressModalProps> = ({ isOpen, address, onClose  })  =>{
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
        <AddressForm onClose={onClose}  address={address}/>

        </div>
      </div>,
      modalRoot
    );
   
  }