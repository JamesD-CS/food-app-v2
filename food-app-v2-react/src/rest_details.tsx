import React from 'react';
import { useLocation } from 'react-router';
import cookies from 'js-cookie';


const RestDetails: React.FC = () => {
    let restaurant_info = useLocation();
    let rest_name:string = restaurant_info.state.name;
    let rest_id:string = restaurant_info.state.id;

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');

    return(
        <h2>
        Restaurant Name:{rest_name}
        <br />
        Restaurant Id:{rest_id}
        </h2>
    )

}

export default RestDetails