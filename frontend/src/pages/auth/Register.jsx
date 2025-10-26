import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Calendar, Users, Trophy, Zap, Shield, Check, X, Globe, ChevronDown } from 'lucide-react';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { validatePassword, getPasswordStrength } from '../../utils/passwordValidation';

// Custom CSS animations
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes bounceSlow {
    0%, 100% {
      transform: translateY(0) rotate(12deg);
    }
    50% {
      transform: translateY(-5px) rotate(12deg);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-bounce-slow {
    animation: bounceSlow 2s ease-in-out infinite;
  }
  
  .delay-300 {
    animation-delay: 0.3s;
  }
  
  .delay-500 {
    animation-delay: 0.5s;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, errors: [] });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, strength: '', color: '', checks: {} });
  const navigate = useNavigate();

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

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Add required fields that backend expects
      const fullRegisterData = {
        email: formData.email,
        password: formData.password,
        nama_lengkap: 'Temporary Name', // Will be updated in profile completion
        no_handphone: '000000000', // Will be updated in profile completion
        alamat: 'Temporary Address', // Will be updated in profile completion
        pendidikan_terakhir: 'Temporary Education' // Will be updated in profile completion
      };
      
      const response = await authAPI.register(fullRegisterData);
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Floating Circles */}
          <div className="absolute top-20 left-16 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-10 w-24 h-24 bg-white/8 rounded-full"></div>
          <div className="absolute bottom-20 right-32 w-16 h-16 bg-white/12 rounded-full animate-pulse"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-center h-full text-white p-12 z-10 relative">
          <div className="max-w-lg mx-auto w-full text-center">
            
            {/* Simple Title */}
            <div className="mb-16">
              <h1 className="text-5xl font-black mb-6 leading-tight text-white animate-fade-in-up">
                Create Amazing<br/>
                <span className="text-white">Evoria</span>
              </h1>
              
              <p className="text-white/70 text-xl leading-relaxed font-light max-w-md mx-auto animate-fade-in-up delay-300">
                Platform terdepan untuk mengelola event profesional dengan mudah dan efisien.
              </p>
            </div>

            {/* Modern Illustration */}
            <div className="flex justify-center mb-16">
              <div className="relative animate-float">
                {/* Main Card */}
                <div className="w-64 h-40 bg-white/15 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 relative overflow-hidden hover:scale-105 transition-transform duration-300">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-300/20 to-purple-400/20 rounded-full blur-lg"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </div>
                      <div className="text-white/60 text-sm font-medium">Create Events</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="h-2 bg-white/30 rounded-full w-full"></div>
                      <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                      <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      </div>
                      <div className="text-white/40 text-xs">New Account</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl shadow-xl flex items-center justify-center transform rotate-12 animate-bounce-slow">
                  <div className="w-6 h-6 bg-white rounded-lg"></div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl shadow-lg flex items-center justify-center transform -rotate-12 animate-pulse">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center bg-white overflow-hidden relative">
        <div className="max-w-md mx-auto w-full px-8 lg:px-16 z-10 relative">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Evoria.</h2>
            <p className="text-gray-600">Create your account to get started.</p>
          </div>

          <div className="text-center mb-8 animate-fade-in-up delay-300">
            <p className="text-gray-600">Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link></p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up delay-500">
            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 text-base bg-gray-50 focus:bg-white"
                placeholder="Email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 text-base bg-gray-50 focus:bg-white"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 text-base bg-gray-50 focus:bg-white"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600 leading-relaxed">
                I want to receive latest news and event updates from Evoria Event Academy.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-600 leading-relaxed">
                I agree to the <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base mt-6"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
