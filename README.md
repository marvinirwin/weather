# Open Weather Planner

A modern web application for planning activities based on weather conditions. Built using React, TypeScript, Express, and integrated with OpenWeatherMap API and Google's Gemini AI.

## Features

- Display current weather conditions
- View 5-day weather forecasts
- Access comprehensive weather data with OneCall API
- Check air pollution information
- Use AI-powered planning with Gemini to suggest weather cards based on your activities

## Prerequisites

- Node.js 18+
- An OpenWeatherMap API key (get one at [https://openweathermap.org/api](https://openweathermap.org/api))
- A Google Gemini API key (get one at [https://ai.google.dev/](https://ai.google.dev/))

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weather-api.git
   cd weather-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your API keys:
   ```
   OPENWEATHER_API_KEY=your_openweather_api_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3001
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. In a separate terminal, run the backend server:
   ```
   npm run dev:server
   ```

6. Open your browser and visit `http://localhost:5173`

## Docker Deployment

To build and run using Docker:

```
docker build -t weather-planner .
docker run -p 3001:3001 --env-file .env weather-planner
```

Then visit `http://localhost:3001` in your browser.

## Project Structure

- `/src` - React frontend code
  - `/components` - UI components
  - `/hooks` - Custom React hooks
  - `/types` - TypeScript type definitions
- `/server` - Express backend code
  - `/routes` - API route handlers

## Technologies Used

- React
- TypeScript
- Express.js
- Tailwind CSS
- OpenWeatherMap API
- Google Gemini AI
- Vite

## License

MIT 