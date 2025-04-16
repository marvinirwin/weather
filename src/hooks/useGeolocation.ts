import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  error: string | null;
  isLoading: boolean;
  permissionState: PermissionState | 'not-requested';
}

// All possible permission states
type PermissionState = 'granted' | 'denied' | 'prompt' | 'unavailable';

export function useGeolocation() {
  const [geolocation, setGeolocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null, 
    cityName: null,
    error: null,
    isLoading: false,
    permissionState: 'not-requested'
  });

  // Function to check browser permission status
  const checkPermissionStatus = useCallback(async (): Promise<PermissionState> => {
    if (!navigator.permissions || !navigator.geolocation) {
      return 'unavailable';
    }

    try {
      const { state } = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return state as PermissionState;
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      return 'unavailable';
    }
  }, []);

  // Function to request location (can be called from components)
  const requestLocation = useCallback(async () => {
    setGeolocation(prev => ({ ...prev, isLoading: true }));
    
    // First, check current permission status
    const permissionState = await checkPermissionStatus();
    setGeolocation(prev => ({ ...prev, permissionState }));
    
    // Don't try to get location if permission is denied
    if (permissionState === 'denied' || permissionState === 'unavailable') {
      setGeolocation(prev => ({
        ...prev,
        error: permissionState === 'denied' 
          ? 'Location permission denied. Please enable location services for this site.'
          : 'Geolocation is not supported by your browser',
        isLoading: false
      }));
      return;
    }

    // Get current position
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
            isLoading: false,
            permissionState: 'granted'
          });
        } catch (error) {
          // Still set coordinates even if reverse geocoding fails
          setGeolocation({
            latitude,
            longitude,
            cityName: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
            permissionState: 'granted'
          });
        }
      },
      (error) => {
        const errorMessage = error.code === 1 
          ? 'Location permission denied. Please enable location services for this site.'
          : error.message;
        
        setGeolocation(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          permissionState: error.code === 1 ? 'denied' : prev.permissionState
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [checkPermissionStatus]);

  // Check permission status on mount without requesting location
  useEffect(() => {
    const checkInitialPermission = async () => {
      const permissionState = await checkPermissionStatus();
      setGeolocation(prev => ({ ...prev, permissionState }));
      
      // Auto-request if permission is already granted
      if (permissionState === 'granted') {
        requestLocation();
      }
    };
    
    checkInitialPermission();
  }, [checkPermissionStatus, requestLocation]);

  return { ...geolocation, requestLocation };
} 