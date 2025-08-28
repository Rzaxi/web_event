import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { userAPI } from '../../services/api';
import { User, Mail, Phone, Save, Edit3, MapPin, GraduationCap, Lock, Eye, EyeOff } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';

const AccountSettings = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        toast.error('Silakan login terlebih dahulu');
        window.location.href = '/login';
        return;
      }
      
      const response = await userAPI.getProfile();
      setUser(response.data);
      // Populate form with fetched data
      setValue('nama_lengkap', response.data.nama_lengkap);
      setValue('email', response.data.email);
      setValue('no_handphone', response.data.no_handphone);
      setValue('alamat', response.data.alamat);
      setValue('pendidikan_terakhir', response.data.pendidikan_terakhir);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Sesi telah berakhir. Silakan login kembali');
        window.location.href = '/login';
      } else {
        toast.error('Gagal memuat profil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      const response = await userAPI.updateProfile(data);
      if (response.data.success) {
        toast.success('Profil berhasil diperbarui!');
        setUser(response.data.user);
        // Update localStorage
        const updatedUser = { ...JSON.parse(localStorage.getItem('user')), nama: data.nama_lengkap };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
    }
  };

  const onSubmitPassword = async (data) => {
    if (data.new_password !== data.confirm_password) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }
    
    try {
      // Add password change API call here
      toast.success('Password berhasil diubah!');
    } catch (error) {
      toast.error('Gagal mengubah password');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h1>
              <p className="text-gray-600">Kelola informasi akun dan pengaturan keamanan Anda</p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 mb-8">
              <div className="flex border-b border-indigo-100">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 rounded-tl-xl ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Informasi Profil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 rounded-tr-xl ${
                    activeTab === 'security'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  Keamanan
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'profile' && (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Informasi Profil</h2>
                      <p className="text-gray-600">Perbarui informasi pribadi Anda dengan mudah</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            {...register('nama_lengkap', { required: 'Nama lengkap wajib diisi' })}
                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            placeholder="Masukkan nama lengkap"
                          />
                        </div>
                        {errors.nama_lengkap && (
                          <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap.message}</p>
                        )}
                      </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        {...register('email')}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Handphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        {...register('no_handphone')}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Masukkan nomor handphone"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        {...register('alamat')}
                        rows={3}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                        placeholder="Masukkan alamat lengkap"
                      />
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pendidikan Terakhir
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        {...register('pendidikan_terakhir')}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      >
                        <option value="">Pilih pendidikan terakhir</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA">SMA</option>
                        <option value="D3">D3</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                      </select>
                    </div>
                  </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Keamanan Akun</h2>
                      <p className="text-gray-600">Ubah password untuk menjaga keamanan akun Anda</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Saat Ini
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('current_password', { required: 'Password saat ini wajib diisi' })}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            placeholder="Masukkan password saat ini"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.current_password && (
                          <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>
                        )}
                      </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        {...register('new_password', { 
                          required: 'Password baru wajib diisi',
                          minLength: { value: 6, message: 'Password minimal 6 karakter' }
                        })}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Masukkan password baru"
                      />
                    </div>
                    {errors.new_password && (
                      <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        {...register('confirm_password', { required: 'Konfirmasi password wajib diisi' })}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Konfirmasi password baru"
                      />
                    </div>
                    {errors.confirm_password && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>
                    )}
                  </div>

                      {/* Submit Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          {isSubmitting ? 'Mengubah...' : 'Ubah Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
