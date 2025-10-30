import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' or 'secondary'
  className = '',
}) {
  const baseStyle = 'w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const styles = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue/90 focus:ring-brand-blue',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}