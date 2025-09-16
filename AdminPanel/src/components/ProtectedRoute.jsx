// import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // This is the authentication check.
  // We're checking for a 'token' item in localStorage.
  // You should have saved this token during the login process.
  const isAuthenticated = localStorage.getItem('authToken');


  // If the user is authenticated, the <Outlet> component will render the
  // child route (e.g., <Dashboard />).
  // If not, we use the <Navigate> component to redirect them to the login page.
  // The "replace" prop is important to prevent the user from using the
  // back button to get back to the protected route after being redirected.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
