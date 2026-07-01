import React from 'react'
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const PrivateRoute = () => {
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            // If no token, redirect to login page
            navigate('/login');
        }
    }, [token]);

    return token ? <Outlet /> : navigate('/login'); // Render child routes if token exists, otherwise redirect to login
}

export default PrivateRoute
