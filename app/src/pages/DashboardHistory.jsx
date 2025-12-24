import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Calendar, Clock, Navigation, Play, Pause, Search } from 'lucide-react';
import L from 'leaflet';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('ABC-1234');
  const [date, setDate] = useState('2025-12-24');

  // Mock Route Data
  const routePoints = [
    [-23.55052, -46.633308],
    [-23.55152, -46.634308],
    [-23.55252, -46.635308],
    [-23.55352, -46.636308],
    [-23.55452, -46.637308],
    [-23.55552, -46.638308],
  ];

  const events = [
    { time: '08:00', type: 'start', desc: 'Início da Jornada', location: 'Garagem Central' },
    { time: '09:30', type: 'stop', desc: 'Parada (15min)', location: 'Cliente A' },
    { time: '11:45', type: 'stop', desc: 'Parada Almoço (1h)', location: 'Restaurante BR' },
    { time: '14:20', type: 'alert', desc: 'Excesso de Velocidade', location: 'Av. Paulista' },
    { time: '18:00', type: 'end', desc: 'Fim da Jornada', location: 'Garagem Central' },
  ];

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
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              >
                <option value="ABC-1234">ABC-1234 - Caminhão VW</option>
                <option value="XYZ-9876">XYZ-9876 - Fiat Fiorino</option>
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

            <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Search size={16} /> Buscar Rota
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Resumo do Dia</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Distância</div>
              <div className="font-bold text-primary">145 km</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Tempo Mov.</div>
              <div className="font-bold text-primary">5h 20m</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Vel. Max</div>
              <div className="font-bold text-primary">92 km/h</div>
            </div>
            <div className="bg-blue-50 p-2 rounded text-center">
              <div className="text-xs text-gray-500">Paradas</div>
              <div className="font-bold text-primary">8</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1">
          <h3 className="font-bold text-gray-800 mb-3">Linha do Tempo</h3>
          <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:h-full before:w-0.5 before:bg-gray-100">
            {events.map((event, idx) => (
              <div key={idx} className="relative pl-8">
                <div className={`absolute left-3 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10
                  ${event.type === 'start' || event.type === 'end' ? 'bg-green-500' : 
                    event.type === 'alert' ? 'bg-red-500' : 'bg-blue-400'}`} 
                />
                <div className="text-xs font-bold text-gray-500">{event.time}</div>
                <div className="text-sm font-semibold text-gray-800">{event.desc}</div>
                <div className="text-xs text-gray-400 truncate">{event.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col">
        <MapContainer 
          center={routePoints[0]} 
          zoom={13} 
          style={{ height: '100%', width: '100%', flex: 1 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline positions={routePoints} color="blue" weight={4} opacity={0.7} />
          <Marker position={routePoints[0]} icon={startIcon}>
            <Popup>Início: 08:00</Popup>
          </Marker>
          <Marker position={routePoints[routePoints.length - 1]} icon={endIcon}>
            <Popup>Fim: 18:00</Popup>
          </Marker>
        </MapContainer>

        {/* Playback Controls */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-100 flex items-center gap-4 z-[1000]">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
          
          <div className="flex-1">
             <div className="flex justify-between text-xs text-gray-500 mb-1">
               <span>08:00</span>
               <span>18:00</span>
             </div>
             <input 
               type="range" 
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" 
               min="0" 
               max="100" 
             />
          </div>

          <div className="shrink-0 text-center bg-gray-50 px-3 py-1 rounded">
             <div className="text-xs text-gray-500">Velocidade</div>
             <div className="font-bold text-sm text-primary">1x</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHistory;
