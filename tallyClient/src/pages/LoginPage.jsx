import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@sarm.com');
  const [password, setPassword] = useState('1234');
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  // If user is already logged in, redirect them from login page
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-brand-blue">
          SARM Login
        </h2>
        <p className="mb-4 text-center text-sm text-gray-600">
          (Demo: <code className="bg-gray-200 p-1">admin@sarm.com</code> / <code className="bg-gray-200 p-1">1234</code>)
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}