import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Wifi, Battery, Clock, Crosshair } from 'lucide-react';
import { useVehicles } from '../contexts/VehicleContext';
import toast from 'react-hot-toast';

// Custom Icons
const carIcon = new L.Icon({
  iconUrl: '/images/car.svg', // Use local SVG
  iconRetinaUrl: '/images/car.svg',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [40, 40], // Adjusted size for car icon
  iconAnchor: [20, 20], // Center anchor
  popupAnchor: [0, -20],
  shadowSize: [41, 41]
});

// Component to handle map view updates
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, {
        animate: true,
        duration: 1.5
    });
  }, [center, map]);
  return null;
};

const DashboardMap = () => {
  const { vehicles, loading, fetchVehicles } = useVehicles();
  const [selectedId, setSelectedId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([-23.55052, -46.633308]); // Default SP

  useEffect(() => {
    // Request User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          toast.success('Localização encontrada!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Não foi possível obter sua localização.');
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(() => fetchVehicles(true), 5000);

    return () => clearInterval(interval);
  }, [fetchVehicles]);

  useEffect(() => {
    // If we have a selected vehicle, center on it. 
    // BUT if we just loaded user location and no vehicle is manually selected, we prefer user location initially.
    // However, the logic below auto-selects the first vehicle.
    // We should probably allow the user to toggle between "Follow User" and "Follow Vehicle".
    
    // For now, let's keep the logic simple: 
    // If user explicitly clicks a vehicle, selectedId changes, and we might want to center on it.
    // But the requirement says "map should go to current location LIKE MAPS DOES".
    // Usually Maps starts at user location.
    
    if (selectedId) {
       const vehicle = vehicles.find(v => v.id === selectedId);
       if (vehicle?.locations?.[0]) {
           setMapCenter([vehicle.locations[0].latitude, vehicle.locations[0].longitude]);
       }
    }
  }, [selectedId, vehicles]);
  
  // Logic to center on vehicle if no user location is found yet, or if vehicles update
  // But we want to prioritize user location on startup.
  
  const activeVehicle = vehicles.find(v => v.id === selectedId);
  const telemetry = activeVehicle?.telemetry?.[0];
  const location = activeVehicle?.locations?.[0];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
      {/* Map */}
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater center={mapCenter} />

        {/* User Location Marker */}
        {userLocation && (
            <>
                <Circle 
                    center={userLocation}
                    pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
                    radius={500}
                />
                <CircleMarker 
                    center={userLocation} 
                    radius={8} 
                    pathOptions={{ color: 'white', fillColor: '#2563eb', fillOpacity: 1, weight: 2 }}
                >
                    <Popup>Você está aqui</Popup>
                </CircleMarker>
            </>
        )}

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
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
        <button 
            onClick={() => {
                if (userLocation) {
                    setMapCenter(userLocation);
                    setSelectedId(null);
                } else {
                    toast.error('Localização não disponível');
                }
            }}
            className="p-3 bg-white rounded-full shadow-lg text-gray-700 hover:text-primary transition-colors"
            title="Minha Localização"
        >
            <Crosshair size={24} />
        </button>
      </div>

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
