import React, { useState } from 'react';
import { Lock, Unlock, Zap, RotateCcw, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

const DashboardCommands = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('ABC-1234');
  const [processing, setProcessing] = useState(null);
  
  const [history, setHistory] = useState([
    { id: 1, cmd: 'Bloquear', vehicle: 'ABC-1234', time: '10:30', status: 'success', user: 'Usuario Demo' },
    { id: 2, cmd: 'Desbloquear', vehicle: 'XYZ-9876', time: '09:15', status: 'success', user: 'Usuario Demo' },
    { id: 3, cmd: 'Ativar Sirene', vehicle: 'ABC-1234', time: '08:45', status: 'failed', user: 'Admin' },
  ]);

  const sendCommand = (cmdName) => {
    setProcessing(cmdName);
    setTimeout(() => {
      setProcessing(null);
      const newLog = {
        id: Date.now(),
        cmd: cmdName,
        vehicle: selectedVehicle,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'success',
        user: 'Usuario Demo'
      };
      setHistory([newLog, ...history]);
    }, 2000);
  };

  const commands = [
    { name: 'Bloquear', icon: Lock, color: 'bg-red-500 hover:bg-red-600', desc: 'Corta a ignição do veículo imediatamente.' },
    { name: 'Desbloquear', icon: Unlock, color: 'bg-green-500 hover:bg-green-600', desc: 'Restaura a ignição do veículo.' },
    { name: 'Ativar Sirene', icon: ShieldAlert, color: 'bg-orange-500 hover:bg-orange-600', desc: 'Dispara o alarme sonoro por 30s.' },
    { name: 'Resetar', icon: RotateCcw, color: 'bg-blue-500 hover:bg-blue-600', desc: 'Reinicia o módulo rastreador remotamente.' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      {/* Command Center */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="text-primary" /> Central de Comandos
          </h2>
          
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-500 mb-1 block">Selecione o Veículo</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="ABC-1234">ABC-1234 - Caminhão VW</option>
              <option value="XYZ-9876">XYZ-9876 - Fiat Fiorino</option>
              <option value="DEF-5678">DEF-5678 - Moto Honda</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commands.map((cmd) => (
              <button 
                key={cmd.name}
                onClick={() => sendCommand(cmd.name)}
                disabled={!!processing}
                className={`p-6 rounded-xl text-white text-left transition-all relative overflow-hidden group
                  ${cmd.color} ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-lg'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <cmd.icon size={28} />
                  {processing === cmd.name && <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
                </div>
                <h3 className="text-lg font-bold">{cmd.name}</h3>
                <p className="text-xs text-white/80 mt-1">{cmd.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
           <ShieldAlert className="text-blue-600 shrink-0 mt-0.5" size={20} />
           <div>
             <h4 className="font-bold text-blue-800 text-sm">Atenção</h4>
             <p className="text-sm text-blue-700 mt-1">
               O envio de comandos de bloqueio deve ser feito apenas em situações de emergência confirmada. 
               Verifique a velocidade do veículo antes de agir.
             </p>
           </div>
        </div>
      </div>

      {/* Command Log */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={20} /> Histórico de Comandos
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {history.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className={`mt-1 p-1 rounded-full ${log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {log.status === 'success' ? <CheckCircle size={14} /> : <ShieldAlert size={14} />}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{log.cmd}</div>
                <div className="text-xs text-gray-500">Veículo: {log.vehicle}</div>
                <div className="text-xs text-gray-400 mt-1">{log.time} • {log.user}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCommands;
