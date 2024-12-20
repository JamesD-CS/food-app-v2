import {useNavigate} from 'react-router'
import './App.css'
import { MessageModal } from './message_modal';
const apiUrl = import.meta.env.VITE_API_URL;
import React, { useState, useEffect, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

const RegistrationForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData);
    console.log(jsonData);
    /*
    try {
      const response = await fetch(apiUrl + '/users/register', {
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
    setFormData({ name: '', email: '', phone_number: '', password: '' });

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
    {isModalOpen && (
        <MessageModal isFadingOut={isFadingOut} onTransitionEnd={handleTransitionEnd}>
          <p>Registration successful!</p>
        </MessageModal>
      )}
    </div>
  );
};

export default RegistrationForm;

