import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './components/App'; // Home Page Component
import Details from './components/Details'; // Details Page Component
/**
 * This file can be ignored, please work in ./components/App.jsx
 */

// Include mock API.
import './mock';

// Include styles.
import './styles/index.css';


const rootElemnt = document.getElementById('root');
const root = createRoot(rootElemnt);
root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/details" element={<Details />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
