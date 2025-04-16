import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null, 
    cityName: null,
    error: null,
    isLoading: true
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeolocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        isLoading: false
      }));
      return;
    }

    // Get current position - this will trigger the browser's permission dialog
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get city name using reverse geocoding
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to get location name');
          }
          
          const data = await response.json();
          const cityName = data.length > 0 ? data[0].name : null;
          
          setGeolocation({
            latitude,
            longitude,
            cityName,
            error: null,
            isLoading: false
          });
        } catch (error) {
          // Still set coordinates even if reverse geocoding fails
          setGeolocation({
            latitude,
            longitude,
            cityName: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false
          });
        }
      },
      (error) => {
        setGeolocation(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  return geolocation;
} 