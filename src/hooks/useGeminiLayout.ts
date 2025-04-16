import { useState } from 'react';
import axios from 'axios';
import { WeatherLayout } from '../types/weatherTypes';

interface GeminiLayoutState {
  layout: WeatherLayout | null;
  isLoading: boolean;
  error: string | null;
}

export function useGeminiLayout() {
  const [state, setState] = useState<GeminiLayoutState>({
    layout: null,
    isLoading: false,
    error: null,
  });

  const generateLayout = async (query: string) => {
    // If the query is empty, reset state and do nothing else
    if (query.trim() === '') {
      setState({
        layout: null,
        isLoading: false,
        error: null,
      });
      return; // Exit early
    }

    setState({
      layout: null,
      isLoading: true,
      error: null,
    });

    try {
      const response = await axios.post<WeatherLayout>('/api/gemini/generate-layout', {
        query,
      });

      setState({
        layout: response.data,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      setState({
        layout: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  };

  return {
    ...state,
    generateLayout,
  };
} 