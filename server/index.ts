import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { weatherRoutes } from './routes/weatherRoutes.js';
import { geminiRoutes } from './routes/geminiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Setup for ES modules to use __dirname
// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join('./dist')));

// Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/gemini', geminiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 