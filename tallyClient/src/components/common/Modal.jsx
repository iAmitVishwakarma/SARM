import React from 'react';

// A basic modal component for confirmations
export default function Modal({ title, children, onClose, onConfirm, confirmText = "Confirm" }) {
  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close modal on backdrop click
    >
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="mt-4 text-gray-600">
          {children}
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md border border-transparent bg-brand-blue px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue/90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}