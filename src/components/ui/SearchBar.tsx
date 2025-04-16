import React, { useState, KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, isLoading = false, placeholder = "Going to Vegas next week for a conference" }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() !== '' && !isLoading) {
      onSearch(query);
    }
  };

  const handleButtonClick = () => {
    if (query.trim() !== '' && !isLoading) {
      onSearch(query);
    }
  };

  const gradientContainerStyle = {
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const gradientBackgroundStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(315deg, rgba(2,6,13,0.95) 3%, rgba(15,23,42,0.95) 38%, rgba(30,41,59,0.95) 68%, rgba(51,65,85,0.95) 98%)',
    animation: 'gradient 5s ease infinite',
    backgroundSize: '400% 400%',
    backgroundAttachment: 'fixed',
    zIndex: 0
  };

  const waveStyle1 = {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '1000% 1000% 0 0',
    position: 'absolute' as const,
    width: '200%',
    height: '5em',
    animation: 'wave 10s -3s linear infinite',
    transform: 'translate3d(0, 0, 0)',
    opacity: 0.5,
    bottom: 0,
    left: 0,
    zIndex: 1
  };

  const waveStyle2 = {
    ...waveStyle1,
    bottom: '-0.5em',
    animation: 'wave 18s linear reverse infinite',
    opacity: 0.3
  };

  const waveStyle3 = {
    ...waveStyle1,
    bottom: '-1em',
    animation: 'wave 20s -1s reverse infinite',
    opacity: 0.4
  };

  const spinnerStyle = {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    zIndex: 20
  };

  return (
    <div className="w-full relative">
      <div className="flex items-center gap-3">
        <label htmlFor="search-input" className="text-slate-200 font-medium whitespace-nowrap">
          What's the occasion?
        </label>
        <div className="relative flex-1">
          <div className="overflow-hidden rounded-lg" style={gradientContainerStyle}>
            <div style={gradientBackgroundStyle} />
            <div style={waveStyle1} />
            <div style={waveStyle2} />
            <div style={waveStyle3} />
            <input
              id="search-input"
              type="text"
              className="w-full border-0 py-4 pl-4 pr-14 text-sm text-slate-200 bg-transparent ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-primary rounded-lg relative z-10"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
          </div>
          
          {isLoading ? (
            <div style={spinnerStyle} className="animate-spin rounded-full border-2 border-slate-500 border-t-blue-500"></div>
          ) : (
            <button
              type="button"
              style={{
                position: 'absolute',
                top: '50%',
                right: '12px',
                transform: 'translateY(-50%)',
                zIndex: 20
              }}
              className="cursor-pointer"
              onClick={handleButtonClick}
              disabled={query.trim() === ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-slate-400 hover:text-primary">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes gradient {
            0% {
              background-position: 0% 0%;
            }
            50% {
              background-position: 100% 100%;
            }
            100% {
              background-position: 0% 0%;
            }
          }
          
          @keyframes wave {
            2% {
              transform: translateX(1);
            }
            25% {
              transform: translateX(-25%);
            }
            50% {
              transform: translateX(-50%);
            }
            75% {
              transform: translateX(-25%);
            }
            100% {
              transform: translateX(1);
            }
          }
        `}
      </style>
    </div>
  );
} 