import { CartContext } from "./cart_context";
import React, {useEffect, useState, useContext} from 'react';
import { useNavigate } from "react-router";
import cookies from 'js-cookie';
import { Category, Menu_item } from './app_types';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL;

interface CartViewProps {
    onClose: () => void
}

const CartView: React.FC<CartViewProps> = ({onClose}) => {

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');
    const [menu_items, setMenuItems]= useState<Menu_item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const  cartContext = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
      const items = cartContext?.getCartItems;
      setMenuItems(items ?? []);
        
    }, [cartContext])

    const checkoutClick = ()=>{
      navigate('/checkout', { replace: true });

    }

    const increaseQuantity = (itemId:number) =>{
      let updated_quantity = cartContext?.updateQuantity(itemId, 1)
      console.log("updated quantity of itemid", itemId, " is", updated_quantity)
    }

    const decreaseQuantity = (itemId:number) => {
      let updated_quantity = cartContext?.updateQuantity(itemId, -1)
      console.log("updated quantity of itemid", itemId, " is", updated_quantity)
      if (updated_quantity! <= 0){
        cartContext?.removeItem(itemId);
      }
      
    }

    const removeItems = (itemId:number) => {
      cartContext?.removeItem(itemId);
    }

    if(cartContext?.getItemCount()==0){
      return(
        <>
        <div className="modal-content">
          <h2>Your Cart is Empty</h2>
          <button onClick={onClose}>Close</button>
        </div>
        </>
      )
    }

    return(
        <>
         <div className="cart-items-grid">
            {menu_items.map(item => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-header">{item.name}</div>
                <div className="cart-item-details">Price: {item.price}</div>
                <div className="cart-item-details">Available: {item.is_available ? 'Yes' : 'No'}</div>
                <div className="cart-item-details">
                  <div className="quantity-div">
                  <button onClick={() => increaseQuantity(item.id!)}>+</button>
                  <span>{item.quantity}</span>
                  <button onClick={()  => decreaseQuantity(item.id!)}>-</button>
                  <button onClick={() => removeItems(item.id!)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
         </div>
         <button onClick={onClose}>Close</button>
         <button onClick={checkoutClick}>Checkout</button>
        </>
    )

}

export default CartView;