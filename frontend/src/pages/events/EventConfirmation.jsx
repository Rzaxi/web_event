import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus, Star, Award, DollarSign, FileText, Shield, AlertTriangle, CheckCircle, Check, X, Ticket, CreditCard, User, Mail, Phone } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { isProfileComplete } from '../../utils/profileUtils';

const EventConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
<<<<<<< HEAD
  const [ticketCategories, setTicketCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState('');
=======
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState('regular');
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    if (!isProfileComplete(user)) {
      toast.info('Lengkapi profil Anda terlebih dahulu untuk mendaftar event');
      localStorage.setItem('profile_completion_redirect', `/events/${id}/confirm`);
      navigate('/');
      return;
    }

    fetchEventDetail();
  }, [id, user, navigate]);

  const fetchEventDetail = async () => {
    try {
<<<<<<< HEAD
      const [eventResponse, categoriesResponse] = await Promise.all([
        eventsAPI.getById(id),
        eventsAPI.getTicketCategories(id)
      ]);
      
      setEvent(eventResponse.data);
      setTicketCategories(categoriesResponse.data.data || []);
      
      // Set default selected ticket to first available category
      const availableCategories = categoriesResponse.data.data?.filter(cat => cat.is_active) || [];
      if (availableCategories.length > 0) {
        setSelectedTicketType(availableCategories[0].id.toString());
      }
    } catch (error) {
      console.error('Fetch error:', error);
=======
      const response = await eventsAPI.getById(id);
      setEvent(response.data);
    } catch (error) {
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      toast.error('Gagal memuat detail event');
      navigate('/events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRegistration = async () => {
    if (!agreedToTerms) {
      toast.error('Harap setujui syarat dan ketentuan');
      return;
    }

    setIsRegistering(true);
    try {
      const response = await eventsAPI.register(id);
      toast.success('Berhasil mendaftar event!');
      
      // Trigger event for MyEventsTab to refresh
      window.dispatchEvent(new CustomEvent('eventRegistered'));
      
      // Generate consistent registration ID for ticket
      const user = JSON.parse(localStorage.getItem('user'));
      const consistentHash = btoa(`${id}-${user.id}-event`).replace(/[^a-zA-Z0-9]/g, '').substr(0, 9);
      const registrationId = response.data?.registrationId || `reg-1729567200000-${consistentHash}`;
      
      // Redirect to ticket page
      navigate(`/events/${id}/ticket/${registrationId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsRegistering(false);
    }
  };

<<<<<<< HEAD
  // Transform ticket categories for display
  const ticketTypes = ticketCategories.map(category => ({
    id: category.id.toString(),
    name: category.name,
    price: parseFloat(category.price) || 0,
    originalPrice: category.original_price ? parseFloat(category.original_price) : null,
    description: category.description || `Tiket ${category.name} untuk event ini.`,
    status: category.is_active ? 'Tersedia' : 'Habis',
    available: category.is_active,
    badge: category.badge_text,
    badgeColor: category.badge_color,
    quota: category.quota,
    soldCount: category.sold_count || 0
  }));
=======
  const ticketTypes = [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: event?.biaya ? Math.floor(event.biaya * 0.8) : 0,
      originalPrice: event?.biaya || 0,
      description: 'Penawaran pertama dan paling ramah kantong yang ditawarkan oleh Svara team jauh sebelum harga normal diberlakukan.',
      status: 'Habis',
      available: false,
      badge: 'HEMAT 20%'
    },
    {
      id: 'regular',
      name: 'Regular',
      price: event?.biaya || 0,
      description: 'Tiket reguler dengan harga standar untuk mengikuti event ini.',
      status: 'Tersedia',
      available: true,
      badge: null
    }
  ];
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

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

  const selectedTicket = ticketTypes.find(t => t.id === selectedTicketType);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(`/events/${id}`)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Konfirmasi Pendaftaran</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Ticket Categories */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Kategori Tiket</h2>
                <p className="text-gray-600">Pilih kategori tiket yang sesuai untuk event ini</p>
              </div>
              
              <div className="p-6 space-y-4">
                {ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`relative border rounded-lg p-6 cursor-pointer transition-all ${
                      selectedTicketType === ticket.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!ticket.available ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={() => ticket.available && setSelectedTicketType(ticket.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.name}</h3>
                          {ticket.badge && (
<<<<<<< HEAD
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              ticket.badgeColor === 'green' ? 'bg-green-100 text-green-800' :
                              ticket.badgeColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                              ticket.badgeColor === 'red' ? 'bg-red-100 text-red-800' :
                              ticket.badgeColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                              ticket.badgeColor === 'purple' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
=======
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                              {ticket.badge}
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ticket.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {ticket.status}
                          </span>
<<<<<<< HEAD
                          {ticket.quota && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {ticket.soldCount}/{ticket.quota} terjual
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{ticket.description}</p>
=======
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{ticket.description}</p>
                        
                        {ticket.id === 'early-bird' && (
                          <div className="text-blue-600 text-sm font-medium">
                            Tampilkan Lebih Banyak
                          </div>
                        )}
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {ticket.price > 0 ? `Rp ${ticket.price.toLocaleString('id-ID')}` : 'Gratis'}
                        </div>
                        {ticket.originalPrice && ticket.originalPrice !== ticket.price && (
                          <div className="text-sm text-gray-500 line-through">
                            Rp {ticket.originalPrice.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedTicketType === ticket.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      agreedToTerms
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {agreedToTerms && <Check className="w-3 h-3" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      Saya setuju dengan{' '}
                      <button className="text-blue-600 hover:text-blue-700 underline">
                        syarat dan ketentuan
                      </button>{' '}
                      yang berlaku untuk event ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Detail Pesanan</h3>
              </div>
              
              <div className="p-6">
                {/* Event Info */}
                <div className="mb-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Ticket className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{event.judul}</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {new Date(event.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-600 text-sm">{event.lokasi}</p>
                    </div>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3 text-sm">Detail Pembeli</h5>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{user.nama_lengkap}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                    {user.no_handphone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{user.no_handphone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jumlah</span>
                    <span className="text-gray-900">1 Tiket</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Pembayaran</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTicket?.price > 0 ? `Rp ${selectedTicket.price.toLocaleString('id-ID')}` : 'Rp 0'}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleConfirmRegistration}
                  disabled={!agreedToTerms || isRegistering || !selectedTicket?.available}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
                    agreedToTerms && !isRegistering && selectedTicket?.available
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isRegistering ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    'Checkout'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventConfirmation;
