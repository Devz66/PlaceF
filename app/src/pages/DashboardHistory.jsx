import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Calendar, Clock, Navigation, Play, Pause, Search, AlertTriangle } from 'lucide-react';
import L from 'leaflet';
import { api } from '../utils/api';

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DashboardHistory = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [routePoints, setRoutePoints] = useState([]);
  const [stats, setStats] = useState({ distance: 0, maxSpeed: 0, avgSpeed: 0 });
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Placeholder for playback

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await api.get('/api/vehicles');
      setVehicles(data);
      if (data.length > 0) {
        setSelectedVehicleId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSearch = async () => {
    if (!selectedVehicleId || !date) return;
    setLoading(true);
    try {
      const start = `${date}T00:00:00`;
      const end = `${date}T23:59:59`;
      const response = await api.get(`/api/vehicles/${selectedVehicleId}/history?start=${start}&end=${end}`);
      
      const locations = response.locations || [];
      const points = locations.map(l => [l.latitude, l.longitude]);
      setRoutePoints(points);

      // Calculate stats
      const maxSpeed = locations.reduce((max, l) => Math.max(max, l.speed || 0), 0);
      const avgSpeed = locations.length > 0 
        ? locations.reduce((sum, l) => sum + (l.speed || 0), 0) / locations.length 
        : 0;
      
      setStats({
        distance: response.totalDistance || 0,
        maxSpeed,
        avgSpeed
      });

    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Erro ao buscar histórico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-4">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto">
        {/* Filters Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Filtros de Busca</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Veículo</label>
              <select 
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
              >
                {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Data</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search size={16} /> {loading ? 'Buscando...' : 'Buscar Rota'}
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Resumo do Dia</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Distância</div>
              <div className="font-bold text-primary">{stats.distance} km</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Média</div>
              <div className="font-bold text-primary">{stats.avgSpeed.toFixed(0)} km/h</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Vel. Max</div>
              <div className="font-bold text-primary">{stats.maxSpeed.toFixed(0)} km/h</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
               <div className="text-xs text-gray-500">Eventos</div>
               <div className="font-bold text-primary">0</div>
            </div>
          </div>
        </div>

        {/* Timeline/Events (Placeholder for now) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1 overflow-y-auto">
          <h3 className="font-bold text-gray-800 mb-3">Linha do Tempo</h3>
          <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
             {routePoints.length === 0 ? (
                 <p className="text-sm text-gray-500 text-center py-4">Nenhuma rota encontrada para esta data.</p>
             ) : (
                 <>
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                        <div className="text-xs text-gray-500">Início</div>
                        <div className="font-medium text-sm text-gray-800">Primeiro ponto registrado</div>
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                        <div className="text-xs text-gray-500">Fim</div>
                        <div className="font-medium text-sm text-gray-800">Último ponto registrado</div>
                    </div>
                 </>
             )}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        <MapContainer 
          center={routePoints.length > 0 ? routePoints[0] : [-23.55052, -46.633308]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {routePoints.length > 0 && (
            <>
                <Polyline positions={routePoints} color="blue" weight={4} />
                <Marker position={routePoints[0]} icon={startIcon}>
                    <Popup>Início</Popup>
                </Marker>
                <Marker position={routePoints[routePoints.length - 1]} icon={endIcon}>
                    <Popup>Fim</Popup>
                </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default DashboardHistory;
