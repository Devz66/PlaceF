import React, { createContext, useState, useContext, useCallback } from 'react';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchVehicles = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await api.get('/api/vehicles');
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Don't show toast on silent updates to avoid spam
      if (!silent) toast.error('Erro ao carregar veículos');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  return (
    <VehicleContext.Provider value={{ vehicles, loading, fetchVehicles, setVehicles }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => useContext(VehicleContext);
