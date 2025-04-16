import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LocationProvider } from './contexts/LocationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <LocationProvider>
        <App />
    </LocationProvider>
); 