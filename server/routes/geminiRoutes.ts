import express from 'express';
import { callGeminiTextOnly } from '../gemini.server.js';
import { WeatherCardType } from '../../src/types/weatherTypes.js';
import { SchemaType } from '@google/generative-ai';

const router = express.Router();

// Available card types with descriptions
const AVAILABLE_CARD_TYPES = [
  {
    type: 'current',
    name: 'Current Weather',
    description: 'Shows the current weather conditions for a location including temperature, humidity, wind speed, and conditions.',
    parameters: ['lat', 'lon', 'units'],
  },
  {
    type: 'forecast',
    name: '5-Day Forecast',
    description: 'Shows a 5-day weather forecast with 3-hour intervals for a location.',
    parameters: ['lat', 'lon', 'units'],
  },
  {
    type: 'onecall',
    name: 'Complete Weather Data',
    description: 'Provides current weather, minute forecast for 1 hour, hourly forecast for 48 hours, daily forecast for 7 days, and historical data for 5 previous days.',
    parameters: ['lat', 'lon', 'exclude', 'units'],
  },
  {
    type: 'air_pollution',
    name: 'Air Pollution',
    description: 'Shows air quality data including Air Quality Index (AQI) and concentrations of various pollutants.',
    parameters: ['lat', 'lon'],
  },
  {
    type: 'geocode/direct',
    name: 'Geocoding',
    description: 'Converts location names to geographic coordinates (latitude and longitude).',
    parameters: ['q', 'limit'],
  },
  {
    type: 'geocode/reverse',
    name: 'Reverse Geocoding',
    description: 'Converts geographic coordinates to location names and address details.',
    parameters: ['lat', 'lon', 'limit'],
  },
];

interface GeminiResponse {
  cards: WeatherCardType[];
}

// Generate custom layout with cards based on user query
router.post('/generate-layout', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    console.log('Processing query:', query);
    
    const prompt = `
    You are a weather planning assistant. Based on the user's query, select the most relevant weather data cards to display.
    
    User query: "${query}"
    
    Available card types:
    ${AVAILABLE_CARD_TYPES.map(card => (
      `- Type: ${card.type}
       Name: ${card.name}
       Description: ${card.description}
       Parameters: ${card.parameters.join(', ')}`
    )).join('\n\n')}
    
    For each card you select, provide:
    1. Type (must be one of the available types)
    2. Parameters (provide latitude and longitude for the relevant location, and any other required parameters)
    3. Rationale (why this card is useful for the user's query, explain it in a personal way like "this seven day forecast will help you plan your trip")
    
    Return the response as a JSON object with a "cards" array. Each card in the array should have "type", "parameters", and "rationale" properties.
    
    For locations, use real-world coordinates (latitude and longitude). If the user doesn't specify a location, use New York City (40.7128, -74.0060) as the default.
    
    Example response format:
    {
      "cards": [
        {
          "type": "current",
          "parameters": {
            "lat": 40.7128,
            "lon": -74.0060,
            "units": "metric"
          },
          "rationale": "The user needs to know current conditions for planning today's activities."
        }
      ]
    }
    `;
    
    const response = await callGeminiTextOnly<GeminiResponse>(prompt, {
      functions: [
        {
          name: 'generateWeatherLayout',
          description: 'Generate a custom layout of weather cards based on the user query',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              cards: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    type: {
                      type: SchemaType.STRING,
                      enum: AVAILABLE_CARD_TYPES.map(card => card.type)
                    },
                    parameters: {
                      type: SchemaType.OBJECT,
                      properties: {
                        lat: { type: SchemaType.NUMBER },
                        lon: { type: SchemaType.NUMBER },
                        units: { type: SchemaType.STRING, enum: ['standard', 'metric', 'imperial'] },
                        exclude: { type: SchemaType.STRING }
                      }
                    },
                    rationale: { type: SchemaType.STRING }
                  },
                  required: ['type', 'parameters', 'rationale']
                }
              }
            },
            required: ['cards']
          }
        }
      ],
      functionCall: { name: 'generateWeatherLayout' }
    });
    
    res.json(response);
  } catch (error) {
    console.error('Error generating layout with Gemini:', error);
    res.status(500).json({ error: 'Failed to generate layout' });
  }
});

export const geminiRoutes = router; 