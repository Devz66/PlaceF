import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Bell, Search, Filter, XCircle } from 'lucide-react';

const DashboardAlerts = () => {
  const [filter, setFilter] = useState('all');

  const initialAlerts = [
    { id: 1, type: 'critical', vehicle: 'ABC-1234', message: 'Botão de Pânico Acionado', time: '10:32', date: 'Hoje', status: 'pending' },
    { id: 2, type: 'warning', vehicle: 'XYZ-9876', message: 'Excesso de Velocidade (110km/h)', time: '09:15', date: 'Hoje', status: 'resolved' },
    { id: 3, type: 'info', vehicle: 'DEF-5678', message: 'Ignição Ligada Fora de Horário', time: '08:00', date: 'Hoje', status: 'pending' },
    { id: 4, type: 'critical', vehicle: 'GHI-3456', message: 'Bateria do Rastreador Baixa', time: 'Ontem', date: '23/12', status: 'resolved' },
    { id: 5, type: 'warning', vehicle: 'ABC-1234', message: 'Saída de Cerca Virtual: Garagem', time: 'Ontem', date: '23/12', status: 'resolved' },
  ];

  const [alerts, setAlerts] = useState(initialAlerts);

  const handleResolve = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'pending') return alert.status === 'pending';
    if (filter === 'resolved') return alert.status === 'resolved';
    if (filter === 'critical') return alert.type === 'critical';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'critical': return <XCircle className="text-red-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={24} />;
      case 'info': return <Bell className="text-blue-500" size={24} />;
      default: return <Bell size={24} />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-100';
      case 'warning': return 'bg-yellow-50 border-yellow-100';
      case 'info': return 'bg-blue-50 border-blue-100';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Alertas</h2>
          <p className="text-gray-500">Monitoramento de eventos críticos da frota</p>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setFilter('all')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
           >
             Todos
           </button>
           <button 
             onClick={() => setFilter('critical')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filter === 'critical' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-red-50'}`}
           >
             Críticos
           </button>
           <button 
             onClick={() => setFilter('pending')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${filter === 'pending' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50'}`}
           >
             Pendentes
           </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800">Tudo Certo!</h3>
            <p className="text-gray-500">Nenhum alerta encontrado com os filtros atuais.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-xl border flex items-start gap-4 transition-all hover:shadow-md ${getBgColor(alert.type)}`}>
              <div className="mt-1 shrink-0">
                {getIcon(alert.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{alert.message}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span className="font-semibold bg-white px-2 py-0.5 rounded border border-gray-200">{alert.vehicle}</span>
                      <span>•</span>
                      <span>{alert.date} às {alert.time}</span>
                    </div>
                  </div>
                  
                  {alert.status === 'pending' && (
                    <button 
                      onClick={() => handleResolve(alert.id)}
                      className="bg-white border border-green-200 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <CheckCircle size={16} />
                      Resolver
                    </button>
                  )}
                  {alert.status === 'resolved' && (
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <CheckCircle size={14} /> Resolvido
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardAlerts;
