import './App.css'
const apiUrl = import.meta.env.VITE_API_URL;
import React, { useState, FormEvent } from 'react';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import { Address } from './app_types';
import cookies from 'js-cookie';

interface AFProps  {
    address: Address | null
    div_id:string
    onClose: () => void
    onSubmit: () => void
}

const AddressForm: React.FC<AFProps> = ({ address, div_id, onClose, onSubmit}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const token = cookies.get('token');
  const user_name= cookies.get('user_name');
  const email= cookies.get('email');
  let modal_message:string;
  let fetchUrl:string 
  let method_string:string 
  let isNewAddress:boolean = (address)? true: false;

  // Check if address object exists
  if (!address){
    modal_message = "Address Added"
    fetchUrl = apiUrl + '/addresses'
    method_string = "POST"
  }else{
    modal_message = "Address Updated"
    fetchUrl = apiUrl + '/addresses/' + address!.id
    method_string = "PUT"
  }
  
  const [addressData, setAddressData] = useState<Address>({
    street: (address)?address.street : '',
    city: (address)?address.city : '',
    state: (address)?address.state : '',
    country: (address)?address.country : '',
    postal_code: (address)?address.postal_code : ''

  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onModalClose = () => {
    setIsModalOpen(false);
    onSubmit();

  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = JSON.stringify(addressData);
    console.log(jsonData);
    
    console.log("Fetching url:", fetchUrl);
    try {
      const response = await fetch(fetchUrl, {
        method: method_string,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ token,

        },
        body: jsonData,
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        console.error('Server returned an error response');
        return;
      }

      const result = await response.json();

      console.log('Form submitted successfully:', result);
      setIsModalOpen(true);


      // Optionally reset the form
      setAddressData({ street: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''});
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    

  };

  return (

    <div id={div_id} text-align={"center"}>   
    <FadeOutModal
          isOpen={isModalOpen}
          onClose={() => onModalClose()}
          showDuration={500}  // Wait (x)ms before starting fade
          fadeDuration={200}   // 0.5s fade-out transition
        >
          <p>{modal_message}</p>
      </FadeOutModal>

    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>

      <div>
        <label htmlFor="name">Street</label><br />
        <input
          type="text"
          id="street"
          name="street"
          value={addressData.street}
          onChange={handleChange}
          placeholder="Enter your street"
          required={isNewAddress}
        />
      </div>

      <div>
        <label htmlFor="city">City</label><br />
        <input
          type="text"
          id="city"
          name="city"
          value={addressData.city}
          onChange={handleChange}
          placeholder="Enter city"
          required={isNewAddress}
        />
      </div>

      <div>
        <label htmlFor="state">State</label><br />
        <input
          type="text"
          id="state"
          name="state"
          value={addressData.state}
          onChange={handleChange}
          placeholder="Enter your state"
          required={isNewAddress}
        />
      </div>

      <div>
        <label htmlFor="country">Country</label><br />
        <input
          type="text"
          id="country"
          name="country"
          value={addressData.country}
          onChange={handleChange}
          placeholder="Enter country"
          required={isNewAddress}
        />
      </div>

      <div>
        <label htmlFor="country">Postal Code</label><br />
        <input
          type="text"
          id="postal_code"
          name="postal_code"
          value={addressData.postal_code}
          onChange={handleChange}
          placeholder="Enter Postal Code"
          required={isNewAddress}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
    <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AddressForm;

