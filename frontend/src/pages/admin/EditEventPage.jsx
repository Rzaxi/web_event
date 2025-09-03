import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, FileImage, Tag, TrendingUp } from 'lucide-react';

const EditEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    kategori: 'lainnya',
    tingkat_kesulitan: 'pemula'
  });
  const [flyer, setFlyer] = useState(null);
  const [currentFlyer, setCurrentFlyer] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [errors, setErrors] = useState({});

  const kategoriOptions = [
    { value: 'akademik', label: 'Akademik' },
    { value: 'olahraga', label: 'Olahraga' },
    { value: 'seni_budaya', label: 'Seni & Budaya' },
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'kewirausahaan', label: 'Kewirausahaan' },
    { value: 'sosial', label: 'Sosial' },
    { value: 'kompetisi', label: 'Kompetisi' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'lainnya', label: 'Lainnya' }
  ];

  const tingkatKesulitanOptions = [
    { value: 'pemula', label: 'Pemula' },
    { value: 'menengah', label: 'Menengah' },
    { value: 'lanjutan', label: 'Lanjutan' }
  ];

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/admin/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const event = data.event;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date || '',
          time: event.time || '',
          location: event.location || '',
          maxParticipants: event.maxParticipants || '',
          kategori: event.kategori || 'lainnya',
          tingkat_kesulitan: event.tingkat_kesulitan || 'pemula'
        });
        setCurrentFlyer(event.flyer || '');
      } else {
        alert('Event tidak ditemukan');
        navigate('/admin/events');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      alert('Gagal memuat data event');
      navigate('/admin/events');
    } finally {
      setLoadingEvent(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          flyer: 'Hanya file JPG, JPEG, dan PNG yang diizinkan'
        }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          flyer: 'Ukuran file maksimal 5MB'
        }));
        return;
      }
      
      setFlyer(file);
      setErrors(prev => ({
        ...prev,
        flyer: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul event wajib diisi';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi event wajib diisi';
    }
    
    if (!formData.date) {
      newErrors.date = 'Tanggal event wajib diisi';
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      const diffTime = eventDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 3) {
        newErrors.date = 'Event hanya dapat diubah minimal H-3 dari tanggal pelaksanaan';
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'Waktu event wajib diisi';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi event wajib diisi';
    }
    
    if (!formData.maxParticipants || formData.maxParticipants < 1) {
      newErrors.maxParticipants = 'Kapasitas peserta minimal 1 orang';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const adminToken = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('maxParticipants', formData.maxParticipants);
      formDataToSend.append('kategori', formData.kategori);
      formDataToSend.append('tingkat_kesulitan', formData.tingkat_kesulitan);
      
      if (flyer) {
        formDataToSend.append('flyer', flyer);
      }
      
      const response = await fetch(`http://localhost:3000/admin/events/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Event berhasil diupdate!');
        navigate('/admin/events');
      } else {
        alert(data.message || 'Gagal mengupdate event');
      }
      
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Gagal mengupdate event. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/events')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
                <p className="mt-2 text-gray-600">Ubah informasi event di bawah</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Event *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan judul event"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Event *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan deskripsi lengkap event"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detail Event</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Tanggal Event *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Waktu Event *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Lokasi Event *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan lokasi event"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Kapasitas Peserta *
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.maxParticipants ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan kapasitas peserta"
                  />
                  {errors.maxParticipants && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Category & Difficulty */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Kategori & Tingkat</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Kategori Event *
                  </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {kategoriOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Tingkat Kesulitan *
                  </label>
                  <select
                    name="tingkat_kesulitan"
                    value={formData.tingkat_kesulitan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {tingkatKesulitanOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Flyer Upload */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Media</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileImage className="inline h-4 w-4 mr-1" />
                  Flyer Event (Opsional)
                </label>
                
                {currentFlyer && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Flyer saat ini:</p>
                    <img
                      src={`http://localhost:3000${currentFlyer}`}
                      alt="Current flyer"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Format: JPG, JPEG, PNG. Maksimal 5MB. Kosongkan jika tidak ingin mengubah flyer.
                </p>
                {errors.flyer && (
                  <p className="mt-1 text-sm text-red-600">{errors.flyer}</p>
                )}
              </div>
            </div>

            {/* H-3 Rule Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Aturan H-3</h3>
              <p className="text-sm text-blue-700">
                Event hanya dapat diubah minimal 3 hari sebelum tanggal pelaksanaan untuk memberikan waktu yang cukup bagi peserta.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/events')}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Mengupdate Event...' : 'Update Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
