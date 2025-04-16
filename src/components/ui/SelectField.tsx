import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  isLoading?: boolean;
}

export function SelectField({ label, options, isLoading, ...props }: SelectFieldProps) {
  return (
    <div className="mb-3">
      <label htmlFor={props.id} className="block text-xs font-medium text-slate-400 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          disabled={isLoading || props.disabled}
          className={`
            block w-full rounded-md border-slate-700 bg-slate-800 shadow-sm text-slate-200
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            ${isLoading ? 'bg-slate-900 text-slate-500' : ''}
            ${props.className || ''}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-8">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
} 