import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
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
      localStorage.setItem('profile_completion_redirect', `/events/${id}`);
      navigate('/profile-completion');
      return;
    }

    if (isRegistered) {
      handleRegister(); // Direct unregister
    } else {
      setShowConfirmModal(true); // Show confirmation for registration
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
    <div className="min-h-screen bg-white">
      {/* Clean Professional Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </button>
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              <div className="hidden md:flex items-center">
                <span className="text-sm font-medium text-gray-600">Event Details</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Active Event
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Clean Hero Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* Event Content */}
            <div className="lg:col-span-7">
              {/* Simple Breadcrumb */}
              <nav className="flex mb-8" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <span className="text-sm font-medium text-gray-500">Events</span>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-4 text-sm font-medium text-gray-900">{event.nama_event}</span>
                    </div>
                  </li>
                </ol>
              </nav>

              {/* Clean Event Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                  {event.kategori}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  <Users className="w-4 h-4 mr-2" />
                  {event.participantCount || 0} Registered
                </span>
              </div>

              {/* Enhanced Title & Description */}
              <div className="mb-12">
                <div className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4 leading-tight">
                    {event.nama_event}
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl blur opacity-25"></div>
                  <div className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
                        <p className="text-gray-700 leading-relaxed text-base">{event.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Event Image & Stats */}
            <div className="lg:col-span-5 mt-10 lg:mt-0">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-teal-400 rounded-2xl blur-2xl opacity-20"></div>
                
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-12 lg:aspect-w-4 lg:aspect-h-5">
                    {event.flyer ? (
                      <img
                        src={`http://localhost:3000${event.flyer}`}
                        alt={event.nama_event}
                        className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-white"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white">
                        <Calendar className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Floating stats card */}
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                    <div className="text-center">
                      <div className="text-3xl font-black text-gray-900 mb-1">{event.participantCount || 0}</div>
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Registered</div>
                      <div className="mt-3 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs font-medium text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Event Information */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Information</h2>
            <p className="text-lg text-gray-600">Key details about this event</p>
          </div>
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Clean Event Details Cards */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Date Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Date</dt>
                          <dd className="text-lg font-semibold text-gray-900">
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
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-teal-600" />
                        </div>
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Time</dt>
                          <dd className="text-lg font-semibold text-gray-900">{event.waktu}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
                          <dd className="text-lg font-semibold text-gray-900">{event.lokasi}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capacity Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Capacity</dt>
                          <dd className="text-lg font-semibold text-gray-900 mb-3">
                            {event.participantCount || 0} / {event.kuota} participants
                          </dd>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${event.kuota ? Math.min(((event.participantCount || 0) / event.kuota) * 100, 100) : 0}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>{event.kuota ? Math.round(((event.participantCount || 0) / event.kuota) * 100) : 0}% Full</span>
                            <span>{(event.kuota || 0) - (event.participantCount || 0)} spots left</span>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Registration Sidebar */}
            <div className="mt-12 lg:mt-0">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Register for Event</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {isRegistered
                      ? "You are registered for this event"
                      : event.participantCount >= event.kuota
                        ? "This event is fully booked"
                        : "Secure your spot now"}
                  </p>
                  
                  {/* Registration Progress */}
                  {event.kuota && (
                    <div className="mb-6">
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-gray-700">Registration Progress</span>
                          <span className="text-sm font-bold text-gray-900">{event.participantCount || 0}/{event.kuota}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(((event.participantCount || 0) / event.kuota) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>{Math.round(((event.participantCount || 0) / event.kuota) * 100)}% Full</span>
                          <span>{event.kuota - (event.participantCount || 0)} spots left</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleRegisterClick}
                    disabled={isRegistering || (event.participantCount >= event.kuota && !isRegistered)}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      isRegistered
                        ? 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500'
                        : event.participantCount >= event.kuota
                          ? 'text-gray-500 bg-gray-200 cursor-not-allowed'
                          : 'text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 focus:ring-blue-500'
                    }`}
                  >
                    {isRegistering ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {isRegistered ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Cancel Registration
                          </>
                        ) : event.participantCount >= event.kuota ? (
                          'Event Full'
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Register Now
                          </>
                        )}
                      </div>
                    )}
                  </button>

                  {isRegistered && (
                    <div className="mt-4 p-3 bg-green-100 rounded-md">
                      <div className="flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-green-800 font-medium">Registration confirmed</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Konfirmasi Pendaftaran
              </h3>
              <p className="text-gray-600 mb-6">
                Yakin ingin mendaftar untuk event <span className="font-medium">{event.nama_event}</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
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
