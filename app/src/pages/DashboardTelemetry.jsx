import React, { useState, useEffect } from 'react';
import { Activity, Gauge, Battery, Thermometer, AlertCircle, TrendingUp, Cpu, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';

const TelemetryCard = ({ title, value, unit, icon: Icon, color, trend }) => {
  // Safety check for Icon
  const IconComponent = Icon || Activity; 
  // Safety check for color
  const safeColor = color || 'bg-blue-500';
  const pulseColor = safeColor.replace('bg-', 'text-'); // Fixed logic: bg-blue-500 -> text-blue-500 for text color

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1">
          <IconComponent size={14} className="text-gray-400" /> {title}
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {value} <span className="text-sm font-normal text-gray-400">{unit}</span>
        </div>
        {trend && (
          <div className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% vs média
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-full ${safeColor} bg-opacity-10 flex items-center justify-center text-current`}>
         <div className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse bg-current`} /> 
         {/* Used bg-current to inherit text color from parent if needed, or just rely on pulseColor class if valid */}
      </div>
    </div>
  );
};

const DashboardTelemetry = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('ABC-1234');

  // Mock data for "charts"
  const speedData = [0, 20, 45, 60, 55, 70, 80, 75, 60, 40, 0, 0];
  const rpmData = [800, 1500, 2200, 3000, 2800, 3500, 3200, 2500, 1500, 800];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Telemetria Avançada</h2>
          <p className="text-gray-500">Dados técnicos em tempo real via OBD-II</p>
        </div>
        
        <select 
          className="p-2 border border-gray-200 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
        >
          <option value="ABC-1234">ABC-1234 - Caminhão VW</option>
          <option value="XYZ-9876">XYZ-9876 - Fiat Fiorino</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TelemetryCard title="Velocidade Atual" value={current.speed || 0} unit="km/h" icon={Gauge} color="bg-blue-500" trend={trends.speed || 0} />
        <TelemetryCard title="RPM Motor" value={current.rpm || 0} unit="rpm" icon={Activity} color="bg-orange-500" />
        <TelemetryCard title="Temp. Motor" value={current.temp || 0} unit="°C" icon={Thermometer} color="bg-red-500" />
        <TelemetryCard title="Voltagem Bateria" value={current.battery || 0} unit="V" icon={Battery} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Speed Chart Mockup */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Perfil de Velocidade (Última hora)
            </h3>
            <div className="h-48 flex items-end gap-2 px-2">
              {speedData.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end group relative">
                   <div 
                    className="w-full bg-blue-500/80 rounded-t-sm hover:bg-blue-600 transition-all" 
                    style={{ height: `${val}%` }} 
                   />
                   <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                     {val} km/h
                   </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 border-t pt-2">
              <span>60 min atrás</span>
              <span>Agora</span>
            </div>
          </div>

          {/* RPM Chart Mockup */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-orange-500" /> Variação de RPM
            </h3>
            <div className="h-48 flex items-end gap-2 px-2">
              {rpmData.map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end group relative">
                   <div 
                    className="w-full bg-orange-400/80 rounded-t-sm hover:bg-orange-500 transition-all" 
                    style={{ height: `${(val / 4000) * 100}%` }} 
                   />
                   <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                     {val} rpm
                   </div>
                </div>
              ))}
            </div>
             <div className="flex justify-between text-xs text-gray-400 mt-2 border-t pt-2">
              <span>10 min atrás</span>
              <span>Agora</span>
            </div>
          </div>
        </div>

        {/* Diagnostics Side Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Cpu size={18} className="text-purple-500" /> Diagnóstico ECU
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-1">
                  <CheckCircle size={16} /> Sistema de Injeção
                </div>
                <div className="text-xs text-green-600">Funcionamento Normal</div>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 font-bold text-sm mb-1">
                  <CheckCircle size={16} /> Sistema de Freios (ABS)
                </div>
                <div className="text-xs text-green-600">Funcionamento Normal</div>
              </div>

              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-1">
                  <AlertCircle size={16} /> Transmissão
                </div>
                <div className="text-xs text-red-600">Código P0700 detectado</div>
                <button className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded transition-colors w-full">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase text-gray-500">Combustível</h3>
             <div className="flex items-center justify-center mb-4 relative">
                <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center relative">
                   <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-l-transparent border-b-transparent rotate-45"></div>
                   <div className="text-center">
                     <span className="text-3xl font-bold text-gray-800">75</span>
                     <span className="text-xs text-gray-500 block">%</span>
                   </div>
                </div>
             </div>
             <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
               <span>Consumo Médio</span>
               <span className="font-bold">8.5 km/L</span>
             </div>
             <div className="flex justify-between text-sm text-gray-600 mt-2">
               <span>Autonomia Est.</span>
               <span className="font-bold">420 km</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTelemetry;
