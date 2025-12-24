import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Wifi, Battery, Clock } from 'lucide-react';
import { api } from '../utils/api';

// Custom Icons
const carIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Fallback
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DashboardMap = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchVehicles = async () => {
      try {
        const data = await api.get('/api/vehicles');
        if (isMounted) {
          setVehicles(data);
          // Select first vehicle if none selected
          if (!selectedId && data.length > 0) {
            setSelectedId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedId]);

  const activeVehicle = vehicles.find(v => v.id === selectedId) || vehicles[0];
  const location = activeVehicle?.locations?.[0];
  const telemetry = activeVehicle?.telemetry?.[0];

  const defaultCenter = [-23.55052, -46.633308]; // SP
  const center = location ? [location.latitude, location.longitude] : defaultCenter;

  if (loading && vehicles.length === 0) {
    return <div className="flex items-center justify-center h-full">Carregando mapa...</div>;
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* Map */}
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {vehicles.map(vehicle => {
            const loc = vehicle.locations?.[0];
            if (!loc) return null;
            return (
                <Marker 
                    key={vehicle.id} 
                    position={[loc.latitude, loc.longitude]} 
                    icon={carIcon}
                    eventHandlers={{
                        click: () => setSelectedId(vehicle.id),
                    }}
                >
                    <Popup>
                        <div className="text-center">
                            <strong>{vehicle.plate}</strong><br/>
                            {vehicle.model}<br/>
                            {loc.speed?.toFixed(0)} km/h
                        </div>
                    </Popup>
                </Marker>
            );
        })}
      </MapContainer>

      {/* Floating Status Panel */}
      {activeVehicle && (
        <div className="absolute top-4 right-4 z-[1000] w-72 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">{activeVehicle.plate}</h3>
            <span className={`px-2 py-1 rounded text-xs font-bold ${telemetry?.ignition ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {telemetry?.ignition ? 'LIGADO' : 'DESLIGADO'}
            </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Navigation size={12} /> Velocidade
                </div>
                <div className="font-bold text-lg text-primary">{location?.speed?.toFixed(0) || 0} <span className="text-xs font-normal">km/h</span></div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-center">
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Battery size={12} /> Combustível
                </div>
                <div className="font-bold text-lg text-green-700">{telemetry?.fuelLevel || 0}%</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg text-center col-span-2">
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Clock size={12} /> Última Atualização
                </div>
                <div className="font-medium text-purple-700">
                    {location?.timestamp ? new Date(location.timestamp).toLocaleTimeString() : 'Sem dados'}
                </div>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMap;
