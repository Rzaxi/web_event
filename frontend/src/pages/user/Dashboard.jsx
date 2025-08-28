import React, { useState, useEffect } from 'react';
import { BarChart, Calendar, Settings, User, LogOut, Clock, Users, Award, TrendingUp, Activity, Bell } from 'lucide-react';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || { name: 'User', role: 'Guest' });
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    certificates: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
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
      setRecentEvents(events.slice(0, 5)); // Get latest 5 events

      // Calculate statistics
      const now = new Date();
      const upcoming = events.filter(event => new Date(event.tanggal) > now).length;
      const completed = events.filter(event => new Date(event.tanggal) <= now).length;
      
      setStats({
        totalEvents: events.length,
        upcomingEvents: upcoming,
        completedEvents: completed,
        certificates: completed // Assuming completed events give certificates
      });

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
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <main>
            {/* Dynamic Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {getGreeting()}, {user.nama_lengkap || user.nama || 'User'}!
                  </h1>
                  <p className="text-gray-600 mt-2">Kelola aktivitas event Anda dengan mudah</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Hari ini</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {currentTime.toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Events</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {stats.totalEvents}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Event terdaftar
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                    <BarChart className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Upcoming</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {stats.upcomingEvents}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Event mendatang
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {stats.completedEvents}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      <Award className="w-3 h-3 inline mr-1" />
                      Event selesai
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Certificates</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {stats.certificates}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      <Award className="w-3 h-3 inline mr-1" />
                      Sertifikat earned
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Event Terbaru
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Activity className="w-4 h-4 mr-2" />
                  Live updates
                </div>
              </div>
              
              {recentEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Belum ada event terdaftar</p>
                  <p className="text-gray-400 text-sm mt-2">Mulai jelajahi event menarik untuk Anda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentEvents.map((event, index) => {
                    const isUpcoming = new Date(event.tanggal) > new Date();
                    return (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-lg mr-4 ${
                            isUpcoming 
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100' 
                              : 'bg-gradient-to-r from-gray-100 to-slate-100'
                          }`}>
                            <Calendar className={`h-5 w-5 ${
                              isUpcoming ? 'text-green-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{event.nama_event}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(event.tanggal)} • {event.lokasi}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            isUpcoming 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                              : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                          }`}>
                            {isUpcoming ? 'Upcoming' : 'Completed'}
                          </span>
                          {index === 0 && (
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 ml-1">New</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
