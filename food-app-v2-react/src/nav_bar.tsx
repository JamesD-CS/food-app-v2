import {Link} from 'react-router';
import './App.css'

const NavBar =() => {

  return (
    <>

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
        <li className="navbar">
          <h2>
            <Link to={'/profile'} >
              Profile
            </Link>
          </h2>
        </li>
      </ul>
    </>
  )
}

export default NavBar
