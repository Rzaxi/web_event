import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Users, 
  CheckCircle, 
  XCircle, 
  Download,
  FileText,
  Calendar,
  MapPin,
  AlertCircle,
  Loader,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import organizerApi from '../../services/organizerApi';

const CertificateManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [view, setView] = useState('events'); // 'events' or 'participants'

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await organizerApi.getCertificateEvents();
      
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Gagal memuat data event');
    } finally {
      setLoading(false);
    }
  };

  const loadParticipants = async (eventId) => {
    try {
      setLoading(true);
      const response = await organizerApi.getEventParticipantsForCertificate(eventId);
      
      if (response.data.success) {
        setParticipants(response.data.data.participants);
        setSummary(response.data.data.summary);
        setSelectedEvent(response.data.data.event);
        setView('participants');
      }
    } catch (error) {
      console.error('Error loading participants:', error);
      toast.error('Gagal memuat data peserta');
    } finally {
      setLoading(false);
    }
  };

  const generateSingleCertificate = async (userId) => {
    try {
      setGenerating(true);
      const response = await organizerApi.generateCertificate(selectedEvent.id, userId);
      
      if (response.data.success) {
        toast.success('Sertifikat berhasil digenerate!');
        // Reload participants to update status
        await loadParticipants(selectedEvent.id);
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error(error.response?.data?.message || 'Gagal generate sertifikat');
    } finally {
      setGenerating(false);
    }
  };

  const generateAllCertificates = async () => {
    if (!selectedEvent) return;
    
    try {
      setGenerating(true);
      const response = await organizerApi.bulkGenerateCertificates(selectedEvent.id);
      
      if (response.data.success) {
        toast.success('Semua sertifikat berhasil digenerate');
        loadParticipants(selectedEvent.id); // Reload data
      }
    } catch (error) {
      console.error('Error generating certificates:', error);
      toast.error('Gagal generate sertifikat');
    } finally {
      setGenerating(false);
    }
  };

  const debugCertificates = async () => {
    try {
      const response = await organizerApi.debugCertificates();
      console.log('Debug data:', response.data);
      toast.info('Debug data logged to console');
    } catch (error) {
      console.error('Debug error:', error);
      toast.error('Debug failed');
    }
  };

  const fixCertificateData = async () => {
    try {
      setLoading(true);
      const response = await organizerApi.fixCertificateData();
      
      if (response.data.success) {
        toast.success(response.data.message);
        loadEvents(); // Reload events to see updated counts
      }
    } catch (error) {
      console.error('Fix error:', error);
      toast.error('Failed to fix certificate data');
    } finally {
      setLoading(false);
    }
  };

  const bulkGenerateCertificates = async () => {
    try {
      setGenerating(true);
      const response = await organizerApi.bulkGenerateCertificates(selectedEvent.id);
      
      if (response.data.success) {
        const { generated, failed } = response.data.data;
        if (failed > 0) {
          toast.warning(`Generate selesai: ${generated} berhasil, ${failed} gagal`);
        } else {
          toast.success(`Berhasil generate ${generated} sertifikat!`);
        }
        // Reload participants to update status
        await loadParticipants(selectedEvent.id);
      }
    } catch (error) {
      console.error('Error bulk generating:', error);
      toast.error(error.response?.data?.message || 'Gagal bulk generate');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Events List View
  const EventsView = () => (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Sertifikat</h1>
        </div>
        <p className="text-gray-600">Kelola dan generate sertifikat untuk peserta event Anda</p>
        
        {/* Debug buttons */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={loadEvents}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 inline ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button
            onClick={debugCertificates}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Debug Data
          </button>
          <button
            onClick={fixCertificateData}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? 'Fixing...' : 'Fix Certificate Data'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">{events.length}</span>
          </div>
          <p className="text-blue-900 font-medium">Event dengan Sertifikat</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-green-600">
              {events.reduce((sum, e) => sum + parseInt(e.total_participants || 0), 0)}
            </span>
          </div>
          <p className="text-green-900 font-medium">Total Peserta</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-yellow-600" />
            <span className="text-3xl font-bold text-yellow-600">
              {events.reduce((sum, e) => sum + parseInt(e.total_issued || 0), 0)}
            </span>
          </div>
          <p className="text-yellow-900 font-medium">Sertifikat Diterbitkan</p>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Daftar Event</h2>
          <p className="text-gray-600 text-sm mt-1">Klik event untuk manage sertifikat</p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Event</h3>
            <p className="text-gray-600">Event yang memberikan sertifikat akan muncul di sini</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map((event) => {
              const totalParticipants = parseInt(event.total_participants || 0);
              const totalIssued = parseInt(event.total_issued || 0);
              const progress = totalParticipants > 0 ? (totalIssued / totalParticipants) * 100 : 0;

              return (
                <div
                  key={event.id}
                  onClick={() => loadParticipants(event.id)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.judul}</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(event.tanggal)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          {event.durasi_hari} hari
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          {totalParticipants} peserta
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Min {event.minimum_kehadiran} hari
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress Penerbitan</span>
                          <span className="font-semibold text-gray-900">
                            {totalIssued}/{totalParticipants} ({Math.round(progress)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="ml-6">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        progress === 100
                          ? 'bg-green-100 text-green-700'
                          : progress > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {progress === 100 ? 'Selesai' : progress > 0 ? 'Berlangsung' : 'Belum Mulai'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Participants View
  const ParticipantsView = () => (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => {
            setView('events');
            setSelectedEvent(null);
            setParticipants([]);
          }}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Event
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedEvent?.judul}</h1>
            <p className="text-gray-600">Kelola sertifikat peserta event ini</p>
          </div>
          
          {summary && summary.pending > 0 && (
            <button
              onClick={bulkGenerateCertificates}
              disabled={generating}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Award className="w-5 h-5 mr-2" />
                  Generate Semua ({summary.pending})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{summary.total}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Total Peserta</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{summary.eligible}</span>
            </div>
            <p className="text-sm text-green-700 mt-2">Eligible</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <Award className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{summary.issued}</span>
            </div>
            <p className="text-sm text-blue-700 mt-2">Sudah Diterbitkan</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{summary.pending}</span>
            </div>
            <p className="text-sm text-yellow-700 mt-2">Pending</p>
          </div>
        </div>
      )}

      {/* Participants Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Peserta</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Kehadiran</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{participant.nama}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{participant.email}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      participant.is_eligible
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {participant.attendance_count}/{selectedEvent?.durasi_hari}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {participant.certificate_issued ? (
                      <div className="inline-flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Sudah Terbit</span>
                      </div>
                    ) : participant.is_eligible ? (
                      <div className="inline-flex items-center text-yellow-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center text-red-600">
                        <XCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Tidak Eligible</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {participant.is_eligible && !participant.certificate_issued && (
                      <button
                        onClick={() => generateSingleCertificate(participant.user_id)}
                        disabled={generating}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {generating ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-1" />
                            Generate
                          </>
                        )}
                      </button>
                    )}
                    {participant.certificate_issued && (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {view === 'events' ? <EventsView /> : <ParticipantsView />}
      </div>
    </div>
  );
};

export default CertificateManagement;
