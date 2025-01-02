import {useNavigate} from 'react-router'
import './App.css'
const apiUrl = import.meta.env.VITE_API_URL;
import React, { useState, FormEvent, useContext } from 'react';
import cookies from 'js-cookie';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import { CartContext } from "./cart_context.tsx";


interface FormData {
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const  cartContext = useContext(CartContext);
  const [modalMessage, setModalMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onModalClose = () =>{
    setIsModalOpen(false)
    if(loginSuccess){
    navigate('/profile', { replace: true });
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData);
    console.log(jsonData);
    
    try {
      const response = await fetch(apiUrl + '/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      if (!response.ok) {
        // Handle non-2xx HTTP responses
        console.error('Server returned an error response');
        setModalMessage("Error Signing In")
        setIsModalOpen(true)
        return;
      }

      const result = await response.json();

      console.log('Form submitted successfully:', result);
      setModalMessage("Login Successful")
      setLoginSuccess(true)
      setIsModalOpen(true);

      cookies.set('token', result.token, { expires: 2, secure: true });
      cookies.set('user_name', result.user.name, { expires: 2, secure: true });
      cookies.set('id', result.user.id, { expires: 2, secure: true });
      cookies.set('email', result.user.email, { expires: 2, secure: true });
      cookies.set('phone_number', result.user.phone_number, { expires: 2, secure: true });
      cartContext?.setIsLoggedIn(true);
      cartContext?.setUserId(result.user_id);

      // Optionally reset the form
      setFormData({email: '', password: '' });
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
      
  };

  return (
    <>
    <FadeOutModal
          isOpen={isModalOpen}
          onClose={() => onModalClose()}
          showDuration={500}  // Wait (x)ms before starting fade
          fadeDuration={200}   // 0.5s fade-out transition
        >
          <p>{modalMessage}</p>
      </FadeOutModal>

    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>

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

      <button type="submit">Login</button>
    </form>
    </>
  );
};

export default LoginComponent;

