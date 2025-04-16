import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../ui/Card';
import { InputField } from '../ui/InputField';
import { useWeatherData } from '../../hooks/useWeatherData';
import { GeocodingData, GeocodingParams } from '../../types/weatherTypes';

const DEFAULT_PARAMS: GeocodingParams = {
  query: 'New York',
  limit: 5
};

interface GeocodingCardProps {
  initialParams?: Partial<GeocodingParams>;
  rationale?: string;
}

export function GeocodingCard({ initialParams, rationale }: GeocodingCardProps) {
  const [params, setParams] = useState<GeocodingParams>({
    ...DEFAULT_PARAMS,
    ...initialParams
  });

  // Transform the params to match the API's expected format
  // Use useMemo to prevent recreating the object on every render
  const transformedParams = useMemo(() => ({
    q: params.query,
    limit: params.limit
  }), [params.query, params.limit]);

  const { data, isLoading, error } = useWeatherData<typeof transformedParams, GeocodingData>(
    'geocode/direct',
    transformedParams
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, query: e.target.value }));
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limit = parseInt(e.target.value);
    if (!isNaN(limit) && limit > 0) {
      setParams(prev => ({ ...prev, limit }));
    }
  };

  return (
    <Card 
      title="Geocoding" 
      isLoading={isLoading}
      error={error}
      rationale={rationale}
    >
      <div className="space-y-4">
        <InputField
          label="City Name"
          type="text"
          value={params.query}
          onChange={handleQueryChange}
          id="geocoding-query"
          isLoading={isLoading}
          placeholder="Enter city name, state code and country code"
        />
        
        <InputField
          label="Results Limit"
          type="number"
          value={params.limit}
          onChange={handleLimitChange}
          min={1}
          max={10}
          id="geocoding-limit"
          isLoading={isLoading}
        />

        {data && data.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-4">Search Results</h3>
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
            No results found for "{params.query}"
          </div>
        )}
      </div>
    </Card>
  );
} 