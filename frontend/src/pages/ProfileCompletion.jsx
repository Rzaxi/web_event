import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, GraduationCap, CheckCircle, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { isProfileComplete } from '../utils/profileUtils';
import { displayName, displayPhone, displayAddress, displayEducation } from '../utils/displayUtils';

const ProfileCompletion = () => {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_handphone: '',
    alamat: '',
    pendidikan_terakhir: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Check if profile is already complete
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && isProfileComplete(user)) {
      // Profile is already complete, redirect to home
      navigate('/');
      return;
    }

    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

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
      const response = await authAPI.updateProfile(formData);
      
      if (response.data.success) {
        // Update user data in localStorage with complete profile data
        const user = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...user, ...response.data.user, profile_completed: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profil berhasil dilengkapi!');
        
        // Check if there's a redirect URL (for event registration flow)
        const redirectUrl = localStorage.getItem('profile_completion_redirect');
        if (redirectUrl) {
          localStorage.removeItem('profile_completion_redirect');
          navigate(redirectUrl);
        } else {
          navigate('/');
        }
      } else {
        toast.error(response.data.message || 'Gagal melengkapi profil');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error(error.response?.data?.message || 'Gagal melengkapi profil');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: 'Nama Lengkap', icon: User, field: 'nama_lengkap', placeholder: 'Masukkan nama lengkap Anda' },
    { number: 2, title: 'No. Telepon', icon: Phone, field: 'no_handphone', placeholder: 'Masukkan nomor telepon' },
    { number: 3, title: 'Alamat', icon: MapPin, field: 'alamat', placeholder: 'Masukkan alamat lengkap' },
    { number: 4, title: 'Pendidikan', icon: GraduationCap, field: 'pendidikan_terakhir', placeholder: 'Contoh: S1 Teknik Informatika' }
  ];

  const currentStepData = steps[currentStep - 1];
  const IconComponent = currentStepData.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4 transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className={`w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-1000 ease-out delay-200 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}>
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-700 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lengkapi Profil</h1>
          <p className="text-gray-600">
            Langkah {currentStep} dari {steps.length}: {currentStepData.title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className={`mb-8 transition-all duration-700 ease-out delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step.number <= currentStep 
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.number < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                    step.number < currentStep ? 'bg-gradient-to-r from-blue-600 to-teal-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={`space-y-6 transition-all duration-700 ease-out delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <div className="space-y-4">
            <label htmlFor={currentStepData.field} className="block text-sm font-medium text-gray-700">
              {currentStepData.title} <span className="text-red-500">*</span>
            </label>
            <input
              id={currentStepData.field}
              name={currentStepData.field}
              type="text"
              required
              value={formData[currentStepData.field]}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white focus:bg-white focus:shadow-md"
              placeholder={currentStepData.placeholder}
              autoFocus
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
              >
                Kembali
              </button>
            )}
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData[currentStepData.field]}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Lanjut
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !formData[currentStepData.field]}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-teal-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                ) : (
                  'Selesai'
                )}
              </button>
            )}
          </div>
        </form>

        {/* Skip Option */}
        <div className={`mt-6 text-center transition-all duration-500 ease-out delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button
            onClick={() => {
              // Mark profile as skipped
              const user = JSON.parse(localStorage.getItem('user'));
              const updatedUser = { ...user, profile_skipped: true };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              
              // Check if there's a redirect URL
              const redirectUrl = localStorage.getItem('profile_completion_redirect');
              if (redirectUrl) {
                localStorage.removeItem('profile_completion_redirect');
                navigate(redirectUrl);
              } else {
                navigate('/');
              }
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Lewati untuk sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
