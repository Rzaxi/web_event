import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  ArrowLeft, 
  User, 
  CalendarDays 
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Sidebar from '../../components/dashboard/Sidebar';
import AttendanceButton from '../../components/AttendanceButton';

const AttendanceCertificatePage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [certificateEligibility, setCertificateEligibility] = useState(null);
  const [userRegistration, setUserRegistration] = useState(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [otpAnimateIn, setOtpAnimateIn] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [otpInfoMsg, setOtpInfoMsg] = useState('');

  useEffect(() => {
    fetchEventData();
    fetchAttendanceData();
    fetchCertificateEligibility();
    
    // Set up global refresh function for AttendanceButton with debounce
    let refreshTimeout;
    window.refreshAttendanceData = () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      refreshTimeout = setTimeout(() => {
        fetchAttendanceData();
        fetchCertificateEligibility();
      }, 500);
    };
    
    // Cleanup
    return () => {
      delete window.refreshAttendanceData;
    };
  }, [eventId]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (otpModalOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
      // trigger enter animation
      requestAnimationFrame(() => setOtpAnimateIn(true));
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.paddingRight = prevPaddingRight;
        setOtpAnimateIn(false);
      };
    }
  }, [otpModalOpen]);

  const fetchEventData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Gagal mengambil data event');
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}/my-attendance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.attendance || []);
        setUserRegistration(data.registration);
      } else if (response.status === 401) {
        // Handle unauthorized - redirect to login without console error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (error) {
      // Only log actual network/server errors, not expected responses
      if (error.name !== 'TypeError' || !error.message.includes('Failed to fetch')) {
        console.error('Error fetching attendance:', error);
      }
      toast.error('Gagal mengambil data kehadiran');
    }
  };

  const fetchCertificateEligibility = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}/certificate-eligibility`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCertificateEligibility(data);
      } else if (response.status === 401) {
        // Handle unauthorized - redirect to login without console error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (error) {
      // Only log actual network/server errors, not expected responses
      if (error.name !== 'TypeError' || !error.message.includes('Failed to fetch')) {
        console.error('Error fetching certificate eligibility:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/events/${eventId}/certificate/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `certificate-${event?.judul || 'event'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Sertifikat berhasil diunduh');
      } else {
        toast.error('Sertifikat belum tersedia');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Gagal mengunduh sertifikat');
    }
  };

  const requestOtp = async () => {
    try {
      if (requestingOtp) return;
      setRequestingOtp(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${eventId}/attendance/request-otp`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Request OTP gagal');
      }
      toast.success('OTP telah dikirim ke email Anda');
      setOtpInfoMsg('OTP sudah dikirim. Cek email Anda.');
      setOtpModalOpen(true);
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Gagal meminta OTP');
    } finally {
      setRequestingOtp(false);
    }
  };

  const submitOtp = async () => {
    try {
      if (!otpCode.trim()) {
        toast.error('Masukkan kode OTP');
        return;
      }
      setSubmittingOtp(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${eventId}/attendance/verify-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: otpCode.trim() })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Verifikasi OTP gagal');
      }
      toast.success('Absensi berhasil');
      setOtpModalOpen(false);
      setOtpCode('');
      await fetchAttendanceData();
      await fetchCertificateEligibility();
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Gagal verifikasi OTP');
    } finally {
      setSubmittingOtp(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'excused':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present':
        return 'Hadir';
      case 'late':
        return 'Terlambat';
      case 'absent':
        return 'Tidak Hadir';
      case 'excused':
        return 'Izin';
      default:
        return 'Belum Dicatat';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Event yang Anda cari tidak ditemukan atau tidak tersedia.</p>
          <button
            onClick={() => navigate('/my-events')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Event Saya
          </button>
        </div>
      </div>
    );
  }

  const presentDays = attendanceData.filter(att => att.status === 'present' || att.status === 'late').length;
  const totalDays = event.durasi_hari || 1;
  const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-events')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Event Saya
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.judul}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {new Date(event.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {event.waktu}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {event.lokasi}
                  </div>
                </div>
              </div>

              {event.memberikan_sertifikat && (
                <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm">
                  <Award className="h-4 w-4 mr-1" />
                  Event Bersertifikat
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress Kehadiran</h2>

              {/* Token-based Attendance */}
              <AttendanceButton eventId={eventId} event={event} />
              {otpInfoMsg && (
                <p className="text-sm text-blue-600 mb-4">{otpInfoMsg}</p>
              )}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Kehadiran: {presentDays} dari {totalDays} hari</span>
                  <span>{attendancePercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Daily Attendance */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Detail Kehadiran Harian</h3>
                {Array.from({ length: totalDays }, (_, index) => {
                  const dayNumber = index + 1;
                  const attendance = attendanceData.find(att => att.hari_ke === dayNumber);
                  const eventDate = new Date(event.tanggal);
                  const currentDate = new Date(eventDate);
                  currentDate.setDate(eventDate.getDate() + index);

                  return (
                    <div key={dayNumber} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {dayNumber}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Hari ke-{dayNumber}</p>
                          <p className="text-sm text-gray-600">
                            {currentDate.toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {attendance && attendance.check_in_time && (
                          <span className="text-sm text-gray-600">
                            {new Date(attendance.check_in_time).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(attendance?.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(attendance?.status)}`}>
                            {getStatusText(attendance?.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Certificate Status */}
          <div className="lg:col-span-1">
            {event.memberikan_sertifikat && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Sertifikat</h2>

                <div className="space-y-4">
                  {/* Requirements */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Persyaratan Sertifikat</h3>
                    <p className="text-sm text-blue-700">
                      Minimal hadir {event.minimum_kehadiran} dari {event.durasi_hari} hari
                    </p>
                  </div>

                  {/* Current Status */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kehadiran Anda:</span>
                      <span className="font-medium">{presentDays} hari</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Minimum Required:</span>
                      <span className="font-medium">{event.minimum_kehadiran} hari</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      {presentDays >= event.minimum_kehadiran ? (
                        <span className="flex items-center text-green-600 font-medium">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Memenuhi Syarat
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 font-medium">
                          <XCircle className="h-4 w-4 mr-1" />
                          Belum Memenuhi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Certificate Action */}
                  {certificateEligibility?.eligible && certificateEligibility?.certificate_issued ? (
                    <button
                      onClick={downloadCertificate}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Unduh Sertifikat
                    </button>
                  ) : certificateEligibility?.eligible ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center text-yellow-800">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm">Sertifikat sedang diproses</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center text-gray-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {presentDays < event.minimum_kehadiran
                            ? `Perlu ${event.minimum_kehadiran - presentDays} hari kehadiran lagi`
                            : 'Sertifikat belum tersedia'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Registration Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Info Pendaftaran</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status Pendaftaran:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Terdaftar
                  </span>
                </div>
                {userRegistration?.createdAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tanggal Daftar:</span>
                    <span className="text-sm font-medium">
                      {new Date(userRegistration.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal via Portal to body to ensure center positioning */}
      {otpModalOpen && ReactDOM.createPortal(
        (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div
              className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${otpAnimateIn ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => {
                setOtpAnimateIn(false);
                setTimeout(() => setOtpModalOpen(false), 200);
              }}
            ></div>
            <div
              className={`relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all duration-200 ${otpAnimateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifikasi Kehadiran</h3>
              <p className="text-sm text-gray-600 mb-4">Masukkan kode OTP yang dikirim ke email Anda</p>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                placeholder="6 digit OTP"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => { setOtpAnimateIn(false); setTimeout(() => setOtpModalOpen(false), 200); }}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  disabled={submittingOtp}
                >
                  Batal
                </button>
                <button
                  onClick={submitOtp}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  disabled={submittingOtp}
                >
                  {submittingOtp ? 'Memverifikasi...' : 'Verifikasi'}
                </button>
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </div>
  );
};

export default AttendanceCertificatePage;
