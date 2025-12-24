import React, { useState } from 'react';
import { User, Bell, Lock, Shield, Save } from 'lucide-react';

const DashboardSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-6rem)] flex flex-col md:flex-row overflow-hidden">
      {/* Settings Sidebar */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-4">
        <h2 className="font-bold text-gray-800 mb-6 px-2">Configurações</h2>
        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <User size={18} /> Perfil
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Bell size={18} /> Notificações
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Lock size={18} /> Segurança
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'system' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Shield size={18} /> Privacidade
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Meu Perfil</h3>
            
            <div className="flex items-center gap-6">
              <img 
                src="https://ui-avatars.com/api/?name=Usuario+Demo&background=0066cc&color=fff&size=128" 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-gray-100"
              />
              <button className="text-sm font-semibold text-primary hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                Alterar Foto
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" defaultValue="Usuario Demo" className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" defaultValue="demo@placerastreios.com" className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input type="tel" defaultValue="(11) 99999-9999" className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" defaultValue="Gerente de Frota" className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Preferências de Notificação</h3>
            
            <div className="space-y-4">
              {['Alertas de Velocidade', 'Entrada/Saída de Cerca', 'Ignição Ligada/Desligada', 'Bateria Baixa', 'Manutenção Próxima'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-700 font-medium">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Segurança da Conta</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
                <input type="password" className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                <input type="password" className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                <input type="password" className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <button className="text-red-600 font-medium text-sm hover:underline">Desativar Autenticação em Dois Fatores (2FA)</button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Privacidade e Dados</h3>
            
            <p className="text-gray-600 text-sm">
              Gerencie como seus dados são coletados e armazenados.
            </p>
            
            <div className="space-y-4">
               <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                 <h4 className="font-bold text-yellow-800 mb-1">Retenção de Histórico</h4>
                 <p className="text-xs text-yellow-700 mb-3">Seu plano atual permite armazenar histórico de rotas por até 90 dias.</p>
                 <button className="text-xs bg-white border border-yellow-200 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-100 transition-colors">
                   Gerenciar Plano
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t flex justify-end">
          <button className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/30">
            <Save size={18} /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
