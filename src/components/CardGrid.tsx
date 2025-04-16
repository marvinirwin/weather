import React, { useState, useEffect, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { WeatherCardType } from '../types/weatherTypes';
import { CurrentWeatherCard } from './cards/CurrentWeatherCard';
import { ForecastCard } from './cards/ForecastCard';
import { OneCallCard } from './cards/OneCallCard';
import { AirPollutionCard } from './cards/AirPollutionCard';
import { GeocodingCard } from './cards/GeocodingCard';
import { ReverseGeocodingCard } from './cards/ReverseGeocodingCard';

interface CardGridProps {
  cards: WeatherCardType[];
  isLoading?: boolean;
}

export function CardGrid({ cards = [], isLoading = false }: CardGridProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  
  // If no cards provided, show all card types with default params
  const displayCards = useMemo(() => {
    return cards.length > 0 ? cards : [
      { type: 'current', parameters: { lat: 40.7128, lon: -74.0060, units: 'metric' } },
      { type: 'forecast', parameters: { lat: 40.7128, lon: -74.0060, units: 'metric' } },
      { type: 'onecall', parameters: { lat: 40.7128, lon: -74.0060, units: 'metric' } },
      { type: 'air_pollution', parameters: { lat: 40.7128, lon: -74.0060 } },
      { type: 'geocoding', parameters: { query: 'New York', limit: 5 } },
      { type: 'reverse_geocoding', parameters: { lat: 40.7128, lon: -74.0060, limit: 3 } },
    ];
  }, [cards]);

  useEffect(() => {
    // Don't show cards while loading
    if (isLoading) {
      setVisibleCards([]);
      return;
    }
    
    // Clear visible cards when the displayCards changes
    setVisibleCards([]);
    
    // Stagger the appearance of each card
    displayCards.forEach((_, index) => {
      // Generate a random delay between 100-250ms for each card
      const delay = 100 + Math.random() * 150;
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, delay * (index + 1));
    });
  }, [isLoading]);

  // Dynamic breakpoints based on number of cards
  const maxColumns = Math.min(displayCards.length, 3);
  
  const breakpointColumns = useMemo(() => ({
    default: maxColumns,
    1100: Math.min(maxColumns, 2),
    700: 1
  }), [maxColumns]);

  const renderCard = useMemo(() => (card: WeatherCardType) => {
    switch (card.type) {
      case 'current':
        return <CurrentWeatherCard key={`current-${JSON.stringify(card.parameters)}`} initialParams={card.parameters as any} rationale={card.rationale} />;
      case 'forecast':
        return <ForecastCard key={`forecast-${JSON.stringify(card.parameters)}`} initialParams={card.parameters as any} rationale={card.rationale} />;
      case 'onecall':
        return <OneCallCard key={`onecall-${JSON.stringify(card.parameters)}`} initialParams={card.parameters as any} rationale={card.rationale} />;
      case 'air_pollution':
        return <AirPollutionCard key={`air_pollution-${JSON.stringify(card.parameters)}`} initialParams={card.parameters as any} rationale={card.rationale} />;
      case 'geocoding':
        return <GeocodingCard key={`geocoding-${JSON.stringify(card.parameters)}`} initialParams={card.parameters as any} rationale={card.rationale} />;
      case 'reverse_geocoding':
        return <ReverseGeocodingCard key={`reverse_geocoding-${JSON.stringify(card.parameters)}`} initialParams={card.parameters as any} rationale={card.rationale} />;
      default:
        return null;
    }
  }, []);

  // Weather-themed loading animation component
  const WeatherLoadingAnimation = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-180px)]">
        <div className="relative w-64 h-64">
          {/* Circular orbit path indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border border-slate-700 border-dashed opacity-30"></div>
          
          {/* Rotating container with all icons */}
          <div 
            className="absolute top-1/2 left-1/2 w-[180px] h-[180px]" 
            style={{
              transform: 'translate(-50%, -50%)',
              animation: 'spin 20s linear infinite'
            }}
          >
            {/* Sun icon */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ animation: 'counter-spin 20s linear infinite' }}>
              <div className="flex items-center justify-center w-16 h-16 bg-orange-500/50 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(255,170,0,0.8)]">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="#FFDD00" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="3" x2="12" y2="1" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="23" x2="12" y2="21" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="1" y2="12" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="23" y1="12" x2="21" y2="12" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5.64" y1="5.64" x2="4.22" y2="4.22" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="19.78" y1="19.78" x2="18.36" y2="18.36" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5.64" y1="18.36" x2="4.22" y2="19.78" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" />
                  <line x1="19.78" y1="4.22" x2="18.36" y2="5.64" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            
            {/* Clouds icon */}
            <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2" style={{ animation: 'counter-spin 20s linear infinite' }}>
              <div className="flex items-center justify-center w-16 h-16 bg-white/50 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.8)]">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.5,10h-1.04c-0.1-2.48-2.14-4.5-4.65-4.5c-1.6,0-3.01,0.81-3.85,2.03C8.64,7.19,8.28,7,7.88,7C6.82,7,5.95,7.87,5.95,8.93
                    c0,0.22,0.04,0.42,0.11,0.62C4.68,10.4,3.5,11.85,3.5,13.5c0,2.49,2.01,4.5,4.49,4.5h10.5c2.49,0,4.5-2.01,4.5-4.5
                    C22.99,11.98,20.96,10,18.5,10z"/>
                </svg>
              </div>
            </div>
            
            {/* Rain icon */}
            <div className="absolute bottom-1/4 right-0 transform translate-x-1/2 translate-y-1/2" style={{ animation: 'counter-spin 20s linear infinite' }}>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500/50 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                <svg viewBox="0 0 24 24" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M18.5,6h-1.04c-0.1-2.48-2.14-4.5-4.65-4.5c-1.6,0-3.01,0.81-3.85,2.03C8.64,3.19,8.28,3,7.88,3
                    C6.82,3,5.95,3.87,5.95,4.93c0,0.22,0.04,0.42,0.11,0.62C4.68,6.4,3.5,7.85,3.5,9.5c0,2.49,2.01,4.5,4.49,4.5h10.5
                    c2.49,0,4.5-2.01,4.5-4.5C22.99,7.98,20.96,6,18.5,6z"/>
                  <line x1="8" y1="17" x2="6" y2="22" stroke="#00DDFF" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="17" x2="8" y2="22" stroke="#00DDFF" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="17" x2="14" y2="22" stroke="#00DDFF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            
            {/* Thunderstorm icon */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2" style={{ animation: 'counter-spin 20s linear infinite' }}>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-500/50 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(255,215,0,0.9)]">
                <svg viewBox="0 0 24 24" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFFFFF" d="M18.5,6h-1.04c-0.1-2.48-2.14-4.5-4.65-4.5c-1.6,0-3.01,0.81-3.85,2.03C8.64,3.19,8.28,3,7.88,3
                    C6.82,3,5.95,3.87,5.95,4.93c0,0.22,0.04,0.42,0.11,0.62C4.68,6.4,3.5,7.85,3.5,9.5c0,2.49,2.01,4.5,4.49,4.5h10.5
                    c2.49,0,4.5-2.01,4.5-4.5C22.99,7.98,20.96,6,18.5,6z"/>
                  <path fill="#FFEE00" d="M12,14l-2,5h3l-1,5l5-7h-3l1-3H12z"/>
                </svg>
              </div>
            </div>
            
            {/* Snow icon */}
            <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 translate-y-1/2" style={{ animation: 'counter-spin 20s linear infinite' }}>
              <div className="flex items-center justify-center w-16 h-16 bg-cyan-200/70 rounded-full backdrop-blur-sm shadow-[0_0_25px_rgba(255,255,255,1)]">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0V32" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M0 16H32" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M4.5 4.5L27.5 27.5" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M27.5 4.5L4.5 27.5" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            
            {/* Moon icon */}
            <div className="absolute top-1/4 left-0 transform -translate-x-1/2 -translate-y-1/2" style={{ animation: 'counter-spin 20s linear infinite' }}>
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-300/50 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(226,232,240,0.9)]">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,2.2c-0.5,0-1,0.1-1.5,0.1c2.9,1.7,4.9,4.8,4.9,8.4c0,5.3-4.3,9.7-9.7,9.7c-0.7,0-1.3-0.1-2-0.2
                    c1.7,1.7,4.1,2.8,6.7,2.8c5.3,0,9.7-4.3,9.7-9.7C20,7.5,16.5,3.4,12,2.2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-slate-300 font-medium animate-pulse"></p>
        <style>
          {`
          @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          @keyframes counter-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
          `}
        </style>
      </div>
    );
  };

  if (isLoading) {
    return <WeatherLoadingAnimation />;
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid-column pl-6"
    >
      {displayCards.map((card, index) => (
        <div 
          key={`${card.type}-${index}`} 
          className="mb-6"
          style={{ 
            opacity: visibleCards.includes(index) ? 1 : 0,
            transform: visibleCards.includes(index) ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
          }}
        >
          {renderCard(card)}
        </div>
      ))}
    </Masonry>
  );
} 