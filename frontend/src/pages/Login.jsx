import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Calendar, Users, Trophy, Zap } from 'lucide-react';
import { authAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { isProfileComplete } from '../utils/profileUtils';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Get complete profile data
      try {
        const profileResponse = await userAPI.getProfile();
        const completeUser = { ...response.data.user, ...profileResponse.data };
        localStorage.setItem('user', JSON.stringify(completeUser));
        
        console.log('=== LOGIN DEBUG ===');
        console.log('Complete user object:', JSON.stringify(completeUser, null, 2));
        console.log('Profile complete check:', isProfileComplete(completeUser));
        console.log('Profile skipped:', completeUser.profile_skipped);
        console.log('===================');
        
        toast.success('Login berhasil!');
        
        if (!isProfileComplete(completeUser) && !completeUser.profile_skipped) {
          console.log('Redirecting to profile completion');
          navigate('/profile-completion');
        } else {
          console.log('Redirecting to home');
          window.location.href = '/';
        }
      } catch (profileError) {
        // If profile fetch fails, assume profile is incomplete
        console.log('Profile fetch failed, redirecting to profile completion');
        toast.success('Login berhasil!');
        navigate('/profile-completion');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex transition-all duration-700 ease-out ${
      isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-4'
    }`}>
      {/* Left Sidebar */}
      <div className={`hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-teal-500 to-blue-700 p-12 flex-col justify-center relative overflow-hidden transition-all duration-1000 ease-out delay-200 ${
        isVisible 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-8'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/30 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-6">Event Management</h1>
          <p className="text-blue-100 mb-12 leading-relaxed text-lg">
            Bergabunglah dengan berbagai event menarik dan kembangkan potensi diri Anda bersama komunitas yang inspiratif.
          </p>

          <div className="space-y-6">
            {/* Platform Items */}
            {[
              { icon: Calendar, color: 'bg-white/20', title: 'Workshop & Seminar', desc: 'Event pembelajaran interaktif', delay: 'delay-300' },
              { icon: Users, color: 'bg-white/20', title: 'Networking Events', desc: 'Bangun koneksi profesional', delay: 'delay-400' },
              { icon: Trophy, color: 'bg-white/20', title: 'Competition', desc: 'Kompetisi dan lomba menarik', delay: 'delay-500' },
              { icon: Zap, color: 'bg-white/20', title: 'Tech Meetup', desc: 'Diskusi teknologi terkini', delay: 'delay-600' }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 transition-all duration-700 ease-out ${item.delay} hover:bg-white/20 hover:scale-105 hover:shadow-lg ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-4'
                  }`}
                >
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-6 border border-white/30`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-blue-100">{item.desc}</p>
                  </div>
                </div>
              );
            })}
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
            to="/"
            className={`inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium transition-all duration-500 ease-out delay-700 hover:translate-x-1 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-2'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 hover:-translate-x-1" />
            Beranda
          </Link>

          {/* Header */}
          <div className={`mb-8 transition-all duration-700 ease-out delay-800 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-600">
              Masuk ke akun Anda untuk mengakses <span className="text-blue-600 font-semibold">Event Management</span>
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
                Email / No Handphone <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white focus:bg-white focus:shadow-md"
                placeholder="Masukkan email atau nomor handphone"
              />
            </div>

            <div className={`transition-all duration-500 ease-out delay-1100 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
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
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white focus:bg-white focus:shadow-md"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className={`flex items-center justify-between transition-all duration-500 ease-out delay-1200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-transform duration-200 hover:scale-110"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Ingat Saya
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:translate-x-1"
              >
                Lupa Password
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform ${
                isVisible ? 'opacity-100 translate-y-0 delay-1300' : 'opacity-0 translate-y-4'
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>

          <div className={`mt-6 text-center transition-all duration-500 ease-out delay-1400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <p className="text-gray-600">
              Belum Punya Akun? <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:underline">Daftar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
