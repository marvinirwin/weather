import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDebounce } from './useDebounce';

export interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useWeatherData<ParamType, ResponseType>(
  endpoint: string,
  params: ParamType,
  enabled: boolean = true
): FetchState<ResponseType> {
  const [state, setState] = useState<FetchState<ResponseType>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const debouncedParams = useDebounce(params, 500);

  useEffect(() => {
    if (!enabled) return;
    
    let isCancelled = false;
    
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const response = await axios.get<ResponseType>(`/api/weather/${endpoint}`, {
          params: debouncedParams
        });
        
        if (!isCancelled) {
          setState({
            data: response.data,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      }
    };

    fetchData();
    
    return () => {
      isCancelled = true;
    };
  }, [endpoint, debouncedParams, enabled]);

  return state;
} 