import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventStats, setEventStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    certificates: 0
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      console.log('Fetching my events...');
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        console.log('No authentication found, redirecting to login');
        toast.error('Silakan login terlebih dahulu');
        window.location.href = '/login';
        return;
      }
      
      const response = await userAPI.getMyEvents();
      console.log('My Events Response:', response);
      console.log('Response data:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setEvents(response.data);
        console.log('Events set:', response.data);
        
        // Calculate statistics
        const now = new Date();
        const stats = {
          total: response.data.length,
          upcoming: response.data.filter(event => new Date(event.tanggal) > now).length,
          completed: response.data.filter(event => new Date(event.tanggal) <= now).length,
          certificates: response.data.filter(event => event.certificate_issued).length || 0
        };
        setEventStats(stats);
      } else {
        console.log('No events data or not array');
        setEvents([]);
      }
    } catch (error) {
      console.error('My Events Error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 401) {
        console.log('Authentication failed, clearing storage and redirecting');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Sesi telah berakhir. Silakan login kembali');
        window.location.href = '/login';
      } else {
        toast.error('Gagal memuat riwayat event');
      }
      setEvents([]);
    } finally {
      setIsLoading(false);
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{eventStats.total}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Upcoming</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{eventStats.upcoming}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{eventStats.completed}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Events List */}
            {events.length === 0 ? (
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
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300 hover:scale-102">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-3 text-lg">{event.nama_event}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-3 text-indigo-500" />
                            <span>{formatDate(event.tanggal)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-3 text-indigo-500" />
                            <span>{formatTime(event.jam_mulai)} - {formatTime(event.jam_selesai)}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-3 text-indigo-500" />
                            <span>{event.lokasi}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-4 py-2 rounded-full text-xs font-semibold shadow-sm ${
                          new Date(event.tanggal) > new Date()
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                        }`}>
                          {new Date(event.tanggal) > new Date() ? 'Upcoming' : 'Completed'}
                        </span>
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
