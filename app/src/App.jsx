import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardMap from './pages/DashboardMap';
import DashboardReports from './pages/DashboardReports';
import DashboardFleet from './pages/DashboardFleet';

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
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardMap />} />
          <Route path="history" element={<PlaceholderModule title="Histórico de Rotas" />} />
          <Route path="alerts" element={<PlaceholderModule title="Gestão de Alertas" />} />
          <Route path="geofence" element={<PlaceholderModule title="Cercas Virtuais" />} />
          <Route path="reports" element={<DashboardReports />} />
          <Route path="commands" element={<PlaceholderModule title="Envio de Comandos" />} />
          <Route path="telemetry" element={<PlaceholderModule title="Telemetria Avançada" />} />
          <Route path="fleet" element={<DashboardFleet />} />
          <Route path="settings" element={<PlaceholderModule title="Configurações do Sistema" />} />
        </Route>
        {/* Redirect any unknown route to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
