import React from 'react';
import cookies from 'js-cookie';


const ProfileComponent: React.FC = () => {

    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');

    return(
        <>
        Token:{token}
        <br />
        User name:{user_name}
        <br />
        email:{email}
        <br />
        <h1>Coming soon</h1>
        </>
    )

}

export default ProfileComponent