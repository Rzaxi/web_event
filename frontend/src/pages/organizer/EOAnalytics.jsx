import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Eye,
  DollarSign,
  Target,
  Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';

const EOAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await organizerApi.getAnalytics(timeRange);
        
        if (response.data.success) {
          setAnalyticsData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Gagal memuat data analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Fallback mock data jika API belum ready
  const mockData = {
    monthlyEvents: [
      { month: 'Jun', events: 2, participants: 45 },
      { month: 'Jul', events: 3, participants: 78 },
      { month: 'Agu', events: 1, participants: 25 },
      { month: 'Sep', events: 4, participants: 120 },
      { month: 'Okt', events: 3, participants: 89 },
      { month: 'Nov', events: 2, participants: 67 }
    ],
    eventCategories: [
      { name: 'Pelatihan', value: 45, color: '#3B82F6' },
      { name: 'Webinar', value: 30, color: '#10B981' },
      { name: 'Workshop', value: 15, color: '#F59E0B' },
      { name: 'Bootcamp', value: 10, color: '#EF4444' }
    ],
    topEvents: [
      { name: 'Workshop Digital Marketing', participants: 45, revenue: 6750000 },
      { name: 'Seminar Kewirausahaan', participants: 32, revenue: 0 },
      { name: 'Training Leadership', participants: 28, revenue: 8400000 },
      { name: 'Bootcamp Web Dev', participants: 15, revenue: 37500000 }
    ],
    stats: {
      totalEvents: 12,
      totalParticipants: 324,
      totalRevenue: 52650000,
      avgParticipants: 27,
      completionRate: 85,
      satisfactionRate: 4.2
    }
  };

  // Use API data if available, otherwise use mock data
  const currentData = Object.keys(analyticsData).length > 0 ? analyticsData : mockData;

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600">Analisis performa event dan peserta</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1month">1 Bulan Terakhir</option>
                <option value="3months">3 Bulan Terakhir</option>
                <option value="6months">6 Bulan Terakhir</option>
                <option value="1year">1 Tahun Terakhir</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data analytics...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total Event"
            value={currentData.stats?.totalEvents || 0}
            subtitle="Event yang telah dibuat"
            trend="+12%"
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Total Peserta"
            value={currentData.stats?.totalParticipants || 0}
            subtitle="Peserta terdaftar"
            trend="+8%"
            color="green"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={formatCurrency(currentData.stats?.totalRevenue || 0)}
            subtitle="Pendapatan kotor"
            trend="+15%"
            color="yellow"
          />
          <StatCard
            icon={Target}
            title="Rata-rata Peserta"
            value={currentData.stats?.avgParticipants || 0}
            subtitle="Per event"
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Events Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Event & Peserta Bulanan</h3>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData.monthlyEvents || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#3B82F6" name="Event" />
                <Bar dataKey="participants" fill="#10B981" name="Peserta" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Event Categories Pie Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Kategori Event</h3>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={currentData.eventCategories || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(currentData.eventCategories || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tingkat Penyelesaian</h3>
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {currentData.stats?.completionRate || 0}%
              </div>
              <p className="text-sm text-gray-600">Event yang diselesaikan</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentData.stats?.completionRate || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rating Kepuasan</h3>
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {currentData.stats?.satisfactionRate || 0}/5
              </div>
              <p className="text-sm text-gray-600">Rata-rata rating peserta</p>
              <div className="flex justify-center mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-2xl ${
                      star <= (currentData.stats?.satisfactionRate || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Growth Rate</h3>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">+23%</div>
              <p className="text-sm text-gray-600">Pertumbuhan peserta</p>
              <p className="text-xs text-gray-500 mt-2">Dibanding periode sebelumnya</p>
            </div>
          </div>
        </div>

        {/* Top Performing Events */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Event Terpopuler</h3>
            <p className="text-sm text-gray-600">Event dengan peserta dan revenue tertinggi</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(currentData.topEvents || []).map((event, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-600">{event.participants} peserta</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {event.revenue > 0 ? formatCurrency(event.revenue) : 'Gratis'}
                    </p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EOAnalytics;
