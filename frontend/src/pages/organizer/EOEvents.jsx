<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
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
<<<<<<< HEAD
  DollarSign,
  UserCheck,
  Download
=======
  DollarSign
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
} from 'lucide-react';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import LazyWrapper from '../../components/ui/LazyWrapper';
import { EventListSkeleton } from '../../components/ui/SkeletonLoader';

const EOEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch events function for LazyWrapper
  const fetchEvents = async () => {
    try {
      const response = await organizerApi.getEvents({
        search: searchTerm,
        status: filterStatus
      });
      
      if (response.data && response.data.success) {
        const eventsData = response.data.data?.events || [];
        return Array.isArray(eventsData) ? eventsData : [];
      }
      
      // If API returns but not successful, throw error to use fallback
      throw new Error('API response not successful');
      
    } catch (error) {
      console.error('⚠️ Events API failed:', error.message);
      
      // Check if it's a 403 error (authentication issue)
      if (error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Gagal memuat daftar event');
      }
      
      // Return empty array instead of mock data
      return [];
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.relative')) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
=======

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
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      try {
        await organizerApi.deleteEvent(eventId);
        toast.success('Event berhasil dihapus');
<<<<<<< HEAD
        setShowDropdown(null); // Close dropdown
        fetchEvents(); // Refresh data
=======
        // Refresh data
        const response = await organizerApi.getEvents({
          search: searchTerm,
          status: filterStatus
        });
        if (response.data.success) {
          setEvents(response.data.data);
        }
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Gagal menghapus event');
      }
    }
  };

