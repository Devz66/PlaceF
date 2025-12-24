import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Shield, Wifi, Battery, Clock, AlertTriangle } from 'lucide-react';

// Custom Icons
const carIcon = new L.Icon({
  iconUrl: '/images/car.svg', // Assuming car.svg is available, otherwise use default
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20]
});

// Fallback if svg not found, use default but fixed
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DashboardMap = () => {
  const [position, setPosition] = useState([-23.55052, -46.633308]); // Sao Paulo
  const [path, setPath] = useState([[-23.55052, -46.633308]]);
  const [speed, setSpeed] = useState(0);
  const [status, setStatus] = useState('Parado');
  const [ignition, setIgnition] = useState(false);

  // Simulation effect
  useEffect(() => {
    if (!ignition) return;

    const interval = setInterval(() => {
      setPosition(prev => {
        const newLat = prev[0] + (Math.random() - 0.5) * 0.001;
        const newLng = prev[1] + (Math.random() - 0.5) * 0.001;
        const newPos = [newLat, newLng];
        
        setPath(currentPath => [...currentPath, newPos]);
        setSpeed(Math.floor(Math.random() * 60) + 20);
        setStatus('Em Movimento');
        return newPos;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [ignition]);

  const toggleIgnition = () => {
    setIgnition(!ignition);
    if (ignition) {
      setSpeed(0);
      setStatus('Parado');
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* Map */}
      <MapContainer 
        center={position} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={carIcon}>
          <Popup>
            <div className="text-center">
              <strong>Veículo: ABC-1234</strong><br/>
              Status: {status}<br/>
              Velocidade: {speed} km/h
            </div>
          </Popup>
        </Marker>
        <Polyline positions={path} color="blue" />
      </MapContainer>

      {/* Floating Status Panel */}
      <div className="absolute top-4 right-4 z-[1000] w-72 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Status do Veículo</h3>
          <span className={`px-2 py-1 rounded text-xs font-bold ${ignition ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {ignition ? 'LIGADO' : 'DESLIGADO'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Navigation size={12} /> Velocidade
            </div>
            <div className="font-bold text-lg text-primary">{speed} <span className="text-xs font-normal">km/h</span></div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg text-center">
             <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Battery size={12} /> Bateria
            </div>
            <div className="font-bold text-lg text-primary">12.4 <span className="text-xs font-normal">V</span></div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg text-center">
             <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Wifi size={12} /> Sinal
            </div>
            <div className="font-bold text-lg text-primary">GPS <span className="text-xs font-normal">4G</span></div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg text-center">
             <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Clock size={12} /> Hodômetro
            </div>
            <div className="font-bold text-lg text-primary">12540 <span className="text-xs font-normal">km</span></div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={toggleIgnition}
            className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2
              ${ignition 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
          >
            <Shield size={18} />
            {ignition ? 'Bloquear Veículo' : 'Desbloquear Veículo'}
          </button>
        </div>
      </div>

      {/* Floating Stats Bottom */}
      <div className="absolute bottom-4 left-4 z-[1000] flex gap-2">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Conectado</span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-gray-100 flex items-center gap-2">
           <AlertTriangle size={14} className="text-yellow-500" />
           <span className="text-sm font-medium text-gray-700">0 Alertas</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMap;
