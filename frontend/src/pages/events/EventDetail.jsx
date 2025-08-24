import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      const response = await eventsAPI.getById(id);
      setEvent(response.data);
      // Check if user is already registered (you might need to add this to backend response)
      setIsRegistered(response.data.isRegistered || false);
    } catch (error) {
      toast.error('Gagal memuat detail event');
      navigate('/events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    setIsRegistering(true);
    try {
      if (isRegistered) {
        await eventsAPI.unregister(id);
        toast.success('Berhasil membatalkan pendaftaran');
        setIsRegistered(false);
      } else {
        await eventsAPI.register(id);
        toast.success('Berhasil mendaftar event!');
        setIsRegistered(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memproses pendaftaran');
    } finally {
      setIsRegistering(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event tidak ditemukan</h2>
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Events</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Event Image */}
          {event.flyer && (
            <div className="h-64 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
              <img
                src={`http://localhost:3000${event.flyer}`}
                alt={event.nama_event}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Event Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.kategori === 'Competition' ? 'bg-red-100 text-red-800' :
                    event.kategori === 'Seminar' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.kategori}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {event.nama_event}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(event.tanggal)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{formatTime(event.waktu_mulai)} - {formatTime(event.waktu_selesai)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{event.lokasi}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>{event.jumlah_peserta || 0} / {event.kuota} peserta</span>
                  </div>
                </div>
              </div>

              {/* Registration Button */}
              <div className="lg:ml-8 mt-6 lg:mt-0">
                <button
                  onClick={handleRegister}
                  disabled={isRegistering || (event.jumlah_peserta >= event.kuota && !isRegistered)}
                  className={`w-full lg:w-auto px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    isRegistered
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : event.jumlah_peserta >= event.kuota
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isRegistering ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      {isRegistered ? (
                        <>
                          <UserMinus className="w-5 h-5" />
                          <span>Batal Daftar</span>
                        </>
                      ) : event.jumlah_peserta >= event.kuota ? (
                        <span>Kuota Penuh</span>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5" />
                          <span>Daftar Sekarang</span>
                        </>
                      )}
                    </>
                  )}
                </button>
                
                {isRegistered && (
                  <p className="text-sm text-green-600 mt-2 text-center lg:text-left">
                    ✓ Anda sudah terdaftar
                  </p>
                )}
              </div>
            </div>

            {/* Event Description */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Event</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="whitespace-pre-line">{event.deskripsi}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
