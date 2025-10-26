import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Clock, MapPin, Users, FileText, Image, Tag, TrendingUp, ArrowLeft, FileImage, ChevronDown, Award, Hash } from 'lucide-react';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    kategori: 'webinar',
    tingkat_kesulitan: 'pemula',
    durasi_hari: 1,
    minimum_kehadiran: 1,
    memberikan_sertifikat: false,
    tanggal_selesai: ''
  });
  const [flyer, setFlyer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [tingkatKesulitanOptions, setTingkatKesulitanOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [kategoriDropdownOpen, setKategoriDropdownOpen] = useState(false);
  const [tingkatDropdownOpen, setTingkatDropdownOpen] = useState(false);

  // Fetch event options from API
  useEffect(() => {
    const fetchEventOptions = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/admin/events/options', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          setKategoriOptions(result.data.categories);
          setTingkatKesulitanOptions(result.data.difficulties);
        } else {
          console.error('Failed to fetch event options');
        }
      } catch (error) {
        console.error('Error fetching event options:', error);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchEventOptions();
  }, []);

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
        newErrors.date = 'Event hanya dapat dibuat minimal H-3 dari tanggal pelaksanaan';
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
      formDataToSend.append('durasi_hari', formData.durasi_hari);
      formDataToSend.append('minimum_kehadiran', formData.minimum_kehadiran);
      formDataToSend.append('memberikan_sertifikat', formData.memberikan_sertifikat);
      formDataToSend.append('tanggal_selesai', formData.tanggal_selesai);
      
      if (flyer) {
        formDataToSend.append('flyer', flyer);
      }
      
      const response = await fetch('http://localhost:3000/admin/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Event berhasil dibuat!');
        navigate('/admin/events');
      } else {
        alert(data.message || 'Gagal membuat event');
      }
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Gagal membuat event. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Buat Event Baru</h1>
                <p className="mt-2 text-gray-600">Isi form di bawah untuk membuat event baru</p>
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
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Kategori Event *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setKategoriDropdownOpen(!kategoriDropdownOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                    >
                      <span>{kategoriOptions.find(opt => opt.value === formData.kategori)?.label || 'Pilih Kategori'}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${kategoriDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {kategoriDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {kategoriOptions.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, kategori: option.value }));
                              setKategoriDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                              formData.kategori === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    Tingkat Kesulitan *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setTingkatDropdownOpen(!tingkatDropdownOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                    >
                      <span>{tingkatKesulitanOptions.find(opt => opt.value === formData.tingkat_kesulitan)?.label || 'Pilih Tingkat'}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${tingkatDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {tingkatDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {tingkatKesulitanOptions.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, tingkat_kesulitan: option.value }));
                              setTingkatDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-blue-50 ${
                              formData.tingkat_kesulitan === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Pengaturan Sertifikat</h2>
              
              <div className="space-y-6">
                {/* Certificate Toggle */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="memberikan_sertifikat"
                      checked={formData.memberikan_sertifikat}
                      onChange={(e) => setFormData(prev => ({ ...prev, memberikan_sertifikat: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      <Award className="inline h-4 w-4 mr-1" />
                      Event ini memberikan sertifikat
                    </span>
                  </label>
                </div>

                {formData.memberikan_sertifikat && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Hash className="inline h-4 w-4 mr-1" />
                        Durasi Event (Hari) *
                      </label>
                      <input
                        type="number"
                        name="durasi_hari"
                        value={formData.durasi_hari}
                        onChange={handleInputChange}
                        min="1"
                        max="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Minimum Attendance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="inline h-4 w-4 mr-1" />
                        Min. Kehadiran (Hari) *
                      </label>
                      <input
                        type="number"
                        name="minimum_kehadiran"
                        value={formData.minimum_kehadiran}
                        onChange={handleInputChange}
                        min="1"
                        max={formData.durasi_hari}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* End Date */}
                    {formData.durasi_hari > 1 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          Tanggal Selesai *
                        </label>
                        <input
                          type="date"
                          name="tanggal_selesai"
                          value={formData.tanggal_selesai}
                          onChange={handleInputChange}
                          min={formData.date}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                )}

                {formData.memberikan_sertifikat && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-amber-800 mb-2">Catatan Sertifikat</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Peserta harus hadir minimal {formData.minimum_kehadiran} dari {formData.durasi_hari} hari untuk mendapat sertifikat</li>
                      <li>• Admin dapat mencatat kehadiran harian melalui halaman manajemen kehadiran</li>
                      <li>• Sertifikat akan diterbitkan otomatis setelah event selesai</li>
                    </ul>
                  </div>
                )}
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
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Format: JPG, JPEG, PNG. Maksimal 5MB.
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
                Event hanya dapat dibuat minimal 3 hari sebelum tanggal pelaksanaan untuk memberikan waktu yang cukup bagi peserta untuk mendaftar.
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
                {loading ? 'Membuat Event...' : 'Buat Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
