import React, { useState, useEffect } from 'react';
import { Truck, Search, MoreVertical, Battery, Signal, MapPin, Plus, X } from 'lucide-react';
import { api } from '../utils/api';
import { useVehicles } from '../contexts/VehicleContext';
import toast from 'react-hot-toast';

const DashboardFleet = () => {
  const { vehicles, loading, fetchVehicles } = useVehicles();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    plate: '',
    model: '',
    driver: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/vehicles', formData);
      setShowModal(false);
      setFormData({ plate: '', model: '', driver: '' });
      toast.success('Veículo cadastrado com sucesso!');
      fetchVehicles(); // Refresh list
    } catch (error) {
      toast.error('Erro ao cadastrar veículo');
    }
  };

  const getStatus = (vehicle) => {
    const telemetry = vehicle.telemetry?.[0];
    const location = vehicle.locations?.[0];
    
    if (!telemetry) return 'Desconhecido';
    if (telemetry.ignition) {
        if (location && location.speed > 0) return 'Em Movimento';
        return 'Ligado';
    }
    return 'Desligado';
  };

  const getStatusColor = (status) => {
    switch (status) {
        case 'Em Movimento': return 'bg-green-50 text-green-700 border-green-100';
        case 'Ligado': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        case 'Desligado': return 'bg-gray-50 text-gray-600 border-gray-100';
        default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Sem dados';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const filteredVehicles = vehicles.filter(v => 
    v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.driver?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Frota</h2>
          <p className="text-gray-500">Gerencie seus veículos e motoristas</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar veículo, placa ou motorista..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap flex items-center gap-2"
          >
            <Plus size={18} /> Novo Veículo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4">Veículo / Placa</th>
                <th className="px-6 py-4">Motorista</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Telemetria</th>
                <th className="px-6 py-4">Última Posição</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">Carregando frota...</td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">Nenhum veículo encontrado.</td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                    const status = getStatus(vehicle);
                    return (
                        <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                <Truck size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{vehicle.plate}</div>
                                <div className="text-xs text-gray-500">{vehicle.model || 'Modelo não inf.'}</div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-medium text-gray-700">{vehicle.driver || 'Não atribuído'}</div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
                            {status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4 text-gray-500">
                            <div className="flex items-center gap-1" title="Bateria">
                                <Battery size={14} className={(vehicle.telemetry?.[0]?.fuelLevel || 0) < 20 ? 'text-red-500' : 'text-green-500'} />
                                <span className="text-xs font-medium">{vehicle.telemetry?.[0]?.fuelLevel || 0}%</span>
                            </div>
                            <div className="flex items-center gap-1" title="Sinal">
                                <Signal size={14} className="text-blue-500" />
                                <span className="text-xs font-medium">4G</span>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-gray-500">
                            <MapPin size={14} />
                            <span className="text-xs">{formatLastUpdate(vehicle.locations?.[0]?.timestamp)}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical size={18} />
                            </button>
                        </td>
                        </tr>
                    );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Veículo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Novo Veículo</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                <input
                  type="text"
                  name="plate"
                  required
                  value={formData.plate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="ABC-1234"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex: VW Constellation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motorista</label>
                <input
                  type="text"
                  name="driver"
                  value={formData.driver}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Nome do motorista"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFleet;