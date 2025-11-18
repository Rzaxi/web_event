import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Html5QrcodeScanner, Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import { 
  Camera, 
  Users, 
  CheckCircle, 
  XCircle, 
  Download, 
  Search,
  Filter,
  RefreshCw,
  Clock,
  UserCheck,
  AlertCircle,
  CameraOff,
  ArrowLeft,
  Calendar,
  MapPin,
  Eye,
  FileText,
  MoreVertical
} from 'lucide-react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import LazyWrapper from '../../components/ui/LazyWrapper';
import organizerApi from '../../services/organizerApi';
import '../../styles/qr-scanner.css';

const EOAttendance = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  const [scannerError, setScannerError] = useState(null);
  const [manualInputActive, setManualInputActive] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventSortBy, setEventSortBy] = useState('tanggal');
  const [participantSortBy, setParticipantSortBy] = useState('nama');
  
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const isProcessingScanRef = useRef(false);

  // Scoped logger for scanner (disabled to reduce noise)
  const SHOW_SCANNER_LOG = false;
  const slog = (...args) => {
    if (SHOW_SCANNER_LOG && import.meta?.env?.DEV) console.log(...args);
  };

  // Stable dependencies for LazyWrapper
  const participantsDependencies = useMemo(() => {
    return [selectedEvent?.id || null];
  }, [selectedEvent?.id]);

  // Stop scanner
  const stopScanner = useCallback(() => {
    try {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current = null;
          setScannerActive(false);
          setScannerLoading(false);
          setScannerError(null);
        }).catch(err => {
          slog('Failed to stop scanner:', err);
          html5QrCodeRef.current = null;
          setScannerActive(false);
          setScannerLoading(false);
          setScannerError(null);
        });
      } else {
        setScannerActive(false);
        setScannerLoading(false);
        setScannerError(null);
      }
    } catch (error) {
      slog('Error stopping scanner:', error);
      html5QrCodeRef.current = null;
      setScannerActive(false);
      setScannerLoading(false);
      setScannerError(null);
    }
  }, []);

  // Initialize QR Scanner
  const initializeScanner = useCallback(async () => {
    slog('[Scanner] initializeScanner called');
    slog('[Scanner] scannerRef.current:', scannerRef.current);
    slog('[Scanner] html5QrCodeRef.current:', html5QrCodeRef.current);
    
    if (!scannerRef.current) {
      slog('[Scanner] ERROR: scannerRef.current is null!');
      setScannerError('Scanner element tidak ditemukan. Refresh halaman dan coba lagi.');
      setScannerLoading(false);
      return;
    }
    
    if (html5QrCodeRef.current) {
      slog('[Scanner] WARNING: html5QrCodeRef already exists, clearing first...');
      stopScanner();
      return;
    }
    
    try {
      slog('[Scanner] Initializing...');
      setScannerLoading(true);
      setScannerError(null);

      slog('[Scanner] Checking browser support...');
      slog('[Scanner] navigator.mediaDevices:', navigator.mediaDevices);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        slog('[Scanner] MediaDevices not supported');
        setScannerError('Browser tidak mendukung akses kamera. Gunakan Input Manual.');
        setScannerLoading(false);
        return;
      }

      slog('[Scanner] Browser supported, requesting camera permission...');
      
      try {
        const permissionTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Permission timeout')), 10000)
        );
        
        const cameraPermission = navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        const stream = await Promise.race([cameraPermission, permissionTimeout]);
        
        slog('[Scanner] Camera permission granted');
        
        stream.getTracks().forEach(track => track.stop());
        
      } catch (permError) {
        slog('[Scanner] Permission error:', permError);
        
        if (permError.name === 'NotAllowedError') {
          setScannerError('Akses kamera ditolak. Klik ikon kamera di address bar dan izinkan akses.');
        } else if (permError.name === 'NotFoundError') {
          setScannerError('Kamera tidak ditemukan. Pastikan kamera terhubung.');
        } else if (permError.message === 'Permission timeout') {
          setScannerError('Timeout menunggu izin kamera. Refresh halaman dan coba lagi.');
        } else {
          setScannerError('Tidak dapat mengakses kamera. Gunakan Input Manual.');
        }
        setScannerLoading(false);
        return;
      }

      slog('[Scanner] Starting camera with Html5Qrcode (direct mode)...');

      const scannerElement = document.getElementById('qr-scanner');
      if (scannerElement) {
        scannerElement.innerHTML = '';
      }

      // Use Html5Qrcode directly instead of Scanner wrapper
      const html5QrCode = new Html5Qrcode("qr-scanner");
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // Prevent multiple rapid scans
          if (isProcessingScanRef.current) return;
          isProcessingScanRef.current = true;
          try {
            await markAttendance(decodedText);
            stopScanner();
          } catch (err) {
            slog('[Scanner] Error on decode:', err);
          } finally {
            isProcessingScanRef.current = false;
          }
        },
        (errorMessage) => {
          // Ignore scanning errors
        }
      ).then(() => {
        slog('[Scanner] ✓ Camera started!');
        setScannerLoading(false);
      }).catch(err => {
        slog('[Scanner] Start failed:', err);
        setScannerError('Gagal memulai kamera: ' + err);
        setScannerLoading(false);
      });

    } catch (error) {
      slog('[Scanner] Initialization error:', error);
      setScannerError('Gagal memuat scanner: ' + error.message);
      setScannerLoading(false);
    }
  }, [stopScanner]);

  // Cleanup scanner on component unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
      }
    };
  }, []);

  // Initialize scanner when scannerActive becomes true
  useEffect(() => {
    slog('[Scanner] useEffect triggered, scannerActive:', scannerActive);
    slog('[Scanner] useEffect scannerRef.current:', scannerRef.current);
    
    if (scannerActive && !html5QrCodeRef.current) {
      // Wait for DOM to render with multiple retries
      let retries = 0;
      const maxRetries = 10;
      
      const checkAndInitialize = () => {
        slog(`[Scanner] Retry ${retries + 1}/${maxRetries}, scannerRef.current:`, scannerRef.current);
        
        if (scannerRef.current) {
          slog('[Scanner] scannerRef is ready! Initializing...');
          initializeScanner();
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(checkAndInitialize, 100); // Check every 100ms
        } else {
          slog('[Scanner] scannerRef still null after', maxRetries, 'retries');
          setScannerError('Scanner element tidak dapat dimuat. Refresh halaman dan coba lagi.');
          setScannerLoading(false);
        }
      };
      
      // Start checking after a small delay
      const initTimer = setTimeout(checkAndInitialize, 50);
      
      // Fallback timeout
      const fallbackTimer = setTimeout(() => {
        slog('[Scanner] Fallback timeout checking...');
        if (scannerLoading) {
          slog('[Scanner] STUCK! Forcing error state');
          setScannerLoading(false);
          setScannerError('Scanner gagal dimuat setelah 12 detik. Silakan gunakan Input Manual atau refresh halaman.');
        }
      }, 12000);
      
      return () => {
        clearTimeout(initTimer);
        clearTimeout(fallbackTimer);
      };
    }
  }, [scannerActive, initializeScanner, scannerLoading]);

  // Fetch events function for LazyWrapper
  const fetchEvents = async () => {
    try {
      const response = await organizerApi.getEvents();
      if (response.data && response.data.success) {
        const eventsData = response.data.data?.events || [];
        return Array.isArray(eventsData) ? eventsData : [];
      }
      throw new Error('API response not successful');
    } catch (error) {
      console.error('⚠️ Events API failed:', error.message);
      if (error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Gagal memuat daftar event');
      }
      return [];
    }
  };

  // Fetch participants function for LazyWrapper
  const fetchParticipants = useCallback(async () => {
    if (!selectedEvent) {
      return [];
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/organizer/events/${selectedEvent.id}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const participantsData = data.data || data;
        
        // Transform data to ensure consistent structure
        const transformedData = participantsData.map(participant => ({
          id: participant.id,
          nama_lengkap: participant.User?.nama || participant.User?.nama_lengkap || 'Unknown User',
          email: participant.User?.email || 'No email',
          no_handphone: participant.User?.no_handphone || 'No phone',
          status: participant.status || 'pending',
          createdAt: participant.createdAt,
          attended_at: participant.attended_at,
          attendance_token: participant.attendance_token
        }));
        
        return transformedData;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch participants');
      }
    } catch (error) {
      console.error('⚠️ Participants API failed:', error.message);
      if (error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Gagal memuat daftar peserta');
      }
      return [];
    }
  }, [selectedEvent]);

  // Function untuk menentukan status realtime event
  const getEventRealTimeStatus = (event) => {
    if (!event || !event.tanggal) {
      return 'unknown';
    }

    const now = new Date();
    const eventDate = new Date(event.tanggal);
    
    if (!event.waktu_mulai || !event.waktu_selesai) {
      const eventEndOfDay = new Date(eventDate);
      eventEndOfDay.setHours(23, 59, 59, 999);
      
      if (now > eventEndOfDay) {
        return 'completed';
      } else if (now.toDateString() === eventDate.toDateString()) {
        return 'ongoing';
      } else {
        return 'upcoming';
      }
    }
    
    const [startHour, startMinute] = event.waktu_mulai.split(':').map(Number);
    const [endHour, endMinute] = event.waktu_selesai.split(':').map(Number);
    
    const eventStart = new Date(eventDate);
    eventStart.setHours(startHour, startMinute, 0, 0);
    
    const eventEnd = new Date(eventDate);
    eventEnd.setHours(endHour, endMinute, 0, 0);
    
    if (eventEnd < eventStart) {
      eventEnd.setDate(eventEnd.getDate() + 1);
    }
    
    if (now < eventStart) {
      return 'upcoming';
    } else if (now >= eventStart && now <= eventEnd) {
      return 'ongoing';
    } else {
      return 'completed';
    }
  };

  // Function untuk mendapatkan display status dengan warna
  const getEventStatusDisplay = (event) => {
    if (event.status_event === 'draft') {
      return { 
        text: 'Draft', 
        color: 'bg-yellow-100 text-yellow-800',
        realTimeStatus: 'draft'
      };
    }
    
    if (event.status_event === 'cancelled') {
      return { 
        text: 'Dibatalkan', 
        color: 'bg-red-100 text-red-800',
        realTimeStatus: 'cancelled'
      };
    }
    
    const realTimeStatus = getEventRealTimeStatus(event);
    
    switch (realTimeStatus) {
      case 'ongoing':
        return { 
          text: 'Berlangsung', 
          color: 'bg-blue-100 text-blue-800',
          realTimeStatus: 'ongoing'
        };
      case 'completed':
        return { 
          text: 'Selesai', 
          color: 'bg-gray-100 text-gray-800',
          realTimeStatus: 'completed'
        };
      case 'upcoming':
        return { 
          text: 'Akan Datang', 
          color: 'bg-green-100 text-green-800',
          realTimeStatus: 'upcoming'
        };
      default:
        return { 
          text: 'Aktif', 
          color: 'bg-green-100 text-green-800',
          realTimeStatus: 'active'
        };
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Sort events function
  const sortEvents = (events, sortBy) => {
    if (!events || !Array.isArray(events)) return [];
    
    return [...events].sort((a, b) => {
      switch (sortBy) {
        case 'tanggal':
          return new Date(b.tanggal) - new Date(a.tanggal);
        case 'nama':
          return a.judul.localeCompare(b.judul);
        case 'peserta':
          return (b.registeredCount || 0) - (a.registeredCount || 0);
        case 'status':
          return a.status_event.localeCompare(b.status_event);
        default:
          return 0;
      }
    });
  };

  // Handle event selection
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Handle back to event list
  const handleBackToEvents = () => {
    setSelectedEvent(null);
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Toggle scanner
  const toggleScanner = () => {
    if (scannerActive) {
      slog('[Scanner] User clicked stop scanner');
      stopScanner();
    } else {
      slog('[Scanner] User clicked start scanner');
      // Close manual input if open
      setManualInputActive(false);
      setScannerLoading(true);
      setScannerActive(true); // This will trigger useEffect to initialize
      
      slog('[Scanner] Set scannerActive to true, useEffect will handle initialization');
    }
  };

  // Toggle manual input
  const toggleManualInput = () => {
    if (manualInputActive) {
      setManualInputActive(false);
      setManualToken('');
    } else {
      // Close scanner if open
      if (scannerActive) {
        stopScanner();
      }
      setManualInputActive(true);
    }
  };

  // Handle manual token submission
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualToken.trim()) {
      toast.error('Masukkan kode kehadiran terlebih dahulu');
      return;
    }

    try {
      await markAttendance(manualToken.trim());
      setManualToken('');
      setManualInputActive(false);
    } catch (error) {
      slog('Manual attendance error:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const markAttendance = async (attendanceToken) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/organizer/attendance/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          attendance_token: attendanceToken,
          event_id: selectedEvent.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Kehadiran ${data.participant.User.nama} berhasil dicatat!`);
        // Refresh participants list
        fetchEventParticipants(selectedEvent.id);
      } else {
        toast.error(data.message || 'Gagal mencatat kehadiran');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Terjadi kesalahan saat mencatat kehadiran');
    }
  };

  const exportToExcel = () => {
    if (!selectedEvent || participants.length === 0) {
      toast.warning('Tidak ada data untuk diekspor');
      return;
    }

    const exportData = participants.map((participant, index) => ({
      'No': index + 1,
      'Nama': participant.User?.nama || '-',
      'Email': participant.User?.email || '-',
      'Status': participant.status === 'attended' ? 'Hadir' : 
                participant.status === 'confirmed' ? 'Terdaftar' : 'Dibatalkan',
      'Tanggal Daftar': new Date(participant.createdAt).toLocaleDateString('id-ID'),
      'Waktu Kehadiran': participant.attended_at ? 
        new Date(participant.attended_at).toLocaleString('id-ID') : '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kehadiran');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(data, `Kehadiran_${selectedEvent.judul}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data berhasil diekspor ke Excel');
  };

  const exportToCSV = () => {
    if (!selectedEvent || participants.length === 0) {
      toast.warning('Tidak ada data untuk diekspor');
      return;
    }

    const csvData = participants.map((participant, index) => [
      index + 1,
      participant.User?.nama || '-',
      participant.User?.email || '-',
      participant.status === 'attended' ? 'Hadir' : 
      participant.status === 'confirmed' ? 'Terdaftar' : 'Dibatalkan',
      new Date(participant.createdAt).toLocaleDateString('id-ID'),
      participant.attended_at ? new Date(participant.attended_at).toLocaleString('id-ID') : '-'
    ]);

    const csvContent = [
      ['No', 'Nama', 'Email', 'Status', 'Tanggal Daftar', 'Waktu Kehadiran'],
      ...csvData
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Kehadiran_${selectedEvent.judul}_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Data berhasil diekspor ke CSV');
  };

  const getStatusBadge = (status) => {
    const badges = {
      attended: 'bg-green-100 text-green-800 border-green-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      attended: 'Hadir',
      confirmed: 'Terdaftar',
      cancelled: 'Dibatalkan'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Event Selection View
  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Kehadiran</h1>
                <p className="text-sm text-gray-600">Pilih event untuk mengelola kehadiran peserta</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LazyWrapper
            fetchFunction={fetchEvents}
            SkeletonComponent={() => (
              <div className="space-y-8">
                {/* Stats & Sorting Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Events List Skeleton */}
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0 mr-4">
                              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            delay={400}
          >
            {(events) => (
              <div className="space-y-8">
                {/* Stats & Sorting */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Total Event Anda</h2>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{events?.length || 0}</p>
                      </div>
                      <FileText className="w-12 h-12 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urutkan Event
                        </label>
                        <select
                          value={eventSortBy}
                          onChange={(e) => setEventSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="tanggal">Tanggal Terbaru</option>
                          <option value="nama">Nama A-Z</option>
                          <option value="peserta">Jumlah Peserta</option>
                          <option value="status">Status</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Events Grid */}
                {!events || events.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Event</h3>
                    <p className="text-gray-600">Buat event pertama Anda untuk mulai mengelola kehadiran</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortEvents(events, eventSortBy)?.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleEventSelect(event)}
                        className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0 mr-4">
                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                  {event.judul}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 capitalize">{event.kategori}</p>
                              </div>
                              {(() => {
                                const statusDisplay = getEventStatusDisplay(event);
                                return (
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusDisplay.color}`}>
                                    {statusDisplay.text}
                                  </span>
                                );
                              })()}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{formatDate(event.tanggal)}</span>
                              </div>
                              
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{event.lokasi}</span>
                              </div>

                              <div className="flex items-center text-sm text-gray-600">
                                <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="font-medium text-blue-600">{event.registeredCount || 0} Peserta</span>
                              </div>

                              <div className="flex items-center text-sm text-gray-600">
                                <UserCheck className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="text-green-600 font-medium">Kelola Kehadiran</span>
                              </div>
                            </div>
                          </div>

                          <div className="ml-6 flex items-center">
                            <Eye className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </LazyWrapper>
        </div>
      </div>
    );
  }

  // Attendance Management View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBackToEvents}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kehadiran: {selectedEvent.judul}</h1>
                <p className="text-sm text-gray-600">Kelola kehadiran peserta event ini</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleScanner}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                  scannerActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {scannerActive ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                {scannerActive ? 'Tutup Scanner' : 'Scanner QR'}
              </button>
              <button
                onClick={toggleManualInput}
                className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                  manualInputActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                {manualInputActive ? 'Tutup Input' : 'Input Manual'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LazyWrapper
          fetchFunction={fetchParticipants}
          dependencies={participantsDependencies}
          SkeletonComponent={() => (
            <div className="space-y-8">
              {/* Scanner/Manual Input Skeleton */}
              {(scannerActive || manualInputActive) && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="max-w-md mx-auto">
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              )}

              {/* Stats Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters Skeleton */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                </div>
              </div>

              {/* Table Skeleton */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b">
                  <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-8 h-4 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-32 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          delay={500}
        >
          {(participants) => {
            // Filter participants berdasarkan search dan status
            let filteredParticipants = participants || [];

            if (searchTerm) {
              filteredParticipants = filteredParticipants.filter(p => 
                p.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.email?.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }

            if (statusFilter !== 'all') {
              filteredParticipants = filteredParticipants.filter(p => p.status === statusFilter);
            }

            // Calculate stats
            const stats = {
              total: participants?.length || 0,
              attended: participants?.filter(p => p.status === 'attended').length || 0,
              confirmed: participants?.filter(p => p.status === 'confirmed').length || 0,
              cancelled: participants?.filter(p => p.status === 'cancelled').length || 0
            };

            // Check HTTPS for warning
            const isHttps = window.location.protocol === 'https:';
            const isLocalhost = window.location.hostname === 'localhost' || 
                               window.location.hostname === '127.0.0.1';
            const showHttpsWarning = !isHttps && !isLocalhost;

            return (
              <>
                {/* HTTPS Warning */}
                {showHttpsWarning && !scannerActive && (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-yellow-900 mb-2">
                          ⚠️ Scanner QR Tidak Akan Berfungsi di HTTP
                        </h3>
                        <p className="text-xs text-yellow-700 mb-2">
                          Browser memblokir akses kamera di website HTTP karena alasan keamanan.
                        </p>
                        <div className="bg-white rounded border border-yellow-200 p-2 mt-2">
                          <p className="text-xs font-medium text-yellow-900 mb-1">💡 Solusi:</p>
                          <ul className="text-xs text-yellow-700 space-y-1 ml-3">
                            <li>• <strong>Untuk development:</strong> Akses via <code className="bg-yellow-100 px-1 rounded">http://localhost:3001</code> (bukan IP address)</li>
                            <li>• <strong>Untuk production:</strong> Deploy ke hosting dengan HTTPS (Netlify/Vercel/Cloudflare Pages - gratis!)</li>
                            <li>• <strong>Sementara ini:</strong> Gunakan tombol <strong>"Input Manual"</strong> di atas</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* QR Scanner - Versi Simpel */}
                {scannerActive && (
                  <div className="bg-white rounded-lg border p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Scanner QR</h2>
                      <button
                        onClick={stopScanner}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                      >
                        Tutup
                      </button>
                    </div>
                    
                    <div className="max-w-md mx-auto">
                      {/* Scanner Container - Always rendered for ref */}
                      <div className="relative min-h-[300px]">
                        {/* Scanner Element - Always rendered and visible */}
                        <div 
                          id="qr-scanner" 
                          ref={scannerRef}
                          className="border rounded min-h-[300px]"
                        ></div>

                        {/* Loading Overlay - on top */}
                        {scannerLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded z-20">
                            <div className="text-center max-w-xs">
                              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                              <p className="text-gray-600 mb-1">Memuat scanner...</p>
                              <p className="text-xs text-gray-500 mb-3">
                                Jika muncul popup, klik "Izinkan" untuk akses kamera
                              </p>
                              <button
                                onClick={() => {
                                  console.log('[Scanner] User cancelled loading');
                                  setScannerLoading(false);
                                  setManualInputActive(true);
                                  stopScanner();
                                }}
                                className="mt-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                              >
                                Gunakan Input Manual
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Error Overlay - on top */}
                        {scannerError && (
                          <div className="absolute inset-0 bg-gray-50 bg-opacity-95 rounded flex items-center justify-center p-4 z-20">
                            <div className="text-center">
                              <p className="text-gray-700 mb-3">{scannerError}</p>
                              <div className="space-x-2">
                                <button
                                  onClick={() => {
                                    setScannerError(null);
                                    setScannerLoading(true);
                                    initializeScanner();
                                  }}
                                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                                >
                                  Coba Lagi
                                </button>
                                <button
                                  onClick={() => {
                                    stopScanner();
                                    setManualInputActive(true);
                                  }}
                                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm"
                                >
                                  Input Manual
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Instructions - Simpel */}
                      {!scannerLoading && !scannerError && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-600">
                            Arahkan kamera ke QR code peserta
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Event: {selectedEvent.judul}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Manual Input - Versi Simpel */}
                {manualInputActive && (
                  <div className="bg-white rounded-lg border p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Input Manual</h2>
                      <button
                        onClick={toggleManualInput}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                      >
                        Tutup
                      </button>
                    </div>
                    <div className="max-w-md mx-auto">
                      <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="manualToken" className="block text-sm text-gray-700 mb-2">
                            Kode Kehadiran (10 digit)
                          </label>
                          <input
                            type="text"
                            id="manualToken"
                            value={manualToken}
                            onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                            placeholder="ABC1234567"
                            className="w-full px-3 py-2 border rounded text-center font-mono tracking-wider"
                            maxLength={10}
                            autoComplete="off"
                            autoFocus
                          />
                        </div>
                        
                        <button
                          type="submit"
                          disabled={!manualToken.trim() || manualToken.length < 10}
                          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded"
                        >
                          {manualToken.length < 10 ? `${10 - manualToken.length} digit lagi` : 'Catat Kehadiran'}
                        </button>
                      </form>
                      
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                          Event: {selectedEvent.judul}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Kode tertera di e-ticket peserta
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Peserta</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Hadir</p>
                        <p className="text-2xl font-bold text-green-600">{stats.attended}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Terdaftar</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Dibatalkan</p>
                        <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                      </div>
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      >
                        <option value="all">Semua Status</option>
                        <option value="attended">Hadir</option>
                        <option value="confirmed">Terdaftar</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const csvContent = [
                            ['No', 'Nama', 'Email', 'Status', 'Tanggal Daftar', 'Waktu Kehadiran'],
                            ...(filteredParticipants || []).map((participant, index) => [
                              index + 1,
                              participant.nama_lengkap || '-',
                              participant.email || '-',
                              participant.status === 'attended' ? 'Hadir' : 
                              participant.status === 'confirmed' ? 'Terdaftar' : 'Dibatalkan',
                              new Date(participant.createdAt).toLocaleDateString('id-ID'),
                              participant.attended_at ? 
                                new Date(participant.attended_at).toLocaleString('id-ID') : '-'
                            ])
                          ].map(row => row.join(',')).join('\n');

                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Kehadiran_${selectedEvent.judul}_${new Date().toISOString().split('T')[0]}.csv`;
                          a.click();
                          toast.success('Data berhasil diekspor ke CSV');
                        }}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </button>
                      <button
                        onClick={exportToExcel}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Export Excel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Participants Table */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Daftar Peserta - {selectedEvent.judul}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredParticipants.length} dari {participants?.length || 0} peserta
                    </p>
                  </div>
                  
                  {filteredParticipants.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada peserta</h3>
                      <p className="text-gray-600">
                        {participants?.length === 0 
                          ? 'Belum ada peserta yang mendaftar untuk event ini'
                          : 'Tidak ada peserta yang sesuai dengan filter yang dipilih'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              No
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Peserta
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal Daftar
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Waktu Kehadiran
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredParticipants.map((participant, index) => (
                            <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-sm font-medium text-gray-600">
                                      {(participant.nama_lengkap || 'U').charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {participant.nama_lengkap || 'Unknown User'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {participant.email || 'No email'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(participant.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(participant.createdAt).toLocaleDateString('id-ID')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {participant.attended_at 
                                  ? new Date(participant.attended_at).toLocaleString('id-ID')
                                  : '-'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            );
          }}
        </LazyWrapper>
      </div>
    </div>
  );
};

export default EOAttendance;
