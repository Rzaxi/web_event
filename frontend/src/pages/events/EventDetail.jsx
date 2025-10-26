import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus, UserMinus, Star, Award, DollarSign, Zap, Share2, Heart, FileText, Shield, AlertTriangle, CheckCircle, Bookmark } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { isProfileComplete } from '../../utils/profileUtils';
import LazyWrapper from '../../components/ui/LazyWrapper';
import { EventDetailSkeleton } from '../../components/ui/SkeletonLoader';
import ProfileCompletionPopup from '../../components/common/ProfileCompletionPopup';
import EventCard from '../../components/event/EventCard';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showCancelModal || showConfirmModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [showCancelModal, showConfirmModal]);

  const fetchEventDetail = async () => {
    try {
      const response = await eventsAPI.getById(id);
      // Set registration status from response
      setIsRegistered(response.data.isRegistered || false);
      
      // Check bookmark status if user is logged in AND has valid token
      const token = localStorage.getItem('token');
      if (user && token) {
        await checkBookmarkStatus();
      }
      
      // Fetch related events
      await fetchRelatedEvents(response.data.kategori);
      
      return response.data;
    } catch (error) {
      toast.error('Gagal memuat detail event');
      navigate('/events');
      throw error;
    }
  };

  const fetchRelatedEvents = async (kategori) => {
    try {
      setLoadingRelated(true);
      console.log('Fetching related events for category:', kategori);
      
      // Get all events first
      const response = await eventsAPI.getAll();
      console.log('All events response:', response.data);
      
      let allEvents = [];
      
      // Handle backend response structure: response.data.data.events
      if (response.data.success && response.data.data && response.data.data.events) {
        allEvents = response.data.data.events;
      } else if (response.data.events) {
        allEvents = response.data.events;
      } else if (Array.isArray(response.data)) {
        allEvents = response.data;
      } else {
        console.log('Unexpected response structure:', response.data);
        setRelatedEvents([]);
        return;
      }
      
      console.log('All events:', allEvents);
      console.log('Current event ID:', id);
      console.log('Looking for category:', kategori);
      
      // Filter by category and exclude current event
      let filtered = allEvents.filter(event => {
        const isSameCategory = event.kategori === kategori;
        const isDifferentEvent = event.id !== parseInt(id);
        console.log(`Event ${event.id}: category=${event.kategori}, same=${isSameCategory}, different=${isDifferentEvent}`);
        return isSameCategory && isDifferentEvent;
      });
      
      console.log('Filtered events by category:', filtered);
      
      // If no events in same category, show other recent events (excluding current)
      if (filtered.length === 0) {
        filtered = allEvents.filter(event => event.id !== parseInt(id));
        console.log('No events in same category, showing other events:', filtered);
      }
      
      // Take only first 6 events
      const limitedEvents = filtered.slice(0, 6);
      setRelatedEvents(limitedEvents);
      
      console.log('Final related events to display:', limitedEvents);
      
    } catch (error) {
      console.error('Error fetching related events:', error);
      setRelatedEvents([]);
    } finally {
      setLoadingRelated(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Skip if no token (user not logged in)
      if (!token) {
        setIsBookmarked(false);
        return;
      }
      
      const response = await fetch(`/api/bookmarks/${id}/check`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
      } else if (response.status === 401) {
        // Token invalid/expired, clear it
        localStorage.removeItem('token');
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error('Check bookmark error:', error);
      setIsBookmarked(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/bookmarks/${id}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.bookmarked);
        toast.success(data.message);
      } else {
        toast.error('Gagal mengubah bookmark');
      }
    } catch (error) {
      console.error('Toggle bookmark error:', error);
      toast.error('Terjadi kesalahan');
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
      // Show profile completion popup instead of navigating
      setShowProfilePopup(true);
      return;
    }

    // Navigate to confirmation page (not for cancel anymore)
    navigate(`/events/${id}/confirm`);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setIsRegistering(true);
    try {
      await eventsAPI.unregister(id);
      setIsRegistered(false);
      setShowCancelModal(false);
      toast.success('Pendaftaran berhasil dibatalkan');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membatalkan pendaftaran');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleProfilePopupClose = () => {
    setShowProfilePopup(false);
    // Clear redirect URL if user closes without completing
    localStorage.removeItem('profile_completion_redirect');
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


  return (
    <>
      <LazyWrapper
        fetchFunction={fetchEventDetail}
        SkeletonComponent={EventDetailSkeleton}
        dependencies={[id]}
        delay={800}
      >
        {(event) => (
          <EventDetailContent 
            event={event}
            isRegistering={isRegistering}
            isRegistered={isRegistered}
            isBookmarked={isBookmarked}
            handleToggleBookmark={handleToggleBookmark}
            showConfirmModal={showConfirmModal}
            showCancelModal={showCancelModal}
            setShowConfirmModal={setShowConfirmModal}
            setShowCancelModal={setShowCancelModal}
            handleRegisterClick={handleRegisterClick}
            handleCancelClick={handleCancelClick}
            handleConfirmCancel={handleConfirmCancel}
            handleRegister={handleRegister}
            navigate={navigate}
            formatDate={formatDate}
            formatTime={formatTime}
            relatedEvents={relatedEvents}
            loadingRelated={loadingRelated}
          />
        )}
      </LazyWrapper>

      {/* Profile Completion Popup */}
      <ProfileCompletionPopup 
        isOpen={showProfilePopup} 
        onClose={handleProfilePopupClose}
      />
    </>
  );
};

const EventDetailContent = ({ 
  event, 
  isRegistering, 
  isRegistered,
  isBookmarked,
  handleToggleBookmark,
  showConfirmModal,
  showCancelModal,
  setShowConfirmModal,
  setShowCancelModal,
  handleRegisterClick,
  handleCancelClick,
  handleConfirmCancel,
  handleRegister, 
  navigate, 
  formatDate, 
  formatTime,
  relatedEvents,
  loadingRelated
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <div className="pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/events')}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Events</span>
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-gray-500 text-sm">
              <span>Events</span>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate max-w-[200px]">{event.judul}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Container */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative">
              {/* Background Image */}
              <div className="h-[520px] relative">
                {event.flyer_url ? (
                  <>
                    <img
                      src={event.flyer_url}
                      alt={event.judul}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
                )}
              </div>

              {/* Action Buttons - Top Right */}
              <div className="absolute top-4 right-4 z-20">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleToggleBookmark}
                    className={`p-3 backdrop-blur-sm rounded-full transition-all duration-300 border ${
                      isBookmarked 
                        ? 'bg-blue-500/90 text-white border-blue-500 hover:bg-blue-600' 
                        : 'bg-black/30 text-white border-white/20 hover:bg-black/50'
                    }`}
                    title={isBookmarked ? 'Hapus dari bookmark' : 'Tambah ke bookmark'}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-all duration-300 border border-white/20">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full px-8 py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 text-white">
                      {/* Title */}
                      <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                        {event.judul}
                      </h1>

                      {/* Location */}
                      <p className="text-xl text-white/90 leading-relaxed">
                        {event.lokasi}
                      </p>
                    </div>

                    {/* Right Content - Date & Time Card */}
                    <div className="lg:justify-self-end">
                      <div className="bg-white rounded-2xl p-6 shadow-xl w-72 max-w-sm">
                        <div className="mb-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Date & Time</h3>
                          <p className="text-gray-600 text-sm">
                            {formatDate(event.tanggal)} at {event.waktu_mulai ? formatTime(event.waktu_mulai) : '09:00'}
                          </p>
                        </div>

                        <div className="mb-6">
                          <button className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium">
                            <Calendar className="w-4 h-4 mr-2" />
                            Add to Calendar
                          </button>
                        </div>

                        <button
                          onClick={handleRegisterClick}
                          disabled={isRegistering || isRegistered || (event.participantCount >= (event.kuota || event.kapasitas_peserta) && !isRegistered)}
                          className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 mb-3 flex items-center justify-center ${isRegistered
                              ? 'bg-green-600 text-white cursor-not-allowed'
                              : event.participantCount >= (event.kuota || event.kapasitas_peserta)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                        >
                          {isRegistering ? 'Mendaftar...' : isRegistered ? (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Terdaftar
                            </>
                          ) : 'Daftar'}
                        </button>

                        {isRegistered && (
                          <button
                            onClick={handleCancelClick}
                            disabled={isRegistering}
                            className="w-full font-semibold py-3 rounded-lg transition-all duration-300 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Batalkan Pendaftaran
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="space-y-16">


              {/* Additional Event Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-40">
                {/* Left Column */}
                <div className="space-y-16">
                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {event.deskripsi}
                    </p>
                  </div>

                  {/* Event Schedule */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Hours</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 w-40 text-base">Event Date:</span>
                        <span className="text-gray-600 text-base">{formatDate(event.tanggal)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 w-40 text-base">Event Time:</span>
                        <span className="text-gray-600 text-base">{event.waktu_mulai ? formatTime(event.waktu_mulai) : 'TBA'}</span>
                      </div>
                      {event.durasi_hari && (
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900 w-40 text-base">Duration:</span>
                          <span className="text-gray-600 text-base">{event.durasi_hari} day(s)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Penyelenggara */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Penyelenggara</h2>
                    <div className="space-y-4">
                      <p className="text-gray-900 font-semibold text-lg">
                        {event.penyelenggara || event.nama_penyelenggara || 'Tidak tersedia'}
                      </p>
                      {event.kontak_penyelenggara && (
                        <p className="text-gray-600 text-base">
                          <span className="font-medium">Kontak: </span>
                          {event.kontak_penyelenggara}
                        </p>
                      )}
                      {event.email_penyelenggara && (
                        <p className="text-gray-600 text-base">
                          <span className="font-medium">Email: </span>
                          {event.email_penyelenggara}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-16">
                  {/* Event Location */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Location</h2>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mb-6">
                      <div className="flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6">
                        <MapPin className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-lg mb-3">{event.lokasi}</h3>
                      <p className="text-gray-600 text-base">
                        Event venue location
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Tags</h2>
                    <div className="flex flex-wrap gap-4">
                      <span className="px-6 py-3 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200">
                        {event.kategori}
                      </span>
                      {event.tingkat_kesulitan && (
                        <span className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                          {event.tingkat_kesulitan}
                        </span>
                      )}
                      <span className="px-6 py-3 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200">
                        {event.biaya && event.biaya > 0 ? 'Paid Event' : 'Free Event'}
                      </span>
                      {event.memberikan_sertifikat && (
                        <span className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                          Certificate Available
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Events Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Terkait</h2>
            <p className="text-gray-600 text-lg">Event lainnya yang mungkin Anda minati</p>
          </div>

          {loadingRelated ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map((relatedEvent) => (
                <EventCard 
                  key={relatedEvent.id}
                  event={relatedEvent}
                  variant="light"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada event terkait</h3>
              <p className="text-gray-600">Belum ada event lain dalam kategori yang sama.</p>
            </div>
          )}

          {relatedEvents.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
              >
                Lihat Semua Event
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-4">Event Management System</h3>
              <p className="text-gray-400 mb-4">
                Platform terpercaya untuk mengelola dan mengikuti berbagai event menarik.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/events" className="hover:text-white transition-colors">All Events</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Event Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Enhanced Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            margin: 0,
            overflow: 'hidden'
          }}
          onClick={() => setShowCancelModal(false)}
        >
          <div 
            style={{ 
              position: 'relative',
              zIndex: 1000000,
              maxWidth: '448px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              transform: 'translate(0, 0)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ 
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '48px',
                  width: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6'
                }}>
                  <AlertTriangle style={{ height: '24px', width: '24px', color: '#111827' }} />
                </div>
                <h3 style={{ 
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  Batalkan Pendaftaran?
                </h3>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  Apakah Anda yakin ingin membatalkan pendaftaran untuk event <span style={{ fontWeight: '500', color: '#111827' }}>{event.judul}</span>?
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={isRegistering}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: isRegistering ? 0.5 : 1
                  }}
                  onMouseOver={(e) => !isRegistering && (e.target.style.backgroundColor = '#f9fafb')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isRegistering}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'white',
                    backgroundColor: '#111827',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: isRegistering ? 0.5 : 1
                  }}
                  onMouseOver={(e) => !isRegistering && (e.target.style.backgroundColor = '#1f2937')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#111827')}
                >
                  {isRegistering ? 'Membatalkan...' : 'Ya, Batalkan'}
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
