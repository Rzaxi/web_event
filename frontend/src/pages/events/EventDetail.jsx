import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus, UserMinus, Star, Award, DollarSign, Zap, Share2, Heart, FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { isProfileComplete } from '../../utils/profileUtils';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      const response = await eventsAPI.getById(id);
      console.log('Event Detail Response:', response.data);
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

  const handleRegisterClick = () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    // Check if profile is complete before allowing registration
    if (!isRegistered && !isProfileComplete(user)) {
      toast.info('Lengkapi profil Anda terlebih dahulu untuk mendaftar event');
      // Store the current event URL for redirect after profile completion
      localStorage.setItem('profile_completion_redirect', `/events/${id}/confirm`);
      navigate('/profile-completion');
      return;
    }

    if (isRegistered) {
      handleRegister(); // Direct unregister
    } else {
      // Navigate to confirmation page instead of showing modal
      navigate(`/events/${id}/confirm`);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      if (isRegistered) {
        await eventsAPI.unregister(id);
        setIsRegistered(false);
        toast.success('Pendaftaran dibatalkan');
      } else {
        await eventsAPI.register(id);
        setIsRegistered(true);
        toast.success('Berhasil mendaftar event!');
        setShowConfirmModal(false);
      }
      fetchEventDetail(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with Gradient */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-red-500 bg-white/90 rounded-xl border border-gray-200/50 hover:border-red-200 transition-all duration-200">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-500 bg-white/90 rounded-xl border border-gray-200/50 hover:border-blue-200 transition-all duration-200">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Modern Design */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-teal-600/5"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Event Content */}
            <div className="lg:col-span-7">
              {/* Breadcrumb with Modern Style */}
              <nav className="flex mb-8" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <span className="text-sm font-medium text-gray-500 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm">Events</span>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-white/50">{event.judul}</span>
                    </div>
                  </li>
                </ol>
              </nav>

              {/* Enhanced Event Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25">
                  <Award className="w-4 h-4 mr-2" />
                  {event.kategori}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 text-gray-700 border border-gray-200/50 backdrop-blur-sm shadow-sm">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  {event.participantCount || 0} Terdaftar
                </span>
                {event.tingkat_kesulitan && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 text-gray-700 border border-gray-200/50 backdrop-blur-sm shadow-sm">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    {event.tingkat_kesulitan}
                  </span>
                )}
                {event.biaya !== undefined && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/90 text-gray-700 border border-gray-200/50 backdrop-blur-sm shadow-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                    {event.biaya > 0 ? `Rp ${event.biaya.toLocaleString('id-ID')}` : 'Gratis'}
                  </span>
                )}
              </div>

              {/* Enhanced Title & Description */}
              <div className="mb-12">
                <div className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
                    {event.judul}
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl blur opacity-75"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Zap className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Tentang Event Ini</h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{event.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Event Card */}
            <div className="lg:col-span-5 mt-10 lg:mt-0">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                {/* Event Image */}
                <div className="relative h-48">
                  {event.flyer_url ? (
                    <img
                      src={event.flyer_url}
                      alt={event.judul}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100 flex items-center justify-center ${event.flyer_url ? 'hidden' : 'flex'}`}>
                    <Calendar className="w-16 h-16 text-gray-400" />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Event Mendatang
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-6 space-y-4">
                  {/* Participant Count */}
                  <div className="text-center pb-4 border-b border-gray-100">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">{event.participantCount || 0}</div>
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Terdaftar</div>
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-2 animate-pulse shadow-lg"></div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Aktif</span>
                    </div>
                  </div>

                  {/* Quick Event Details */}
                  <div className="space-y-3">
                    {/* Date */}
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Tanggal</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {new Date(event.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Waktu</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {event.waktu_mulai ? formatTime(event.waktu_mulai) : '10:30'}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Lokasi</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 text-right max-w-[120px] truncate">
                        {event.lokasi}
                      </span>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-orange-600 mr-3" />
                        <span className="text-sm font-medium text-gray-700">Peserta</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {event.participantCount || 0} terdaftar
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Event Information Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">Informasi Event</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Detail lengkap tentang event ini</p>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Enhanced Event Details Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {/* Date Card */}
                <div className="group relative bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                  <div className="relative p-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Calendar className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div className="ml-6 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Tanggal</dt>
                          <dd className="text-xl font-bold text-gray-900">
                            {new Date(event.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Card */}
                <div className="group relative bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5"></div>
                  <div className="relative p-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Clock className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div className="ml-6 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Waktu</dt>
                          <dd className="text-xl font-bold text-gray-900">{event.waktu}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group relative bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5"></div>
                  <div className="relative p-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div className="ml-6 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Lokasi</dt>
                          <dd className="text-xl font-bold text-gray-900">{event.lokasi}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacity Card */}
                <div className="group relative bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                  <div className="relative p-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-7 w-7 text-white" />
                        </div>
                      </div>
                      <div className="ml-6 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Kapasitas</dt>
                          <dd className="text-xl font-bold text-gray-900 mb-4">
                            {event.participantCount || 0} / {event.kuota || event.kapasitas_peserta} peserta
                          </dd>
                          <div className="w-full bg-gray-200/60 rounded-full h-3 mb-3">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${(event.kuota || event.kapasitas_peserta) ? Math.min(((event.participantCount || 0) / (event.kuota || event.kapasitas_peserta)) * 100, 100) : 0}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="font-medium">{(event.kuota || event.kapasitas_peserta) ? Math.round(((event.participantCount || 0) / (event.kuota || event.kapasitas_peserta)) * 100) : 0}% Terisi</span>
                            <span className="font-medium">{((event.kuota || event.kapasitas_peserta) || 0) - (event.participantCount || 0)} slot tersisa</span>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Registration Sidebar */}
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur"></div>
                <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-6 shadow-lg">
                      <UserPlus className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Daftar Event</h3>
                    <p className="text-base text-gray-600 mb-8">
                      {isRegistered
                        ? "Anda sudah terdaftar untuk event ini"
                        : event.participantCount >= (event.kuota || event.kapasitas_peserta)
                          ? "Event ini sudah penuh"
                          : "Amankan tempat Anda sekarang"}
                    </p>

                    {/* Enhanced Registration Progress */}
                    {(event.kuota || event.kapasitas_peserta) && (
                      <div className="mb-8">
                        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl border border-gray-100/50">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Progress Pendaftaran</span>
                            <span className="text-lg font-black text-gray-900">{event.participantCount || 0}/{event.kuota || event.kapasitas_peserta}</span>
                          </div>
                          <div className="w-full bg-gray-200/80 rounded-full h-4 mb-4 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-700 shadow-lg"
                              style={{ width: `${Math.min(((event.participantCount || 0) / (event.kuota || event.kapasitas_peserta)) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="font-semibold">{Math.round(((event.participantCount || 0) / (event.kuota || event.kapasitas_peserta)) * 100)}% Terisi</span>
                            <span className="font-semibold">{((event.kuota || event.kapasitas_peserta) || 0) - (event.participantCount || 0)} slot tersisa</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleRegisterClick}
                      disabled={isRegistering || (event.participantCount >= (event.kuota || event.kapasitas_peserta) && !isRegistered)}
                      className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl shadow-lg text-base font-bold focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 ${isRegistered
                          ? 'text-red-700 bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 focus:ring-red-500 border-red-200'
                          : event.participantCount >= (event.kuota || event.kapasitas_peserta)
                            ? 'text-gray-500 bg-gray-200 cursor-not-allowed transform-none hover:scale-100'
                            : 'text-white bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 hover:from-blue-700 hover:via-purple-700 hover:to-teal-600 focus:ring-blue-500 shadow-blue-500/25'
                        }`}
                    >
                      {isRegistering ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                          Memproses...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {isRegistered ? (
                            <>
                              <UserMinus className="w-5 h-5 mr-3" />
                              Batalkan Pendaftaran
                            </>
                          ) : event.participantCount >= (event.kuota || event.kapasitas_peserta) ? (
                            'Event Penuh'
                          ) : (
                            <>
                              <UserPlus className="w-5 h-5 mr-3" />
                              Daftar Sekarang
                            </>
                          )}
                        </div>
                      )}
                    </button>

                    {isRegistered && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border border-green-200">
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm text-green-800 font-bold">Pendaftaran Dikonfirmasi</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full mx-4 border border-white/50">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur"></div>
            <div className="relative p-8">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 mb-4 shadow-lg">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Konfirmasi Pendaftaran
                </h3>
                <p className="text-gray-600 text-lg">
                  Yakin ingin mendaftar untuk event <span className="font-bold text-gray-900">{event.judul}</span>?
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100/80 hover:bg-gray-200 rounded-2xl font-semibold transition-all duration-200 border border-gray-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-200 disabled:opacity-50 shadow-lg shadow-blue-500/25"
                >
                  {isRegistering ? 'Mendaftar...' : 'Ya, Daftar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventDetail;
