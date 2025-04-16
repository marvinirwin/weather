import React from 'react';
import { SearchBar } from './SearchBar';

interface NavbarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function Navbar({ onSearch, isLoading }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">Open Weather Planner</h1>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6 w-1/2">
            <SearchBar onSearch={onSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </header>
  );
} 