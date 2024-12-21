import {useNavigate} from 'react-router'
import './App.css'
const apiUrl = import.meta.env.VITE_API_URL;
import React, { useState, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';

interface FormData {
  email: string;
  password: string;
}

interface ModalProps {
  children: React.ReactNode;
  isFadingOut: boolean;
  onTransitionEnd: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, isFadingOut, onTransitionEnd }) => {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    // If no modal-root is found, return null or handle it gracefully.
    return null;
  }

  // The inline styles are adjusted to use a CSS class for transitions.
  // We'll rely on a className that toggles for the fade-out effect.
  return createPortal(
    <div 
      className={`modal-overlay ${isFadingOut ? 'fade-out' : ''}`}
      onTransitionEnd={onTransitionEnd}
    >
      <div className="modal-content">
        {children}
      </div>
    </div>,
    modalRoot
  );
};

const LoginComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);


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
    /*
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


      // Optionally reset the form
      setFormData({ name: '', email: '', phone_number: '', password: '' });
      
    } catch (error) {
      console.error('Error submitting form:', error);
    }
      */
    //delete this block when done ui testing
    console.log('Form submitted successfully:');
    setIsModalOpen(true);
    setIsFadingOut(false);
    //end block delete

    // Optionally reset the form
    setFormData({ email: '', password: '' });

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
        <Modal isFadingOut={isFadingOut} onTransitionEnd={handleTransitionEnd}>
          <p>Login successful!</p>
        </Modal>
      )}
    </div>
  );
};

export default LoginComponent;

