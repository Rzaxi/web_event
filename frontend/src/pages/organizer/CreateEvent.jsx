import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  FileText,
  Save,
  ArrowLeft,
  Image,
  Award,
  Settings,
<<<<<<< HEAD
  CheckCircle,
  Ticket,
  Plus,
  Trash2,
  Edit,
  Percent
=======
  CheckCircle
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
} from 'lucide-react';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [flyerFile, setFlyerFile] = useState(null);
  const [flyerPreview, setFlyerPreview] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const [certificateElements, setCertificateElements] = useState([
    { id: 'name', label: 'Nama Peserta', x: 50, y: 40, fontSize: 24, color: '#000000' },
    { id: 'signature', label: 'Tanda Tangan', x: 50, y: 70, fontSize: 16, color: '#000000' }
  ]);
  const [selectedElement, setSelectedElement] = useState(null);
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal: '',
    tanggal_selesai: '',
    waktu_mulai: '',
    waktu_selesai: '',
    lokasi: '',
<<<<<<< HEAD
=======
    flyer_url: '',
    sertifikat_template: '',
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    kategori: 'webinar',
    kapasitas_peserta: 50,
    biaya: 0,
    status_event: 'draft',
    durasi_hari: 1,
    minimum_kehadiran: 1,
    memberikan_sertifikat: false,
    penyelenggara: ''
  });

<<<<<<< HEAD
  const [ticketCategories, setTicketCategories] = useState([
    {
      id: 1,
      name: 'Early Bird',
      description: 'Penawaran pertama dan paling ramah kantong yang ditawarkan oleh Svara team jauh sebelum harga normal diberlakukan.',
      price: 0,
      originalPrice: 6000,
      discount: 20,
      quota: 50,
      isDefault: false,
      isAvailable: true,
      salesStart: '',
      salesEnd: ''
    },
    {
      id: 2,
      name: 'Regular',
      description: 'Tiket regular dengan harga standar untuk mengikuti event ini.',
      price: 0,
      originalPrice: 0,
      discount: 0,
      quota: 100,
      isDefault: true,
      isAvailable: true,
      salesStart: '',
      salesEnd: ''
    }
  ]);

=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

<<<<<<< HEAD
  // Handle flyer file upload
  const handleFlyerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setFlyerFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFlyerPreview(reader.result);
        };
        reader.readAsDataURL(file);
        toast.success('Flyer berhasil dipilih!');
      } else {
        toast.error('File harus berupa gambar!');
      }
    }
  };

  // Handle certificate template file upload
  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setCertificateFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCertificatePreview(reader.result);
        };
        reader.readAsDataURL(file);
        toast.success('Template sertifikat berhasil dipilih! Atur posisi nama dan tanda tangan.');
      } else {
        toast.error('File harus berupa gambar!');
      }
    }
  };

  // Update certificate element position/style
  const updateCertificateElement = (id, updates) => {
    setCertificateElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const handleTicketChange = (ticketId, field, value) => {
    setTicketCategories(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, [field]: value }
        : ticket
    ));
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
      isAvailable: true,
      salesStart: '',
      salesEnd: ''
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

=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.tanggal || !formData.waktu_mulai || !formData.lokasi) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

