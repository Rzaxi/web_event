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
      // Explicitly check registration status from the backend response
      if (response.data.isRegistered) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
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
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-red-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Event Content */}
            <div className="lg:col-span-7">
              {/* Breadcrumb */}
              <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <span className="text-sm text-gray-500">Events</span>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{event.judul}</span>
                    </div>
                  </li>
                </ol>
              </nav>

              {/* Event Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-800">
                  <Award className="w-4 h-4 mr-1" />
                  {event.kategori}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                  <Users className="w-4 h-4 mr-1" />
                  {event.participantCount || 0} Terdaftar
                </span>
                {event.tingkat_kesulitan && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Star className="w-4 h-4 mr-1" />
                    {event.tingkat_kesulitan}
                  </span>
                )}
                {event.biaya !== undefined && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {event.biaya > 0 ? `Rp ${event.biaya.toLocaleString('id-ID')}` : 'Gratis'}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  {event.judul}
                </h1>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tentang Event Ini</h3>
                  <p className="text-gray-600 leading-relaxed">{event.deskripsi}</p>
                </div>
              </div>
            </div>

            {/* Event Card */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Event Image */}
                <div className="relative h-40">
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
                  <div className={`w-full h-full bg-gray-100 flex items-center justify-center ${event.flyer_url ? 'hidden' : 'flex'}`}>
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-4 space-y-3">
                  {/* Participant Count */}
                  <div className="text-center pb-3 border-b border-gray-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{event.participantCount || 0}</div>
                    <div className="text-sm text-gray-600">Peserta Terdaftar</div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2">
                    {/* Date */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Tanggal</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(event.tanggal)}
                        </div>
                        {event.tanggal_selesai && event.tanggal_selesai !== event.tanggal && (
                          <div className="text-xs text-gray-500">
                            s/d {formatDate(event.tanggal_selesai)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Waktu</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {event.waktu_mulai ? formatTime(event.waktu_mulai) : '10:30'}
                        </div>
                        {event.waktu_selesai && (
                          <div className="text-xs text-gray-500">
                            s/d {formatTime(event.waktu_selesai)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Lokasi</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 text-right max-w-[150px] truncate">
                        {event.lokasi}
                      </span>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Kapasitas</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {event.participantCount || 0}/{event.kuota || event.kapasitas_peserta}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Information Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Informasi Event</h2>
            <p className="text-gray-600">Detail lengkap tentang event ini</p>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Event Details Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Date Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <dt className="text-sm font-medium text-gray-500">Tanggal Event</dt>
                        <dd className="text-base font-semibold text-gray-900">
                          {formatDate(event.tanggal)}
                        </dd>
                        {event.tanggal_selesai && event.tanggal_selesai !== event.tanggal && (
                          <dd className="text-sm text-gray-600">
                            s/d {formatDate(event.tanggal_selesai)}
                          </dd>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <dt className="text-sm font-medium text-gray-500">Waktu Event</dt>
                        <dd className="text-base font-semibold text-gray-900">
                          {event.waktu_mulai ? formatTime(event.waktu_mulai) : (event.waktu || '10:30')}
                        </dd>
                        {event.waktu_selesai && (
                          <dd className="text-sm text-gray-600">
                            s/d {formatTime(event.waktu_selesai)}
                          </dd>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <dt className="text-sm font-medium text-gray-500">Lokasi</dt>
                        <dd className="text-base font-semibold text-gray-900">{event.lokasi}</dd>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organizer Card */}
                {event.penyelenggara && (
                  <div className="group relative bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5"></div>
                    <div className="relative p-8">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Shield className="h-7 w-7 text-white" />
                          </div>
                        </div>
                        <div className="ml-6 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Penyelenggara</dt>
                            <dd className="text-xl font-bold text-gray-900">{event.penyelenggara}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Capacity Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <dt className="text-sm font-medium text-gray-500">Kapasitas</dt>
                        <dd className="text-base font-semibold text-gray-900">
                          {event.participantCount || 0} / {event.kuota || event.kapasitas_peserta} peserta
                        </dd>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(event.kuota || event.kapasitas_peserta) ? Math.min(((event.participantCount || 0) / (event.kuota || event.kapasitas_peserta)) * 100, 100) : 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{(event.kuota || event.kapasitas_peserta) ? Math.round(((event.participantCount || 0) / (event.kuota || event.kapasitas_peserta)) * 100) : 0}% Terisi</span>
                      <span>{((event.kuota || event.kapasitas_peserta) || 0) - (event.participantCount || 0)} slot tersisa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unified Registration Card */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-1 shadow-xl">
                <div className="bg-white rounded-xl p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-3 shadow-lg">
                      <UserPlus className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Join Event</h3>
                    <p className="text-sm text-slate-600">
                      {isRegistered
                        ? "✅ Sudah terdaftar!"
                        : event.participantCount >= (event.kuota || event.kapasitas_peserta)
                          ? "⚠️ Event penuh"
                          : "🚀 Daftar sekarang!"}
                    </p>
                  </div>

                  {/* Event Highlights - Integrated Benefits */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {/* Certificate */}
                      {event.memberikan_sertifikat && (
                        <div className="flex items-center p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                          <Award className="w-4 h-4 text-emerald-600 mr-2" />
                          <span className="text-xs font-medium text-emerald-800">Sertifikat</span>
                        </div>
                      )}
                      
                      {/* Multi-day */}
                      {event.durasi_hari && event.durasi_hari > 1 && (
                        <div className="flex items-center p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-xs font-medium text-blue-800">{event.durasi_hari} Hari</span>
                        </div>
                      )}
                      
                      {/* Level */}
                      {event.tingkat_kesulitan && (
                        <div className="flex items-center p-2 bg-amber-50 rounded-lg border border-amber-100">
                          <Star className="w-4 h-4 text-amber-600 mr-2" />
                          <span className="text-xs font-medium text-amber-800">{event.tingkat_kesulitan}</span>
                        </div>
                      )}
                      
                      {/* Cost */}
                      <div className="flex items-center p-2 bg-green-50 rounded-lg border border-green-100">
                        <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-xs font-medium text-green-800">
                          {event.biaya && event.biaya > 0 ? 'Berbayar' : 'Gratis'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xl font-bold text-indigo-600">{event.participantCount || 0}</div>
                        <div className="text-xs text-slate-600">Terdaftar</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">{event.kuota || event.kapasitas_peserta}</div>
                        <div className="text-xs text-slate-600">Kapasitas</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-emerald-600">{((event.kuota || event.kapasitas_peserta) || 0) - (event.participantCount || 0)}</div>
                        <div className="text-xs text-slate-600">Tersisa</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${Math.min(((event.participantCount || 0) / (event.kuota || event.kapasitas_peserta)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-xs font-semibold text-slate-700">
                          {Math.round(((event.participantCount || 0) / (event.kuota || event.kapasitas_peserta)) * 100)}% Terisi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleRegisterClick}
                    disabled={isRegistering || (event.participantCount >= (event.kuota || event.kapasitas_peserta) && !isRegistered)}
                    className={`w-full rounded-xl py-4 px-6 text-base font-bold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 shadow-lg ${isRegistered
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500'
                        : event.participantCount >= (event.kuota || event.kapasitas_peserta)
                          ? 'bg-slate-300 text-slate-500 cursor-not-allowed transform-none hover:scale-100'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-500'
                      }`}
                  >
                    {isRegistering ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {isRegistered ? (
                          <>
                            <UserMinus className="w-5 h-5 mr-3" />
                            Cancel Registration
                          </>
                        ) : event.participantCount >= (event.kuota || event.kapasitas_peserta) ? (
                          <>🔒 Event Full</>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5 mr-3" />
                            Register Now
                          </>
                        )}
                      </div>
                    )}
                  </button>

                  {/* Success Message */}
                  {isRegistered && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-800">Registration Confirmed!</p>
                          <p className="text-xs text-emerald-600">Check your email for details</p>
                        </div>
                      </div>
                    </div>
                  )}
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
