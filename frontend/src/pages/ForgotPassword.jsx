import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setIsEmailSent(true);
      toast.success('Email reset password telah dikirim!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim email reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(email);
      toast.success('Email reset password telah dikirim ulang!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim email reset');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className={`min-h-screen flex transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}>
        {/* Left Sidebar */}
        <div className={`hidden lg:flex lg:w-2/5 bg-gradient-to-br from-green-600 via-emerald-500 to-green-700 p-12 flex-col justify-center relative overflow-hidden transition-all duration-1000 ease-out delay-200 ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-8'
        }`}>
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/30 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-6 text-center">Email Terkirim!</h1>
            <p className="text-green-100 mb-8 leading-relaxed text-lg text-center">
              Kami telah mengirim link reset password ke email Anda. Silakan cek inbox dan ikuti instruksi untuk reset password.
            </p>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <h3 className="font-semibold text-white mb-3">Langkah Selanjutnya:</h3>
              <ul className="text-green-100 space-y-2">
                <li>• Cek email di inbox Anda</li>
                <li>• Klik link reset password</li>
                <li>• Masukkan password baru</li>
                <li>• Login dengan password baru</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className={`flex-1 flex items-center justify-center p-8 bg-gray-50 transition-all duration-1000 ease-out delay-100 ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-8'
        }`}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Email Terkirim!
              </h2>
              <p className="text-gray-600 mb-6">
                Kami telah mengirim link reset password ke <strong className="text-green-600">{email}</strong>. 
                Silakan cek email Anda dan ikuti instruksi untuk reset password.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Tidak menerima email?</p>
                    <p>Cek folder spam/junk atau tunggu beberapa menit. Link akan kedaluwarsa dalam 1 jam.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105"
                >
                  Kembali ke Login
                </Link>
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full text-green-600 hover:text-green-700 font-medium py-2 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                      Mengirim ulang...
                    </div>
                  ) : (
                    'Kirim ulang email'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex transition-all duration-700 ease-out ${
      isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-4'
    }`}>
      {/* Left Sidebar */}
      <div className={`hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-purple-500 to-blue-700 p-12 flex-col justify-center relative overflow-hidden transition-all duration-1000 ease-out delay-200 ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-8'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/30 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 text-center">Lupa Password?</h1>
          <p className="text-blue-100 mb-8 leading-relaxed text-lg text-center">
            Jangan khawatir! Masukkan email Anda dan kami akan mengirim link untuk reset password.
          </p>
          
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
            <h3 className="font-semibold text-white mb-3">Cara Reset Password:</h3>
            <ul className="text-blue-100 space-y-2">
              <li>• Masukkan email terdaftar</li>
              <li>• Cek email untuk link reset</li>
              <li>• Klik link dan buat password baru</li>
              <li>• Login dengan password baru</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className={`flex-1 flex items-center justify-center p-8 bg-gray-50 transition-all duration-1000 ease-out delay-100 ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 translate-x-8'
      }`}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Back Button */}
          <Link
            to="/login"
            className={`inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium transition-all duration-500 ease-out delay-700 hover:translate-x-1 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-2'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 hover:-translate-x-1" />
            Kembali ke Login
          </Link>

          {/* Header */}
          <div className={`mb-8 transition-all duration-700 ease-out delay-800 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Lupa Password?</h2>
            <p className="text-gray-600">
              Masukkan email Anda dan kami akan mengirim link untuk reset password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-700 ease-out delay-900 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}>
            <div className={`transition-all duration-500 ease-out delay-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white focus:bg-white focus:shadow-md"
                  placeholder="Masukkan email Anda"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform ${
                isVisible ? 'opacity-100 translate-y-0 delay-1100' : 'opacity-0 translate-y-4'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Mengirim...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Kirim Link Reset
                  <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          <div className={`mt-6 text-center transition-all duration-500 ease-out delay-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <p className="text-gray-600">
              Ingat password Anda? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
