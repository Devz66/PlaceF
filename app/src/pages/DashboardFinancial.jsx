import React, { useState, useEffect } from 'react';
import { FileText, QrCode, History, DollarSign, Download, Search, CheckCircle, AlertTriangle, Clock, Copy, Printer } from 'lucide-react';
import { api } from '../utils/api';

const StatusBadge = ({ status }) => {
  const styles = {
    pago: 'bg-green-100 text-green-800',
    sucesso: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    pendente: 'bg-yellow-100 text-yellow-800',
    vencido: 'bg-red-100 text-red-800',
  };

  const labels = {
    pago: 'Pago',
    sucesso: 'Sucesso',
    completed: 'Concluído',
    pendente: 'Pendente',
    vencido: 'Vencido',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  );
};

const DashboardFinancial = () => {
  const [activeTab, setActiveTab] = useState('boletos'); // boletos, pix, history
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('30'); // 7, 30, all
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const data = await api.get('/api/financial');
        setFinancialData(data);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancials();
  }, []);

  // Boletos Section Component
  const BoletosSection = () => {
    const filteredBoletos = financialData.filter(item => 
      item.type === 'BOLETO' &&
      (item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.id).includes(searchTerm))
    );

    if (loading) return <div className="p-4 text-center">Carregando...</div>;

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por descrição ou código..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Documento</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Vencimento</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBoletos.map((boleto) => (
                  <tr key={boleto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{boleto.description}</div>
                      <div className="text-xs text-gray-500 mt-1">Ref: {boleto.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(boleto.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      R$ {boleto.value.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={boleto.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {boleto.status !== 'pago' ? (
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                          <Printer size={16} /> 2ª Via
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          <Download size={16} /> Recibo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // PIX Section Component
  const PixSection = () => {
    const [amount, setAmount] = useState('');
    const [generated, setGenerated] = useState(false);

    const handleGeneratePix = (e) => {
      e.preventDefault();
      setGenerated(true);
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="text-green-600" /> Gerar Pagamento PIX
          </h3>
          
          <form onSubmit={handleGeneratePix} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor a Pagar (R$)</label>
              <input 
                type="number" 
                step="0.01"
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20"
                placeholder="Ex: Mensalidade extra"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <QrCode size={20} /> Gerar QR Code
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-2">Dados para Transferência</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Banco:</span>
                <span className="font-medium">341 - Itaú Unibanco</span>
              </div>
              <div className="flex justify-between">
                <span>Agência:</span>
                <span className="font-medium">1234</span>
              </div>
              <div className="flex justify-between">
                <span>Conta Corrente:</span>
                <span className="font-medium">99999-9</span>
              </div>
              <div className="flex justify-between">
                <span>CNPJ:</span>
                <span className="font-medium">12.345.678/0001-90</span>
              </div>
            </div>
          </div>
        </div>

        {generated ? (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <QrCode size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">QR Code Gerado!</h3>
            <p className="text-gray-500 mb-6">Escaneie o código abaixo com o app do seu banco</p>
            
            <div className="bg-white p-4 border-2 border-gray-800 rounded-lg mb-6">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913PLACE RASTREIOS6008SAO PAULO62070503***63041D3D" alt="QR Code PIX" className="w-48 h-48" />
            </div>

            <div className="w-full">
              <label className="block text-xs font-medium text-gray-500 mb-1 text-left">Pix Copia e Cola</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value="00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913PLACE RASTREIOS6008SAO PAULO62070503***63041D3D"
                  className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 truncate"
                />
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600" title="Copiar">
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center p-8 text-center">
            <div>
              <QrCode size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Preencha os dados ao lado para gerar o QR Code</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // History Section Component
  const HistorySection = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <select 
            className="p-2 border border-gray-200 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 3 meses</option>
            <option value="all">Todo o período</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Data</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Descrição</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Valor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {financialMockData.history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${item.type === 'pix' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                      {item.type === 'pix' ? <QrCode size={12} /> : <FileText size={12} />}
                      {item.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    R$ {item.amount.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-primary transition-colors">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <DollarSign className="text-primary" /> Financeiro
        </h1>
        <p className="text-gray-500">Gerencie seus pagamentos, 2ª via de boletos e histórico.</p>
      </header>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('boletos')}
          className={`pb-4 px-6 font-medium text-sm transition-colors relative ${
            activeTab === 'boletos' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText size={18} /> 2ª Via de Boletos
          </div>
          {activeTab === 'boletos' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('pix')}
          className={`pb-4 px-6 font-medium text-sm transition-colors relative ${
            activeTab === 'pix' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <QrCode size={18} /> Pagamento PIX
          </div>
          {activeTab === 'pix' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-4 px-6 font-medium text-sm transition-colors relative ${
            activeTab === 'history' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <History size={18} /> Histórico
          </div>
          {activeTab === 'history' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'boletos' && <BoletosSection />}
        {activeTab === 'pix' && <PixSection />}
        {activeTab === 'history' && <HistorySection />}
      </div>
    </div>
  );
};

export default DashboardFinancial;
