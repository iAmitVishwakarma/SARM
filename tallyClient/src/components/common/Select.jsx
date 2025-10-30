import React from 'react';

export default function Select({
  id,
  label,
  value,
  onChange,
  children, // This will be the <option> elements
  required = false,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
        >
          {children}
        </select>
      </div>
    </div>
  );
}