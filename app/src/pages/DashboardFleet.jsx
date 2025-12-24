import React from 'react';
import { Truck, Search, MoreVertical, Battery, Signal, MapPin } from 'lucide-react';

const DashboardFleet = () => {
  const fleet = [
    { id: 1, plate: 'ABC-1234', model: 'VW Constellation', driver: 'João Silva', status: 'Em Movimento', speed: 80, fuel: 75, lastUpdate: 'Agora mesmo' },
    { id: 2, plate: 'XYZ-9876', model: 'Fiat Fiorino', driver: 'Maria Santos', status: 'Parado', speed: 0, fuel: 45, lastUpdate: '5 min atrás' },
    { id: 3, plate: 'DEF-5678', model: 'Honda CG 160', driver: 'Carlos Oliveira', status: 'Desligado', speed: 0, fuel: 90, lastUpdate: '2h atrás' },
    { id: 4, plate: 'GHI-3456', model: 'VW Gol', driver: 'Ana Costa', status: 'Em Movimento', speed: 60, fuel: 30, lastUpdate: 'Agora mesmo' },
    { id: 5, plate: 'JKL-7890', model: 'Chevrolet Onix', driver: 'Pedro Souza', status: 'Manutenção', speed: 0, fuel: 0, lastUpdate: '1 dia atrás' },
  ];

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
            />
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap">
            + Novo Veículo
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
              {fleet.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                        <Truck size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{vehicle.plate}</div>
                        <div className="text-xs text-gray-500">{vehicle.model}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-700">{vehicle.driver}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                      ${vehicle.status === 'Em Movimento' ? 'bg-green-50 text-green-700 border-green-100' : 
                        vehicle.status === 'Parado' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 
                        vehicle.status === 'Manutenção' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-gray-50 text-gray-600 border-gray-100'
                      }
                    `}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center gap-1" title="Bateria">
                        <Battery size={14} className={vehicle.fuel < 20 ? 'text-red-500' : 'text-green-500'} />
                        <span className="text-xs font-medium">{vehicle.fuel}%</span>
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
                      <span className="text-xs">{vehicle.lastUpdate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando 5 de 24 veículos</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 bg-white border rounded hover:bg-gray-50">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFleet;
