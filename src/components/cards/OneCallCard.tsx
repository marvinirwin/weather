import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { InputField } from '../ui/InputField';
import { SelectField } from '../ui/SelectField';
import { useWeatherData } from '../../hooks/useWeatherData';
import { OneCallData, OneCallParams } from '../../types/weatherTypes';
import { CurrentWeatherDisplay } from './subcomponents/CurrentWeatherDisplay';
import { DailyForecastDisplay } from './subcomponents/DailyForecastDisplay';
import { HourlyForecastDisplay } from './subcomponents/HourlyForecastDisplay';
import { MinutelyForecastDisplay } from './subcomponents/MinutelyForecastDisplay';

// Define the OneCall API response structure
interface OneCallData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  hourly?: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
  }>;
  daily?: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: number;
    pop: number;
    uvi: number;
  }>;
}

const DEFAULT_PARAMS: OneCallParams = {
  lat: 40.7128,
  lon: -74.0060,
  units: 'metric',
  exclude: ''
};

const UNITS_OPTIONS = [
  { value: 'metric', label: 'Celsius (°C)' },
  { value: 'imperial', label: 'Fahrenheit (°F)' },
  { value: 'standard', label: 'Kelvin (K)' }
];

const EXCLUDE_OPTIONS = [
  { value: '', label: 'All Data' },
  { value: 'minutely', label: 'Exclude Minutely' },
  { value: 'hourly', label: 'Exclude Hourly' },
  { value: 'daily', label: 'Exclude Daily' },
  { value: 'hourly,daily', label: 'Current Only' }
];

interface OneCallCardProps {
  initialParams?: Partial<OneCallParams>;
  rationale?: string;
}

export function OneCallCard({ initialParams, rationale }: OneCallCardProps) {
  const [params, setParams] = useState<OneCallParams>({
    ...DEFAULT_PARAMS,
    ...initialParams
  });

  const { data, isLoading, error } = useWeatherData<OneCallParams, OneCallData>(
    'onecall',
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

  const handleExcludeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams(prev => ({ ...prev, exclude: e.target.value }));
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

  // Format date with weekday
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      title="One Call API" 
      isLoading={isLoading}
      error={error}
      rationale={rationale}
    >
      <div className="space-y-6">
        <div className="space-y-4 p-4 bg-slate-800 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Latitude"
              type="number"
              value={params.lat}
              onChange={handleLatChange}
              step="0.0001"
              id="onecall-lat"
              isLoading={isLoading}
            />
            <InputField
              label="Longitude"
              type="number"
              value={params.lon}
              onChange={handleLonChange}
              step="0.0001"
              id="onecall-lon"
              isLoading={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Temperature Units"
              id="onecall-units"
              value={params.units}
              onChange={handleUnitsChange}
              options={UNITS_OPTIONS}
              isLoading={isLoading}
            />
            <SelectField
              label="Exclude Data"
              id="onecall-exclude"
              value={params.exclude}
              onChange={handleExcludeChange}
              options={EXCLUDE_OPTIONS}
              isLoading={isLoading}
            />
          </div>
        </div>

        {data && (
          <div className="mt-6">
            <div className="bg-slate-700 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">{data.timezone.split('/').pop()?.replace('_', ' ')}</h3>
                  <p className="text-sm text-slate-400">
                    {formatDate(data.current.dt)} {formatTime(data.current.dt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{formatTemp(data.current.temp)}</div>
                  <div className="text-sm text-slate-400">Feels like {formatTemp(data.current.feels_like)}</div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                {data.current.weather[0] && (
                  <>
                    <img 
                      src={`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`} 
                      alt={data.current.weather[0].description}
                      className="w-16 h-16"
                    />
                    <div className="ml-2">
                      <div className="text-lg font-medium capitalize text-white">{data.current.weather[0].description}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-slate-200">
                <div>
                  <span className="text-slate-400">Humidity:</span> {data.current.humidity}%
                </div>
                <div>
                  <span className="text-slate-400">Wind:</span> {data.current.wind_speed} {params.units === 'imperial' ? 'mph' : 'm/s'}
                </div>
                <div>
                  <span className="text-slate-400">UV Index:</span> {data.current.uvi}
                </div>
                <div>
                  <span className="text-slate-400">Visibility:</span> {(data.current.visibility / 1000).toFixed(1)} km
                </div>
              </div>
              
              <div className="mt-3 flex justify-between text-sm text-slate-200">
                <div>
                  <span className="text-slate-400">Sunrise:</span> {formatTime(data.current.sunrise)}
                </div>
                <div>
                  <span className="text-slate-400">Sunset:</span> {formatTime(data.current.sunset)}
                </div>
              </div>
            </div>
            
            {data.hourly && !params.exclude?.includes('hourly') && (
              <div className="mb-6">
                <h4 className="font-medium text-white mb-3">Hourly Forecast</h4>
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-4">
                    {data.hourly.slice(0, 24).map(hour => (
                      <div key={hour.dt} className="flex-shrink-0 text-center w-16">
                        <div className="text-xs text-slate-400">{formatTime(hour.dt)}</div>
                        <img 
                          src={`https://openweathermap.org/img/wn/${hour.weather[0]?.icon}.png`}
                          alt={hour.weather[0]?.description || ''}
                          className="w-10 h-10 mx-auto"
                        />
                        <div className="text-sm font-medium text-slate-200">{formatTemp(hour.temp)}</div>
                        <div className="text-xs text-slate-400">{Math.round(hour.pop * 100)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {data.daily && !params.exclude?.includes('daily') && (
              <div>
                <h4 className="font-medium text-white mb-3">7-Day Forecast</h4>
                <div className="space-y-3">
                  {data.daily.slice(0, 7).map(day => (
                    <div key={day.dt} className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                      <div className="w-24 text-sm text-slate-200">{formatDate(day.dt)}</div>
                      <div className="flex items-center flex-1">
                        <img
                          src={`https://openweathermap.org/img/wn/${day.weather[0]?.icon}.png`}
                          alt={day.weather[0]?.description || ''}
                          className="w-10 h-10"
                        />
                        <div className="capitalize text-sm text-slate-200 ml-1">
                          {day.weather[0]?.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">{formatTemp(day.temp.max)}</div>
                        <div className="text-xs text-slate-400">{formatTemp(day.temp.min)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}