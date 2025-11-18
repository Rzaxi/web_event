import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, Save, Calendar, Clock, MapPin, Users, Tag, 
  Image as ImageIcon, Award, FileText, AlertCircle, Plus, Trash2, Percent
} from 'lucide-react';
import { organizerAPI } from '../../services/organizerApi';

const EditEvent = () => {
  const { id: eventId } = useParams(); // Extract 'id' from URL params as 'eventId'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori: '',
    tanggal: '',
    tanggal_selesai: '',
    waktu_mulai: '',
    waktu_selesai: '',
    lokasi: '',
    kapasitas_peserta: '',
    biaya: 0,
    status_event: 'draft',
    memberikan_sertifikat: false,
    durasi_hari: 1,
    minimum_kehadiran: 1,
    penyelenggara: ''
  });

  // File states
  const [flyerFile, setFlyerFile] = useState(null);
  const [flyerPreview, setFlyerPreview] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);

  // Ticket Categories State (will be loaded from database)
  const [ticketCategories, setTicketCategories] = useState([
    {
      id: 1,
      name: 'Regular',
      description: 'Tiket regular dengan harga standar untuk mengikuti event ini.',
      price: 0,
      originalPrice: 0,
      discount: 0,
      quota: 100,
      isDefault: true,
      isAvailable: true
    }
  ]);

  // Fetch event data
  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await organizerAPI.getEventById(eventId);
      
      if (response.data.success) {
        const event = response.data.data;
        
        // Format dates for input fields
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0]; // YYYY-MM-DD
        };

        const formatTime = (timeString) => {
          if (!timeString) return '';
          // Handle HH:MM:SS format from database
          return timeString.substring(0, 5); // HH:MM
        };

        setFormData({
          judul: event.judul || '',
          deskripsi: event.deskripsi || '',
          kategori: event.kategori || '',
          tanggal: formatDate(event.tanggal),
          tanggal_selesai: formatDate(event.tanggal_selesai),
          waktu_mulai: formatTime(event.waktu_mulai),
          waktu_selesai: formatTime(event.waktu_selesai),
          lokasi: event.lokasi || '',
          kapasitas_peserta: event.kapasitas_peserta || '',
          biaya: event.biaya || 0,
          status_event: event.status_event || 'draft',
          memberikan_sertifikat: event.memberikan_sertifikat || false,
          durasi_hari: event.durasi_hari || 1,
          minimum_kehadiran: event.minimum_kehadiran || 1,
          penyelenggara: event.penyelenggara || ''
        });

        // Set existing images
        console.log('Event data received:', event);
        console.log('Flyer URL:', event.flyer_url);
        console.log('Certificate Template:', event.sertifikat_template);
        
        if (event.flyer_url) {
          const flyerUrl = event.flyer_url.startsWith('/') 
            ? `http://localhost:3000${event.flyer_url}` 
            : `http://localhost:3000/${event.flyer_url}`;
          console.log('Setting flyer preview:', flyerUrl);
          setFlyerPreview(flyerUrl);
        }
        
        if (event.sertifikat_template) {
          const certUrl = event.sertifikat_template.startsWith('/') 
            ? `http://localhost:3000${event.sertifikat_template}` 
            : `http://localhost:3000/${event.sertifikat_template}`;
          console.log('Setting certificate preview:', certUrl);
          setCertificatePreview(certUrl);
        }

        // Convert existing biaya to ticket categories
        // For backward compatibility, we convert single biaya field to ticket tiers format
        const existingPrice = parseFloat(event.biaya) || 0;
        
        if (existingPrice === 0) {
          // Free event - show only Regular ticket (free)
          setTicketCategories([
            {
              id: 1,
              name: 'Regular',
              description: 'Tiket regular dengan harga standar untuk mengikuti event ini.',
              price: 0,
              originalPrice: 0,
              discount: 0,
              quota: event.kapasitas_peserta || 100,
              isDefault: true,
              isAvailable: true
            }
          ]);
        } else {
          // Paid event - show Regular ticket with existing price
          setTicketCategories([
            {
              id: 1,
              name: 'Regular',
              description: 'Tiket regular dengan harga standar untuk mengikuti event ini.',
              price: existingPrice,
              originalPrice: existingPrice,
              discount: 0,
              quota: event.kapasitas_peserta || 100,
              isDefault: true,
              isAvailable: true
            }
          ]);
        }
        
        console.log('Loaded ticket categories from biaya:', existingPrice);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Gagal memuat data event');
      navigate('/organizer/events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFlyerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      setFlyerFile(file);
      setFlyerPreview(URL.createObjectURL(file));
    }
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 10MB');
        return;
      }
      setCertificateFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificatePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Template sertifikat berhasil dipilih!');
    }
  };

  // Ticket Categories Handlers
  const handleTicketChange = (ticketId, field, value) => {
    setTicketCategories(prev => prev.map(ticket => {
      if (ticket.id !== ticketId) return ticket;
      
      const updated = { ...ticket, [field]: value };
      
      // Auto-calculate price when originalPrice or discount changes
      if (field === 'originalPrice' || field === 'discount') {
        const original = field === 'originalPrice' ? value : ticket.originalPrice;
        const discount = field === 'discount' ? value : ticket.discount;
        
        if (original > 0 && discount > 0) {
          updated.price = calculateDiscountedPrice(original, discount);
        } else {
          updated.price = original;
        }
      }
      
      return updated;
    }));
  };

  const addTicketCategory = () => {
    const newTicket = {
      id: Date.now(),
      name: 'New Ticket',
      description: 'Deskripsi tiket baru',
      price: 0,
      originalPrice: 0,
      discount: 0,
      quota: 50,
      isDefault: false,
      isAvailable: true
    };
    setTicketCategories(prev => [...prev, newTicket]);
  };

  const removeTicketCategory = (ticketId) => {
    if (ticketCategories.length <= 1) {
      toast.error('Minimal harus ada satu kategori tiket');
      return;
    }
    setTicketCategories(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const setDefaultTicket = (ticketId) => {
    setTicketCategories(prev => prev.map(ticket => ({
      ...ticket,
      isDefault: ticket.id === ticketId
    })));
  };

  const calculateDiscountedPrice = (originalPrice, discount) => {
    return originalPrice - (originalPrice * discount / 100);
  };

  const getTotalCapacity = () => {
    return ticketCategories.reduce((sum, ticket) => sum + (ticket.quota || 0), 0);
  };

  // Format number to Rupiah (display only)
  const formatRupiah = (num) => {
    if (!num && num !== 0) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Parse Rupiah string to number
  const parseRupiah = (str) => {
    if (!str) return 0;
    return parseInt(str.toString().replace(/\./g, '')) || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.judul || !formData.tanggal || !formData.lokasi) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      setSubmitting(true);

      // Get default ticket price for backward compatibility with biaya field
      const defaultTicket = ticketCategories.find(ticket => ticket.isDefault);
      const defaultPrice = defaultTicket.discount > 0 && defaultTicket.originalPrice > 0 
        ? calculateDiscountedPrice(defaultTicket.originalPrice, defaultTicket.discount)
        : defaultTicket.price;

      // Calculate total capacity from all tickets
      const totalCapacity = getTotalCapacity();

      // Prepare FormData
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'memberikan_sertifikat') {
          submitData.append(key, formData[key] ? '1' : '0');
        } else if (key === 'biaya') {
          // Override biaya with default ticket price
          submitData.append(key, defaultPrice);
        } else if (key === 'kapasitas_peserta') {
          // Override kapasitas with total from tickets
          submitData.append(key, totalCapacity);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add ticket categories as JSON for future use (if backend supports it)
      submitData.append('ticket_categories', JSON.stringify(ticketCategories));

      // Add files if changed
      if (flyerFile) {
        submitData.append('flyer', flyerFile);
      }
      if (certificateFile) {
        submitData.append('certificate_template', certificateFile);
      }

      const response = await organizerAPI.updateEvent(eventId, submitData);

      if (response.data.success) {
        toast.success('Event berhasil diupdate!');
        navigate('/organizer/events');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Gagal mengupdate event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => navigate('/organizer/events')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Daftar Event
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600 mt-2">Perbarui informasi event Anda</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Informasi Dasar */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Dasar
            </h2>

            <div className="space-y-6">
              {/* Judul Event */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Event *
                </label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan judul event"
                  required
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Event
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Deskripsikan event Anda..."
                />
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Kategori Event
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="pelatihan">Pelatihan</option>
                    <option value="kompetisi">Kompetisi</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Event
                  </label>
                  <select
                    name="status_event"
                    value={formData.status_event}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Waktu & Lokasi */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Waktu & Lokasi
            </h2>

            <div className="space-y-6">
              {/* Tanggal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    name="tanggal_selesai"
                    value={formData.tanggal_selesai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Waktu Mulai *
                  </label>
                  <input
                    type="time"
                    name="waktu_mulai"
                    value={formData.waktu_mulai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    name="waktu_selesai"
                    value={formData.waktu_selesai}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Lokasi Event *
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: Gedung A Lantai 3, Jakarta"
                  required
                />
              </div>

            </div>
          </div>

          {/* Ticket Categories */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Kategori Tiket</h2>
                <p className="text-sm text-gray-600 mt-1">Pilih kategori tiket yang sesuai untuk event ini</p>
              </div>
              <button
                type="button"
                onClick={addTicketCategory}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Tiket
              </button>
            </div>
            
            <div className="space-y-4">
              {ticketCategories.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    ticket.isDefault 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={(e) => handleTicketChange(ticket.id, 'name', e.target.value)}
                          className="text-lg font-semibold bg-transparent border-none outline-none text-gray-900 p-0"
                          placeholder="Nama Tiket"
                        />
                        {ticket.discount > 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            HEMAT {ticket.discount}%
                          </span>
                        )}
                        {ticket.isDefault && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Tersedia
                          </span>
                        )}
                      </div>
                      <textarea
                        value={ticket.description}
                        onChange={(e) => handleTicketChange(ticket.id, 'description', e.target.value)}
                        className="w-full text-sm text-gray-600 bg-transparent border-none outline-none resize-none"
                        rows="2"
                        placeholder="Deskripsi tiket..."
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-right">
                        {ticket.discount > 0 && ticket.originalPrice > 0 ? (
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {ticket.originalPrice === 0 ? 'Gratis' : `Rp ${calculateDiscountedPrice(ticket.originalPrice, ticket.discount).toLocaleString('id-ID')}`}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              Rp {ticket.originalPrice.toLocaleString('id-ID')}
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-gray-900">
                            {ticket.price === 0 ? 'Gratis' : `Rp ${ticket.price.toLocaleString('id-ID')}`}
                          </div>
                        )}
                      </div>
                      
                      {!ticket.isDefault && (
                        <button
                          type="button"
                          onClick={() => removeTicketCategory(ticket.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Ticket Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Harga Asli (Rp)
                      </label>
                      <input
                        type="text"
                        value={formatRupiah(ticket.originalPrice)}
                        onChange={(e) => {
                          const value = parseRupiah(e.target.value);
                          handleTicketChange(ticket.id, 'originalPrice', value);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-500 mt-1">Tanpa "Rp" atau titik</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Diskon (%)
                      </label>
                      <input
                        type="number"
                        value={ticket.discount}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                          handleTicketChange(ticket.id, 'discount', value);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Harga otomatis update</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Kuota
                      </label>
                      <input
                        type="number"
                        value={ticket.quota}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                          handleTicketChange(ticket.id, 'quota', value);
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="50"
                        min="1"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      {!ticket.isDefault && (
                        <button
                          type="button"
                          onClick={() => setDefaultTicket(ticket.id)}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Total Info */}
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Total Kapasitas Event: <strong>{getTotalCapacity()} peserta</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pengaturan Sertifikat */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Pengaturan Sertifikat
            </h2>

            <div className="space-y-6">
              {/* Toggle Sertifikat */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="memberikan_sertifikat"
                  checked={formData.memberikan_sertifikat}
                  onChange={handleInputChange}
                  className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Memberikan Sertifikat
                  </label>
                  <p className="text-sm text-gray-500">
                    Peserta akan mendapat sertifikat jika hadir minimal sesuai ketentuan
                  </p>
                </div>
              </div>

              {/* Certificate Settings (show only if enabled) */}
              {formData.memberikan_sertifikat && (
                <div className="ml-8 space-y-6 pl-6 border-l-2 border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durasi Event (Hari)
                      </label>
                      <input
                        type="number"
                        name="durasi_hari"
                        value={formData.durasi_hari}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Jumlah hari event berlangsung</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Kehadiran (Hari)
                      </label>
                      <input
                        type="number"
                        name="minimum_kehadiran"
                        value={formData.minimum_kehadiran}
                        onChange={handleInputChange}
                        min="1"
                        max={formData.durasi_hari}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimal hadir untuk dapat sertifikat</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penyelenggara
                    </label>
                    <input
                      type="text"
                      name="penyelenggara"
                      value={formData.penyelenggara}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama penyelenggara (akan tercetak di sertifikat)"
                    />
                  </div>

                  {/* Certificate Template Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Sertifikat
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {certificatePreview ? (
                        <div className="space-y-4">
                          <img
                            src={certificatePreview}
                            alt="Certificate Preview"
                            className="max-w-full h-48 object-contain mx-auto rounded"
                          />
                          <div className="flex justify-center space-x-2">
                            <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                              <span className="text-sm font-medium">Ganti Template</span>
                              <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handleCertificateChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block text-center">
                          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-blue-600 font-medium">Upload Template Sertifikat</p>
                          <p className="text-xs text-gray-500 mt-1">PNG atau JPG untuk template sertifikat</p>
                          <p className="text-xs text-gray-400 mt-1">Ukuran maksimal 10MB</p>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={handleCertificateChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Info Sertifikat:</p>
                        <p>Peserta akan mendapat sertifikat jika hadir minimal {formData.minimum_kehadiran} dari {formData.durasi_hari} hari event.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flyer Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
              Flyer Event
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {flyerPreview ? (
                <div className="space-y-4">
                  <img
                    src={flyerPreview}
                    alt="Flyer Preview"
                    className="max-w-full h-64 object-contain mx-auto rounded"
                  />
                  <div className="flex justify-center space-x-2">
                    <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                      <span className="text-sm font-medium">Ganti Flyer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFlyerChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-blue-600 font-medium">Upload Flyer Event</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, atau JPEG</p>
                  <p className="text-xs text-gray-400 mt-1">Ukuran maksimal 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFlyerChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/organizer/events')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
