import React, {useEffect, useState} from 'react';
import { createPortal } from 'react-dom';
import cookies from 'js-cookie';
import { Address } from './app_types';
import { AddressModal } from './address_modal';

const apiUrl = import.meta.env.VITE_API_URL;

interface APProps {
  div_id:string
  address:Address | null
  
}

const ProfileComponent: React.FC = () => {

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');
    const [address, setAddress]= useState<Address[]>([]);
    

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

    useEffect(() =>{
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

    }, [])

    return(
        <>
        <div id = "address_modal_root">
        Token:{token}
        <br />
        User name:{user_name}
        <br />
        email:{email}
        <br />
        <h1>Coming soon</h1>
        <br />
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
         
          <tr key={address.id}>
            <td >{address.id}</td>
            <td > {address.street}</td>
            <td >{address.city}</td>
            <td >{address.state}</td>
            <td >{address.postal_code}</td>
            <td >{address.country}</td>
            <td id = {String(address.id)}> <AddressPortal address={address} div_id = {String(address.id)}  />
            </td>
            
          </tr>
        ))}
      </tbody>
    </table>
    <div id="add_new_div">
    <AddressPortal address={null} div_id = {"add_new_div"}  />
    </div>

    </div>
        </>
    )

}

export default ProfileComponent