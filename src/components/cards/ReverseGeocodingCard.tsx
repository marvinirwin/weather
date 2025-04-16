import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { InputField } from '../ui/InputField';
import { useWeatherData } from '../../hooks/useWeatherData';
import { GeocodingData, ReverseGeocodingParams } from '../../types/weatherTypes';
import { useLocation } from '../../contexts/LocationContext';

const DEFAULT_PARAMS: ReverseGeocodingParams = {
  lat: 40.7128,
  lon: -74.0060,
  limit: 5
};

interface ReverseGeocodingCardProps {
  initialParams?: Partial<ReverseGeocodingParams>;
  rationale?: string;
}

export function ReverseGeocodingCard({ initialParams, rationale }: ReverseGeocodingCardProps) {
  const { latitude, longitude, isLoading: isLoadingLocation } = useLocation();
  
  const [params, setParams] = useState<ReverseGeocodingParams>({
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

  const { data, isLoading, error } = useWeatherData<ReverseGeocodingParams, GeocodingData>(
    'geocode/reverse',
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

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limit = parseInt(e.target.value);
    if (!isNaN(limit) && limit > 0) {
      setParams(prev => ({ ...prev, limit }));
    }
  };

  return (
    <Card 
      title="Reverse Geocoding" 
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
            id="reverse-geocoding-lat"
            isLoading={isLoading || isLoadingLocation}
          />
          <InputField
            label="Longitude"
            type="number"
            value={params.lon}
            onChange={handleLonChange}
            step="0.0001"
            id="reverse-geocoding-lon"
            isLoading={isLoading || isLoadingLocation}
          />
        </div>
        
        <InputField
          label="Results Limit"
          type="number"
          value={params.limit}
          onChange={handleLimitChange}
          min={1}
          max={10}
          id="reverse-geocoding-limit"
          isLoading={isLoading}
        />

        {data && data.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-4">Location Results</h3>
            <div className="space-y-3">
              {data.map((location, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-4">
                  <div className="text-lg font-medium text-white">{location.name}</div>
                  <div className="text-sm text-slate-400">
                    {location.state && `${location.state}, `}{location.country}
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    <div>Latitude: {location.lat}</div>
                    <div>Longitude: {location.lon}</div>
                  </div>
                  {location.local_names && (
                    <div className="mt-2">
                      <div className="text-xs text-slate-400">Local Names:</div>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {Object.entries(location.local_names).slice(0, 6).map(([lang, name]) => (
                          <div key={lang} className="text-xs text-slate-300">
                            <span className="text-slate-400">{lang}:</span> {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data && data.length === 0 && (
          <div className="mt-6 text-center text-slate-400">
            No locations found for these coordinates
          </div>
        )}
      </div>
    </Card>
  );
} 