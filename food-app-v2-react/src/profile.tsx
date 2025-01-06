import React, {useEffect, useState, useContext} from 'react';
import { CartContext } from './cart_context';
import { createPortal } from 'react-dom';
import cookies from 'js-cookie';
import { Address, Order } from './app_types';
import { AddressModal } from './address_modal';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import { useNavigate } from 'react-router';

const apiUrl = import.meta.env.VITE_API_URL;

interface addressTableProps {
  delivery_address:Address | null | undefined
}

interface orderTableProps {
  orders:Order[]
}

export const AddressTable: React.FC<addressTableProps> = ({delivery_address}) => {

  if ((!delivery_address)) {
    return <div>No data available</div>;
  }
  
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th colSpan={3}>
            Delivery Address
          </th>
        </tr>
        <tr>
          <th >Street</th>
          <th >City</th>
          <th >State</th>

        </tr>
      </thead>
      <tbody>
      
          <tr key={delivery_address.id}>
            <td>{delivery_address.street}</td>
            <td>{delivery_address.city}</td>
            <td>{delivery_address.state}</td>
          </tr>
        
      </tbody>
    </table>
  );

};


const UserOrderTable: React.FC<orderTableProps> = ({ orders }) => {

  if (!Array.isArray(orders)) {
    return <div>No data available</div>;
  }
  
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr key="order_table_title">
          <th colSpan={5}>
            Your Orders
          </th>
        </tr>
        <tr key="order_header">
          <th >Order ID</th>
          <th >Order Status</th>
          <th >Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
         <>
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.order_status}</td>
            <td>{order.total_amount}</td>
          </tr>
        </>
        ))}
      </tbody>
    </table>
  );

};

const ProfileComponent: React.FC = () => {

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const user_id = cookies.get('id');
    const email= cookies.get('email');
    const [orders, serOrders] = useState<Order[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const  cartContext = useContext(CartContext);
    const navigate = useNavigate();
   

    const getOrders = () => {
      const fetchOrderUrl = apiUrl + '/orders';

      const requestOptions = {
        method: 'GET',
        headers: { 
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json',
            'Accept':'*/*'
        }, 
      };

      fetch(fetchOrderUrl, requestOptions).then((response) => {
        if(!response.ok) throw new Error(response.status.toString() );
        else return response.json();
      })
      .then((get_order_response) => {
        console.log("order:", get_order_response.orders);
        serOrders(get_order_response.orders);
      })
      .catch((error) => {
        console.log('error: ' + error);
      });



    }

    const closeModal = () => {
      setIsModalOpen(false)
    }
    
    if(!token){
      return(<>
      You Are Not Logged In
      </>)
    }
    
    const clearCookie = (() => {
      cookies.remove('token');
      cookies.remove('user_name');
      cookies.remove('id');
      cookies.remove('email');
      cookies.remove('phone_number');
      window.location.reload();

    })

    const setDeliveryAddress = ( delivery_address:Address) =>{
      cartContext?.setAddress(delivery_address);
    }

    const getDeliveryAddress = () => {
      return cartContext?.getAddress()!.id;
    }

    
    useEffect(() =>{
        getOrders();
        setDeliveryAddress(cartContext?.getAddress()!)
    }, [])

    return(
        <>
        <div id = "address_modal_root" className="page-content">
        <AddressModal
          isOpen={isModalOpen}
          onClose={closeModal}
          address={null}
        >
      </AddressModal>
        <br />
        User name:{user_name}
        <br />
        email:{email}
        <br />
        user_id:{user_id}
        <br />
        logged in?:{cartContext?.getIsLoggedIn().toString()}
        <br />
        <AddressTable delivery_address={cartContext?.getAddress()}></AddressTable>
        <button onClick={() =>{setIsModalOpen(true)}}>Change</button>

        <br />
        <button onClick={clearCookie}>
          Clear Cookies
        </button>
        <br />
        
    </div>
    <UserOrderTable orders={orders}/>
        </>
    )

}

export default ProfileComponent