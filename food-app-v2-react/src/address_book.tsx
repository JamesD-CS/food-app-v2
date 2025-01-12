import React, {useEffect, useState, useContext} from 'react';
import { CartContext } from './cart_context';
import cookies from 'js-cookie';
import { Address, Order } from './app_types';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import { NewAddressModal } from './new_address_modal';
import { AddressTable } from './profile';

const apiUrl = import.meta.env.VITE_API_URL;

interface addressBookProps {
    addresses:Address[]
    setCurrentAddress:(address:Address)=> void
    currentAddress:Address
    deleteFunction:(addressId:number) => void
}

interface addressBookComponentProps{
  onClose:() => void
  setDeliveryAddress:(delivery_address:Address) => void
  currentAddress:Address|undefined
}

const AddressBookTable: React.FC<addressBookProps> = ({ addresses, setCurrentAddress, currentAddress, deleteFunction }) => {

  const setAddress =(new_address:Address) =>{
    setCurrentAddress(new_address);
  }

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
          <th></th>
        </tr>
      </thead>
      <tbody>
      
      {addresses.map((address) => (
         <>
          <tr key={address.id} className={(address.id==currentAddress.id)?"highlight":""}>
            <td>{address.street}</td>
            <td>{address.city}</td>
            <td>{address.state}</td>
            <td>{(address.id==currentAddress.id)?"Current Address" : <button onClick={()=>setAddress(address)}>Set Address</button>}</td>
            <td>{(address.id!=currentAddress.id)?<button onClick={()=>deleteFunction(address.id!)}>Delete</button> : ""}</td>
          </tr>
        </>
        ))}
        
      </tbody>
    </table>
  );
}

export const AddressBookComponent: React.FC<addressBookComponentProps> = ({onClose, setDeliveryAddress, currentAddress}) => {
    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const user_id = cookies.get('id');
    const email= cookies.get('email');
    const [addresses, setAddresses]= useState<Address[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
    const [messageDeleteSuccess, setMessageDeleteSuccess] = useState<boolean>();

    
    //const [currentAddress, setCurrentAddress] = useState<Address>();
    const  cartContext = useContext(CartContext);
    
    //let current_address = cartContext?.getAddress();
    let current_address = currentAddress;

    const setCurrentAddressState = (newCurrentAddress:Address) => {

      //setCurrentAddress(newCurrentAddress)
      setDeliveryAddress(newCurrentAddress)

    }

    const onMessageModalClose = () =>{
      setIsMessageModalOpen(false)
      getAddresses();

    }

    const closeNewAddressModal = () => {
      setIsModalOpen(false)
      getAddresses();
    }

    const showNewAddressModal = () => {
      setIsModalOpen(true)
    }

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

    const deleteAddress = (async (addressId:Number) =>{
          console.log("address id is:", addressId)
    
          const deleteAddRequestOptions = {
            method: 'DELETE',
            headers: { 
              'Authorization': 'Bearer '+ token,
              'Content-Type': 'application/json',
              'Accept':'*/*'
          },
          }
          let reqUrl = apiUrl + '/addresses/' + addressId;     
            try{
              const delete_response = await fetch(reqUrl, deleteAddRequestOptions);
              if(delete_response.status == 204){
                console.log("delete success")
                setMessageDeleteSuccess(true)
              }else{
                setMessageDeleteSuccess(false)
                console.log("error deleting")
              }
            }catch(error){
              console.log(error);
            }finally{
              setIsMessageModalOpen(true)
            }
        })

    useEffect(() =>{
        getAddresses();
        }, [currentAddress])

    if(!token){
        return(<p>You are not Logged in</p>)
    }

    return(<>
    <FadeOutModal
          isOpen={isMessageModalOpen}
          onClose={() => onMessageModalClose()}
          showDuration={500}  // Wait (x)ms before starting fade
          fadeDuration={200}   // 0.5s fade-out transition
        >
          <p>{(messageDeleteSuccess)?"Address Deleted":"Error Deleting Address"}</p>
      </FadeOutModal>
    <AddressTable delivery_address={current_address}></AddressTable>
    <br />

    <AddressBookTable addresses={addresses} setCurrentAddress={setCurrentAddressState} currentAddress={current_address!} 
    deleteFunction={deleteAddress} />

    <button onClick={onClose}>Close</button>
    <div id="address_form_div">
    <button onClick={showNewAddressModal}>Add New Address</button>
    <NewAddressModal isOpen={isModalOpen} onClose={closeNewAddressModal} address={null}/>
    </div>
    </>)

}