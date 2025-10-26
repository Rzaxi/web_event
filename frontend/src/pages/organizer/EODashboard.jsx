import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  Plus, 
  Search,
  Filter,
  Download,
  UserCheck,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';

const EODashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    activeEvents: 0,
    completedEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await organizerApi.getDashboardData();
        
        if (response.data.success) {
          const { stats: apiStats, recentEvents } = response.data.data;
          setStats(apiStats);
          setEvents(recentEvents);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.judul}</h3>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(event.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {event.waktu_mulai} WIB
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {event.lokasi}
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          event.status_event === 'published' 
            ? 'bg-green-100 text-green-800' 
            : event.status_event === 'completed'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {event.status_event === 'published' ? 'Aktif' : 
           event.status_event === 'completed' ? 'Selesai' : 'Draft'}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Peserta</span>
          <span>{event.registeredCount}/{event.kapasitas_peserta}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(event.registeredCount / event.kapasitas_peserta) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <UserCheck className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Organizer Dashboard</h1>
              <p className="text-sm text-gray-600">Selamat datang, {user?.nama_lengkap || user?.nama}</p>
            </div>
            <button
              onClick={() => navigate('/organizer/events/create')}
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Event Baru
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total Event"
            value={stats.totalEvents}
            subtitle="Semua event yang dibuat"
            trend="+12%"
          />
          <StatCard
            icon={Users}
            title="Total Peserta"
            value={stats.totalParticipants}
            subtitle="Dari semua event"
            trend="+8%"
          />
          <StatCard
            icon={BarChart3}
            title="Event Aktif"
            value={stats.activeEvents}
            subtitle="Sedang berjalan"
          />
          <StatCard
            icon={TrendingUp}
            title="Event Selesai"
            value={stats.completedEvents}
            subtitle="Event yang sudah selesai"
          />
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Event Terbaru</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari event..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Event</h3>
                <p className="text-gray-600 mb-6">Mulai buat event pertama Anda</p>
                <button
                  onClick={() => navigate('/organizer/events/create')}
                  className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Event Baru
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EODashboard;
