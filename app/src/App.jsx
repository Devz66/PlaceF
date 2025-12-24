import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardMap from './pages/DashboardMap';
import DashboardReports from './pages/DashboardReports';
import DashboardFleet from './pages/DashboardFleet';
import DashboardHistory from './pages/DashboardHistory';
import DashboardAlerts from './pages/DashboardAlerts';
import DashboardGeofence from './pages/DashboardGeofence';
import DashboardCommands from './pages/DashboardCommands';
import DashboardTelemetry from './pages/DashboardTelemetry';
import DashboardFinancial from './pages/DashboardFinancial';
import DashboardSettings from './pages/DashboardSettings';

// Simple placeholder for modules under development
const PlaceholderModule = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
    <div className="text-6xl mb-4 grayscale opacity-50">🚧</div>
    <h2 className="text-2xl font-bold text-gray-700 mb-2">{title}</h2>
    <p className="text-gray-500 max-w-md">
      Este módulo está em desenvolvimento e estará disponível em breve. 
      Estamos trabalhando para trazer a melhor experiência para você.
    </p>
    <button className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
      Voltar ao Painel
    </button>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardMap />} />
            <Route path="history" element={<DashboardHistory />} />
            <Route path="alerts" element={<DashboardAlerts />} />
            <Route path="geofence" element={<DashboardGeofence />} />
            <Route path="reports" element={<DashboardReports />} />
            <Route path="commands" element={<DashboardCommands />} />
            <Route path="telemetry" element={<DashboardTelemetry />} />
            <Route path="fleet" element={<DashboardFleet />} />
            <Route path="financial" element={<DashboardFinancial />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
        </Route>
        {/* Redirect any unknown route to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
