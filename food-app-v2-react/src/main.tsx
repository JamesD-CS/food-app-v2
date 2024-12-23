import './index.css'
import ReactDOM from "react-dom/client";
import {BrowserRouter , Routes, Route} from "react-router";
import App from './App.tsx'
import Login from './login.tsx'
import Signup from './signup.tsx'
import Profile from './profile.tsx'
import Restaurants  from './restaurants.tsx';
import RestDetails from './rest_details.tsx'
import { CartProvider } from './cart_context.tsx';

const root = document.getElementById("root")!;

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.appendChild(modalRoot);

ReactDOM.createRoot(root).render(

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />,
      <Route path="login" element ={<Login />} />,
      <Route path="signup" element ={<Signup />} />,
      <Route path="profile" element ={<Profile />} />
      <Route path="restaurants" element ={<Restaurants />} />
      <Route path="rest_details/" element ={<CartProvider> <RestDetails /> </CartProvider>} />
    </Routes>
  </BrowserRouter>


);

