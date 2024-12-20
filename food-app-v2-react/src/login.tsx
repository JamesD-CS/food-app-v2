import {useNavigate} from 'react-router'
import './App.css'
import { MessageModal } from './message_modal';
const apiUrl = import.meta.env.VITE_API_URL;
import React, { useState, useEffect, FormEvent } from 'react';
import cookies from 'js-cookie';
import { useLocalStorage } from 'usehooks-ts';


interface FormData {
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const navigate = useNavigate();


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
        return;
      }

      const result = await response.json();

      console.log('Form submitted successfully:', result);
      setIsModalOpen(true);
      setIsFadingOut(false);

      cookies.set('token', result.token, { expires: 2, secure: true });
      cookies.set('user_name', result.user.name, { expires: 2, secure: true });
      cookies.set('id', result.user.id, { expires: 2, secure: true });
      cookies.set('email', result.user.email, { expires: 2, secure: true });
      cookies.set('phone_number', result.user.phone_number, { expires: 2, secure: true });



      // Optionally reset the form
      setFormData({email: '', password: '' });
      navigate('/profile', { replace: true });

      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
      
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isModalOpen && !isFadingOut) {
      timer = setTimeout(() => {
        setIsFadingOut(true);
      }, 2000); // 2000ms = 2 seconds
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isModalOpen]);

  const handleTransitionEnd = () => {
    if (isFadingOut) {
      // Once the fade-out transition ends, close the modal fully
      setIsModalOpen(false);
    }
  };
  

  return (

    <div id="modal-root">   

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
    {isModalOpen && (
        <MessageModal isFadingOut={isFadingOut} onTransitionEnd={handleTransitionEnd}>
          <p>Login successful!</p>
        </MessageModal>
      )}
    </div>
  );
};

export default LoginComponent;

