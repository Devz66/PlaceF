import React, { useState, useEffect } from 'react';
import { Activity, Gauge, Battery, Thermometer, AlertCircle, TrendingUp, Cpu, CheckCircle, Play, RefreshCw } from 'lucide-react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { useVehicles } from '../contexts/VehicleContext';

const TelemetryCard = ({ title, value, unit, icon: Icon, color, trend }) => {
  const IconComponent = Icon || Activity; 
  const safeColor = color || 'bg-blue-500';
  const pulseColor = safeColor.replace('bg-', 'text-');

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
      <div>
        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1">
          <IconComponent size={14} className="text-gray-400" /> {title}
        </div>
        <div className="text-2xl font-bold text-gray-800">
          {value !== undefined && value !== null ? value : '-'} <span className="text-sm font-normal text-gray-400">{unit}</span>
        </div>
        {trend !== undefined && (
          <div className={`text-xs mt-2 font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% vs média
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-full ${safeColor} bg-opacity-10 flex items-center justify-center text-current`}>
         <div className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse bg-current`} /> 
      </div>
    </div>
  );
};

const DashboardTelemetry = () => {
  const { vehicles, fetchVehicles } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    current: {},
    trends: {},
    history: { speed: [], rpm: [], timestamps: [] }
  });
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (!selectedVehicle && vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].id);
    }
  }, [vehicles, selectedVehicle]);

  const fetchTelemetry = async () => {
    if (!selectedVehicle) return;
    try {
      const data = await api.get(`/api/telemetry/${selectedVehicle}/stats`);
      setStats(data);
    } catch (error) {
      console.error('Error fetching telemetry:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000); // Refresh every 3s
    return () => clearInterval(interval);
  }, [selectedVehicle]);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      // Generate random telemetry data
      const randomData = {
        vehicleId: parseInt(selectedVehicle),
        speed: Math.floor(Math.random() * (120 - 40) + 40), // 40-120 km/h
        rpm: Math.floor(Math.random() * (4000 - 1000) + 1000), // 1000-4000 rpm
        fuelLevel: Math.floor(Math.random() * 100),
        battery: parseFloat((Math.random() * (14.5 - 11.5) + 11.5).toFixed(1)),
        temp: Math.floor(Math.random() * (110 - 80) + 80),
        ignition: true
      };

      await api.post('/api/telemetry', randomData);
      // Data will be fetched on next interval
      toast.success('Dados simulados enviados!');
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('Erro ao simular dados. Verifique o console.');
    } finally {
      setSimulating(false);
    }
  };

  const { current, trends, history } = stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Telemetria Avançada</h2>
          <p className="text-gray-500">Monitoramento em tempo real da saúde da frota</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>
            ))}
          </select>

          <button 
            onClick={handleSimulate}
            disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {simulating ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
            Simular Dados
          </button>

          <select 
            className="p-2 border border-gray-200 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            <option value="1">Veículo Padrão (ID: 1)</option>
            {/* Future: Map real vehicles here */}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TelemetryCard title="Velocidade Atual" value={current?.speed} unit="km/h" icon={Gauge} color="bg-blue-500" trend={trends?.speed} />
        <TelemetryCard title="RPM Motor" value={current?.rpm} unit="rpm" icon={Activity} color="bg-orange-500" />
        <TelemetryCard title="Temp. Motor" value={current?.temp} unit="°C" icon={Thermometer} color="bg-red-500" />
        <TelemetryCard title="Voltagem Bateria" value={current?.battery} unit="V" icon={Battery} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Speed Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Perfil de Velocidade (Tempo Real)
            </h3>
            <div className="h-48 flex items-end gap-2 px-2 relative">
              {history?.speed && history.speed.length > 0 ? (
                history.speed.slice(0, 20).reverse().map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end group relative">
                     <div 
                      className="w-full bg-blue-500/80 rounded-t-sm hover:bg-blue-600 transition-all" 
                      style={{ height: `${Math.min(val, 100)}%` }} 
                     />
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap">
                       {val} km/h
                     </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Aguardando dados...
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 border-t pt-2">
              <span>Anterior</span>
              <span>Agora</span>
            </div>
          </div>

          {/* RPM Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-orange-500" /> Variação de RPM
            </h3>
            <div className="h-48 flex items-end gap-2 px-2">
              {history?.rpm && history.rpm.length > 0 ? (
                history.rpm.slice(0, 20).reverse().map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col justify-end group relative">
                     <div 
                      className="w-full bg-orange-500/80 rounded-t-sm hover:bg-orange-600 transition-all" 
                      style={{ height: `${Math.min((val / 8000) * 100, 100)}%` }} 
                     />
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap">
                       {val} RPM
                     </div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Aguardando dados...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-4">Status do Veículo</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Ignição</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${current?.ignition ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {current?.ignition ? 'LIGADA' : 'DESLIGADA'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Nível de Combustível</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${current?.fuel || 0}%` }}></div>
                    </div>
                    <span className="text-sm font-bold">{current?.fuel || 0}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                   <span className="text-sm text-gray-600">Última Atualização</span>
                   <span className="text-xs text-gray-500">
                     {history?.timestamps?.[0] ? new Date(history.timestamps[0]).toLocaleTimeString() : '-'}
                   </span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTelemetry;