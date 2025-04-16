import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const router = express.Router();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_ONECALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const OPENWEATHER_HISTORY_URL = 'https://history.openweathermap.org/data/2.5';
const OPENWEATHER_SOLAR_URL = 'https://api.openweathermap.org/data/3.0/solar';

// Cache configuration
const CACHE_FILE_PATH = path.join('./weather-cache.json');
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

// Initialize cache
let weatherCache = {};

// Load cache from file
const loadCache = () => {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      weatherCache = JSON.parse(fileContent);
      
      // Clean expired cache entries
      const now = Date.now();
      Object.keys(weatherCache).forEach(key => {
        if (now - weatherCache[key].timestamp > CACHE_TTL) {
          delete weatherCache[key];
        }
      });
    }
  } catch (error) {
    console.error('Error loading cache:', error);
    weatherCache = {};
  }
};

// Save cache to file
const saveCache = () => {
  try {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(weatherCache), 'utf8');
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

// Load cache on startup
loadCache();

// Memoized API caller
const memoizedApiCall = async (url, params, endpoint) => {
  // Create a cache key from endpoint and params
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const now = Date.now();
  
  // Check if we have a valid cached response
  if (
    weatherCache[cacheKey] && 
    now - weatherCache[cacheKey].timestamp < CACHE_TTL
  ) {
    return weatherCache[cacheKey].data;
  }
  
  // If not in cache or expired, fetch from API
  const response = await axios.get(url, { params });
  
  // Store in cache
  weatherCache[cacheKey] = {
    data: response.data,
    timestamp: now
  };
  
  // Save updated cache to file
  saveCache();
  
  return response.data;
};

// Current Weather Data
router.get('/current', async (req, res) => {
  try {
    const { lat, lon, units = 'metric' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const data = await memoizedApiCall(
      `${OPENWEATHER_BASE_URL}/weather`,
      {
        lat,
        lon,
        units,
        appid: OPENWEATHER_API_KEY
      },
      'current'
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching current weather:', error.response?.data || error);
    return res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch weather data' });
  }
});

// 5-day Forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, units = 'metric' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const data = await memoizedApiCall(
      `${OPENWEATHER_BASE_URL}/forecast`,
      {
        lat,
        lon,
        units,
        appid: OPENWEATHER_API_KEY
      },
      'forecast'
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching forecast:', error.response?.data || error.message || error);
    return res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch forecast data' });
  }
});

// One Call API (current weather + forecast + historical)
router.get('/onecall', async (req, res) => {
  try {
    const { lat, lon, exclude, units = 'metric' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const data = await memoizedApiCall(
      `${OPENWEATHER_ONECALL_URL}`,
      {
        lat,
        lon,
        exclude,
        units,
        appid: OPENWEATHER_API_KEY
      },
      'onecall'
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching one call data:', error.response?.data || error.message || error);
    return res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch one call data' });
  }
});

// Air Pollution
router.get('/air_pollution', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const data = await memoizedApiCall(
      `${OPENWEATHER_BASE_URL}/air_pollution`,
      {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY
      },
      'air_pollution'
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching air pollution data:', error.response?.data || error.message || error);
    return res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch air pollution data' });
  }
});


// Geocoding - direct (city name to coordinates)
router.get('/geocode/direct', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'City name is required' });
    }
    
    const data = await memoizedApiCall(
      `${OPENWEATHER_GEO_URL}/direct`,
      {
        q,
        limit,
        appid: OPENWEATHER_API_KEY
      },
      'geocode_direct'
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error geocoding:', error.response?.data || error.message || error);
    return res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to geocode location' });
  }
});

// Geocoding - reverse (coordinates to city name)
router.get('/geocode/reverse', async (req, res) => {
  try {
    const { lat, lon, limit = 5 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const data = await memoizedApiCall(
      `${OPENWEATHER_GEO_URL}/reverse`,
      {
        lat,
        lon,
        limit,
        appid: OPENWEATHER_API_KEY
      },
      'geocode_reverse'
    );
    
    res.json(data);
  } catch (error) {
    console.error('Error reverse geocoding:', error.response?.data || error.message || error);
    return res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to reverse geocode location' });
  }
});

export const weatherRoutes = router; 