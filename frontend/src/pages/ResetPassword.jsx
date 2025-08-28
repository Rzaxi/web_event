import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Check, X } from 'lucide-react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { validatePassword, getPasswordStrength } from '../utils/passwordValidation';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, errors: [] });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, strength: '', color: '', checks: {} });
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get token from either URL params or query params
  const resetToken = token || searchParams.get('token');

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate password in real-time
    if (name === 'password') {
      const validation = validatePassword(value);
      const strength = getPasswordStrength(value);
      setPasswordValidation(validation);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password strength
    const validation = validatePassword(formData.password);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword(resetToken, formData.password);
      setIsSuccess(true);
      toast.success('Password berhasil direset!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
            <h1 className="text-4xl font-bold text-white mb-6 text-center">Password Berhasil Direset!</h1>
            <p className="text-green-100 mb-8 leading-relaxed text-lg text-center">
              Password Anda telah berhasil diubah. Sekarang Anda dapat login dengan password baru.
            </p>
            
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
              <h3 className="font-semibold text-white mb-3">Langkah Selanjutnya:</h3>
              <ul className="text-green-100 space-y-2">
                <li>• Password telah berhasil diubah</li>
                <li>• Anda akan diarahkan ke halaman login</li>
                <li>• Login dengan password baru Anda</li>
                <li>• Mulai menggunakan Event Management</li>
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
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Berhasil!
              </h2>
              <p className="text-gray-600 mb-6">
                Password Anda telah berhasil direset. Anda akan diarahkan ke halaman login dalam beberapa detik.
              </p>
              
              <Link
                to="/login"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center hover:shadow-lg transform hover:scale-105"
              >
                Login Sekarang
              </Link>
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
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 text-center">Reset Password</h1>
          <p className="text-blue-100 mb-8 leading-relaxed text-lg text-center">
            Buat password baru yang kuat untuk mengamankan akun Anda.
          </p>
          
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
            <h3 className="font-semibold text-white mb-3">Tips Password Kuat:</h3>
            <ul className="text-blue-100 space-y-2">
              <li>• Minimal 6 karakter</li>
              <li>• Kombinasi huruf dan angka</li>
              <li>• Hindari informasi pribadi</li>
              <li>• Gunakan karakter khusus</li>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">
              Masukkan password baru untuk akun Anda
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white focus:bg-white focus:shadow-md ${
                    formData.password && !passwordValidation.isValid 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200'
                  }`}
                  placeholder="Minimal 8 karakter dengan huruf besar, kecil, angka & simbol"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Kekuatan Password:</span>
                    <span className={`text-sm font-semibold ${
                      passwordStrength.color === 'green' ? 'text-green-600' :
                      passwordStrength.color === 'blue' ? 'text-blue-600' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                      passwordStrength.color === 'orange' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  
                  {/* Strength Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.color === 'green' ? 'bg-green-500' :
                        passwordStrength.color === 'blue' ? 'bg-blue-500' :
                        passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                        passwordStrength.color === 'orange' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Password Requirements - Simple Version */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className={`flex items-center space-x-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>Min 8 karakter</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>Huruf besar</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>Huruf kecil</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordStrength.checks.numbers ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>Angka</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>Karakter khusus</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`transition-all duration-500 ease-out delay-1100 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white focus:bg-white focus:shadow-md"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {formData.password && formData.confirmPassword && (
              <div className={`transition-all duration-300 ${
                formData.password === formData.confirmPassword 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <div className="flex items-center text-sm">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Password cocok
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Password tidak cocok
                    </>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || formData.password !== formData.confirmPassword}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform ${
                isVisible ? 'opacity-100 translate-y-0 delay-1200' : 'opacity-0 translate-y-4'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Mereset Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
