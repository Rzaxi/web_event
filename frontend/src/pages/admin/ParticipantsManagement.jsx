import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  MapPin,
  Tag,
  Mail,
  Phone,
  CheckCircle,
  XCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const ParticipantsManagement = () => {
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showParticipantDetail, setShowParticipantDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [participantsPerPage] = useState(10);

  useEffect(() => {
    fetchParticipants();
    fetchEvents();
  }, []);

  const fetchParticipants = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('/admin/registrations', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setParticipants(result.data || []);
      } else {
        toast.error('Gagal mengambil data peserta');
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('/admin/events', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Events fetched:', result);
        const eventsData = result.events || result.data?.events || result.data || [];
        console.log('Events data:', eventsData);
        setEvents(eventsData);
      } else {
        console.error('Failed to fetch events:', response.status);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const exportToExcel = () => {
    // Use filtered participants (respects current filter selection)
    const exportData = filteredParticipants.map(participant => ({
      'Event': participant.Event?.judul || '-',
      'Peserta': participant.User?.nama_lengkap || '-',
      'Email': participant.User?.email || '-',
      'No. Handphone': participant.User?.no_handphone || '-',
      'Status Registrasi': participant.status === 'confirmed' ? 'Dikonfirmasi' : participant.status === 'cancelled' ? 'Dibatalkan' : 'Pending',
      'Tanggal Daftar': new Date(participant.createdAt).toLocaleDateString('id-ID'),
      'Kategori Event': participant.Event?.kategori || '-',
      'Tingkat Kesulitan': participant.Event?.tingkat_kesulitan || '-',
      'Tanggal Event': participant.Event?.tanggal ? new Date(participant.Event.tanggal).toLocaleDateString('id-ID') : '-',
      'Lokasi': participant.Event?.lokasi || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Peserta');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Generate filename based on filter
    const selectedEvent = events.find(e => e.id === parseInt(filterEvent));
    const filename = filterEvent === 'all' 
      ? `data-peserta-semua-event-${new Date().toISOString().split('T')[0]}.xlsx`
      : `data-peserta-${selectedEvent?.judul?.replace(/[^a-zA-Z0-9]/g, '-') || 'event'}-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    saveAs(data, filename);
    
    const message = filterEvent === 'all' 
      ? `Data ${exportData.length} peserta dari semua event berhasil diekspor`
      : `Data ${exportData.length} peserta dari event "${selectedEvent?.judul}" berhasil diekspor`;
    
    toast.success(message);
  };

  // Filter participants based on search and event
  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = 
      (participant.User?.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (participant.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (participant.Event?.judul?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesEvent = filterEvent === 'all' || participant.event_id === parseInt(filterEvent);
    
    
    return matchesSearch && matchesEvent;
  });

  // Pagination
  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = filteredParticipants.slice(indexOfFirstParticipant, indexOfLastParticipant);
  const totalPages = Math.ceil(filteredParticipants.length / participantsPerPage);

  const ParticipantDetailModal = ({ participant, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Detail Peserta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Event</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Nama Event
              </label>
              <p className="text-gray-900 font-medium">{participant.Event?.judul || '-'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Kategori
                </label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {participant.Event?.kategori || '-'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  participant.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {participant.status === 'confirmed' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Dikonfirmasi
                    </>
                  ) : (
                    'Pending'
                  )}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Tanggal & Waktu
              </label>
              <p className="text-gray-900">
                {participant.Event?.tanggal ? new Date(participant.Event.tanggal).toLocaleDateString('id-ID') : '-'}
                {participant.Event?.waktu && ` • ${participant.Event.waktu}`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Lokasi
              </label>
              <p className="text-gray-900">{participant.Event?.lokasi || '-'}</p>
            </div>
          </div>

          {/* Participant Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informasi Peserta</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Nama Lengkap
              </label>
              <p className="text-gray-900 font-medium">{participant.User?.nama_lengkap || '-'}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <p className="text-gray-900">{participant.User?.email || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  No. Handphone
                </label>
                <p className="text-gray-900">{participant.User?.no_handphone || '-'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Alamat
              </label>
              <p className="text-gray-900">{participant.User?.alamat || 'Tidak ada alamat'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pendidikan Terakhir
              </label>
              <p className="text-gray-900">{participant.User?.pendidikan_terakhir || 'Tidak diisi'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pendaftaran
              </label>
              <p className="text-gray-900">
                {new Date(participant.createdAt).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Peserta</h1>
        <p className="text-gray-600">Kelola data semua peserta event</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Peserta</p>
              <p className="text-2xl font-bold text-gray-900">{participants.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dikonfirmasi</p>
              <p className="text-2xl font-bold text-gray-900">
                {participants.filter(p => p.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Event Aktif</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari peserta atau event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title || event.judul}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={exportToExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EVENT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PESERTA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS REGISTRASI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TANGGAL DAFTAR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentParticipants.map((participant) => (
                <tr key={participant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {participant.Event?.judul || 'Event Tidak Ditemukan'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {participant.Event?.tanggal ? 
                            new Date(participant.Event.tanggal).toLocaleDateString('id-ID') : 
                            'Tanggal tidak tersedia'
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {participant.User?.nama_lengkap || 'Pengguna Tidak Ditemukan'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.User?.email || 'Email tidak tersedia'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      participant.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      participant.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {participant.status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {participant.status === 'cancelled' && <XCircle className="h-3 w-3 mr-1" />}
                      {participant.status === 'confirmed' ? 'Dikonfirmasi' : 
                       participant.status === 'cancelled' ? 'Dibatalkan' : 
                       'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(participant.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedParticipant(participant);
                        setShowParticipantDetail(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan{' '}
                  <span className="font-medium">{indexOfFirstParticipant + 1}</span>
                  {' '}sampai{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastParticipant, filteredParticipants.length)}
                  </span>
                  {' '}dari{' '}
                  <span className="font-medium">{filteredParticipants.length}</span>
                  {' '}hasil
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } ${i === 0 ? 'rounded-l-md' : ''} ${
                        i === totalPages - 1 ? 'rounded-r-md' : ''
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Participant Detail Modal */}
      {showParticipantDetail && selectedParticipant && (
        <ParticipantDetailModal
          participant={selectedParticipant}
          onClose={() => {
            setShowParticipantDetail(false);
            setSelectedParticipant(null);
          }}
        />
      )}
    </div>
  );
};

export default ParticipantsManagement;
