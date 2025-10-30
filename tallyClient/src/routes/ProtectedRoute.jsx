import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or simple text while checking auth
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If not logged in, redirect to the login page
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If logged in, render the child route (e.g., Dashboard, Stock)
  return <Outlet />;
}