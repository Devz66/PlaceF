import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu, Bell, Maximize, RotateCw } from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden text-gray-600"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Monitoramento em Tempo Real</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Sistema Online
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Atualizar">
                <RotateCw size={18} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Tela Cheia">
                <Maximize size={18} />
              </button>
              <div className="relative">
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                  <Bell size={18} />
                </button>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto relative p-4">
          <Outlet />
        </div>
        
        {/* Footer */}
        <footer className="h-8 bg-white border-t flex items-center justify-between px-4 text-xs text-gray-500 shrink-0">
           <div className="flex gap-4">
             <span>Servidor: BR-SP-01</span>
             <span>Versão 2.1.0</span>
           </div>
           <div className="flex gap-4">
             <a href="#" className="hover:text-primary">Suporte</a>
             <a href="#" className="hover:text-primary">Ajuda</a>
           </div>
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;
