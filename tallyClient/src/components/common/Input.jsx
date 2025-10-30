import React from 'react';

export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm"
        />
      </div>
    </div>
  );
}