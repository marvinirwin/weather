import React, { ReactNode, useState, useEffect } from 'react';
import { StreamingText } from './StreamingText';

interface CardProps {
  title: string;
  children: ReactNode;
  rationale?: string;
  isLoading?: boolean;
  error?: string | null;
  streamingTextSpeed?: number;
  streamingWordsPerMinute?: number;
}

export function Card({ 
  title, 
  children, 
  rationale, 
  isLoading, 
  error,
  streamingTextSpeed,
  streamingWordsPerMinute = 80
}: CardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Slight delay to ensure the component is mounted before animation starts
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow shadow-slate-900/50 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          {isLoading && (
            <div className="ml-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500"></div>
            </div>
          )}
        </div>
        
        {rationale && (
          <div className="mt-2 mb-4 w-full">
            <div className="text-xs italic w-full text-left">
              <StreamingText 
                text={rationale} 
                speed={streamingTextSpeed}
                wordsPerMinute={streamingWordsPerMinute}
              />
            </div>
          </div>
        )}
        
        {error ? (
          <div className="mt-4 rounded-md bg-red-900/30 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-300">{error}</p>
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