import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, Mail, GraduationCap, User, AlertCircle, CheckCircle } from 'lucide-react';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import { isProfileComplete, getProfileCompletionPercentage } from '../../utils/profileUtils';
import { displayName, displayPhone, displayAddress, displayEducation } from '../../utils/displayUtils';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [eventStats, setEventStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchMyEvents();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        toast.error('Silakan login terlebih dahulu');
        window.location.href = '/login';
        return;
      }
      
      // Fetch user profile
      const profileResponse = await userAPI.getProfile();
      setProfile(profileResponse.data);
      
      // Check profile completion status
      const isComplete = isProfileComplete(profileResponse.data);
      setProfileCompleted(isComplete);
      setCompletionPercentage(getProfileCompletionPercentage(profileResponse.data));
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Sesi telah berakhir. Silakan login kembali');
        window.location.href = '/login';
      } else {
        toast.error('Gagal memuat profil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        toast.error('Silakan login terlebih dahulu');
        window.location.href = '/login';
        return;
      }

      const response = await userAPI.getMyEvents();
      const events = response.data || [];
      setRecentActivity(events);

      // Calculate event statistics
      const now = new Date();
      const stats = {
        total: events.length,
        upcoming: events.filter(event => new Date(event.tanggal) > now).length,
        completed: events.filter(event => new Date(event.tanggal) <= now).length
      };
      setEventStats(stats);

      // Set recent activity (last 5 events)
      const sortedEvents = events.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      setRecentActivity(sortedEvents.slice(0, 5));

      console.log('Profile - Events loaded:', {
        totalEvents: events.length,
        eventsList: events,
        stats: stats
      });

    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Sesi telah berakhir. Silakan login kembali');
        window.location.href = '/login';
      } else {
        console.error('Gagal memuat event saya:', error);
        toast.error('Gagal memuat data event');
      }
    } finally {
      setEventsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString?.slice(0, 5) || '';
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await userAPI.updateProfile(profile);
      toast.success('Profil berhasil diperbarui');
      setIsEditing(false);
    } catch (error) {
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset to original data
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
                  <p className="text-gray-600">Kelola profil dan lihat aktivitas event Anda</p>
                </div>
                {!profileCompleted && (
                  <div className="text-right">
                    <div className="flex items-center text-amber-600 mb-2">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Profil {completionPercentage}% lengkap</span>
                    </div>
                    <button
                      onClick={() => navigate('/profile-completion')}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
                    >
                      Lengkapi Profil
                    </button>
                  </div>
                )}
              </div>
              
              {/* Profile Completion Banner */}
              {!profileCompleted && (
                <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-amber-800 mb-1">
                        Lengkapi Profil Anda
                      </h3>
                      <p className="text-sm text-amber-700 mb-3">
                        Profil yang lengkap membantu kami memberikan pengalaman yang lebih baik dan diperlukan untuk mendaftar event.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="w-full bg-amber-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${completionPercentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-amber-600 mt-1">{completionPercentage}% selesai</p>
                        </div>
                        <button
                          onClick={() => navigate('/profile-completion')}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium flex items-center"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Lengkapi Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Profile Complete Badge */}
              {profileCompleted && (
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Profil Lengkap
                </div>
              )}
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

            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Informasi Pribadi</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Nama Lengkap</label>
                    <p className="font-medium text-gray-900">{displayName(profile)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-gray-900">{profile.email || 'Belum diisi'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">No. Handphone</label>
                    <p className="font-medium text-gray-900">{displayPhone(profile)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Pendidikan Terakhir</label>
                    <p className="font-medium text-gray-900">{displayEducation(profile)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Alamat</label>
                  <p className="font-medium text-gray-900">{displayAddress(profile)}</p>
                </div>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Event Terbaru</h2>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada aktivitas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{event.nama_event}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.tanggal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>

  );
};

export default Profile;
