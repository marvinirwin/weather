import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { useWeatherData } from '../../hooks/useWeatherData';
import { ForecastData, ForecastParams } from '../../types/weatherTypes';
import { useLocation } from '../../contexts/LocationContext';

const DEFAULT_PARAMS: ForecastParams = {
  lat: 40.7128,
  lon: -74.0060,
  units: 'metric'
};

const UNITS_OPTIONS = [
  { value: 'metric', label: 'Celsius (°C)' },
  { value: 'imperial', label: 'Fahrenheit (°F)' },
  { value: 'standard', label: 'Kelvin (K)' }
];

interface ForecastCardProps {
  initialParams?: Partial<ForecastParams>;
  rationale?: string;
}

export function ForecastCard({ initialParams, rationale }: ForecastCardProps) {
  const { latitude, longitude, isLoading: isLoadingLocation } = useLocation();
  
  const [params, setParams] = useState<ForecastParams>({
    ...DEFAULT_PARAMS,
    ...initialParams
  });

  // Update coordinates when geolocation is retrieved
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setParams(prev => ({ 
        ...prev, 
        lat: latitude, 
        lon: longitude 
      }));
    }
  }, [latitude, longitude]);

  const { data, isLoading, error } = useWeatherData<ForecastParams, ForecastData>(
    'forecast',
    params
  );

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = parseFloat(e.target.value);
    if (!isNaN(lat)) {
      setParams(prev => ({ ...prev, lat }));
    }
  };

  const handleLonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lon = parseFloat(e.target.value);
    if (!isNaN(lon)) {
      setParams(prev => ({ ...prev, lon }));
    }
  };

  const handleUnitsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams(prev => ({ 
      ...prev, 
      units: e.target.value as 'metric' | 'imperial' | 'standard' 
    }));
  };

  // Format temperature based on units
  const formatTemp = (temp?: number) => {
    if (temp === undefined) return '';
    
    switch (params.units) {
      case 'metric':
        return `${Math.round(temp)}°C`;
      case 'imperial':
        return `${Math.round(temp)}°F`;
      default:
        return `${Math.round(temp)}K`;
    }
  };

  // Group forecast data by day
  const groupByDay = (forecastData: ForecastData | null | undefined) => {
    if (!forecastData || !forecastData.list) return [];

    const grouped: Record<string, typeof forecastData.list> = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(item);
    });
    
    return Object.entries(grouped).map(([date, items]) => ({
      date,
      items,
      // Find min and max temps for the day
      minTemp: Math.min(...items.map(item => item.main.temp_min)),
      maxTemp: Math.max(...items.map(item => item.main.temp_max)),
      // Get most common weather condition for the day
      mainWeather: getMostCommonWeather(items)
    }));
  };

  // Find the most common weather condition
  const getMostCommonWeather = (items) => {
    if (!items) return null;
    
    const counts: Record<string, { count: number; icon: string; description: string }> = {};
    
    items.forEach(item => {
      if (item.weather && item.weather[0]) {
        const { main, icon, description } = item.weather[0];
        
        if (!counts[main]) {
          counts[main] = { count: 0, icon, description };
        }
        
        counts[main].count++;
      }
    });
    
    let mostCommon = { main: '', count: 0, icon: '', description: '' };
    
    Object.entries(counts).forEach(([main, data]) => {
      if (data.count > mostCommon.count) {
        mostCommon = { main, ...data };
      }
    });
    
    return {
      main: mostCommon.main,
      icon: mostCommon.icon,
      description: mostCommon.description
    };
  };

  const groupedData = groupByDay(data);

  return (
    <Card 
      title="5-Day Forecast" 
      isLoading={isLoading || isLoadingLocation}
      error={error}
      rationale={rationale}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Latitude"
            type="number"
            value={params.lat}
            onChange={handleLatChange}
            step="0.0001"
            id="forecast-lat"
            isLoading={isLoading || isLoadingLocation}
          />
          <InputField
            label="Longitude"
            type="number"
            value={params.lon}
            onChange={handleLonChange}
            step="0.0001"
            id="forecast-lon"
            isLoading={isLoading || isLoadingLocation}
          />
        </div>
        
        <SelectField
          label="Temperature Units"
          id="forecast-units"
          value={params.units}
          onChange={handleUnitsChange}
          options={UNITS_OPTIONS}
          isLoading={isLoading}
        />

        {data && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              {data.city.name}, {data.city.country}
            </h3>
            
            <div className="space-y-4">
              {groupedData.map((day) => (
                <div key={day.date} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-white">
                      {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center">
                      {day.mainWeather && (
                        <img 
                          src={`https://openweathermap.org/img/wn/${day.mainWeather.icon}.png`}
                          alt={day.mainWeather.description}
                          className="w-10 h-10"
                        />
                      )}
                      <div className="text-right ml-2">
                        <div className="text-sm font-medium text-white">{formatTemp(day.maxTemp)}</div>
                        <div className="text-xs text-slate-400">{formatTemp(day.minTemp)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 overflow-x-auto">
                    <div className="flex gap-3 pb-2">
                      {day.items.map((item) => (
                        <div key={item.dt} className="flex-shrink-0 text-center">
                          <div className="text-xs text-slate-400">
                            {new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <img 
                            src={`https://openweathermap.org/img/wn/${item.weather[0]?.icon}.png`}
                            alt={item.weather[0]?.description || ''}
                            className="w-8 h-8 mx-auto"
                          />
                          <div className="text-xs font-medium text-slate-200">{formatTemp(item.main.temp)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 