import React from 'react';

// A simple spinning loader for async operations
export default function Loader() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}