import {useNavigate} from 'react-router'
import './App.css'
const apiUrl = import.meta.env.VITE_API_URL;
import React, { useState, FormEvent } from 'react';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component


interface FormData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

const RegistrationForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onModalClose = () => {
    setIsModalOpen(true);
    navigate('/login', { replace: true });

  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData);
    console.log(jsonData);
    let fetchUrl = apiUrl + '/users/register';
    console.log("Fetching url:", fetchUrl);
    try {
      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      setFormData({ name: '', email: '', phone_number: '', password: '' });
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    
    // Optionally reset the form
    setFormData({ name: '', email: '', phone_number: '', password: '' });

  };

  return (

    <div id="modal-root">   
    <FadeOutModal
          isOpen={isModalOpen}
          onClose={() => onModalClose()}
          showDuration={500}  // Wait (x)ms before starting fade
          fadeDuration={200}   // 0.5s fade-out transition
        >
          <p>Signup Successful</p>
      </FadeOutModal>

    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>

      <div>
        <label htmlFor="name">Name</label><br />
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email</label><br />
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label htmlFor="phone">Phone</label><br />
        <input
          type="tel"
          id="phone"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Enter your phone number"
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label><br />
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter a secure password"
          required
        />
      </div>

      <button type="submit">Submit</button>
    </form>
    
    </div>
  );
};

export default RegistrationForm;

