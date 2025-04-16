import React, { useState } from 'react';
import { Navbar } from './components/ui/Navbar';
import { CardGrid } from './components/CardGrid';
import { useGeminiLayout } from './hooks/useGeminiLayout';

export default function App() {
  const { layout, isLoading, error, generateLayout } = useGeminiLayout();

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      // If the query is empty, reset the layout but don't fetch
      // generateLayout already sets layout to null initially, 
      // so we just need to ensure it's called to reset state
      // without making the API call.
      // We can potentially add a dedicated reset function to the hook later if needed.
      generateLayout(''); // Call with empty to reset state, but it won't proceed to API call
      return; 
    }
    
    try {
      await generateLayout(query);
    } catch (err) {
      console.error('Error generating layout:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-400">
      <div className="wave-pattern absolute inset-0 opacity-5 z-0" />
      
      <Navbar onSearch={handleSearch} isLoading={isLoading} />
      
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-md bg-red-900 p-4">
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
          )}
          
          <CardGrid cards={layout?.cards || []} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
} 