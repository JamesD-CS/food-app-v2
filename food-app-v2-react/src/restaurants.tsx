import React, { useState, useEffect } from 'react';
import cookies from 'js-cookie';
const apiUrl = import.meta.env.VITE_API_URL;
import {Link} from 'react-router';
import  { Restaurant } from './app_types';

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
            <Link to={'/rest_details'}  
            state={{ id: restaurant.id, name:restaurant.name }}>
              <td >{restaurant.name}</td>
            </Link>
            <td >{restaurant.description}</td>
            <td >{restaurant.phone_number}</td>
            <td >{restaurant.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


const Restaurants:React.FC = () => {

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');
    const [data, setData] = useState<Restaurant[]>([]);

    useEffect(() => {
        setData([]);
        const requestOptions = {
          method: 'GET',
          headers: { 
              'Content-Type': 'application/json',
              'Accept':'*/*'
          },
          
        };
        console.log('fetching items');
        fetch(apiUrl + '/restaurants', requestOptions).then((response) => {
          if(!response.ok) throw new Error(response.status.toString() );
          else return response.json();
        })
        .then((data) => {
          console.log(data);
          setData(data.restaurants);
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
        let token:string | undefined = cookies.get('token');
        console.log('cookie is', token);
        return () => {
          
        };
      }, []);

    return(

      <RestaurantTable restaurants={data} />

    )

}

export default Restaurants