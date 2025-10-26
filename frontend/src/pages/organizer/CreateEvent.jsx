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
  CheckCircle
} from 'lucide-react';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    tanggal: '',
    tanggal_selesai: '',
    waktu_mulai: '',
    waktu_selesai: '',
    lokasi: '',
    flyer_url: '',
    sertifikat_template: '',
    kategori: 'webinar',
    kapasitas_peserta: 50,
    biaya: 0,
    status_event: 'draft',
    durasi_hari: 1,
    minimum_kehadiran: 1,
    memberikan_sertifikat: false,
    penyelenggara: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.tanggal || !formData.waktu_mulai || !formData.lokasi) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const response = await organizerApi.createEvent(formData);
      
      if (response.data.success) {
        toast.success('Event berhasil dibuat!');
        navigate('/organizer/events');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Gagal membuat event');
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
          </div>

          {/* Media & Files */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Media & File</h2>
            
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
