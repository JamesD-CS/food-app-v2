import React, {useEffect, useState, useContext} from 'react';
import { CartContext } from './cart_context';
import cookies from 'js-cookie';
import { Address, Order, Restaurant } from './app_types';
import { AddressModal } from './address_modal';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import { getRestData } from './restaurants';

const apiUrl = import.meta.env.VITE_API_URL;

interface addressTableProps {
  delivery_address:Address | null | undefined
}

interface orderTableProps {
  orders:Order[]
  rest_data:Restaurant[] | undefined | null
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


const UserOrderTable: React.FC<orderTableProps> = ({ orders, rest_data }) => {

  if (!Array.isArray(orders) || !rest_data) {
    return <div>No data available</div>;
  }
  
  const restnameMap = new Map(rest_data.map(rest => [rest.id, rest.name]));

  const namedOrders = orders.map(order => ({
    ...order,
    name: restnameMap.get(order.restaurant_id!)
  }));

  console.log("rest names", namedOrders)
  
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
          <th>Restaurant</th>
          <th >Order Status</th>
          <th >Total</th>
        </tr>
      </thead>
      <tbody>
        {namedOrders.map((order) => (
         <>
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.name}</td>
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
    const [restData, setRestData] = useState<Restaurant[]>([])
    const [deliveryAddress, setDeliveryAddressState] = useState<Address>();
    const  cartContext = useContext(CartContext);

    //let rest_data = cartContext?.getRestaurants()!;

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
      setDeliveryAddressState(delivery_address);
    }

    const getDeliveryAddress = () => {
      return cartContext?.getAddress()!.id;
    }

    
    useEffect(() =>{
        getOrders();
        setDeliveryAddress(cartContext?.getAddress()!)
        console.log("rest data is:", restData)
        if(restData.length == 0){
          console.log("Restaurant data not in local storage, fetching data from api")
          const fetchRestaurants = async () => {
                    try {
                      // Call your fetch function
                      const restData = await getRestData();
                      setRestData(restData);
                      cartContext?.setRestaurants(restData)
                      console.log("rest data after fetch:", restData)

                    } catch (err) {
                      console.error('Failed to fetch restaurants:', err);
                    }
                  };
            fetchRestaurants();
        }

    }, [])

    return(
        <>
        <div id = "address_modal_root" className="page-content">
        <AddressModal
          isOpen={isModalOpen}
          onClose={closeModal}
          address={deliveryAddress!}
          setDeliveryAddress={setDeliveryAddress}
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
        <AddressTable delivery_address={deliveryAddress}></AddressTable>
        <button onClick={() =>{setIsModalOpen(true)}}>Change</button>

        <br />
        <button onClick={clearCookie}>
          Clear Cookies
        </button>
        <br />
        
    </div>
    <UserOrderTable orders={orders} rest_data={restData}/>
        </>
    )

}

export default ProfileComponent