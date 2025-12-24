import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('Usuário Demo');

  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.name) {
          setUserName(userData.name);
        }
      } catch (e) {
        console.error('Erro ao ler dados do usuário', e);
      }
    }
  }, []);

  const menuItems = [
    { icon: Map, label: 'Painel Principal', path: '/dashboard', end: true },
    { icon: History, label: 'Histórico', path: '/dashboard/history' },
    { icon: Bell, label: 'Alertas', path: '/dashboard/alerts' },
    { icon: Hexagon, label: 'Cercas', path: '/dashboard/geofence' },
    { icon: FileText, label: 'Relatórios', path: '/dashboard/reports' },
    { icon: Lock, label: 'Comandos', path: '/dashboard/commands' },
    { icon: Activity, label: 'Telemetria', path: '/dashboard/telemetry' },
    { icon: Truck, label: 'Frota', path: '/dashboard/fleet' },
    { icon: DollarSign, label: 'Financeiro', path: '/dashboard/financial' },
    { icon: Settings, label: 'Configurações', path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64`}
    >
      <div className="flex items-center justify-between p-4 border-b h-16">
        <div className="flex items-center gap-2 font-bold text-primary text-xl">
          <img src="/images/Logo.png" alt="Logo" className="h-8 object-contain" />
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
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0066cc&color=fff`}
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-gray-800">{userName}</h5>
            <p className="text-xs text-gray-500">Plano Premium</p>
          </div>
        </div>
      </div>

      <nav className="p-3 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 translate-x-1' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary hover:translate-x-1'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t bg-white">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