<<<<<<< HEAD
  const handleViewDetail = (eventId) => {
    setShowDropdown(null);
    navigate(`/organizer/events/${eventId}`);
  };

  const handleEditEvent = (eventId) => {
    setShowDropdown(null);
    navigate(`/organizer/events/${eventId}/edit`);
  };

  const handleManageParticipants = (eventId) => {
    setShowDropdown(null);
    navigate(`/organizer/participants?eventId=${eventId}`);
  };

  const handleExportData = async (eventId) => {
    setShowDropdown(null);
    try {
      // Implement export functionality
      toast.info('Fitur export sedang dalam pengembangan');
    } catch (error) {
      toast.error('Gagal export data');
    }
  };

  // Function untuk menentukan status realtime event (sama seperti di dashboard)
  const getEventRealTimeStatus = (event) => {
    if (!event || !event.tanggal) {
      return 'unknown';
    }

    const now = new Date();
    const eventDate = new Date(event.tanggal);
    
    // Jika tidak ada waktu mulai/selesai, bandingkan hanya berdasarkan tanggal
    if (!event.waktu_mulai || !event.waktu_selesai) {
      // Set waktu event ke akhir hari untuk perbandingan
      const eventEndOfDay = new Date(eventDate);
      eventEndOfDay.setHours(23, 59, 59, 999);
      
      if (now > eventEndOfDay) {
        return 'completed'; // Sudah selesai
      } else if (now.toDateString() === eventDate.toDateString()) {
        return 'ongoing'; // Berlangsung hari ini
      } else {
        return 'upcoming'; // Akan datang
      }
    }
    
    // Parse waktu mulai dan selesai
    const [startHour, startMinute] = event.waktu_mulai.split(':').map(Number);
    const [endHour, endMinute] = event.waktu_selesai.split(':').map(Number);
    
    // Buat datetime untuk mulai dan selesai event
    const eventStart = new Date(eventDate);
    eventStart.setHours(startHour, startMinute, 0, 0);
    
    const eventEnd = new Date(eventDate);
    eventEnd.setHours(endHour, endMinute, 0, 0);
    
    // Jika event end time lebih kecil dari start time, berarti event berakhir di hari berikutnya
    if (eventEnd < eventStart) {
      eventEnd.setDate(eventEnd.getDate() + 1);
    }
    
    // Tentukan status berdasarkan waktu sekarang
    if (now < eventStart) {
      return 'upcoming'; // Akan datang
    } else if (now >= eventStart && now <= eventEnd) {
      return 'ongoing'; // Sedang berlangsung
    } else {
      return 'completed'; // Sudah selesai
    }
  };

  // Function untuk mendapatkan display status dengan warna (sama seperti di dashboard)
  const getEventStatusDisplay = (event) => {
    // Jika event masih draft, prioritaskan status draft
    if (event.status_event === 'draft') {
      return { 
        text: 'Draft', 
        color: 'bg-yellow-100 text-yellow-800',
        realTimeStatus: 'draft'
      };
    }
    
    // Jika event dibatalkan
    if (event.status_event === 'cancelled') {
      return { 
        text: 'Dibatalkan', 
        color: 'bg-red-100 text-red-800',
        realTimeStatus: 'cancelled'
      };
    }
    
    // Untuk event yang published, gunakan realtime status
    const realTimeStatus = getEventRealTimeStatus(event);
    
    switch (realTimeStatus) {
      case 'ongoing':
        return { 
          text: 'Berlangsung', 
          color: 'bg-blue-100 text-blue-800',
          realTimeStatus: 'ongoing'
        };
      case 'completed':
        return { 
          text: 'Selesai', 
          color: 'bg-gray-100 text-gray-800',
          realTimeStatus: 'completed'
        };
      case 'upcoming':
        return { 
          text: 'Akan Datang', 
          color: 'bg-green-100 text-green-800',
          realTimeStatus: 'upcoming'
        };
      default:
        return { 
          text: 'Aktif', 
          color: 'bg-green-100 text-green-800',
          realTimeStatus: 'active'
        };
    }
  };

  const EventCard = ({ event }) => {
    const statusDisplay = getEventStatusDisplay(event);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 p-4">
        <div className="flex items-center justify-between">
          {/* Left: Event Title and Category */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {event.judul}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusDisplay.color}`}>
                {statusDisplay.text}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{event.kategori}</p>
          </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={() => handleViewDetail(event.id)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Lihat Detail"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(showDropdown === event.id ? null : event.id)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            
            {showDropdown === event.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-20">
                <button 
                  onClick={() => handleViewDetail(event.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Detail
                </button>
                <button 
                  onClick={() => handleEditEvent(event.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Event
                </button>
                <button 
                  onClick={() => handleManageParticipants(event.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Kelola Peserta
                </button>
                <button 
                  onClick={() => handleExportData(event.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
                <hr className="my-2" />
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Event
                </button>
              </div>
            )}
=======
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
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Bottom Row: Event Details */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{event.waktu_mulai} WIB</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[100px]">{event.lokasi}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{event.registeredCount || 0} Peserta</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {event.biaya === 0 ? 'Gratis' : `Rp ${event.biaya?.toLocaleString('id-ID') || 0}`}
          </span>
        </div>
      </div>
    </div>
    );
  };
=======
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
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

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

<<<<<<< HEAD
        {/* Events List with LazyWrapper */}
        <LazyWrapper
          fetchFunction={fetchEvents}
          dependencies={[searchTerm, filterStatus]}
          SkeletonComponent={() => (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-start justify-between">
                    {/* Left Content */}
                    <div className="flex-1">
                      {/* Title and Status */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-6 bg-gray-200 rounded w-8"></div>
                        <div className="h-5 bg-gray-200 rounded w-24"></div>
                      </div>
                      
                      {/* Event Title */}
                      <div className="h-4 bg-gray-200 rounded w-48 mb-3"></div>
                      
                      {/* Event Details */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Content */}
                    <div className="flex items-center gap-3">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          delay={400}
        >
          {(events) => {
            const filteredEvents = events.filter(event => {
              const matchesSearch = !searchTerm || 
                event.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.lokasi?.toLowerCase().includes(searchTerm.toLowerCase());
              
              const matchesStatus = filterStatus === 'all' || event.status_event === filterStatus;
              
              return matchesSearch && matchesStatus;
            });

            return filteredEvents.length > 0 ? (
              <div className="space-y-4">
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
            );
          }}
        </LazyWrapper>
=======
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
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      </div>
    </div>
  );
};

export default EOEvents;
