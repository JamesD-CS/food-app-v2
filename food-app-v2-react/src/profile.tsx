import React, {useEffect, useState, useContext} from 'react';
import { CartContext } from './cart_context';
import { createPortal } from 'react-dom';
import cookies from 'js-cookie';
import { Address, Order } from './app_types';
import { AddressModal } from './address_modal';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component

const apiUrl = import.meta.env.VITE_API_URL;

interface APProps {
  div_id:string
  address:Address | null
}

interface orderTableProps {
  orders:Order[]
}

const UserOrderTable: React.FC<orderTableProps> = ({ orders }) => {

  if (!Array.isArray(orders)) {
    return <div>No data available</div>;
  }
  
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th colSpan={5}>
            Your Orders
          </th>
        </tr>
        <tr>
          <th >Order ID</th>
          <th >Order Status</th>
          <th >Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
         
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.order_status}</td>
            <td>{order.total_amount}</td>
          </tr>
          
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
    const [address, setAddress]= useState<Address[]>([]);
    const [orders, serOrders] = useState<Order[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const  cartContext = useContext(CartContext);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [selectedAddress, setSelectedAddress] = useState<Address>()

    const getAddresses = () => {

      const requestOptions = {
        method: 'GET',
        headers: { 
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json',
            'Accept':'*/*'
        },
        
      };
      console.log("request options:", requestOptions.headers)
      console.log('fetching items');
      //fetch categories
      fetch(apiUrl + '/addresses/', requestOptions).then((response) => {
        if(!response.ok) throw new Error(response.status.toString() );
        else return response.json();
      })
      .then((address_response) => {
        console.log("Addresses:", address_response.addresses);
        setAddress(address_response.addresses);
      })
      .catch((error) => {
        console.log('error: ' + error);
      });

    }

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
    
    const onFadeModalClose = () =>{
      setIsModalOpen(false);
      getAddresses();
    }

    const AddressPortal:React.FC<APProps> = ({ div_id , address }) => {
   
    const [showModal, setShowModal] = useState(false);
    const modalClose = () => {
      setShowModal(false)
    };
  
    const onModalSubmit = () =>{
      setShowModal(false)
      window.location.reload();
    }

    let buttonText = (address? "Edit Address": "Add New Address")
    return (
      <>
        {!showModal &&
        <button onClick={() => setShowModal(true)}>
          {buttonText}
        </button>
        }
        {showModal && createPortal(
          <AddressModal onClose={modalClose} onSubmit={onModalSubmit} address = {address} div_id={div_id}/>,
          document.getElementById(div_id)!
        )}
      </>
    );
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
      setSelectedAddress(delivery_address)
    }

    const deleteAddress = (async (event:React.MouseEvent<HTMLButtonElement>) =>{
      console.log("target id is:", event.currentTarget.id)
      let address_id = event.currentTarget.id;

      const deleteAddRequestOptions = {
        method: 'DELETE',
        headers: { 
          'Authorization': 'Bearer '+ token,
          'Content-Type': 'application/json',
          'Accept':'*/*'
      },
      }

      let reqUrl = apiUrl + '/addresses/' + address_id;
        
        try{
          const delete_response = await fetch(reqUrl, deleteAddRequestOptions);

          if(delete_response.status == 204){
            console.log("delete success")
            setDeleteMessage( "Address Deleted");
            setIsModalOpen(true);

          }else{
            console.log("error deleting")
            setDeleteMessage( "Error Deleting Message");
            setIsModalOpen(true);
          }

        }catch(error){
          console.log(error);

        }

    })

    useEffect(() =>{
        getAddresses();
        getOrders();
        setDeliveryAddress(cartContext?.getAddress()!)
    }, [])

    return(
        <>
        <div id = "address_modal_root">
        <FadeOutModal
          isOpen={isModalOpen}
          onClose={() => onFadeModalClose()}
          showDuration={500}  // Wait (x)ms before starting fade
          fadeDuration={200}   // 0.5s fade-out transition
        >
          <p>{deleteMessage}</p>
      </FadeOutModal>
        <br />
        User name:{user_name}
        <br />
        email:{email}
        <br />
        user_id:{user_id}
        <br />
        logged in?:{cartContext?.getIsLoggedIn().toString()}
        <br />
        Current Delivery Address:{String(cartContext?.getAddress()?.street)}
        <button onClick={clearCookie}>
          Clear Cookies
        </button>
        <br />
        <table style={{ borderCollapse: "collapse", width: "100%" }} className="card-view">
      <thead>
        <tr>
          <th colSpan={5}>
          </th>
        </tr>
        <tr>
          <th >ID</th>
          <th >Street</th>
          <th >City</th>
          <th >State</th>
          <th >Postal Code</th>
          <th >Country</th>
          
        </tr>
      </thead>
      <tbody>
        
        {address?.map((address) => (
         
          <tr key={address.id} >
            <td >{address.id}</td>
            <td > {address.street}</td>
            <td >{address.city}</td>
            <td >{address.state}</td>
            <td >{address.postal_code}</td>
            <td >{address.country}</td>
            <td id = {String(address.id)} colSpan={6}> <AddressPortal address={address} div_id = {String(address.id)}  />
            </td>
            <td><button id = {String(address.id)} onClick={deleteAddress}>Delete Address</button></td>
            <td><button id = {String(address.id)+"-set_delivery"} onClick={() => setDeliveryAddress( address)}>{(address==selectedAddress)?"Current Delivery Address":"Set Delivery Address"}</button></td>

            
          </tr>
        ))}
        <tr> 
          <td colSpan={6} id = {"add_new_div"}>
          <AddressPortal address={null} div_id = {"add_new_div"}  />
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <UserOrderTable orders={orders}/>
        </>
    )

}

export default ProfileComponent