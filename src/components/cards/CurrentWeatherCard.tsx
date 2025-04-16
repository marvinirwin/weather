import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { useWeatherData } from '../../hooks/useWeatherData';
import { CurrentWeatherData, CurrentWeatherParams } from '../../types/weatherTypes';

const DEFAULT_PARAMS: CurrentWeatherParams = {
  lat: 40.7128,
  lon: -74.0060,
  units: 'metric'
};

const UNITS_OPTIONS = [
  { value: 'metric', label: 'Celsius (°C)' },
  { value: 'imperial', label: 'Fahrenheit (°F)' },
  { value: 'standard', label: 'Kelvin (K)' }
];

interface CurrentWeatherCardProps {
  initialParams?: Partial<CurrentWeatherParams>;
  rationale?: string;
}

export function CurrentWeatherCard({ initialParams, rationale }: CurrentWeatherCardProps) {
  const [params, setParams] = useState<CurrentWeatherParams>({
    ...DEFAULT_PARAMS,
    ...initialParams
  });

  const { data, isLoading, error } = useWeatherData<CurrentWeatherParams, CurrentWeatherData>(
    'current',
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

  return (
    <Card 
      title="Current Weather" 
      isLoading={isLoading}
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
            id="current-lat"
            isLoading={isLoading}
          />
          <InputField
            label="Longitude"
            type="number"
            value={params.lon}
            onChange={handleLonChange}
            step="0.0001"
            id="current-lon"
            isLoading={isLoading}
          />
        </div>
        
        <SelectField
          label="Temperature Units"
          id="current-units"
          value={params.units}
          onChange={handleUnitsChange}
          options={UNITS_OPTIONS}
          isLoading={isLoading}
        />

        {data && (
          <div className="mt-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{data.name}, {data.sys.country}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(data.dt * 1000).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{formatTemp(data.main.temp)}</div>
                <div className="text-sm text-gray-500">Feels like {formatTemp(data.main.feels_like)}</div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              {data.weather[0] && (
                <>
                  <img 
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} 
                    alt={data.weather[0].description}
                    className="w-16 h-16"
                  />
                  <div className="ml-2">
                    <div className="text-lg font-medium capitalize">{data.weather[0].description}</div>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Humidity</div>
                <div className="text-lg">{data.main.humidity}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Wind</div>
                <div className="text-lg">
                  {data.wind.speed} {params.units === 'imperial' ? 'mph' : 'm/s'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Pressure</div>
                <div className="text-lg">{data.main.pressure} hPa</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Visibility</div>
                <div className="text-lg">{(data.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm text-gray-500">Sunrise & Sunset</div>
              <div className="flex justify-between mt-1">
                <div>
                  <div className="text-xs text-gray-500">Sunrise</div>
                  <div className="text-sm">
                    {new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Sunset</div>
                  <div className="text-sm">
                    {new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 