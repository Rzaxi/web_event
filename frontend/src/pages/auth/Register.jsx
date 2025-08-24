import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Calendar, Users, Trophy, Zap } from 'lucide-react';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    confirmPassword: '',
    no_handphone: '',
    alamat: '',
    pendidikan_terakhir: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authAPI.register(registerData);
      toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registrasi gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-100 via-blue-50 to-purple-50 p-12 flex-col justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Single Sign On</h1>
          <p className="text-gray-600 mb-12 leading-relaxed">
            Hi Pelajar, Sekarang Akun-Mu Dapat Digunakan Untuk Berbagai Platform. Nikmati Berbagai Kemudahan Akses Platform Dalam Satu Akun.
          </p>

          <div className="space-y-6">
            {/* Platform Items */}
            <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Event Management</h3>
                <p className="text-sm text-gray-600">Platform Event Sekolah</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Student Portal</h3>
                <p className="text-sm text-gray-600">Platform Digital Student</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Competition Hub</h3>
                <p className="text-sm text-gray-600">Platform Kompetisi Sekolah</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Learning Platform</h3>
                <p className="text-sm text-gray-600">Platform Pembelajaran Digital</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Beranda
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Baru</h2>
            <p className="text-gray-600">
              Hi, Selamat Datang <span className="text-blue-600 font-semibold">#JagoanDigital</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                id="nama_lengkap"
                name="nama_lengkap"
                type="text"
                required
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                placeholder="Masukkan email Anda"
              />
            </div>

            <div>
              <label htmlFor="no_handphone" className="block text-sm font-medium text-gray-700 mb-2">
                No. Telepon <span className="text-red-500">*</span>
              </label>
              <input
                id="no_handphone"
                name="no_handphone"
                type="tel"
                required
                value={formData.no_handphone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                placeholder="Masukkan nomor telepon"
              />
            </div>

            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
                Alamat <span className="text-red-500">*</span>
              </label>
              <input
                id="alamat"
                name="alamat"
                type="text"
                required
                value={formData.alamat}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                placeholder="Masukkan alamat"
              />
            </div>

            <div>
              <label htmlFor="pendidikan_terakhir" className="block text-sm font-medium text-gray-700 mb-2">
                Pendidikan Terakhir <span className="text-red-500">*</span>
              </label>
              <input
                id="pendidikan_terakhir"
                name="pendidikan_terakhir"
                type="text"
                required
                value={formData.pendidikan_terakhir}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                placeholder="Contoh: S1 Teknik Informatika"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                'DAFTAR SEKARANG'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah Punya Akun? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
