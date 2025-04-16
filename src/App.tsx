import React, { useState } from 'react';
import { Navbar } from './components/ui/Navbar';
import { CardGrid } from './components/CardGrid';
import { useGeminiLayout } from './hooks/useGeminiLayout';
import { TestTailwind } from './components/TestTailwind';

export default function App() {
  const { layout, isLoading, error, generateLayout } = useGeminiLayout();

  const handleSearch = async (query: string) => {
    try {
      await generateLayout(query);
    } catch (err) {
      console.error('Error generating layout:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-white">
      <div className="wave-pattern absolute inset-0 opacity-10 z-0" />
      
      <Navbar onSearch={handleSearch} isLoading={isLoading} />
      
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
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
          )}
          
          <CardGrid cards={layout?.cards || []} />

          <TestTailwind />

          <div className="rounded-md bg-gray-100 p-4 m-4">
            <p>Testing Tailwind CSS rounded-md class</p>
          </div>
        </div>
      </main>
    </div>
  );
} 