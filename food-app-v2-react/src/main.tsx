import './index.css'
import ReactDOM from "react-dom/client";
import {BrowserRouter , Routes, Route} from "react-router";
import App from './App.tsx'
import Login from './login.tsx'
import Signup from './signup.tsx'

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />,

      <Route path="login" element ={<Login />} />,

      <Route path="signup" element ={<Signup />} />

      
    </Routes>
  </BrowserRouter>
);

