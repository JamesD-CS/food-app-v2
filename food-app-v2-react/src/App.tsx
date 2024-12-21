import { useState } from 'react'
import {Link} from 'react-router';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Welcome to Food App V2</h1>

      <ul className="navbar">
        <li className="navbar">
          <h2>
            <Link to={'/login'} >
              Login
            </Link>
          </h2>
        </li>
        <li className="navbar">
          <h2>
            <Link to={'/signup'} >
              Signup
            </Link>
          </h2>
        </li>
        <li className="navbar">
          <h2>
            <Link to={'/restaurants'} >
              Restaurants
            </Link>
          </h2>
        </li>
      </ul>
    </>
  )
}

export default App