<<<<<<< HEAD
    // Validate ticket categories
    if (ticketCategories.length === 0) {
      toast.error('Minimal harus ada satu kategori tiket');
      return;
    }

    const hasDefaultTicket = ticketCategories.some(ticket => ticket.isDefault);
    if (!hasDefaultTicket) {
      toast.error('Harus ada satu tiket yang dijadikan default');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate total capacity from all tickets
      const totalCapacity = ticketCategories.reduce((total, ticket) => total + ticket.quota, 0);
      
      // Get default ticket price for backward compatibility
      const defaultTicket = ticketCategories.find(ticket => ticket.isDefault);
      const defaultPrice = defaultTicket.discount > 0 && defaultTicket.originalPrice > 0 
        ? calculateDiscountedPrice(defaultTicket.originalPrice, defaultTicket.discount)
        : defaultTicket.price;

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append additional fields
      formDataToSend.append('kapasitas_peserta', totalCapacity);
      formDataToSend.append('biaya', defaultPrice);
      formDataToSend.append('ticketCategories', JSON.stringify(ticketCategories));
      
      // Append files if they exist
      if (flyerFile) {
        formDataToSend.append('flyer', flyerFile);
      }
      
      if (certificateFile) {
        formDataToSend.append('certificate_template', certificateFile);
        // Save certificate element positions
        formDataToSend.append('certificate_elements', JSON.stringify(certificateElements));
      }
      
      const response = await organizerApi.createEvent(formDataToSend);
=======
    try {
      setLoading(true);
      const response = await organizerApi.createEvent(formData);
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      
      if (response.data.success) {
        toast.success('Event berhasil dibuat!');
        navigate('/organizer/events');
<<<<<<< HEAD
      } else {
        toast.error(response.data.message || 'Gagal membuat event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Terjadi kesalahan saat membuat event');
=======
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Gagal membuat event');
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/organizer/events')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Buat Event Baru</h1>
                <p className="text-sm text-gray-600">Lengkapi informasi event Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Event *
                </label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan judul event"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Event
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Deskripsikan event Anda..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori Event
                </label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="webinar">Webinar</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="pelatihan">Pelatihan</option>
                  <option value="konser">Konser</option>
                  <option value="kompetisi">Kompetisi</option>
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Waktu & Lokasi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tanggal Event *
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Waktu Mulai *
                </label>
                <input
                  type="time"
                  name="waktu_mulai"
                  value={formData.waktu_mulai}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  name="tanggal_selesai"
                  value={formData.tanggal_selesai}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Waktu Selesai
                </label>
                <input
                  type="time"
                  name="waktu_selesai"
                  value={formData.waktu_selesai}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Lokasi Event *
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan lokasi event"
                  required
                />
              </div>
            </div>
          </div>

<<<<<<< HEAD
          {/* Ticket Categories */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
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
                        type="number"
                        value={ticket.originalPrice}
                        onChange={(e) => handleTicketChange(ticket.id, 'originalPrice', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Diskon (%)
                      </label>
                      <input
                        type="number"
                        value={ticket.discount}
                        onChange={(e) => handleTicketChange(ticket.id, 'discount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Kuota
                      </label>
                      <input
                        type="number"
                        value={ticket.quota}
                        onChange={(e) => handleTicketChange(ticket.id, 'quota', parseInt(e.target.value) || 0)}
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

                  {/* Terms Checkbox */}
                  {ticket.isDefault && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Saya setuju dengan{' '}
                          <a href="#" className="text-blue-600 hover:underline">
                            syarat dan ketentuan
                          </a>{' '}
                          yang berlaku untuk event ini.
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Capacity Display */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Kapasitas Event:</span>
                <span className="text-lg font-bold text-gray-900">
                  {ticketCategories.reduce((total, ticket) => total + ticket.quota, 0)} peserta
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Pengaturan Sertifikat</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="memberikan_sertifikat"
                  checked={formData.memberikan_sertifikat}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label className="ml-3 font-medium text-gray-700 flex items-center cursor-pointer">
                  <Award className="w-4 h-4 mr-2" />
                  Memberikan Sertifikat
                </label>
              </div>
            </div>

            {formData.memberikan_sertifikat && (
              <div className="space-y-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Durasi Event (Hari)
                    </label>
                    <input
                      type="number"
                      name="durasi_hari"
                      value={formData.durasi_hari}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: 3"
                    />
                    <p className="text-xs text-gray-500 mt-1">Jumlah hari event berlangsung</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Minimum Kehadiran (Hari)
                    </label>
                    <input
                      type="number"
                      name="minimum_kehadiran"
                      value={formData.minimum_kehadiran}
                      onChange={handleInputChange}
                      min="1"
                      max={formData.durasi_hari}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Contoh: 2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimal hadir untuk dapat sertifikat</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Settings className="w-4 h-4 inline mr-2" />
                      Penyelenggara
                    </label>
                    <input
                      type="text"
                      name="penyelenggara"
                      value={formData.penyelenggara}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama penyelenggara"
                    />
                    <p className="text-xs text-gray-500 mt-1">Akan tercetak di sertifikat</p>
                  </div>
                </div>

                {/* Certificate Template Upload & Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Award className="w-4 h-4 inline mr-2" />
                    Template Sertifikat
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                    {certificatePreview ? (
                      <div>
                        {/* Preview with Editable Elements */}
                        <div className="relative bg-gray-50 rounded-lg mb-4" style={{ minHeight: '400px' }}>
                          <img 
                            src={certificatePreview} 
                            alt="Certificate Preview" 
                            className="w-full h-auto rounded-lg"
                            draggable={false}
                          />
                          
                          {/* Overlay Elements */}
                          {certificateElements.map((element) => (
                            <div
                              key={element.id}
                              className={`absolute cursor-pointer transition-all ${
                                selectedElement?.id === element.id ? 'ring-2 ring-blue-500 bg-blue-50 bg-opacity-50' : 'hover:ring-1 hover:ring-gray-400'
                              }`}
                              style={{
                                left: `${element.x}%`,
                                top: `${element.y}%`,
                                transform: 'translate(-50%, -50%)',
                                fontSize: `${element.fontSize}px`,
                                color: element.color,
                                fontWeight: 'bold',
                                padding: '4px 8px',
                                borderRadius: '4px'
                              }}
                              onClick={() => setSelectedElement(element)}
                            >
                              {element.label}
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            onClick={() => {
                              setCertificateFile(null);
                              setCertificatePreview(null);
                              setSelectedElement(null);
                            }}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Element Editor */}
                        {selectedElement && (
                          <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
                            <h4 className="font-medium text-gray-900 mb-3">Atur: {selectedElement.label}</h4>
                            
                            <div className="space-y-3">
                              {/* Position X */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Posisi Horizontal: {selectedElement.x}%
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={selectedElement.x}
                                  onChange={(e) => updateCertificateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                                  className="w-full"
                                />
                              </div>

                              {/* Position Y */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Posisi Vertikal: {selectedElement.y}%
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={selectedElement.y}
                                  onChange={(e) => updateCertificateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                                  className="w-full"
                                />
                              </div>

                              {/* Font Size */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Ukuran Font: {selectedElement.fontSize}px
                                </label>
                                <input
                                  type="range"
                                  min="12"
                                  max="48"
                                  value={selectedElement.fontSize}
                                  onChange={(e) => updateCertificateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                                  className="w-full"
                                />
                              </div>

                              {/* Color */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Warna Teks
                                </label>
                                <input
                                  type="color"
                                  value={selectedElement.color}
                                  onChange={(e) => updateCertificateElement(selectedElement.id, { color: e.target.value })}
                                  className="w-full h-10 rounded border border-gray-300"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 mt-2">
                          Klik pada "<strong>Nama Peserta</strong>" atau "<strong>Tanda Tangan</strong>" untuk mengatur posisinya
                        </p>
                      </div>
                    ) : (
                      <div className="py-8">
                        <Award className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                        <label className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-700 font-medium text-lg">
                            Upload Template Sertifikat
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCertificateChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">PNG atau JPG untuk template sertifikat</p>
                        <p className="text-xs text-gray-400 mt-1">Ukuran maksimal 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Info Sertifikat:</p>
                      <p>Peserta akan mendapat sertifikat jika hadir minimal <strong>{formData.minimum_kehadiran} dari {formData.durasi_hari} hari</strong> event.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
=======
          {/* Capacity & Pricing */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Kapasitas & Harga</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Kapasitas Peserta
                </label>
                <input
                  type="number"
                  name="kapasitas_peserta"
                  value={formData.kapasitas_peserta}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Biaya Pendaftaran (Rp)
                </label>
                <input
                  type="number"
                  name="biaya"
                  value={formData.biaya}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0 untuk gratis"
                />
              </div>
            </div>
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
          </div>

          {/* Media & Files */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Media & File</h2>
            
<<<<<<< HEAD
            <div className="grid grid-cols-1 gap-6">
              {/* Flyer Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-2" />
                  Flyer Event
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  {flyerPreview ? (
                    <div className="relative">
                      <img 
                        src={flyerPreview} 
                        alt="Flyer Preview" 
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFlyerFile(null);
                          setFlyerPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-6">
                      <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <label className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Pilih file
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFlyerChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
=======
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="w-4 h-4 inline mr-2" />
                  URL Flyer Event
                </label>
                <input
                  type="url"
                  name="flyer_url"
                  value={formData.flyer_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/flyer.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="w-4 h-4 inline mr-2" />
                  Template Sertifikat
                </label>
                <input
                  type="text"
                  name="sertifikat_template"
                  value={formData.sertifikat_template}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama template sertifikat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Settings className="w-4 h-4 inline mr-2" />
                  Penyelenggara
                </label>
                <input
                  type="text"
                  name="penyelenggara"
                  value={formData.penyelenggara}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama penyelenggara event"
                />
              </div>
            </div>
          </div>

          {/* Event Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Pengaturan Event</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi Hari
                </label>
                <input
                  type="number"
                  name="durasi_hari"
                  value={formData.durasi_hari}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Kehadiran
                </label>
                <input
                  type="number"
                  name="minimum_kehadiran"
                  value={formData.minimum_kehadiran}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="memberikan_sertifikat"
                    checked={formData.memberikan_sertifikat}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Memberikan Sertifikat
                  </label>
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/organizer/events')}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Menyimpan...' : 'Simpan Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
