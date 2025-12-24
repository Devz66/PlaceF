import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Map, 
  History, 
  Bell, 
  Hexagon, 
  FileText, 
  Lock, 
  Activity, 
  Truck, 
  Settings,
  LogOut,
  Menu,
  DollarSign
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: Map, label: 'Painel Principal', path: '/' },
    { icon: History, label: 'Histórico', path: '/history' },
    { icon: Bell, label: 'Alertas', path: '/alerts' },
    { icon: Hexagon, label: 'Cercas', path: '/geofence' },
    { icon: FileText, label: 'Relatórios', path: '/reports' },
    { icon: Lock, label: 'Comandos', path: '/commands' },
    { icon: Activity, label: 'Telemetria', path: '/telemetry' },
    { icon: Truck, label: 'Frota', path: '/fleet' },
    { icon: DollarSign, label: 'Financeiro', path: '/financial' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}
    >
      <div className="flex items-center justify-between p-4 border-b h-16">
        <div className="flex items-center gap-2 font-bold text-primary text-xl">
          <img src="/images/rastreador.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => e.target.style.display='none'}/>
          <span>PLACE RASTREIOS</span>
        </div>
        <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:bg-gray-100 p-1 rounded">
          <Menu size={20} />
        </button>
      </div>

      <div className="p-4 border-b bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="https://ui-avatars.com/api/?name=Usuario+Demo&background=0066cc&color=fff" 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-gray-800">Usuário Demo</h5>
            <p className="text-xs text-gray-500">Plano Premium</p>
          </div>
        </div>
      </div>

      <nav className="p-3 overflow-y-auto h-[calc(100vh-180px)]">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                  ${isActive 
                    ? 'bg-blue-50 text-primary border-r-2 border-primary' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }
                `}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t bg-white">
        <button className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
