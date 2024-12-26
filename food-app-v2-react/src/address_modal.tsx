import React from 'react';
import AddAddress from './add_address';
import { Address } from './app_types';
import './App.css';

interface AdModalProps {
    address: Address | null
    div_id: string
    onClose: () => void
    onSubmit: () => void
}

export const AddressModal: React.FC<AdModalProps> = ({ address,div_id, onClose, onSubmit  })  =>{
   
    return (
      <div className="Address-Modal">
        
        <AddAddress address = {address} div_id = {div_id}  onClose = {onClose} onSubmit={onSubmit}/>

      </div>
    );
  }