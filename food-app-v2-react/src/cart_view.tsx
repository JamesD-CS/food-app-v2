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
         <table className="modal-content">
                  <thead>
                    <tr>
                        <th colSpan={4}> Cart </th>
                    </tr>
                    <tr>
                      {/* Example header row. Adjust columns as needed */}
                      <th style={{ textAlign: "left" }}>Name</th>
                      <th style={{ textAlign: "left" }}>Description</th>
                      <th style={{ textAlign: "left" }}>Price</th>
                      <th style={{ textAlign: "left" }}>Available</th>
                      <th style={{ textAlign: "left" }}>Quantity</th>

                    </tr>
                  </thead>
                  <tbody>
                        {menu_items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td>{item.is_available ? "Yes" : "No"}</td>
                            <td>{item.quantity}</td>
                            <td><button onClick={()=>increaseQuantity(item.id!)}>+</button> <button onClick={()=>decreaseQuantity(item.id!)}>-</button></td>
                            <td><button onClick={() => removeItems(item.id!)}>Remove</button></td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={8}> <button onClick={onClose}>Close</button>
                          <button onClick={checkoutClick}>Checkout</button></td>
                        </tr>
                  </tbody>
                </table>
       
        </>
    )

}

export default CartView;