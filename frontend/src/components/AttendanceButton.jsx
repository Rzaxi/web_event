import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AttendanceButton = ({ eventId, event }) => {
  const [attendanceStatus, setAttendanceStatus] = useState({
    available: false,
    hasToken: false,
    eventDateTime: null,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeUntilActive, setTimeUntilActive] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showTokenModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showTokenModal]);

  useEffect(() => {
    checkAttendanceAvailability();
  }, [eventId]);

  // Prevent re-checking if already marked
  useEffect(() => {
    if (attendanceStatus.alreadyMarked) {
      return; // Don't re-check if already marked
    }
  }, [attendanceStatus.alreadyMarked]);

  useEffect(() => {
    // Don't start countdown if already marked
    if (attendanceStatus.alreadyMarked) {
      return;
    }

    // Update countdown timer every second
    const interval = setInterval(() => {
      if (attendanceStatus.eventDateTime && !attendanceStatus.available && !attendanceStatus.alreadyMarked) {
        const now = new Date();
        const eventTime = new Date(attendanceStatus.eventDateTime);
        const timeDiff = eventTime.getTime() - now.getTime();
        
        if (timeDiff > 0) {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          
          setTimeUntilActive(`${hours}j ${minutes}m ${seconds}d`);
        } else {
          // Time has passed, recheck availability only if not already marked
          if (!attendanceStatus.alreadyMarked) {
            checkAttendanceAvailability();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attendanceStatus.eventDateTime, attendanceStatus.available, attendanceStatus.alreadyMarked]);

  const checkAttendanceAvailability = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/users/events/${eventId}/attendance/check`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        // The backend now always returns 200 OK, so we check the data payload
        setAttendanceStatus(data);
      } else {
        // This will now only catch actual server errors (500, etc.)
        console.error('Check attendance availability error:', response.status, data);
        setAttendanceStatus({
          available: false,
          message: 'Gagal memeriksa ketersediaan kehadiran'
        });
      }
    } catch (error) {
      // Only network errors should reach here
      console.error('Network error checking attendance availability:', error);
      setAttendanceStatus({
        available: false,
        message: 'Gagal memeriksa ketersediaan kehadiran'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendanceSubmit = async () => {
    if (!token.trim()) {
      toast.error('Masukkan token kehadiran');
      return;
    }

    if (token.length !== 10) {
      toast.error('Token kehadiran harus 10 digit');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post(`/users/events/${eventId}/attendance/verify-token`, {
        token: token.trim()
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowTokenModal(false);
        setToken('');
        document.body.style.overflow = 'unset';
        
        // Update attendance status to show attendance is marked
        setAttendanceStatus(prev => ({
          ...prev,
          available: false,
          alreadyMarked: true,
          message: 'Kehadiran sudah tercatat untuk hari ini'
        }));
        
        // Trigger parent component refresh if callback provided
        setTimeout(() => {
          if (window.refreshAttendanceData) {
            window.refreshAttendanceData();
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Attendance submission error:', error);
      toast.error(error.response?.data?.message || 'Gagal mengisi kehadiran');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show button if event doesn't provide certificate
  if (!event?.memberikan_sertifikat) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
        <span className="text-sm text-gray-600">Memeriksa ketersediaan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Attendance Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Daftar Hadir</h3>
          </div>
          {attendanceStatus.hasToken && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              Token Tersedia
            </div>
          )}
        </div>

        {attendanceStatus.available ? (
          <button
            onClick={() => setShowTokenModal(true)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Isi Daftar Hadir
          </button>
        ) : attendanceStatus.alreadyMarked ? (
          <div className="space-y-3">
            <button
              disabled
              className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center border border-green-200"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Kehadiran Tercatat
            </button>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div className="text-sm">
                  <p className="text-green-800 font-medium">
                    {attendanceStatus.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center"
            >
              <Clock className="w-5 h-5 mr-2" />
              Belum Aktif
            </button>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium mb-1">
                    {attendanceStatus.message}
                  </p>
                  {timeUntilActive && (
                    <p className="text-yellow-700">
                      Aktif dalam: <span className="font-mono font-bold">{timeUntilActive}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Token Input Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-20 overflow-hidden">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 mt-8 transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 fade-in">
            <div className="p-5 max-h-screen overflow-y-auto">
              <div className="text-center mb-4">
                <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Masukkan Token Kehadiran
                </h3>
                <p className="text-xs text-gray-600">
                  Masukkan token 10 digit yang dikirim ke email Anda saat mendaftar event
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Token Kehadiran
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Masukkan 10 digit token"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-base font-mono tracking-wider"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Token terdiri dari 10 digit angka
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowTokenModal(false);
                      setToken('');
                      document.body.style.overflow = 'unset';
                    }}
                    className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleAttendanceSubmit}
                    disabled={isSubmitting || token.length !== 10}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? 'Memproses...' : 'Konfirmasi'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceButton;
