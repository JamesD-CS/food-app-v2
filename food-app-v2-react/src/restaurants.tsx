import React, { useState, useEffect, useContext } from 'react';
import cookies from 'js-cookie';
const apiUrl = import.meta.env.VITE_API_URL;
import {Link} from 'react-router';
import  { Restaurant } from './app_types';
import { CartContext } from "./cart_context.tsx";


interface RestaurantTableProps {
  restaurants: Restaurant[];
}

const RestaurantTable: React.FC<RestaurantTableProps> = ({ restaurants }) => {
 
  if (!Array.isArray(restaurants)) {
    return <div>No data available</div>;
  }
  
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th colSpan={5}>
            Restaurants
          </th>
        </tr>
        <tr>
          <th >ID</th>
          <th >Name</th>
          <th >Description</th>
          <th >Phone Number</th>
          <th >Email</th>
        </tr>
      </thead>
      <tbody>
        {restaurants.map((restaurant) => (
         
          <tr key={restaurant.id}>
            <td >{restaurant.id}</td>
           
              <td > <Link to={'/rest_details' }  
            state={{ id: restaurant.id, name:restaurant.name }}>{restaurant.name}</Link>
            </td>
            <td >{restaurant.description}</td>
            <td >{restaurant.phone_number}</td>
            <td >{restaurant.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

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
        <RestaurantTable restaurants={data} />
      </>

    )

}

export default Restaurants