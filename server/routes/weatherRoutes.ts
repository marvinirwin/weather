import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_ONECALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Current Weather Data
router.get('/current', async (req, res) => {
  try {
    const { lat, lon, units = 'metric' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units,
        appid: OPENWEATHER_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// 5-day Forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, units = 'metric' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        units,
        appid: OPENWEATHER_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// One Call API (current weather + forecast + historical)
router.get('/onecall', async (req, res) => {
  try {
    const { lat, lon, exclude, units = 'metric' } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(`${OPENWEATHER_ONECALL_URL}`, {
      params: {
        lat,
        lon,
        exclude,
        units,
        appid: OPENWEATHER_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching one call data:', error);
    res.status(500).json({ error: 'Failed to fetch one call data' });
  }
});

// Air Pollution
router.get('/air_pollution', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching air pollution data:', error);
    res.status(500).json({ error: 'Failed to fetch air pollution data' });
  }
});

// Geocoding - direct (city name to coordinates)
router.get('/geocode/direct', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'City name is required' });
    }
    
    const response = await axios.get(`${OPENWEATHER_GEO_URL}/direct`, {
      params: {
        q,
        limit,
        appid: OPENWEATHER_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error geocoding:', error);
    res.status(500).json({ error: 'Failed to geocode location' });
  }
});

// Geocoding - reverse (coordinates to city name)
router.get('/geocode/reverse', async (req, res) => {
  try {
    const { lat, lon, limit = 5 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const response = await axios.get(`${OPENWEATHER_GEO_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit,
        appid: OPENWEATHER_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    res.status(500).json({ error: 'Failed to reverse geocode location' });
  }
});

export const weatherRoutes = router; 