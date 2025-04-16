import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { InputField } from '../ui/InputField';
import { useWeatherData } from '../../hooks/useWeatherData';
import { AirPollutionData, AirPollutionParams } from '../../types/weatherTypes';

const DEFAULT_PARAMS: AirPollutionParams = {
  lat: 40.7128,
  lon: -74.0060
};

interface AirPollutionCardProps {
  initialParams?: Partial<AirPollutionParams>;
  rationale?: string;
}

export function AirPollutionCard({ initialParams, rationale }: AirPollutionCardProps) {
  const [params, setParams] = useState<AirPollutionParams>({
    ...DEFAULT_PARAMS,
    ...initialParams
  });

  const { data, isLoading, error } = useWeatherData<AirPollutionParams, AirPollutionData>(
    'air_pollution',
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

  // Get AQI label and color
  const getAqiInfo = (aqi: number) => {
    switch (aqi) {
      case 1:
        return { label: 'Good', color: 'bg-green-500' };
      case 2:
        return { label: 'Fair', color: 'bg-yellow-400' };
      case 3:
        return { label: 'Moderate', color: 'bg-orange-400' };
      case 4:
        return { label: 'Poor', color: 'bg-red-500' };
      case 5:
        return { label: 'Very Poor', color: 'bg-purple-600' };
      default:
        return { label: 'Unknown', color: 'bg-slate-400' };
    }
  };

  return (
    <Card 
      title="Air Pollution"
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
            id="air-lat"
            isLoading={isLoading}
          />
          <InputField
            label="Longitude"
            type="number"
            value={params.lon}
            onChange={handleLonChange}
            step="0.0001"
            id="air-lon"
            isLoading={isLoading}
          />
        </div>

        {data && data.list && data.list.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-white">Air Quality Index</h3>
                <p className="text-sm text-slate-400">
                  {new Date(data.list[0].dt * 1000).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                {(() => {
                  const aqiInfo = getAqiInfo(data.list[0].main.aqi);
                  return (
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full ${aqiInfo.color} flex items-center justify-center text-white font-bold`}>
                        {data.list[0].main.aqi}
                      </div>
                      <div className="text-sm mt-1 text-slate-200">{aqiInfo.label}</div>
                    </div>
                  );
                })()}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white mb-3">Pollutants Concentration (μg/m³)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400">Carbon Monoxide (CO)</div>
                  <div className="text-sm font-medium text-slate-200">{data.list[0].components.co.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Nitrogen Dioxide (NO₂)</div>
                  <div className="text-sm font-medium text-slate-200">{data.list[0].components.no2.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Ozone (O₃)</div>
                  <div className="text-sm font-medium text-slate-200">{data.list[0].components.o3.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Sulphur Dioxide (SO₂)</div>
                  <div className="text-sm font-medium text-slate-200">{data.list[0].components.so2.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Fine Particles (PM2.5)</div>
                  <div className="text-sm font-medium text-slate-200">{data.list[0].components.pm2_5.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Coarse Particles (PM10)</div>
                  <div className="text-sm font-medium text-slate-200">{data.list[0].components.pm10.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-slate-400">
              <p>AQI scale (1-5): 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 