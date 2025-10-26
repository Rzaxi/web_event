import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Clock,
  Users,
  DollarSign
} from 'lucide-react';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EOEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch events data from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await organizerApi.getEvents({
          search: searchTerm,
          status: filterStatus
        });
        
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Gagal memuat data event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchTerm, filterStatus]);

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        await organizerApi.deleteEvent(eventId);
        toast.success('Event berhasil dihapus');
        // Refresh data
        const response = await organizerApi.getEvents({
          search: searchTerm,
          status: filterStatus
        });
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Gagal menghapus event');
      }
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status_event === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return 'Aktif';
      case 'draft': return 'Draft';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{event.judul}</h3>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(showDropdown === event.id ? null : event.id)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
              
              {showDropdown === event.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Lihat Detail
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Event
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Kelola Peserta
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                  <hr className="my-2" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Event
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
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

          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status_event)}`}>
              {getStatusText(event.status_event)}
            </span>
            <span className="text-sm font-medium text-gray-900">
              {event.biaya === 0 ? 'Gratis' : `Rp ${event.biaya.toLocaleString('id-ID')}`}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Peserta Terdaftar</span>
          <span>{event.registeredCount}/{event.kapasitas_peserta}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(event.registeredCount / event.kapasitas_peserta) * 100}%` }}
          ></div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.deskripsi}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {event.kategori}
        </span>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteEvent(event.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
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
              <h1 className="text-2xl font-bold text-gray-900">Event Saya</h1>
              <p className="text-sm text-gray-600">Kelola semua event yang Anda buat</p>
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
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari event berdasarkan judul atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="published">Aktif</option>
                <option value="draft">Draft</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data event...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'Tidak Ada Event Ditemukan' : 'Belum Ada Event'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Mulai buat event pertama Anda untuk menjangkau lebih banyak peserta'
              }
            </p>
            {(!searchTerm && filterStatus === 'all') && (
              <button
                onClick={() => navigate('/organizer/events/create')}
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Event Baru
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EOEvents;
