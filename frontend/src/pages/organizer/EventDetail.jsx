import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  UserCheck,
  Eye,
  DollarSign,
  BarChart3,
  Award,
  Tag,
  FileText,
  CalendarDays,
  Building2
} from 'lucide-react';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      // Fetch single event detail - we'll need to add this endpoint
      const response = await fetch(`/api/organizer/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setEvent(data.data);
      } else {
        toast.error('Event tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching event detail:', error);
      toast.error('Gagal memuat detail event');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (event) => {
    if (!event) return { text: 'Loading...', color: 'bg-gray-100 text-gray-600' };
    
    if (event.status_event === 'draft') {
      return { text: 'Draft', color: 'bg-gray-100 text-gray-700' };
    }
    
    if (event.status_event === 'cancelled') {
      return { text: 'Dibatalkan', color: 'bg-gray-200 text-gray-800' };
    }
    
    if (event.status_event === 'completed') {
      return { text: 'Selesai', color: 'bg-gray-800 text-white' };
    }
    
    const today = new Date();
    const eventDate = new Date(event.tanggal);
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return { text: 'Selesai', color: 'bg-gray-800 text-white' };
    } else if (eventDate.getTime() === today.getTime()) {
      return { text: 'Berlangsung', color: 'bg-gray-900 text-white' };
    } else {
      return { text: 'Akan Datang', color: 'bg-gray-700 text-white' };
    }
  };

  const handleBack = () => {
    navigate('/organizer/events');
  };

  const handleEdit = () => {
    navigate(`/organizer/events/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus event "${event.judul}"?`)) {
      try {
        await organizerApi.deleteEvent(id);
        toast.success('Event berhasil dihapus');
        navigate('/organizer/events');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Gagal menghapus event');
      }
    }
  };

  const handleAttendance = () => {
    navigate(`/organizer/attendance?event=${id}`);
  };

  const handleParticipants = () => {
    navigate(`/organizer/participants?event=${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      webinar: 'Webinar',
      bootcamp: 'Bootcamp',
      pelatihan: 'Pelatihan',
      konser: 'Konser',
      kompetisi: 'Kompetisi'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event tidak ditemukan</h2>
          <button 
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900"
          >
            Kembali ke Events
          </button>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(event);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Detail Event</h1>
                <p className="text-sm text-gray-500">Informasi lengkap event</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Title & Status */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{event.judul}</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                    {statusDisplay.text}
                  </span>
                </div>
              </div>
              {event.deskripsi && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Deskripsi</p>
                  <p className="text-gray-600 leading-relaxed">{event.deskripsi}</p>
                </div>
              )}
            </div>

            {/* Event Details Grid */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informasi Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tanggal Mulai */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Tanggal Mulai</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(event.tanggal)}</p>
                  </div>
                </div>

                {/* Tanggal Selesai */}
                {event.tanggal_selesai && (
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Tanggal Selesai</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(event.tanggal_selesai)}</p>
                    </div>
                  </div>
                )}

                {/* Waktu */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Waktu</p>
                    <p className="text-sm font-medium text-gray-900">
                      {event.waktu_mulai} - {event.waktu_selesai} WIB
                    </p>
                  </div>
                </div>

                {/* Durasi */}
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Durasi</p>
                    <p className="text-sm font-medium text-gray-900">
                      {event.durasi_hari} {event.durasi_hari > 1 ? 'hari' : 'hari'}
                    </p>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Lokasi</p>
                    <p className="text-sm font-medium text-gray-900">{event.lokasi}</p>
                  </div>
                </div>

                {/* Kategori */}
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Kategori</p>
                    <p className="text-sm font-medium text-gray-900">{getCategoryLabel(event.kategori)}</p>
                  </div>
                </div>

                {/* Biaya */}
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Biaya Tiket</p>
                    <p className="text-sm font-medium text-gray-900">
                      {event.biaya === 0 || event.biaya === '0.00' ? 'Gratis' : `Rp ${parseFloat(event.biaya).toLocaleString('id-ID')}`}
                    </p>
                  </div>
                </div>

                {/* Penyelenggara */}
                {event.penyelenggara && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Penyelenggara</p>
                      <p className="text-sm font-medium text-gray-900">{event.penyelenggara}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Certificate Info */}
            {event.memberikan_sertifikat && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-gray-700" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Sertifikat Tersedia</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Event ini memberikan sertifikat digital untuk peserta yang memenuhi kriteria kehadiran.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1">Minimum Kehadiran</p>
                        <p className="text-lg font-bold text-gray-900">{event.minimum_kehadiran} dari {event.durasi_hari} hari</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1">Status Template</p>
                        <p className="text-sm font-medium text-gray-900">
                          {event.sertifikat_template ? '✓ Sudah diatur' : '✗ Belum diatur'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Event Flyer */}
            {event.flyer_url && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Flyer Event</h3>
                <img 
                  src={`http://localhost:3000${event.flyer_url}`}
                  alt={event.judul}
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Statistik Pendaftaran</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Kapasitas</span>
                  <span className="text-sm font-semibold text-gray-900">{event.kapasitas_peserta} orang</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Terdaftar</span>
                  <span className="text-sm font-semibold text-gray-900">{event.registeredCount || 0} orang</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-600">Sisa Slot</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {event.kapasitas_peserta - (event.registeredCount || 0)} orang
                  </span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-gray-900 h-2.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(((event.registeredCount || 0) / event.kapasitas_peserta) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {Math.round(((event.registeredCount || 0) / event.kapasitas_peserta) * 100)}% terisi
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kelola Event</h3>
              <div className="space-y-2">
                <button
                  onClick={handleAttendance}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <UserCheck className="w-4 h-4" />
                  Kelola Kehadiran
                </button>
                <button
                  onClick={handleParticipants}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <Users className="w-4 h-4" />
                  Lihat Peserta
                </button>
                <button
                  onClick={() => navigate(`/organizer/analytics?event=${id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
                <button
                  onClick={() => window.open(`/events/${id}`, '_blank')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Lihat Publik
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
