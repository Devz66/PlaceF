import React from 'react';
import { FileText, Download, Filter, Calendar } from 'lucide-react';

const ReportCard = ({ title, value, change, positive }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-end justify-between">
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {change}
      </div>
    </div>
  </div>
);

const DashboardReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Relatórios Gerenciais</h2>
          <p className="text-gray-500">Análise de desempenho da frota</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
            <Calendar size={16} /> Últimos 30 dias
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm">
            <Download size={16} /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard title="Distância Total" value="12,450 km" change="+12%" positive={true} />
        <ReportCard title="Combustível Gasto" value="1,240 L" change="-5%" positive={true} />
        <ReportCard title="Tempo Ocioso" value="45h 20m" change="+2%" positive={false} />
        <ReportCard title="Infrações" value="3" change="-50%" positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            Consumo por Veículo
          </h3>
          <div className="space-y-4">
             {[
               { name: 'Caminhão VW - ABC-1234', val: 75, color: 'bg-blue-500' },
               { name: 'Van Fiat - XYZ-9876', val: 45, color: 'bg-green-500' },
               { name: 'Moto Honda - DEF-5678', val: 20, color: 'bg-yellow-500' },
               { name: 'Carro Gol - GHI-3456', val: 60, color: 'bg-purple-500' }
             ].map((item, idx) => (
               <div key={idx}>
                 <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-600 font-medium">{item.name}</span>
                   <span className="text-gray-900 font-bold">{item.val}%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-2.5">
                   <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.val}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Filter size={18} className="text-primary" />
            Últimos Eventos
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Veículo</th>
                  <th className="px-4 py-3">Evento</th>
                  <th className="px-4 py-3">Data/Hora</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { v: 'ABC-1234', e: 'Excesso de Velocidade', d: '24/12 10:30', s: 'Pendente', c: 'text-orange-600 bg-orange-50' },
                  { v: 'XYZ-9876', e: 'Entrada em Cerca', d: '24/12 09:15', s: 'Resolvido', c: 'text-green-600 bg-green-50' },
                  { v: 'ABC-1234', e: 'Ignição Ligada', d: '24/12 08:00', s: 'Info', c: 'text-blue-600 bg-blue-50' },
                  { v: 'DEF-5678', e: 'Bateria Baixa', d: '23/12 18:45', s: 'Crítico', c: 'text-red-600 bg-red-50' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.v}</td>
                    <td className="px-4 py-3 text-gray-600">{row.e}</td>
                    <td className="px-4 py-3 text-gray-500">{row.d}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${row.c}`}>{row.s}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReports;
