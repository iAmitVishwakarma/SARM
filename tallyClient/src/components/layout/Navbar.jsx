import React from 'react';
import useAuth from '../../hooks/useAuth'; // <-- Auth hook ko import karein

export default function Navbar() {
  const { user } = useAuth(); // <-- Logged-in user ka data lein

  return (
    <header className="flex h-16 w-full items-center justify-between bg-white px-6 shadow-md">
      <div>
        {/* User ka shopName dikhayein */}
        <h1 className="text-xl font-semibold">
          {user?.shopName || 'SARM'}
        </h1>
      </div>
      <div>
        {/* User ka email dikhayein */}
        <span className="text-sm font-medium text-gray-600">
          {user?.email || 'User'}
        </span>
      </div>
    </header>
  );
}