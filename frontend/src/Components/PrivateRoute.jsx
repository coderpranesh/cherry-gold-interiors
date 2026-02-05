// src/Components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check for accessToken (not token)
  const accessToken = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  
  console.log('PrivateRoute check:', {
    accessToken: accessToken ? 'Present ✓' : 'Missing ✗',
    user: user ? 'Present ✓' : 'Missing ✗',
    path: window.location.pathname
  });
  
  if (!accessToken || !user) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;