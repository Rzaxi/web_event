import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Award, Eye, CheckCircle } from 'lucide-react';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // Filter events based on status
  const filteredEvents = events.filter(event => {
    if (statusFilter === 'all') return true;
    return event.status === statusFilter;
  });

  const fetchMyEvents = async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        toast.error('Silakan login terlebih dahulu');
        window.location.href = '/login';
        return;
      }

      const response = await userAPI.getMyEvents();

      if (response.data && Array.isArray(response.data)) {
        const eventsWithStatus = response.data.map(event => {
          const now = new Date();
          const eventDate = new Date(event.tanggal);
          
          // Calculate end date: use tanggal_selesai if available, otherwise calculate from durasi_hari
          let eventEndDate = new Date(eventDate);
          if (event.tanggal_selesai) {
            eventEndDate = new Date(event.tanggal_selesai);
          } else if (event.durasi_hari && event.durasi_hari > 1) {
            eventEndDate.setDate(eventEndDate.getDate() + event.durasi_hari - 1);
          } else {
            // Default to 3 days for events without explicit end date or duration
            eventEndDate.setDate(eventEndDate.getDate() + 2); // +2 means 3 days total (start + 2)
          }

          let status = 'upcoming';
          // Set time to start of day for proper comparison
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const eventStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          const eventEnd = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());

          if (todayStart > eventEnd) {
            status = 'completed';
          } else if (todayStart >= eventStart && todayStart < eventEnd) {
            status = 'ongoing';
          } else if (todayStart.getTime() === eventEnd.getTime()) {
            status = 'completed';
          }
          return { ...event, status };
        });

        setEvents(eventsWithStatus);

      } else {
        setEvents([]);
      }
    } catch (error) {

      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Sesi telah berakhir. Silakan login kembali');
        window.location.href = '/login';
      } else {
        toast.error('Gagal memuat riwayat event');
      }
      setEvents([]);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">My Events</h1>
              <p className="text-gray-600">Event yang telah Anda daftarkan</p>
            </div>


            {/* Header with Filter */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Riwayat Pelatihan</h2>
                <p className="text-sm text-gray-600">Ditemukan {filteredEvents.length} Pelatihan</p>
              </div>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada event</h3>
                <p className="text-gray-500 mb-6">Anda belum mendaftar event apapun</p>
                <Link
                  to="/events"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  Jelajahi Event
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Event Logo/Icon */}
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-8 h-8 text-blue-600" />
                        </div>

                        {/* Event Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                {event.nama_event}
                              </h3>
                              <p className="text-sm text-blue-600 mb-2">
                                Belajar Mandiri (Micro Skill)
                              </p>
                            </div>

                            {/* Status Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : event.status === 'ongoing'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                              {event.status === 'upcoming' ? 'Upcoming' :
                                event.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                            </span>
                          </div>

                          {/* Event Details */}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(event.tanggal)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(event.jam_mulai)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.lokasi}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {event.kategori || 'Pemrograman'}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              Self-Paced (Mandiri)
                            </span>
                            {event.memberikan_sertifikat && (
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                                Bersertifikat
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3">
                            <Link
                              to={`/events/${event.id}`}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Lihat Detail
                            </Link>

                            {event.memberikan_sertifikat && (
                              <Link
                                to={`/events/${event.id}/attendance`}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Kehadiran
                              </Link>
                            )}

                            {event.status === 'completed' && event.sertifikat_url && (
                              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                                <Award className="w-4 h-4" />
                                Download Sertifikat
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>

  );
};

export default MyEvents;
