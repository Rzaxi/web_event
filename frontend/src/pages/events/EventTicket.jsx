import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Download, Share2, ArrowLeft, User, Mail, Phone, Ticket, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const EventTicket = () => {
  const { id, registrationId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
<<<<<<< HEAD
  const [attendanceToken, setAttendanceToken] = useState(null);
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    fetchTicketData();
<<<<<<< HEAD
  }, [id, registrationId]);

  const fetchTicketData = async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');
      
      // Fetch event data and attendance token
      const [eventResponse, tokenResponse] = await Promise.all([
        eventsAPI.getById(id),
        fetch(`/api/events/${id}/attendance-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
=======
  }, [id, registrationId, user, navigate]);

  const fetchTicketData = async () => {
    try {
      const [eventResponse, registrationResponse] = await Promise.all([
        eventsAPI.getById(id),
        // Assuming we have an API to get registration details
        fetch(`/api/registrations/${registrationId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
          }
        }).then(res => res.json())
      ]);
      
      setEvent(eventResponse.data);
      
<<<<<<< HEAD
      if (tokenResponse.success) {
        setAttendanceToken(tokenResponse.attendance_token);
      }
      
      // Generate consistent nomor_faktur based on registrationId and eventId
      const consistentHash = btoa(`${registrationId}-${id}-${user.id}`).replace(/[^a-zA-Z0-9]/g, '').substr(0, 9);
      
      setRegistration({
=======
      // Generate consistent nomor_faktur based on registrationId and eventId
      const consistentHash = btoa(`${registrationId}-${id}-${user.id}`).replace(/[^a-zA-Z0-9]/g, '').substr(0, 9);
      
      setRegistration(registrationResponse.data || {
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        id: registrationId,
        nomor_faktur: `yp-${registrationId.replace(/[^0-9]/g, '').substr(-8)}-${consistentHash}`,
        tanggal_transaksi: '2025-10-22T08:28:00Z',
        status: 'Payment Success',
        jumlah: 1
      });
    } catch (error) {
      console.error('Error fetching ticket data:', error);
      
      // Generate consistent data for demo
      const consistentHash = btoa(`${registrationId}-${id}-${user.id}`).replace(/[^a-zA-Z0-9]/g, '').substr(0, 9);
      
      // Create mock data for demo
      setEvent({
        judul: 'PANGGUNG GEMBIRA 2025',
        tanggal: '2025-10-29',
        waktu: '08:28',
        lokasi: 'PONDOK PESANTREN DARUL AMANAH',
        biaya: 0
      });
      setRegistration({
        id: registrationId || 'demo',
        nomor_faktur: `yp-${registrationId ? registrationId.replace(/[^0-9]/g, '').substr(-8) : '17611377'}-${consistentHash}`,
        tanggal_transaksi: '2025-10-22T08:28:00Z',
        status: 'Payment Success',
        jumlah: 1
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRData = () => {
<<<<<<< HEAD
    // Use attendance token from database
    return attendanceToken || 'LOADING...';
  };

  const getAttendanceToken = () => {
    // Return attendance token from database or fallback
    return attendanceToken || 'LOADING...';
=======
    return JSON.stringify({
      eventId: id,
      registrationId: registration?.id,
      userId: user.id,
      nomorFaktur: registration?.nomor_faktur
    });
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
  };

  const handleDownloadTicket = () => {
    // Create a canvas to capture the ticket
    const ticketElement = document.getElementById('ticket-container');
    if (ticketElement) {
      // For now, just show a success message
      toast.success('Fitur download akan segera tersedia');
    }
  };

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `E-Ticket: ${event?.judul}`,
        text: `Saya akan menghadiri ${event?.judul}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link tiket berhasil disalin');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/profile/settings?tab=my-events')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Detail Transaksi</h1>
            <button
              onClick={handleDownloadTicket}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Lihat E-Tiket
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Clean Status Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaksi Berhasil</h1>
          <p className="text-gray-600">E-Tiket telah diterbitkan dan siap digunakan</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Event Information Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{event?.judul}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(event?.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })} • {event?.waktu} WIB
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event?.lokasi}</span>
                  </div>
                </div>
              </div>
              <div className="ml-6 text-right">
                <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                <p className="text-2xl font-bold text-gray-900">
                  {event?.biaya > 0 ? `Rp ${event.biaya.toLocaleString('id-ID')}` : 'GRATIS'}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details Section */}
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Detail Transaksi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nomor Transaksi</p>
                <p className="font-mono text-sm font-medium text-gray-900 break-all">{registration?.nomor_faktur}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="text-sm font-medium text-gray-900">{registration?.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tanggal</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(registration?.tanggal_transaksi).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Jumlah Tiket</p>
                <p className="text-sm font-medium text-gray-900">{registration?.jumlah} Tiket</p>
              </div>
            </div>
          </div>

          {/* Buyer Information Section */}
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Informasi Pembeli</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
                <p className="text-sm font-medium text-gray-900">{user.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-sm font-medium text-gray-900 break-all">{user.email}</p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code E-Tiket</h3>
              <p className="text-sm text-gray-600 mb-8">Tunjukkan QR code ini saat masuk ke lokasi event</p>
              
<<<<<<< HEAD
              <div className="inline-block p-6 bg-white border-2 border-gray-200 rounded-2xl mb-4">
=======
              <div className="inline-block p-6 bg-white border-2 border-gray-200 rounded-2xl mb-8">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                <QRCode
                  value={generateQRData()}
                  size={160}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
<<<<<<< HEAD

              {/* Attendance Code */}
              <div className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-sm mx-auto">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Kode Kehadiran</h4>
                  <div className="bg-white border border-blue-300 rounded-lg p-3">
                    <span className="text-2xl font-mono font-bold text-blue-900 tracking-widest">
                      {getAttendanceToken()}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Gunakan kode ini jika QR scanner bermasalah
                  </p>
                </div>
              </div>
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  onClick={handleDownloadTicket}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download E-Tiket
                </button>
                <button
                  onClick={handleShareTicket}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-xl text-left max-w-md mx-auto">
                <p className="text-xs text-gray-600">
<<<<<<< HEAD
                  <strong>Catatan:</strong> Simpan e-tiket ini dengan baik. Tunjukkan QR code atau berikan kode kehadiran kepada panitia untuk masuk ke lokasi event.
=======
                  <strong>Catatan:</strong> Simpan e-tiket ini dengan baik. QR code diperlukan untuk masuk ke lokasi event.
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTicket;
