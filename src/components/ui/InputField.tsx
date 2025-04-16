import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isLoading?: boolean;
}

export function InputField({ label, isLoading, ...props }: InputFieldProps) {
  return (
    <div className="mb-3">
      <label htmlFor={props.id} className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          disabled={isLoading || props.disabled}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            ${isLoading ? 'bg-gray-100 text-gray-500' : ''}
            ${props.className || ''}
          `}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
} 