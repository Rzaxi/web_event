 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, GraduationCap, CheckCircle, ArrowRight, X } from 'lucide-react';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { isProfileComplete } from '../../utils/profileUtils';

const ProfileCompletionPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_handphone: '',
    alamat: '',
    pendidikan_terakhir: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Disable scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        const user = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...user, ...response.data.user, profile_completed: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        toast.success('Profile completed successfully!');
        
        // Check if there's a redirect URL stored
        const redirectUrl = localStorage.getItem('profile_completion_redirect');
        if (redirectUrl) {
          localStorage.removeItem('profile_completion_redirect');
          navigate(redirectUrl);
        } else {
          onClose();
        }
      } else {
        toast.error(response.data.message || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error(error.response?.data?.message || 'Failed to complete profile');
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

  const handleSkip = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...user, profile_skipped: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Check if there's a redirect URL stored
    const redirectUrl = localStorage.getItem('profile_completion_redirect');
    if (redirectUrl) {
      localStorage.removeItem('profile_completion_redirect');
      // Don't redirect if skipped, just close popup
      toast.info('Profile completion skipped. Please complete your profile to register for events.');
    }
    
    // Don't clear session storage when skipped - popup won't show again this session
    onClose();
  };

  const steps = [
    { number: 1, title: 'Full Name', icon: User, field: 'nama_lengkap', placeholder: 'Enter your full name' },
    { number: 2, title: 'Phone Number', icon: Phone, field: 'no_handphone', placeholder: 'Enter your phone number' },
    { number: 3, title: 'Address', icon: MapPin, field: 'alamat', placeholder: 'Enter your complete address' },
    { number: 4, title: 'Education', icon: GraduationCap, field: 'pendidikan_terakhir', placeholder: 'e.g., Bachelor of Computer Science' }
  ];

  if (!isOpen) return null;

  const currentStepData = steps[currentStep - 1];
  const IconComponent = currentStepData.icon;

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { 
              opacity: 0; 
            }
            to { 
              opacity: 1; 
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(40px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .popup-backdrop {
            animation: fadeIn 0.3s ease-out;
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
          }

          .popup-content {
            animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        `}
      </style>
      
      {/* Backdrop Overlay */}
      <div 
        className="popup-backdrop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        {/* Clean Modern Popup */}
        <div 
          className="popup-content"
          style={{
            position: 'relative',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
            padding: '48px',
            maxWidth: '440px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '32px',
              height: '32px',
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f3f4f6';
            }}
          >
            <X style={{ width: '16px', height: '16px', color: '#6b7280' }} />
          </button>

          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Complete Your Profile
            </h2>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>
              Step {currentStep} of {steps.length}: {currentStepData.title}
            </p>
          </div>

          {/* Progress Indicators */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {steps.map((step, index) => (
                <div key={step.number} style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: step.number <= currentStep ? '#6366f1' : '#f3f4f6',
                  color: step.number <= currentStep ? 'white' : '#9ca3af',
                  transition: 'all 0.2s'
                }}>
                  {step.number < currentStep ? (
                    <CheckCircle style={{ width: '16px', height: '16px' }} />
                  ) : (
                    step.number
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <label htmlFor={currentStepData.field} style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '8px'
              }}>
                {currentStepData.title} <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id={currentStepData.field}
                name={currentStepData.field}
                type="text"
                required
                value={formData[currentStepData.field]}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '10px',
                  color: '#111827',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder={currentStepData.placeholder}
                autoFocus
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    flex: 1,
                    padding: '13px 20px',
                    background: 'white',
                    border: '1px solid #d1d5db',
                    color: '#6b7280',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '15px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  Back
                </button>
              )}
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData[currentStepData.field]}
                  style={{
                    flex: 1,
                    padding: '13px 20px',
                    background: !formData[currentStepData.field] ? '#e5e7eb' : '#6366f1',
                    border: 'none',
                    color: !formData[currentStepData.field] ? '#9ca3af' : 'white',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: !formData[currentStepData.field] ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    opacity: !formData[currentStepData.field] ? 0.6 : 1,
                    fontSize: '15px'
                  }}
                  onMouseEnter={(e) => {
                    if (formData[currentStepData.field]) {
                      e.target.style.background = '#4f46e5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData[currentStepData.field]) {
                      e.target.style.background = '#6366f1';
                    }
                  }}
                >
                  Next Step
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !formData[currentStepData.field]}
                  style={{
                    flex: 1,
                    padding: '13px 20px',
                    background: (isLoading || !formData[currentStepData.field]) ? '#e5e7eb' : '#6366f1',
                    border: 'none',
                    color: (isLoading || !formData[currentStepData.field]) ? '#9ca3af' : 'white',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: (isLoading || !formData[currentStepData.field]) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: (isLoading || !formData[currentStepData.field]) ? 0.6 : 1,
                    fontSize: '15px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && formData[currentStepData.field]) {
                      e.target.style.background = '#4f46e5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && formData[currentStepData.field]) {
                      e.target.style.background = '#6366f1';
                    }
                  }}
                >
                  {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid currentColor',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Completing...
                    </div>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Skip Option */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={handleSkip}
              style={{
                fontSize: '14px',
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#6b7280'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCompletionPopup;
