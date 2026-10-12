import React from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App, { ErrorBoundary } from './App.jsx';
import './styles.css';
import './responsive.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><ErrorBoundary><App /></ErrorBoundary><Analytics /></React.StrictMode>);
