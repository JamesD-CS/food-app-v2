import React, { useState, useEffect, useContext } from 'react';
import cookies from 'js-cookie';
const apiUrl = import.meta.env.VITE_API_URL;
import {Link} from 'react-router';
import  { Restaurant } from './app_types';
import { CartContext } from "./cart_context.tsx";

interface RestaurantCardProps {
  restaurants: Restaurant[];
}

const RestCardGrid: React.FC<RestaurantCardProps> = ({restaurants}) => {

  if (!Array.isArray(restaurants)) {
    return <div>No data available</div>;
  }

  return(
    <>
    <div className="restaurant-grid">
    {restaurants.map((restaurant) => (
                  <Link to={'/rest_details' }  
                  state={{ id: restaurant.id, name:restaurant.name }}>
                  <div className="cart-item-card" key={restaurant.id}>
                    <div className="cart-item-header">{restaurant.name}</div>
                    <div className="cart-item-details">{restaurant.description}</div>
                    <div className="cart-item-details">{restaurant.phone_number}</div>
                  </div>
                  </Link>
                ))}
    </div>
    </>
  )
}

export const getRestData = async (): Promise<Restaurant[]> => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    };

    console.log('fetching items');
    
    // Await the fetch and then check if the response is OK
    const response = await fetch(apiUrl + '/restaurants', requestOptions);
    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    // Await the JSON parsing
    const data = await response.json();
    return data.restaurants as Restaurant[]; // The function returns a Promise that resolves with 'data'
  } catch (error) {
    console.log('error:', error);
    throw error; // Re-throw if you want to handle the error outside
  }
};

const Restaurants:React.FC = () => {

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');
    const [data, setData] = useState<Restaurant[]>([]);
    const  cartContext = useContext(CartContext);

    useEffect(() => {
        
        const fetchRestaurants = async () => {
          try {
            // Call your fetch function
            const restData = await getRestData();
            setData(restData);
            cartContext?.setRestaurants(restData)
          } catch (err) {
            console.error('Failed to fetch restaurants:', err);
          }
        };
        fetchRestaurants();
      }, []);

    return(
      <>
        <RestCardGrid restaurants={data} />
      </>

    )

}

export default Restaurants