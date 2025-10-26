import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  MoreVertical,
  Clock,
  ArrowLeft,
  FileText
} from 'lucide-react';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';

const EOParticipants = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDropdown, setShowDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [eventSortBy, setEventSortBy] = useState('tanggal');
  const [participantSortBy, setParticipantSortBy] = useState('nama');
 

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await organizerApi.getEvents();
        
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
  }, []);

  // Fetch participants when event is selected
  const fetchParticipants = async (eventId) => {
    try {
      setParticipantsLoading(true);
      const response = await organizerApi.getParticipants({
        search: searchTerm,
        event_id: eventId,
        status: selectedStatus
      });
      
      if (response.data.success) {
        setParticipants(response.data.data.participants || []);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Gagal memuat data peserta');
    } finally {
      setParticipantsLoading(false);
    }
  };

  // Handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setParticipants([]);
    setSearchTerm('');
    setSelectedStatus('all');
    fetchParticipants(event.id);
  };

  // Handle back to event list
  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setParticipants([]);
    setSearchTerm('');
    setSelectedStatus('all');
  };

  // Refetch participants when filters change
  useEffect(() => {
    if (selectedEvent) {
      fetchParticipants(selectedEvent.id);
    }
  }, [searchTerm, selectedStatus]);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Sort events function
  const sortEvents = (events, sortBy) => {
    if (!events) return [];
    
    return [...events].sort((a, b) => {
      switch (sortBy) {
        case 'tanggal':
          return new Date(b.tanggal) - new Date(a.tanggal);
        case 'nama':
          return a.judul.localeCompare(b.judul);
        case 'peserta':
          return (b.registeredCount || 0) - (a.registeredCount || 0);
        case 'status':
          return a.status_event.localeCompare(b.status_event);
        default:
          return 0;
      }
    });
  };

  // Sort participants function
  const sortParticipants = (participants, sortBy) => {
    if (!participants) return [];
    
    return [...participants].sort((a, b) => {
      switch (sortBy) {
        case 'nama':
          return (a.participant?.nama_lengkap || '').localeCompare(b.participant?.nama_lengkap || '');
        case 'email':
          return (a.participant?.email || '').localeCompare(b.participant?.email || '');
        case 'tanggal':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Terkonfirmasi';
      case 'pending': return 'Menunggu';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceText = (status) => {
    switch (status) {
      case 'present': return 'Hadir';
      case 'late': return 'Terlambat';
      case 'absent': return 'Tidak Hadir';
      default: return 'Belum Dicek';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Nama', 'Email', 'No. HP', 'Event', 'Status', 'Kehadiran', 'Tanggal Daftar'],
      ...filteredParticipants.map(p => [
        p.nama_lengkap,
        p.email,
        p.no_handphone,
        p.event.judul,
        getStatusText(p.status),
        getAttendanceText(p.attendance_status),
        new Date(p.registered_at).toLocaleDateString('id-ID')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'peserta-event.csv';
    a.click();
  };

  const ParticipantCard = ({ participant }) => {
    const participantData = participant.participant || participant;
    const nama = participantData.nama_lengkap || 'Unknown';
    const email = participantData.email || 'No email';
    
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <span className="text-lg font-medium text-gray-600">
                {nama.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{nama}</h3>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
          </div>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(showDropdown === participant.id ? null : participant.id)}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          
          {showDropdown === participant.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Lihat Detail
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Kirim Email
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                Ubah Status
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {participantData.no_handphone || 'No phone'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {participant.event?.judul || 'No event'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          Daftar: {participant.createdAt ? new Date(participant.createdAt).toLocaleDateString('id-ID') : 'Unknown date'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(participant.status)}`}>
            {getStatusText(participant.status)}
          </span>
          {participant.attendance_status && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAttendanceColor(participant.attendance_status)}`}>
              {getAttendanceText(participant.attendance_status)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Mail className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data event...</p>
        </div>
      </div>
    );
  }

  // Event Selection View
  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Peserta Event</h1>
                <p className="text-sm text-gray-600">Pilih event untuk melihat daftar peserta</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats & Sorting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Total Event Anda</h2>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{events?.length || 0}</p>
                </div>
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urutkan Event
                  </label>
                  <select
                    value={eventSortBy}
                    onChange={(e) => setEventSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="tanggal">Tanggal Terbaru</option>
                    <option value="nama">Nama A-Z</option>
                    <option value="peserta">Jumlah Peserta</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {!events || events.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Event</h3>
              <p className="text-gray-600">Buat event pertama Anda untuk mulai menerima peserta</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortEvents(events, eventSortBy)?.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventSelect(event)}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    {/* Left Section - Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 mr-4">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {event.judul}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{event.kategori}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          event.status_event === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {event.status_event === 'published' ? 'Aktif' : 'Draft'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{formatDate(event.tanggal)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{event.lokasi}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-blue-600">{event.registeredCount || 0} Peserta</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${event.biaya > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {event.biaya > 0 ? `Rp ${event.biaya?.toLocaleString('id-ID')}` : 'Gratis'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action */}
                    <div className="ml-6 flex items-center">
                      <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Participants View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToEvents}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Peserta: {selectedEvent.judul}</h1>
                <p className="text-sm text-gray-600">Kelola peserta event ini</p>
              </div>
            </div>
            <button
              onClick={() => {
                // Export participants for this event
                const csvContent = [
                  ['Nama', 'Email', 'No. HP', 'Status', 'Tanggal Daftar'],
                  ...participants.map(p => [
                    p.participant?.nama_lengkap || 'N/A',
                    p.participant?.email || 'N/A',
                    p.participant?.no_handphone || 'N/A',
                    getStatusText(p.status),
                    formatDate(p.createdAt)
                  ])
                ].map(row => row.join(',')).join('\n');

                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `peserta-${selectedEvent.judul}.csv`;
                a.click();
              }}
              className="inline-flex items-center px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Peserta</p>
                <p className="text-2xl font-bold text-gray-900">{participants?.length || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terkonfirmasi</p>
                <p className="text-2xl font-bold text-green-600">
                  {participants?.filter(p => p.status === 'confirmed').length || 0}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {participants?.filter(p => p.status === 'pending').length || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dibatalkan</p>
                <p className="text-2xl font-bold text-red-600">
                  {participants?.filter(p => p.status === 'cancelled').length || 0}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama atau email peserta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="confirmed">Terkonfirmasi</option>
              <option value="pending">Menunggu</option>
              <option value="cancelled">Dibatalkan</option>
            </select>

            {/* Sort Participants */}
            <select
              value={participantSortBy}
              onChange={(e) => setParticipantSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="nama">Urutkan: Nama A-Z</option>
              <option value="email">Urutkan: Email A-Z</option>
              <option value="tanggal">Urutkan: Tanggal Daftar</option>
              <option value="status">Urutkan: Status</option>
            </select>
          </div>
        </div>

        {/* Participants List */}
        {participantsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Memuat data peserta...</span>
          </div>
        ) : !participants || participants.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Peserta</h3>
            <p className="text-gray-600">Belum ada yang mendaftar untuk event ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortParticipants(participants, participantSortBy)?.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EOParticipants;
