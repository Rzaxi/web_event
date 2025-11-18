import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  Users,
  MapPin,
  Tag,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showRegistrationDetail, setShowRegistrationDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [registrationsPerPage] = useState(10);

  useEffect(() => {
    fetchRegistrations();
    fetchEvents();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('/admin/registrations', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setRegistrations(result.data || []);
      } else {
        toast.error('Gagal mengambil data pendaftaran');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
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
        setEvents(result.data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleUpdateRegistrationStatus = async (registrationId, newStatus) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`/admin/registrations/${registrationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Status pendaftaran berhasil diubah ke ${newStatus}`);
        fetchRegistrations();
      } else {
        toast.error('Gagal mengubah status pendaftaran');
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
      toast.error('Terjadi kesalahan');
    }
  };

  const exportToExcel = () => {
    const exportData = filteredRegistrations.map(reg => ({
      'Event': reg.Event?.judul || '-',
      'Peserta': reg.User?.nama_lengkap || '-',
      'Email': reg.User?.email || '-',
      'No. Handphone': reg.User?.no_handphone || '-',
      'Status': getStatusLabel(reg.status),
      'Tanggal Daftar': new Date(reg.createdAt).toLocaleDateString('id-ID'),
      'Kategori Event': reg.Event?.kategori || '-',
      'Tingkat Kesulitan': reg.Event?.tingkat_kesulitan || '-',
      'Tanggal Event': reg.Event?.tanggal ? new Date(reg.Event.tanggal).toLocaleDateString('id-ID') : '-',
      'Lokasi': reg.Event?.lokasi || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Pendaftaran');
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `data-pendaftaran-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success('Data pendaftaran berhasil diekspor');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'confirmed': return 'Dikonfirmasi';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  // Filter registrations based on search, status, and event
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      (reg.User?.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (reg.User?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (reg.Event?.judul?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
    const matchesEvent = filterEvent === 'all' || reg.event_id === parseInt(filterEvent);
    
    return matchesSearch && matchesStatus && matchesEvent;
  });

  // Pagination
  const indexOfLastRegistration = currentPage * registrationsPerPage;
  const indexOfFirstRegistration = indexOfLastRegistration - registrationsPerPage;
  const currentRegistrations = filteredRegistrations.slice(indexOfFirstRegistration, indexOfLastRegistration);
  const totalPages = Math.ceil(filteredRegistrations.length / registrationsPerPage);

  const RegistrationDetailModal = ({ registration, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Detail Pendaftaran</h2>
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
              <p className="text-gray-900 font-medium">{registration.Event?.judul || '-'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Kategori
                </label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {registration.Event?.kategori || '-'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  Tingkat
                </label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {registration.Event?.tingkat_kesulitan || '-'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Tanggal & Waktu
              </label>
              <p className="text-gray-900">
                {registration.Event?.tanggal ? new Date(registration.Event.tanggal).toLocaleDateString('id-ID') : '-'}
                {registration.Event?.waktu && ` • ${registration.Event.waktu}`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Lokasi
              </label>
              <p className="text-gray-900">{registration.Event?.lokasi || '-'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <p className="text-gray-900 text-sm leading-relaxed">
                {registration.Event?.deskripsi || 'Tidak ada deskripsi'}
              </p>
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
              <p className="text-gray-900 font-medium">{registration.User?.nama_lengkap || '-'}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <p className="text-gray-900">{registration.User?.email || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  No. Handphone
                </label>
                <p className="text-gray-900">{registration.User?.no_handphone || '-'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Alamat
              </label>
              <p className="text-gray-900">{registration.User?.alamat || 'Tidak ada alamat'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pendidikan Terakhir
              </label>
              <p className="text-gray-900">{registration.User?.pendidikan_terakhir || 'Tidak diisi'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Pendaftaran
              </label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.status)}`}>
                {React.createElement(getStatusIcon(registration.status), { className: "h-4 w-4 mr-1" })}
                {getStatusLabel(registration.status)}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pendaftaran
              </label>
              <p className="text-gray-900">
                {new Date(registration.createdAt).toLocaleDateString('id-ID', {
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
          {registration.status === 'pending' && (
            <>
              <button
                onClick={() => {
                  handleUpdateRegistrationStatus(registration.id, 'confirmed');
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Konfirmasi
              </button>
              <button
                onClick={() => {
                  handleUpdateRegistrationStatus(registration.id, 'cancelled');
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Batalkan
              </button>
            </>
          )}
          {registration.status === 'confirmed' && (
            <button
              onClick={() => {
                handleUpdateRegistrationStatus(registration.id, 'cancelled');
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Batalkan Pendaftaran
            </button>
          )}
          {registration.status === 'cancelled' && (
            <button
              onClick={() => {
                handleUpdateRegistrationStatus(registration.id, 'confirmed');
                onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Aktifkan Kembali
            </button>
          )}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Pendaftaran</h1>
        <p className="text-gray-600">Kelola semua pendaftaran event dan status peserta</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pendaftaran</p>
              <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Menunggu</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'pending').length}
              </p>
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
                {registrations.filter(r => r.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dibatalkan</p>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'cancelled').length}
              </p>
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Event</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.judul}
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

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peserta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Daftar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.Event?.judul || 'Event Tidak Ditemukan'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {registration.Event?.tanggal ? 
                            new Date(registration.Event.tanggal).toLocaleDateString('id-ID') : 
                            'Tanggal tidak tersedia'
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {registration.User?.nama_lengkap || 'Pengguna Tidak Ditemukan'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {registration.User?.email || 'Email tidak tersedia'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                      {React.createElement(getStatusIcon(registration.status), { className: "h-3 w-3 mr-1" })}
                      {getStatusLabel(registration.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(registration.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowRegistrationDetail(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {registration.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateRegistrationStatus(registration.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                            title="Konfirmasi"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateRegistrationStatus(registration.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Batalkan"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
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
                  <span className="font-medium">{indexOfFirstRegistration + 1}</span>
                  {' '}sampai{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastRegistration, filteredRegistrations.length)}
                  </span>
                  {' '}dari{' '}
                  <span className="font-medium">{filteredRegistrations.length}</span>
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

      {/* Registration Detail Modal */}
      {showRegistrationDetail && selectedRegistration && (
        <RegistrationDetailModal
          registration={selectedRegistration}
          onClose={() => {
            setShowRegistrationDetail(false);
            setSelectedRegistration(null);
          }}
        />
      )}
    </div>
  );
};

export default RegistrationManagement;
