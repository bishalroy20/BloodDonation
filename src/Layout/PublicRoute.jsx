import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';

const PublicRoute = () => {
  const { user, loading } = useContext(AuthContext);


  return user ? <Navigate to="/profile" replace /> : <Outlet />;
};

export default PublicRoute;