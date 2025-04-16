import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  rationale?: string;
  isLoading?: boolean;
  error?: string | null;
}

export function Card({ title, children, rationale, isLoading, error }: CardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          {isLoading && (
            <div className="ml-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
            </div>
          )}
        </div>
        
        {rationale && (
          <div className="mt-2 mb-4">
            <div className="text-xs text-gray-500 italic">{rationale}</div>
          </div>
        )}
        
        {error ? (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">{children}</div>
        )}
      </div>
    </div>
  );
} 