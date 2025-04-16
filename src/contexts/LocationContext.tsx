import React, { createContext, useContext, ReactNode } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

// Define the context value type
interface LocationContextType {
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  error: string | null;
  isLoading: boolean;
}

// Create context with default values
const LocationContext = createContext<LocationContextType>({
  latitude: null,
  longitude: null,
  cityName: null,
  error: null,
  isLoading: false
});

// Provider component that wraps the app and provides the geolocation data
export function LocationProvider({ children }: { children: ReactNode }) {
  // Use our existing geolocation hook to get the location data
  const locationData = useGeolocation();
  
  return (
    <LocationContext.Provider value={locationData}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook to use the location context
export function useLocation() {
  return useContext(LocationContext);
} 