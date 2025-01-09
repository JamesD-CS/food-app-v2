import { CartContext } from "./cart_context";
import React, {useEffect, useState, useContext} from 'react';
import { useNavigate } from "react-router";
import cookies from 'js-cookie';
import { Category, Menu_item, Order } from './app_types';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL;

const Checkout: React.FC = ({}) => {

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');
    const [menu_items, setMenuItems]= useState<Menu_item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [modalMessage, setModalMessage] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const  cartContext = useContext(CartContext);
    const [orderSuccess, setOrderSuccess] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        let items = cartContext?.getCartItems

        setMenuItems(items!);
        console.log("cart items:", cartContext?.getCartItems())
    })


  const onModalClose = () =>{
    setIsModalOpen(false)
    if(orderSuccess){
    navigate('/profile', { replace: true });
    }
  }

  const placeOrderSucess = ((order_success:boolean) =>{
    if(order_success){
      setModalMessage("Order Placed");
      setOrderSuccess(true)
      setIsModalOpen(true)
    }else{
      setModalMessage("Error Placing Order")
      setOrderSuccess(false)
      setIsModalOpen(true)
    }

  })

    const checkout = () => {
        //Do checkout stuff here
        if(!token){
          alert("you are not logged in");
          return
        }
        let cart_items = cartContext?.getCartItems(); 
        let order_items = cart_items!.map((item) =>(
          {
          menu_item_id:item.id,
          quantity: item.quantity
          }

        ))

        console.log("order items:", order_items);
        let order:Order = {
          restaurant_id:Number(cartContext?.getStoreId()),
          delivery_address_id: Number(cartContext?.getAddress()?.id),
          menu_items: order_items
        }

        let order_url = apiUrl + '/orders'

        console.log("token:", token);
        let order_body =JSON.stringify(order);
        const requestOptions = {
          method: 'POST',
          headers: { 
              'Authorization': 'Bearer '+ token,
              'Content-Type': 'application/json',
          },
          body:order_body
        };
        console.log("order :", order_body)
        fetch(order_url, requestOptions).then((response) => {
          if(!response.ok) throw new Error(response.status.toString() );
          else return response.json();
        })
        .then((order_response) => {
          console.log("Order response:", order_response);
          placeOrderSucess(true)
          cartContext?.clearCart();
          
        })
        .catch((error) => {
          placeOrderSucess(false)
          console.log('error: ' + error);
        });
        /*
        {
          "restaurant_id": 1,
          "delivery_address_id": 8,
          "menu_items": [
          {
            "menu_item_id": 3,
            "quantity": 3
          },
          {
            "menu_item_id":2,
            "quantity":2
          }
          //More Items
        ]
        } */
    }

    return(
        <>
        <FadeOutModal
          isOpen={isModalOpen}
          onClose={() => onModalClose()}
          showDuration={500}  // Wait (x)ms before starting fade
          fadeDuration={200}   // 0.5s fade-out transition
        >
          <p>{modalMessage}</p>
      </FadeOutModal>
         <table className="modal-content">
                  <thead>
                    <tr>
                        <th colSpan={4}> Cart </th>
                    </tr>
                    <tr>
                      {/* Example header row. Adjust columns as needed */}
                      <th style={{ textAlign: "left" }}>Item</th>
                      <th style={{ textAlign: "left" }}>Description</th>
                      <th style={{ textAlign: "left" }}>Price</th>
                      <th style={{ textAlign: "left" }}>Available</th>
                      <th style={{ textAlign: "left" }}>Quantity</th>
                      <th style={{ textAlign: "left" }}>Subtotal</th>


                    </tr>
                  </thead>
                  <tbody>
                        {menu_items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>${item.price}</td>
                            <td>{item.is_available ? "Yes" : "No"}</td>
                            <td>{item.quantity}</td>
                            <td>${Number(item.quantity) * Number(item.price)}</td>
                          </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td  ><b>Total:</b></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td  >${cartContext?.getCartTotal()}</td>
                        </tr>
                  </tbody>
                </table>
        <button onClick={()=>navigate('/profile', { replace: true })
}>Close</button>
        <button onClick={checkout}>Place Order</button>


        </>
    )

}

export default Checkout;