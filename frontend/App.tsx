import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';

import Support from './pages/Support';
import Appointments from './pages/Appointments';
import MentalWellness from './pages/MentalWellness';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/mental" element={<MentalWellness />} />
        <Route path="/support" element={<Support />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </Layout>
  );
}

export default App;
