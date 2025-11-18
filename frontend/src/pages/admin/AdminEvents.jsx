import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Tag,
  TrendingUp
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, statusFilter]);

  const fetchEvents = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/admin/events?search=${searchTerm}&status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setEvents(data.events || []);
      } else {
        setMockEvents();
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Set mock data for development
      setMockEvents();
    } finally {
      setLoading(false);
    }
  };

  const setMockEvents = () => {
    const mockEvents = [
      {
        id: 1,
        title: 'Workshop Web Development',
        description: 'Belajar membuat website modern dengan React',
        date: '2024-01-15',
        time: '09:00',
        location: 'Lab Komputer 1',
        maxParticipants: 30,
        registeredCount: 25,
        status: 'active',
        createdAt: '2024-01-12'
      },
      {
        id: 2,
        title: 'Seminar Digital Marketing',
        description: 'Strategi pemasaran digital untuk bisnis modern',
        date: '2024-01-20',
        time: '13:00',
        location: 'Aula Utama',
        maxParticipants: 100,
        registeredCount: 85,
        status: 'active',
        createdAt: '2024-01-17'
      },
      {
        id: 3,
        title: 'Training UI/UX Design',
        description: 'Desain antarmuka yang user-friendly',
        date: '2024-01-10',
        time: '10:00',
        location: 'Ruang Kreatif',
        maxParticipants: 20,
        registeredCount: 20,
        status: 'completed',
        createdAt: '2024-01-07'
      }
    ];
    setEvents(mockEvents);
  };

  const canCreateEvent = (eventDate) => {
    const today = new Date();
    const eventDateTime = new Date(eventDate);
    const diffTime = eventDateTime - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  };

  const isRegistrationOpen = (eventDate, eventTime) => {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate} ${eventTime}`);
    return now < eventDateTime;
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDateTime = new Date(`${event.date} ${event.time}`);

    if (now > eventDateTime) {
      return { status: 'completed', label: 'Selesai', color: 'bg-gray-100 text-gray-800' };
    } else {
      return { status: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' };
    }
  };

  const exportEventParticipants = async (eventId, eventTitle) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/admin/events/${eventId}/participants`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await response.json();

      if (data.success) {
        const participants = data.participants.map(p => ({
          'Nama': p.user.name,
          'Email': p.user.email,
          'Telepon': p.user.phone,
          'Sekolah': p.user.school,
          'Kelas': p.user.class,
          'Tanggal Daftar': new Date(p.registrationDate).toLocaleDateString('id-ID'),
          'Status Kehadiran': p.attendanceStatus
        }));

        const worksheet = XLSX.utils.json_to_sheet(participants);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `peserta-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.xlsx`);
      } else {
        alert('Gagal mengambil data peserta');
      }

    } catch (error) {
      console.error('Error exporting participants:', error);
      alert('Gagal mengekspor data peserta. Silakan coba lagi.');
    }
  };

  const deleteEvent = async (eventId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setEvents(events.filter(event => event.id !== eventId));
        alert('Event berhasil dihapus');
      } else {
        alert(data.message || 'Gagal menghapus event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Gagal menghapus event. Silakan coba lagi.');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;

    const eventStatus = getEventStatus(event);
    return matchesSearch && eventStatus.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kelola Event</h1>
                <p className="mt-2 text-gray-600">Buat dan kelola event sekolah</p>
              </div>
              <button
                onClick={() => navigate('/admin/events/create')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Buat Event Baru
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="grid gap-6">
          {filteredEvents.map(event => {
            const eventStatus = getEventStatus(event);
            const canCreate = canCreateEvent(event.date);

            return (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}>
                        {eventStatus.label}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{event.description}</p>

                    {/* Category and Difficulty Tags */}
                    <div className="flex items-center space-x-2 mb-3">
                      {event.kategori && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Tag className="h-3 w-3 mr-1" />
                          {event.kategori}
                        </span>
                      )}
                      {event.tingkat_kesulitan && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {event.tingkat_kesulitan}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{new Date(event.date).toLocaleDateString('id-ID')}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="mr-4">{event.time}</span>
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.registeredCount}/{event.maxParticipants}</span>
                    </div>

                    {!canCreate && eventStatus.status === 'active' && (
                      <div className="flex items-center text-amber-600 text-sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Event ini dibuat kurang dari H-3. Pastikan mengikuti aturan H-3 untuk event selanjutnya.
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => exportEventParticipants(event.id, event.title)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Export Peserta"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => navigate(`/admin/events/${event.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Pendaftaran</span>
                    <span>{event.registeredCount}/{event.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.registeredCount / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada event ditemukan</h3>
            <p className="text-gray-600">Coba ubah filter atau buat event baru</p>
          </div>
        )}

        {/* Important Rules */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Aturan Penting:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Admin hanya dapat membuat event maksimal H-3 dari tanggal pelaksanaan</li>
            <li>• Pendaftaran otomatis tertutup saat waktu event dimulai</li>
            <li>• Data peserta dapat diekspor dalam format Excel (.xlsx)</li>
            <li>• Event yang sudah dimulai tidak dapat diedit atau dihapus</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default AdminEvents;
