import './index.css'
import ReactDOM from "react-dom/client";
import {BrowserRouter , Routes, Route} from "react-router";
import App from './App.tsx'
import Login from './login.tsx'
import Signup from './signup.tsx'
import Profile from './profile.tsx'
import Restaurants  from './restaurants.tsx';
import RestDetails from './rest_details.tsx'
import Checkout from './checkout.tsx';
import { CartProvider } from './cart_context.tsx';
import NavBar from './nav_bar.tsx';

const root = document.getElementById("root")!;

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.appendChild(modalRoot);

const cartmodalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'cart-modal-root');
document.body.appendChild(cartmodalRoot);

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <NavBar />
    <br />
    <Routes>
      <Route path="/" element={<App />} />,
      <Route path="login" element ={<CartProvider><Login /></CartProvider>} />,
      <Route path="signup" element ={<Signup />} />,
      <Route path="profile" element ={<CartProvider><Profile /></CartProvider>} />
      <Route path="restaurants" element ={<CartProvider><Restaurants /> </CartProvider>} />
      <Route path="rest_details/" element ={<CartProvider> <RestDetails /> </CartProvider>} />
      <Route path="checkout/" element ={<CartProvider> <Checkout /> </CartProvider>} />


    </Routes>
  </BrowserRouter>


);

