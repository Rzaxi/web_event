import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, FileSpreadsheet, Edit, Trash2, Tag, TrendingUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EventDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/admin/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEvent(data.event);
      } else {
        alert('Event tidak ditemukan');
        navigate('/admin/events');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      alert('Gagal memuat data event');
      navigate('/admin/events');
    } finally {
      setLoading(false);
    }
  };

  const exportEventParticipants = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/admin/events/${id}/participants`, {
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
          'Alamat': p.user.school,
          'Pendidikan': p.user.class,
          'Tanggal Daftar': new Date(p.registrationDate).toLocaleDateString('id-ID'),
          'Status Kehadiran': p.attendanceStatus
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(participants);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
        
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `peserta-${event.title.replace(/\s+/g, '-').toLowerCase()}.xlsx`);
      } else {
        alert('Gagal mengambil data peserta');
      }
      
    } catch (error) {
      console.error('Error exporting participants:', error);
      alert('Gagal mengekspor data peserta. Silakan coba lagi.');
    }
  };

  const deleteEvent = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/admin/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Event berhasil dihapus');
        navigate('/admin/events');
      } else {
        alert(data.message || 'Gagal menghapus event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Gagal menghapus event. Silakan coba lagi.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = () => {
    if (!event) return { status: 'unknown', label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    
    const now = new Date();
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    
    if (now >= eventDateTime) {
      return { status: 'completed', label: 'Selesai', color: 'bg-gray-100 text-gray-800' };
    } else {
      return { status: 'active', label: 'Aktif', color: 'bg-green-100 text-green-800' };
    }
  };

  const getKategoriLabel = (kategori) => {
    const kategoriMap = {
      'akademik': 'Akademik',
      'olahraga': 'Olahraga',
      'seni_budaya': 'Seni & Budaya',
      'teknologi': 'Teknologi',
      'kewirausahaan': 'Kewirausahaan',
      'sosial': 'Sosial',
      'kompetisi': 'Kompetisi',
      'workshop': 'Workshop',
      'seminar': 'Seminar',
      'lainnya': 'Lainnya'
    };
    return kategoriMap[kategori] || kategori;
  };

  const getTingkatKesulitanLabel = (tingkat) => {
    const tingkatMap = {
      'pemula': 'Pemula',
      'menengah': 'Menengah',
      'lanjutan': 'Lanjutan'
    };
    return tingkatMap[tingkat] || tingkat;
  };

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

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Event tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const status = getEventStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/admin/events')}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-sm text-gray-600">ID: {event.id}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportEventParticipants}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Peserta
                </button>
                
                <button
                  onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </button>
                
                <button
                  onClick={deleteEvent}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flyer */}
            {event.flyer && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Flyer Event</h2>
                <img
                  src={`http://localhost:3000${event.flyer}`}
                  alt="Event Flyer"
                  className="w-full max-w-md rounded-lg shadow-md mx-auto"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail Event</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Tanggal & Waktu</p>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                    <p className="text-gray-600">{formatTime(event.time)} WIB</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Lokasi</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Kategori</p>
                    <p className="text-gray-600">{getKategoriLabel(event.kategori)}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Tingkat Kesulitan</p>
                    <p className="text-gray-600">{getTingkatKesulitanLabel(event.tingkat_kesulitan)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <Users className="h-5 w-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Peserta</h2>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {event.registeredCount}/{event.maxParticipants}
                </div>
                <p className="text-sm text-gray-600 mb-4">peserta terdaftar</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((event.registeredCount / event.maxParticipants) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-500">
                  {Math.round((event.registeredCount / event.maxParticipants) * 100)}% kapasitas terisi
                </p>
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Tambahan</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dibuat:</span>
                  <span className="text-gray-900">
                    {new Date(event.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Terakhir diupdate:</span>
                  <span className="text-gray-900">
                    {new Date(event.updatedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
