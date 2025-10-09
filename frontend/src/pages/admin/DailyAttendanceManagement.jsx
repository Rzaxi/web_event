import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Save
} from 'lucide-react';
import { toast } from 'react-toastify';

const DailyAttendanceManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchAttendanceSummary(selectedEvent.id);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('/admin/events', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const certificateEvents = result.data?.events?.filter(event => 
          event.memberikan_sertifikat
        ) || [];
        setEvents(certificateEvents);
        
        if (certificateEvents.length > 0) {
          setSelectedEvent(certificateEvents[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Gagal mengambil data event');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceSummary = async (eventId) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`/admin/events/${eventId}/attendance-summary`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setAttendanceSummary(result.data);
      }
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
      toast.error('Gagal mengambil data kehadiran');
    }
  };

  const markAttendance = async (userId, status) => {
    if (!selectedDate || !selectedEvent) {
      toast.error('Pilih tanggal dan event terlebih dahulu');
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`/admin/events/${selectedEvent.id}/daily-attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          tanggalKehadiran: selectedDate,
          hariKe: selectedDay,
          status,
          notes: ''
        })
      });

      if (response.ok) {
        toast.success('Kehadiran berhasil dicatat');
        fetchAttendanceSummary(selectedEvent.id);
      } else {
        toast.error('Gagal mencatat kehadiran');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Terjadi kesalahan saat mencatat kehadiran');
    }
  };

  const issueCertificates = async () => {
    if (!selectedEvent) return;

    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch(`/admin/events/${selectedEvent.id}/issue-certificates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        fetchAttendanceSummary(selectedEvent.id);
      } else {
        toast.error('Gagal menerbitkan sertifikat');
      }
    } catch (error) {
      console.error('Error issuing certificates:', error);
      toast.error('Terjadi kesalahan saat menerbitkan sertifikat');
    }
  };

  const getAttendanceStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Hadir
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Terlambat
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Tidak Hadir
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            Belum Dicatat
          </span>
        );
    }
  };

  const filteredParticipants = attendanceSummary?.participants?.filter(participant =>
    participant.user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Kehadiran Harian</h1>
        <p className="text-gray-600">Kelola kehadiran harian peserta untuk eligibilitas sertifikat</p>
      </div>

      {/* Event Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pilih Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
            <select
              value={selectedEvent?.id || ''}
              onChange={(e) => {
                const event = events.find(ev => ev.id === parseInt(e.target.value));
                setSelectedEvent(event);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.judul} ({event.durasi_hari} hari, min. {event.minimum_kehadiran} hari)
                </option>
              ))}
            </select>
          </div>
          
          {selectedEvent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kehadiran</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: selectedEvent.durasi_hari }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Hari {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedEvent && attendanceSummary && (
        <>
          {/* Event Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{attendanceSummary.participants.length}</div>
                <div className="text-sm text-gray-600">Total Peserta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {attendanceSummary.participants.filter(p => p.isEligibleForCertificate).length}
                </div>
                <div className="text-sm text-gray-600">Eligible Sertifikat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{selectedEvent.durasi_hari}</div>
                <div className="text-sm text-gray-600">Durasi Hari</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedEvent.minimum_kehadiran}</div>
                <div className="text-sm text-gray-600">Min. Kehadiran</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Cari peserta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={issueCertificates}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Award className="h-4 w-4 mr-2" />
                Terbitkan Sertifikat
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peserta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress Kehadiran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Sertifikat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi Kehadiran
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParticipants.map((participant) => (
                    <tr key={participant.registration_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participant.user.nama_lengkap}
                          </div>
                          <div className="text-sm text-gray-500">
                            {participant.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <div className="text-sm font-medium text-gray-900">
                            {participant.presentDays} / {selectedEvent.minimum_kehadiran} hari hadir
                          </div>
                          <div className="flex space-x-1">
                            {Array.from({ length: selectedEvent.durasi_hari }, (_, i) => {
                              const dayAttendance = participant.attendances.find(att => att.hari_ke === i + 1);
                              return (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                    dayAttendance?.status === 'present' || dayAttendance?.status === 'late'
                                      ? 'bg-green-100 text-green-800'
                                      : dayAttendance?.status === 'absent'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {i + 1}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {participant.isEligibleForCertificate ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Award className="h-3 w-3 mr-1" />
                            Eligible
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Belum Eligible
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markAttendance(participant.user.id, 'present')}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            disabled={!selectedDate}
                          >
                            Hadir
                          </button>
                          <button
                            onClick={() => markAttendance(participant.user.id, 'late')}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                            disabled={!selectedDate}
                          >
                            Terlambat
                          </button>
                          <button
                            onClick={() => markAttendance(participant.user.id, 'absent')}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            disabled={!selectedDate}
                          >
                            Tidak Hadir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DailyAttendanceManagement;
