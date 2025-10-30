import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-md ${className}`}>
      {children}
    </div>
  );
}