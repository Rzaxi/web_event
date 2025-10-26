import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { 
  Camera, 
  Users, 
  CheckCircle, 
  XCircle, 
  Download, 
  Search,
  Filter,
  RefreshCw,
  Clock,
  UserCheck,
  AlertCircle,
  CameraOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EOAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    attended: 0,
    confirmed: 0,
    cancelled: 0
  });
  
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Fetch events milik organizer
  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  // Filter participants berdasarkan search dan status
  useEffect(() => {
    let filtered = participants;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.User?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.User?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    setFilteredParticipants(filtered);
  }, [participants, searchTerm, statusFilter]);

  // Update stats ketika participants berubah
  useEffect(() => {
    const newStats = {
      total: participants.length,
      attended: participants.filter(p => p.status === 'attended').length,
      confirmed: participants.filter(p => p.status === 'confirmed').length,
      cancelled: participants.filter(p => p.status === 'cancelled').length
    };
    setStats(newStats);
  }, [participants]);

  const fetchOrganizerEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events/organizer', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        toast.error('Gagal memuat daftar event');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Terjadi kesalahan saat memuat event');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventParticipants = async (eventId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      } else {
        toast.error('Gagal memuat daftar peserta');
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      toast.error('Terjadi kesalahan saat memuat peserta');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setSearchTerm('');
    setStatusFilter('all');
    fetchEventParticipants(event.id);
  };

  // Initialize QR Scanner
  const initializeScanner = () => {
    if (scannerRef.current && !html5QrCodeRef.current) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
      };

      const html5QrCode = new Html5QrcodeScanner("qr-scanner", config, false);
      html5QrCodeRef.current = html5QrCode;

      html5QrCode.render(
        (decodedText) => {
          // Success callback
          handleQRScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Error callback (optional)
          console.log("QR scan error:", errorMessage);
        }
      );
    }
  };

  // Handle successful QR scan
  const handleQRScanSuccess = async (decodedText) => {
    try {
      await markAttendance(decodedText);
      stopScanner();
    } catch (err) {
      console.error('QR Scan error:', err);
    }
  };

  // Stop scanner
  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.clear().then(() => {
        html5QrCodeRef.current = null;
        setScannerActive(false);
      }).catch(err => {
        console.error("Failed to clear scanner:", err);
        setScannerActive(false);
      });
    }
  };

  // Toggle scanner
  const toggleScanner = () => {
    if (scannerActive) {
      stopScanner();
    } else {
      setScannerActive(true);
      setTimeout(initializeScanner, 100);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const markAttendance = async (attendanceToken) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/attendance/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          attendance_token: attendanceToken,
          event_id: selectedEvent.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Kehadiran ${data.participant.User.nama} berhasil dicatat!`);
        // Refresh participants list
        fetchEventParticipants(selectedEvent.id);
      } else {
        toast.error(data.message || 'Gagal mencatat kehadiran');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Terjadi kesalahan saat mencatat kehadiran');
    }
  };

  const exportToExcel = () => {
    if (!selectedEvent || participants.length === 0) {
      toast.warning('Tidak ada data untuk diekspor');
      return;
    }

    const exportData = participants.map((participant, index) => ({
      'No': index + 1,
      'Nama': participant.User?.nama || '-',
      'Email': participant.User?.email || '-',
      'Status': participant.status === 'attended' ? 'Hadir' : 
                participant.status === 'confirmed' ? 'Terdaftar' : 'Dibatalkan',
      'Tanggal Daftar': new Date(participant.createdAt).toLocaleDateString('id-ID'),
      'Waktu Kehadiran': participant.attended_at ? 
        new Date(participant.attended_at).toLocaleString('id-ID') : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kehadiran');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, `Kehadiran_${selectedEvent.judul}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data berhasil diekspor ke Excel');
  };

  const exportToCSV = () => {
    if (!selectedEvent || participants.length === 0) {
      toast.warning('Tidak ada data untuk diekspor');
      return;
    }

    const csvData = participants.map((participant, index) => [
      index + 1,
      participant.User?.nama || '-',
      participant.User?.email || '-',
      participant.status === 'attended' ? 'Hadir' : 
      participant.status === 'confirmed' ? 'Terdaftar' : 'Dibatalkan',
      new Date(participant.createdAt).toLocaleDateString('id-ID'),
      participant.attended_at ? new Date(participant.attended_at).toLocaleString('id-ID') : '-'
    ]);

    const csvContent = [
      ['No', 'Nama', 'Email', 'Status', 'Tanggal Daftar', 'Waktu Kehadiran'],
      ...csvData
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Kehadiran_${selectedEvent.judul}_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Data berhasil diekspor ke CSV');
  };

  const getStatusBadge = (status) => {
    const badges = {
      attended: 'bg-green-100 text-green-800 border-green-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      attended: 'Hadir',
      confirmed: 'Terdaftar',
      cancelled: 'Dibatalkan'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <UserCheck className="w-8 h-8 text-blue-600" />
                Manajemen Kehadiran
              </h1>
              <p className="text-gray-600 mt-1">Kelola kehadiran peserta event Anda</p>
            </div>
            {selectedEvent && (
              <div className="flex gap-3">
                <button
                  onClick={toggleScanner}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    scannerActive 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {scannerActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                  {scannerActive ? 'Tutup Scanner' : 'Buka Scanner QR'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Event Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih Event</h2>
          {loading && !selectedEvent ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Memuat event...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventSelect(event)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedEvent?.id === event.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-2">{event.judul}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(event.tanggal).toLocaleDateString('id-ID')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.kapasitas_peserta} peserta
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Scanner */}
        {scannerActive && selectedEvent && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Scanner QR Kehadiran</h2>
              <button
                onClick={stopScanner}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="max-w-md mx-auto">
              <div 
                id="qr-scanner" 
                ref={scannerRef}
                className="border-2 border-dashed border-gray-300 rounded-lg"
              ></div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Arahkan kamera ke QR code peserta untuk mencatat kehadiran
              </p>
              <div className="text-center text-xs text-gray-500 mt-2">
                Event: <span className="font-medium">{selectedEvent.judul}</span>
              </div>
            </div>
          </div>
        )}

        {/* Participants Management */}
        {selectedEvent && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Peserta</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Hadir</p>
                    <p className="text-2xl font-bold text-green-600">{stats.attended}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Terdaftar</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Dibatalkan</p>
                    <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Filters and Export */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari nama atau email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="all">Semua Status</option>
                      <option value="attended">Hadir</option>
                      <option value="confirmed">Terdaftar</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                  <button
                    onClick={exportToExcel}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Excel
                  </button>
                </div>
              </div>
            </div>

            {/* Participants Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Daftar Peserta - {selectedEvent.judul}
                </h2>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Memuat peserta...</span>
                </div>
              ) : filteredParticipants.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada peserta</h3>
                  <p className="text-gray-600">
                    {participants.length === 0 
                      ? 'Belum ada peserta yang mendaftar untuk event ini'
                      : 'Tidak ada peserta yang sesuai dengan filter yang dipilih'
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
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
                          Waktu Kehadiran
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredParticipants.map((participant, index) => (
                        <tr key={participant.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {participant.User?.nama || '-'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {participant.User?.email || '-'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(participant.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(participant.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {participant.attended_at 
                              ? new Date(participant.attended_at).toLocaleString('id-ID')
                              : '-'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EOAttendance;
