import React,  { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { AddressBookComponent } from './address_book';
import { Address } from './app_types';
import './App.css';

interface AdModalProps {
    /** Controls whether the modal is currently open. */
     isOpen: boolean;
     /** Callback to run when the modal has fully closed (after fade-out). */
     address:Address | null;
     onClose:() => void;
    
}

export const AddressModal: React.FC<AdModalProps> = ({ isOpen, address, onClose  })  =>{
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
        <AddressBookComponent onClose={onClose}/>

        </div>
      </div>,
      modalRoot
    );
   
  }