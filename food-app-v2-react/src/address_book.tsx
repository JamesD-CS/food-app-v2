import React, {useEffect, useState, useContext} from 'react';
import { CartContext } from './cart_context';
import { createPortal } from 'react-dom';
import cookies from 'js-cookie';
import { Address, Order } from './app_types';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import AddressForm from './add_address';
import { AddressTable } from './profile';

const apiUrl = import.meta.env.VITE_API_URL;

interface addressBookProps {
    addresses:Address[]
}

interface addressBookComponentProps{
  onClose:() => void
}

interface addAddressProps{
  div_id:string 
}

const AddAddressModal: React.FC<addAddressProps>  = ({div_id}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {!showModal &&
      <button onClick={() => setShowModal(true)}>
        Add New Address
      </button>
      }
      {showModal && createPortal(
        <AddressForm onClose={() => setShowModal(false)} address={null} />,
        document.getElementById(div_id) as HTMLElement
      )}
    </>
  );
}

const AddressBookTable: React.FC<addressBookProps> = ({ addresses }) => {

  if (!Array.isArray(addresses)) {
    return <div>No data available</div>;
  }

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th colSpan={3}>
            Your Addresses
          </th>
        </tr>
        <tr>
          <th >Street</th>
          <th >City</th>
          <th >State</th>

        </tr>
      </thead>
      <tbody>
      
      {addresses.map((address) => (
         <>
          <tr key={address.id}>
            <td>{address.street}</td>
            <td>{address.city}</td>
            <td>{address.state}</td>
          </tr>
        </>
        ))}
        
      </tbody>
    </table>
  );
}

export const AddressBookComponent: React.FC<addressBookComponentProps> = ({onClose}) => {
    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const user_id = cookies.get('id');
    const email= cookies.get('email');
    const [addresses, setAddresses]= useState<Address[]>([]);
    const  cartContext = useContext(CartContext);
    
    let current_address = cartContext?.getAddress();

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
          setAddresses(address_response.addresses);
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
  
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
              }else{
                console.log("error deleting")
              }
            }catch(error){
              console.log(error);
            }
        })

    useEffect(() =>{
        getAddresses();
        }, [])

    if(!token){
        return(<p>You are not Logged in</p>)
    }

    return(<>
    <AddressTable delivery_address={current_address}></AddressTable>
    <br />

    <AddressBookTable addresses={addresses} />

    <button onClick={onClose}>Close</button>
    <div id="address_form_div">
    <AddAddressModal div_id={"address_form_div"}/>
    </div>
    </>)

}