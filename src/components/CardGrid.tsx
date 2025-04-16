import React from 'react';
import { WeatherCardType } from '../types/weatherTypes';
import { CurrentWeatherCard } from './cards/CurrentWeatherCard';
import { ForecastCard } from './cards/ForecastCard';
import { OneCallCard } from './cards/OneCallCard';
import { AirPollutionCard } from './cards/AirPollutionCard';

interface CardGridProps {
  cards: WeatherCardType[];
}

export function CardGrid({ cards = [] }: CardGridProps) {
  // If no cards provided, show all card types with default params
  const displayCards = cards.length > 0 ? cards : [
    { type: 'current', parameters: { lat: 40.7128, lon: -74.0060, units: 'metric' } },
    { type: 'forecast', parameters: { lat: 40.7128, lon: -74.0060, units: 'metric' } },
    { type: 'onecall', parameters: { lat: 40.7128, lon: -74.0060, units: 'metric' } },
    { type: 'air_pollution', parameters: { lat: 40.7128, lon: -74.0060 } },
  ];

  const renderCard = (card: WeatherCardType) => {
    switch (card.type) {
      case 'current':
        return <CurrentWeatherCard key="current" initialParams={card.parameters} rationale={card.rationale} />;
      case 'forecast':
        return <ForecastCard key="forecast" initialParams={card.parameters} rationale={card.rationale} />;
      case 'onecall':
        return <OneCallCard key="onecall" initialParams={card.parameters} rationale={card.rationale} />;
      case 'air_pollution':
        return <AirPollutionCard key="air_pollution" initialParams={card.parameters} rationale={card.rationale} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
      {displayCards.map((card, index) => (
        <div key={`${card.type}-${index}`} className="col-span-1">
          {renderCard(card)}
        </div>
      ))}
    </div>
  );
} 