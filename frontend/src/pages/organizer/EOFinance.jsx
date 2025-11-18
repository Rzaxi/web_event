import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Eye,
  Settings,
  Wallet,
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Banknote,
  Receipt,
  FileText
} from 'lucide-react';
import { toast } from 'react-toastify';
import LazyWrapper from '../../components/ui/LazyWrapper';
import { DashboardStatsSkeleton, TableSkeleton } from '../../components/ui/SkeletonLoader';

const EOFinance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch finance data function for LazyWrapper
  const fetchFinanceData = async () => {
    // Simulate API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      stats: {
        totalRevenue: 15750000,
        monthlyRevenue: 4250000,
        pendingPayments: 850000,
        completedTransactions: 127,
        pendingTransactions: 8,
        failedTransactions: 3
      },
      paymentMethods: [
        {
          id: 1,
          name: 'Midtrans',
          type: 'gateway',
          status: 'active',
          fee: '2.9%',
          description: 'Payment gateway utama untuk semua transaksi',
          logo: '/api/placeholder/40/40',
          isDefault: true
        },
        {
          id: 2,
          name: 'Bank Transfer',
          type: 'manual',
          status: 'active',
          fee: 'Rp 0',
          description: 'Transfer manual ke rekening bank',
          logo: '/api/placeholder/40/40',
          isDefault: false
        },
        {
          id: 3,
          name: 'GoPay',
          type: 'ewallet',
          status: 'inactive',
          fee: '2.5%',
          description: 'E-wallet GoPay',
          logo: '/api/placeholder/40/40',
          isDefault: false
        }
      ],
      transactions: [
        {
          id: 'TXN001',
          eventTitle: 'Workshop Digital Marketing',
          participantName: 'Ahmad Rizki',
          amount: 250000,
          method: 'Midtrans',
          status: 'completed',
          date: '2025-10-29T10:30:00',
          fee: 7250
        },
        {
          id: 'TXN002',
          eventTitle: 'Seminar Teknologi AI',
          participantName: 'Siti Nurhaliza',
          amount: 150000,
          method: 'Bank Transfer',
          status: 'pending',
          date: '2025-10-29T14:15:00',
          fee: 0
        },
        {
          id: 'TXN003',
          eventTitle: 'Pelatihan Public Speaking',
          participantName: 'Budi Santoso',
          amount: 300000,
          method: 'Midtrans',
          status: 'failed',
          date: '2025-10-28T16:45:00',
          fee: 8700
        }
      ]
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Berhasil';
      case 'pending': return 'Menunggu';
      case 'failed': return 'Gagal';
      case 'active': return 'Aktif';
      case 'inactive': return 'Nonaktif';
      default: return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const handleExportTransactions = () => {
    toast.success('Data transaksi berhasil diekspor');
  };

  const handleTogglePaymentMethod = (id) => {
    toast.success('Status metode pembayaran berhasil diubah');
  };

  const handleSetDefault = (id) => {
    toast.success('Metode pembayaran default berhasil diubah');
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
    </div>
  );

  const PaymentMethodCard = ({ method }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
            <img src={method.logo} alt={method.name} className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{method.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{method.type}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {method.isDefault && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Default
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(method.status)}`}>
            {getStatusText(method.status)}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{method.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-gray-600">Fee: </span>
          <span className="font-medium text-gray-900">{method.fee}</span>
        </div>
        <div className="flex items-center space-x-2">
          {!method.isDefault && (
            <button
              onClick={() => handleSetDefault(method.id)}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Set Default
            </button>
          )}
          <button
            onClick={() => handleTogglePaymentMethod(method.id)}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              method.status === 'active'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {method.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button className="p-1 text-gray-600 hover:text-blue-600 rounded">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const TransactionRow = ({ transaction }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
        <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{transaction.eventTitle}</div>
        <div className="text-sm text-gray-500">{transaction.participantName}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
        {transaction.fee > 0 && (
          <div className="text-xs text-gray-500">Fee: {formatCurrency(transaction.fee)}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">{transaction.method}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
          {getStatusText(transaction.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Receipt className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <LazyWrapper
      fetchFunction={fetchFinanceData}
      SkeletonComponent={DashboardStatsSkeleton}
    >
      {(financeData) => {
        // Filter transactions based on search and filters
        const filteredTransactions = financeData.transactions.filter(transaction => {
          const matchesSearch = transaction.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               transaction.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesDate = dateFilter === 'all' || 
                             (dateFilter === 'today' && new Date(transaction.date).toDateString() === new Date().toDateString()) ||
                             (dateFilter === 'week' && new Date(transaction.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                             (dateFilter === 'month' && new Date(transaction.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
          const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
          
          return matchesSearch && matchesDate && matchesStatus;
        });

        return (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Wallet className="w-8 h-8 text-blue-600 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Keuangan</h1>
                    <p className="text-sm text-gray-600">Kelola pembayaran dan transaksi event</p>
                  </div>
                </div>
                <button
                  onClick={handleExportTransactions}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Ringkasan', icon: BarChart3 },
                { id: 'transactions', name: 'Transaksi', icon: Receipt },
                { id: 'payment-methods', name: 'Metode Pembayaran', icon: CreditCard },
                { id: 'settings', name: 'Pengaturan', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={DollarSign}
                title="Total Pendapatan"
                value={formatCurrency(financeData.stats.totalRevenue)}
                subtitle="Semua waktu"
                trend={12.5}
                color="green"
              />
              <StatCard
                icon={TrendingUp}
                title="Pendapatan Bulan Ini"
                value={formatCurrency(financeData.stats.monthlyRevenue)}
                subtitle="Oktober 2025"
                trend={8.2}
                color="blue"
              />
              <StatCard
                icon={Clock}
                title="Pembayaran Tertunda"
                value={formatCurrency(financeData.stats.pendingPayments)}
                subtitle={`${financeData.stats.pendingTransactions} transaksi`}
                color="yellow"
              />
              <StatCard
                icon={CheckCircle}
                title="Transaksi Berhasil"
                value={`${financeData.stats.completedTransactions}`}
                subtitle="Bulan ini"
                trend={5.1}
                color="green"
              />
            </div>

            {/* Revenue Chart Placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Grafik Pendapatan</h2>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                    <option>3 Bulan Terakhir</option>
                  </select>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Grafik pendapatan akan ditampilkan di sini</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari transaksi, event, atau peserta..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Semua Status</option>
                    <option value="completed">Berhasil</option>
                    <option value="pending">Menunggu</option>
                    <option value="failed">Gagal</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Semua Waktu</option>
                    <option value="today">Hari Ini</option>
                    <option value="week">Minggu Ini</option>
                    <option value="month">Bulan Ini</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Riwayat Transaksi</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID & Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event & Peserta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payment-methods' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Metode Pembayaran</h2>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Metode
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {financeData.paymentMethods.map((method) => (
                <PaymentMethodCard key={method.id} method={method} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Pengaturan Payment Gateway</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Midtrans Server Key
                  </label>
                  <input
                    type="password"
                    placeholder="SB-Mid-server-xxxxxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Midtrans Client Key
                  </label>
                  <input
                    type="text"
                    placeholder="SB-Mid-client-xxxxxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sandbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sandbox" className="ml-2 block text-sm text-gray-700">
                    Mode Sandbox (Testing)
                  </label>
                </div>

                <div className="pt-4">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Simpan Pengaturan
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Pengaturan Umum</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Uang Default
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="IDR">IDR - Rupiah Indonesia</option>
                    <option value="USD">USD - US Dollar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batas Waktu Pembayaran (menit)
                  </label>
                  <input
                    type="number"
                    defaultValue="60"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-confirm"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-confirm" className="ml-2 block text-sm text-gray-700">
                    Konfirmasi otomatis setelah pembayaran berhasil
                  </label>
                </div>

                <div className="pt-4">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Simpan Pengaturan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
        );
      }}
    </LazyWrapper>
  );
};

export default EOFinance;
