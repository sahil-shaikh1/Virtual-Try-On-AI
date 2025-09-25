import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

// Add API URL configuration
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.onrender.com'
  : 'http://localhost:3001';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
