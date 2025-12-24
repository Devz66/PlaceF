import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Circle, Popup } from 'react-leaflet';
import { Hexagon, Plus, Trash2, Edit2, MapPin } from 'lucide-react';

const DashboardGeofence = () => {
  const [geofences, setGeofences] = useState([
    { id: 1, name: 'Garagem Central', type: 'polygon', active: true, color: 'blue', 
      coords: [[-23.5505, -46.6333], [-23.5515, -46.6343], [-23.5525, -46.6333]] 
    },
    { id: 2, name: 'Cliente A - Zona Sul', type: 'circle', active: true, color: 'green', 
      center: [-23.5605, -46.6533], radius: 500 
    },
    { id: 3, name: 'Área de Risco - Centro', type: 'polygon', active: false, color: 'red', 
      coords: [[-23.5405, -46.6233], [-23.5415, -46.6243], [-23.5425, -46.6233], [-23.5415, -46.6213]] 
    },
  ]);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-4">
      {/* Sidebar List */}
      <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">Cercas Virtuais</h2>
          <button className="bg-primary hover:bg-blue-700 text-white p-2 rounded-lg transition-colors" title="Nova Cerca">
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3">
          {geofences.map(geo => (
            <div key={geo.id} className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md
              ${geo.active ? 'border-gray-100 bg-white' : 'border-gray-100 bg-gray-50 opacity-70'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Hexagon size={18} className={geo.color === 'red' ? 'text-red-500' : geo.color === 'green' ? 'text-green-500' : 'text-blue-500'} />
                  <h3 className="font-bold text-gray-800">{geo.name}</h3>
                </div>
                <div className={`w-3 h-3 rounded-full ${geo.active ? 'bg-green-500' : 'bg-gray-300'}`} title={geo.active ? 'Ativa' : 'Inativa'} />
              </div>
              
              <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <MapPin size={12} />
                {geo.type === 'circle' ? `Raio: ${geo.radius}m` : 'Polígono Personalizado'}
              </div>

              <div className="flex gap-2 border-t pt-3 mt-1">
                <button className="flex-1 text-xs font-semibold text-gray-600 hover:text-primary py-1 bg-gray-50 hover:bg-gray-100 rounded">
                  <Edit2 size={12} className="inline mr-1" /> Editar
                </button>
                <button className="flex-1 text-xs font-semibold text-red-500 hover:text-red-700 py-1 bg-red-50 hover:bg-red-100 rounded">
                  <Trash2 size={12} className="inline mr-1" /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        <MapContainer 
          center={[-23.5505, -46.6333]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {geofences.map(geo => {
            if (!geo.active && geo.id !== 3) return null; // Show active + one inactive for demo
            
            if (geo.type === 'polygon') {
              return (
                <Polygon key={geo.id} positions={geo.coords} color={geo.color}>
                  <Popup>{geo.name}</Popup>
                </Polygon>
              );
            } else if (geo.type === 'circle') {
              return (
                <Circle key={geo.id} center={geo.center} radius={geo.radius} color={geo.color}>
                   <Popup>{geo.name}</Popup>
                </Circle>
              );
            }
            return null;
          })}
        </MapContainer>
        
        <div className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-md text-xs font-semibold text-gray-600">
          Modo Visualização
        </div>
      </div>
    </div>
  );
};

export default DashboardGeofence;
