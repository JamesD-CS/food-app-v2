import React from 'react';
import './App.css';
import  CartView  from './cart_view';

interface CartModalProps {
    onClose: () => void
    onSubmit: () => void
}

export const CartViewModal: React.FC<CartModalProps> = ({onClose, onSubmit})  =>{
   
    return (
      <div className="Cart-Modal">
        <CartView onClose = {onClose} onSubmit = {onSubmit}></CartView>
      </div>
    );
  }