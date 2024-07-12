import React from 'react'
import { Navigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';

const PrivateRoute = ({ children }) => {

    const { isAuth } = UserData();

    // console.log(isAuth);


    if (isAuth === true) {
        return children
    }
    else {
        return <Navigate to="/signin" />
    }
}

export default PrivateRoute
