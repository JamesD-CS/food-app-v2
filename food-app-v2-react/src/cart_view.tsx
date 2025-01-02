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
    onSubmit: () => void
}

const CartView: React.FC<CartViewProps> = ({onClose, onSubmit}) => {

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');
    const [menu_items, setMenuItems]= useState<Menu_item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const  cartContext = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        let items = cartContext?.getCartItems

        setMenuItems(items!);
        
    })

    const checkoutClick = ()=>{
      navigate('/checkout', { replace: true });

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

                          </tr>
                        ))}
                  </tbody>
                </table>
        <button onClick={onClose}>Close</button>
        <button onClick={checkoutClick}>Checkout</button>


        </>
    )

}

export default CartView;