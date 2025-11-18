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
<<<<<<< HEAD
import LazyWrapper from '../../components/ui/LazyWrapper';
import { DashboardStatsSkeleton, EventListSkeleton } from '../../components/ui/SkeletonLoader';

const EODashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  // Fetch dashboard data function for LazyWrapper
  const fetchDashboardData = async () => {
    try {
      const response = await organizerApi.getDashboardData();
      
      if (response.data && response.data.success) {
        const { stats: apiStats, recentEvents } = response.data.data;
        return { stats: apiStats, events: recentEvents };
      }
      
      // If API returns but not successful, throw error to use fallback
      throw new Error('API response not successful');
      
    } catch (error) {
      console.error('⚠️ Dashboard API failed:', error.message);
      
      // Check if it's a 403 error (authentication issue)
      if (error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Gagal memuat data dashboard');
      }
      
      // Return empty data instead of mock
      return {
        stats: {
          totalEvents: 0,
          activeEvents: 0,
          completedEvents: 0,
          totalParticipants: 0
        },
        events: []
      };
    }
  };

  // Handle view event
  const handleViewEvent = (eventId) => {
    navigate(`/organizer/events/${eventId}`);
  };

  // Handle edit event
  const handleEditEvent = (eventId) => {
    navigate(`/organizer/events/${eventId}/edit`);
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus event "${eventTitle}"?`)) {
      try {
        await organizerApi.deleteEvent(eventId);
        toast.success('Event berhasil dihapus');
        // Refresh data
        const response = await organizerApi.getDashboardData();
=======

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
        
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        if (response.data.success) {
          const { stats: apiStats, recentEvents } = response.data.data;
          setStats(apiStats);
          setEvents(recentEvents);
        }
      } catch (error) {
<<<<<<< HEAD
        console.error('Error deleting event:', error);
        toast.error('Gagal menghapus event');
      }
    }
  };

  // Handle attendance
  const handleAttendance = (eventId) => {
    navigate(`/organizer/attendance?event=${eventId}`);
  };

  // Handle export participants
  const handleExportParticipants = (eventId) => {
    navigate(`/organizer/participants?event=${eventId}&export=true`);
  };
=======
        console.error('Error fetching dashboard data:', error);
        toast.error('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

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

<<<<<<< HEAD
  const EventCard = ({ event }) => {
    // Get status based on real-time date
    const getStatusDisplay = (event) => {
      if (event.status_event === 'draft') {
        return { text: 'Draft', color: 'bg-yellow-100 text-yellow-800' };
      }
      
      switch (event.realTimeStatus) {
        case 'ongoing':
          return { text: 'Berlangsung', color: 'bg-blue-100 text-blue-800' };
        case 'completed':
          return { text: 'Selesai', color: 'bg-gray-100 text-gray-800' };
        case 'upcoming':
          return { text: 'Akan Datang', color: 'bg-green-100 text-green-800' };
        default:
          return { text: 'Aktif', color: 'bg-green-100 text-green-800' };
      }
    };

    const statusDisplay = getStatusDisplay(event);

    return (
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
                {event.waktu_mulai} - {event.waktu_selesai} WIB
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {event.lokasi}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
            {statusDisplay.text}
          </span>
        </div>
=======
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
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

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
<<<<<<< HEAD
          <button 
            onClick={() => handleViewEvent(event.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleEditEvent(event.id)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Event"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteEvent(event.id, event.judul)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Event"
          >
=======
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
<<<<<<< HEAD
          <button 
            onClick={() => handleAttendance(event.id)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Kelola Kehadiran"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleExportParticipants(event.id)}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Export Data Peserta"
          >
=======
          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <UserCheck className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
<<<<<<< HEAD
    );
  };
=======
  );
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

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
<<<<<<< HEAD
        <LazyWrapper
          fetchFunction={fetchDashboardData}
          SkeletonComponent={() => (
            <div className="space-y-8">
              {/* Stats Cards Skeleton - 5 cards in a row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
              
              {/* Recent Events Skeleton */}
              <div className="bg-white rounded-2xl border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded-lg w-10 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl mr-4"></div>
                          <div>
                            <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          delay={500}
        >
          {(data) => (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard
                  icon={Calendar}
                  title="Total Event"
                  value={data.stats.totalEvents}
                  subtitle="Semua event yang dibuat"
                />
                <StatCard
                  icon={Users}
                  title="Total Peserta"
                  value={data.stats.totalParticipants}
                  subtitle="Dari semua event"
                />
                <StatCard
                  icon={Clock}
                  title="Akan Datang"
                  value={data.stats.activeEvents}
                  subtitle="Event yang akan datang"
                />
                <StatCard
                  icon={BarChart3}
                  title="Berlangsung"
                  value={data.stats.ongoingEvents}
                  subtitle="Event hari ini"
                />
                <StatCard
                  icon={TrendingUp}
                  title="Selesai"
                  value={data.stats.completedEvents}
                  subtitle="Event yang sudah lewat"
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
                  {data.events.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {data.events.map(event => (
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
          )}
        </LazyWrapper>
=======
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
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      </div>
    </div>
  );
};

export default EODashboard;
