import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, UserPlus, Star, Award, DollarSign, FileText, Shield, AlertTriangle, CheckCircle, Check, X } from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { isProfileComplete } from '../../utils/profileUtils';

const EventConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
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
      navigate('/profile-completion');
      return;
    }

    fetchEventDetail();
  }, [id, user, navigate]);

  const fetchEventDetail = async () => {
    try {
      const response = await eventsAPI.getById(id);
      setEvent(response.data);
    } catch (error) {
      toast.error('Gagal memuat detail event');
      navigate('/events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRegistration = async () => {
    if (!agreedToTerms || !agreedToRules || !agreedToPolicy) {
      toast.error('Harap setujui semua syarat dan ketentuan');
      return;
    }

    setIsRegistering(true);
    try {
      await eventsAPI.register(id);
      toast.success('Berhasil mendaftar event!');
      navigate(`/events/${id}`, { state: { registered: true } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsRegistering(false);
    }
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

  const allAgreed = agreedToTerms && agreedToRules && agreedToPolicy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(`/events/${id}`)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Detail Event
            </button>
            <div className="text-sm font-medium text-gray-600">
              Konfirmasi Pendaftaran Event
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Event Summary Card */}
        <div className="relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Konfirmasi Pendaftaran Event</h1>
              <p className="text-lg text-gray-600">Pastikan informasi berikut sudah benar sebelum melanjutkan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{event.judul}</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(event.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">{event.waktu} WIB</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{event.lokasi}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {event.participantCount || 0} / {event.kapasitas_peserta} peserta
                      </p>
                      <p className="text-sm text-gray-600">
                        {event.kapasitas_peserta - (event.participantCount || 0)} slot tersisa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {event.biaya > 0 ? `Rp ${event.biaya.toLocaleString('id-ID')}` : 'Gratis'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Pendaftar</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                    <p className="font-semibold text-gray-900">{user.nama_lengkap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">No. Telepon</p>
                    <p className="font-semibold text-gray-900">{user.no_handphone || 'Belum diisi'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-8">
          {/* Registration Requirements */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Persyaratan Pendaftaran</h3>
                </div>
                <button
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    agreedToTerms 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {agreedToTerms && <Check className="w-4 h-4" />}
                </button>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Peserta harus memiliki akun yang terverifikasi</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Profil peserta harus lengkap dan akurat</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Peserta wajib hadir tepat waktu sesuai jadwal</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Membawa identitas diri yang valid (KTP/Kartu Pelajar)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Mematuhi protokol kesehatan yang berlaku</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Rules & Regulations */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Aturan & Tata Tertib</h3>
                </div>
                <button
                  onClick={() => setAgreedToRules(!agreedToRules)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    agreedToRules 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {agreedToRules && <Check className="w-4 h-4" />}
                </button>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Berpakaian sopan dan sesuai dengan tema event</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Menjaga ketertiban dan tidak mengganggu peserta lain</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Dilarang membawa barang berbahaya atau terlarang</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Mengikuti instruksi dari panitia dan pembicara</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Bertanggung jawab atas barang pribadi masing-masing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl blur"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg mr-4">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Kebijakan Pembatalan</h3>
                </div>
                <button
                  onClick={() => setAgreedToPolicy(!agreedToPolicy)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                    agreedToPolicy 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {agreedToPolicy && <Check className="w-4 h-4" />}
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200">
                  <p className="text-sm font-semibold text-orange-800 mb-2">Pembatalan oleh Peserta:</p>
                  <p className="text-orange-700">Pembatalan dapat dilakukan maksimal 24 jam sebelum event dimulai</p>
                </div>
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                  <p className="text-sm font-semibold text-red-800 mb-2">Pembatalan oleh Penyelenggara:</p>
                  <p className="text-red-700">Jika event dibatalkan, peserta akan mendapat notifikasi dan kompensasi sesuai kebijakan</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">Force Majeure:</p>
                  <p className="text-yellow-700">Event dapat dibatalkan karena kondisi di luar kendali (bencana alam, pandemi, dll)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="flex-1 px-8 py-4 text-gray-700 bg-white/90 hover:bg-white border border-gray-300 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center">
              <X className="w-5 h-5 mr-3" />
              Batal
            </div>
          </button>
          <button
            onClick={handleConfirmRegistration}
            disabled={!allAgreed || isRegistering}
            className={`flex-1 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
              allAgreed && !isRegistering
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isRegistering ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Memproses...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <UserPlus className="w-5 h-5 mr-3" />
                Konfirmasi Pendaftaran
              </div>
            )}
          </button>
        </div>

        {/* Important Notice */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <p className="text-sm text-gray-700">
                  Dengan mengklik "Konfirmasi Pendaftaran", Anda menyetujui semua syarat dan ketentuan yang berlaku. 
                  Pastikan informasi yang Anda berikan sudah benar dan lengkap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventConfirmation;
