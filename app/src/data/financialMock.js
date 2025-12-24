import { FileText, QrCode, History, DollarSign, Download, Search, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const financialMockData = {
  boletos: [
    {
      id: 'BOL-001',
      description: 'Mensalidade Rastreamento - Janeiro/2025',
      value: 89.90,
      dueDate: '2025-01-15',
      status: 'pago',
      barcode: '34191.79001 01043.510047 91020.150008 5 89890000008990',
      paidAt: '2025-01-14',
      downloadUrl: '#'
    },
    {
      id: 'BOL-002',
      description: 'Mensalidade Rastreamento - Fevereiro/2025',
      value: 89.90,
      dueDate: '2025-02-15',
      status: 'pago',
      barcode: '34191.79001 01043.510047 91020.150008 5 89890000008990',
      paidAt: '2025-02-16',
      downloadUrl: '#'
    },
    {
      id: 'BOL-003',
      description: 'Mensalidade Rastreamento - Março/2025',
      value: 89.90,
      dueDate: '2025-03-15',
      status: 'vencido',
      barcode: '34191.79001 01043.510047 91020.150008 5 89890000008990',
      downloadUrl: '#'
    },
    {
      id: 'BOL-004',
      description: 'Instalação Rastreador Adicional',
      value: 150.00,
      dueDate: '2025-03-20',
      status: 'pendente',
      barcode: '34191.79001 01043.510047 91020.150008 5 898900000015000',
      downloadUrl: '#'
    },
    {
      id: 'BOL-005',
      description: 'Mensalidade Rastreamento - Abril/2025',
      value: 89.90,
      dueDate: '2025-04-15',
      status: 'pendente',
      barcode: '34191.79001 01043.510047 91020.150008 5 89890000008990',
      downloadUrl: '#'
    }
  ],
  pixTransactions: [
    {
      id: 'PIX-001',
      description: 'Pagamento Fatura #BOL-001',
      value: 89.90,
      date: '2025-01-14 10:30:00',
      status: 'sucesso',
      receiptUrl: '#'
    },
    {
      id: 'PIX-002',
      description: 'Pagamento Fatura #BOL-002',
      value: 89.90,
      date: '2025-02-16 15:45:00',
      status: 'sucesso',
      receiptUrl: '#'
    },
    {
      id: 'PIX-003',
      description: 'Serviço de Manutenção Extra',
      value: 50.00,
      date: '2025-03-01 09:15:00',
      status: 'sucesso',
      receiptUrl: '#'
    }
  ],
  history: [
    {
      id: 'HIST-001',
      type: 'boleto',
      description: 'Mensalidade Jan/25',
      amount: 89.90,
      date: '2025-01-14',
      status: 'completed'
    },
    {
      id: 'HIST-002',
      type: 'boleto',
      description: 'Mensalidade Fev/25',
      amount: 89.90,
      date: '2025-02-16',
      status: 'completed'
    },
    {
      id: 'HIST-003',
      type: 'pix',
      description: 'Manutenção Extra',
      amount: 50.00,
      date: '2025-03-01',
      status: 'completed'
    }
  ]
};
