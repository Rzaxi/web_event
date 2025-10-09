import React, { useState, useEffect } from 'react';
import { BarChart, Calendar, Settings, User, LogOut, Clock, Users, Award, TrendingUp, Activity, Bell, Filter, Play, CheckCircle, GraduationCap, X } from 'lucide-react';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'User', role: 'Guest' });
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    completedEvents: 0,
    certificates: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        window.location.href = '/login';
        return;
      }

      // Fetch user events
      const eventsResponse = await userAPI.getMyEvents();
      const events = eventsResponse.data || [];

      // Calculate statistics with proper event status logic
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const eventsWithStatus = events.map(event => {
        const eventDate = new Date(event.tanggal);
        let eventEndDate = new Date(eventDate);
        
        if (event.tanggal_selesai) {
          eventEndDate = new Date(event.tanggal_selesai);
        } else if (event.durasi_hari && event.durasi_hari > 1) {
          eventEndDate.setDate(eventEndDate.getDate() + event.durasi_hari - 1);
        } else {
          eventEndDate.setDate(eventEndDate.getDate() + 2);
        }
        
        const eventStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        const eventEnd = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
        
        let status = 'upcoming';
        if (todayStart > eventEnd) {
          status = 'completed';
        } else if (todayStart >= eventStart && todayStart < eventEnd) {
          status = 'ongoing';
        } else if (todayStart.getTime() === eventEnd.getTime()) {
          status = 'completed';
        }
        
        return { ...event, status };
      });
      
      const upcoming = eventsWithStatus.filter(event => event.status === 'upcoming').length;
      const ongoing = eventsWithStatus.filter(event => event.status === 'ongoing').length;
      const completed = eventsWithStatus.filter(event => event.status === 'completed').length;
      
      // Only count certificates for events that are actually completed and have certificate processing
      const certificatesEarned = eventsWithStatus.filter(event => 
        event.status === 'completed' && 
        event.memberikan_sertifikat && 
        event.certificate_processed // This would need to be added to track processed certificates
      ).length;
      
      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming,
        ongoingEvents: ongoing,
        completedEvents: completed,
        certificates: certificatesEarned
      });
      
      // Update recent events with status
      const recentEventsData = eventsWithStatus.slice(0, 10);
      setRecentEvents(recentEventsData);
      setFilteredEvents(recentEventsData);

      // Fetch user profile
      const profileResponse = await userAPI.getProfile();
      setUser(profileResponse.data);
      
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Sesi telah berakhir. Silakan login kembali');
        window.location.href = '/login';
      } else {
        console.error('Error fetching dashboard data:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <main>
            {/* Clean Header */}
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight">
                    {getGreeting()}, <span className="font-medium">{user.nama_lengkap || user.nama || 'User'}</span>
                  </h1>
                  <p className="text-lg text-gray-500 mt-2 font-light">Kelola aktivitas event Anda dengan mudah</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-gray-400 uppercase tracking-wider font-medium">Hari ini</p>
                  <p className="text-xl font-light text-gray-900 mt-1">
                    {currentTime.toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      day: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Cards - Reference Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Event</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.totalEvents} Event</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Sertifikat</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.certificates} Earned</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <Play className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-600 font-medium">Ongoing</p>
                    <p className="text-lg font-semibold text-gray-900">{stats.ongoingEvents} Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Aktivitas</h2>
              
                {recentEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Belum ada event terdaftar</p>
                    <p className="text-gray-400 text-sm mt-2">Mulai jelajahi event menarik untuk Anda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentEvents.map((event, index) => {
                      // Use same status calculation logic as MyEvents page
                      const now = new Date();
                      const eventDate = new Date(event.tanggal);
                      let eventEndDate = new Date(eventDate);
                      
                      if (event.tanggal_selesai) {
                        eventEndDate = new Date(event.tanggal_selesai);
                      } else if (event.durasi_hari && event.durasi_hari > 1) {
                        eventEndDate.setDate(eventEndDate.getDate() + event.durasi_hari - 1);
                      } else {
                        eventEndDate.setDate(eventEndDate.getDate() + 2);
                      }
                      
                      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const eventStart = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                      const eventEnd = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
                      
                      let actualStatus = 'upcoming';
                      if (todayStart > eventEnd) {
                        actualStatus = 'completed';
                      } else if (todayStart >= eventStart && todayStart < eventEnd) {
                        actualStatus = 'ongoing';
                      } else if (todayStart.getTime() === eventEnd.getTime()) {
                        actualStatus = 'completed';
                      }
                      
                      const getStatusBadge = (status) => {
                        switch(status) {
                          case 'upcoming': return 'bg-blue-100 text-blue-700 border border-blue-200';
                          case 'ongoing': return 'bg-green-100 text-green-700 border border-green-200';
                          case 'completed': return 'bg-gray-100 text-gray-700 border border-gray-200';
                          default: return 'bg-gray-100 text-gray-700 border border-gray-200';
                        }
                      };
                      
                      const getStatusText = (status) => {
                        switch(status) {
                          case 'upcoming': return 'Upcoming';
                          case 'ongoing': return 'Ongoing';
                          case 'completed': return 'Completed';
                          default: return 'Unknown';
                        }
                      };
                      
                      return (
                        <div key={event.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                                <Calendar className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{event.nama_event}</h3>
                                <p className="text-sm text-gray-600 mb-2">{event.deskripsi || 'Belajar Mandiri (Micro Skill)'}</p>
                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {formatDate(event.tanggal)}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {event.lokasi}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(actualStatus)}`}>
                                {getStatusText(actualStatus)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
