import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Download, 
  FileSpreadsheet,
  Activity,
  Clock,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AdminDashboard = () => {
  const [monthlyEventsData, setMonthlyEventsData] = useState([]);
  const [monthlyParticipantsData, setMonthlyParticipantsData] = useState([]);
  const [topEventsData, setTopEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    activeEvents: 0,
    completedEvents: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use admin token instead of regular token
      const adminToken = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${adminToken}`
      };
      
      // Fetch monthly events statistics
      const response = await fetch(`http://localhost:3000/admin/statistics/monthly-events`, { headers });
      const eventsData = await response.json();
      
      // Fetch monthly participants statistics
      const response2 = await fetch(`http://localhost:3000/admin/statistics/monthly-participants`, { headers });
      const participantsData = await response2.json();
      
      // Fetch top 10 events by participants
      const response3 = await fetch(`http://localhost:3000/admin/statistics/top-events`, { headers });
      const topEvents = await response3.json();
      
      // Fetch general statistics
      const statsResponse = await fetch('http://localhost:3000/admin/statistics/overview', { headers });
      const statsData = await statsResponse.json();

      if (eventsData.success) setMonthlyEventsData(eventsData.data || []);
      if (participantsData.success) setMonthlyParticipantsData(participantsData.data || []);
      if (topEvents.success) setTopEventsData(topEvents.data || []);
      if (statsData.success) setStats(statsData.data || stats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for development
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const mockMonthlyEvents = months.map(month => ({
      month,
      events: Math.floor(Math.random() * 15) + 5
    }));
    
    const mockMonthlyParticipants = months.map(month => ({
      month,
      participants: Math.floor(Math.random() * 500) + 100
    }));
    
    const mockTopEvents = [
      { name: 'Workshop Web Development', participants: 250 },
      { name: 'Seminar Digital Marketing', participants: 230 },
      { name: 'Training UI/UX Design', participants: 210 },
      { name: 'Bootcamp Data Science', participants: 195 },
      { name: 'Conference Tech Innovation', participants: 180 },
      { name: 'Workshop Mobile App', participants: 165 },
      { name: 'Seminar Cybersecurity', participants: 150 },
      { name: 'Training Cloud Computing', participants: 135 },
      { name: 'Workshop AI & ML', participants: 120 },
      { name: 'Seminar Blockchain', participants: 105 }
    ];
    
    setMonthlyEventsData(mockMonthlyEvents);
    setMonthlyParticipantsData(mockMonthlyParticipants);
    setTopEventsData(mockTopEvents);
    setStats({
      totalEvents: 145,
      totalParticipants: 2850,
      activeEvents: 12,
      completedEvents: 133
    });
  };

  const exportToExcel = async (type) => {
    try {
      let data = [];
      let filename = '';
      
      switch (type) {
        case 'monthly-events':
          data = monthlyEventsData;
          filename = 'monthly-events-statistics.xlsx';
          break;
        case 'monthly-participants':
          data = monthlyParticipantsData;
          filename = 'monthly-participants-statistics.xlsx';
          break;
        case 'top-events':
          data = topEventsData;
          filename = 'top-events-statistics.xlsx';
          break;
        case 'all-participants':
          // Fetch all participants data
          const response = await fetch('http://localhost:3000/admin/statistics/overview', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
          });
          const result = await response.json();
          data = result.participants || [];
          filename = 'all-participants-data.xlsx';
          break;
        default:
          return;
      }
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, filename);
      
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Gagal mengekspor data. Silakan coba lagi.');
    }
  };

  const exportToCSV = (type) => {
    try {
      let data = [];
      let filename = '';
      
      switch (type) {
        case 'monthly-events':
          data = monthlyEventsData;
          filename = 'monthly-events-statistics.csv';
          break;
        case 'monthly-participants':
          data = monthlyParticipantsData;
          filename = 'monthly-participants-statistics.csv';
          break;
        case 'top-events':
          data = topEventsData;
          filename = 'top-events-statistics.csv';
          break;
        default:
          return;
      }
      
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, filename);
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Gagal mengekspor data CSV. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Kelola dan pantau statistik event sekolah</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Event</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Peserta</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Event Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Event Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedEvents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Events Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Event per Bulan</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportToExcel('monthly-events')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Export to Excel"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </button>
                <button
                  onClick={() => exportToCSV('monthly-events')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyEventsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#3B82F6" name="Jumlah Event" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Participants Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Peserta per Bulan</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportToExcel('monthly-participants')}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Export to Excel"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </button>
                <button
                  onClick={() => exportToCSV('monthly-participants')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyParticipantsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="participants" fill="#10B981" name="Jumlah Peserta" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 10 Events Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">10 Event Terpopuler</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => exportToExcel('top-events')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Export to Excel"
              >
                <FileSpreadsheet className="h-4 w-4" />
              </button>
              <button
                onClick={() => exportToCSV('top-events')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Export to CSV"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topEventsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="participants" fill="#8B5CF6" name="Jumlah Peserta" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Export All Data Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ekspor Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => exportToExcel('all-participants')}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Ekspor Semua Peserta (Excel)
            </button>
            
            <button
              onClick={() => exportToCSV('monthly-events')}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor Event Bulanan (CSV)
            </button>
            
            <button
              onClick={() => exportToCSV('monthly-participants')}
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor Peserta Bulanan (CSV)
            </button>
            
            <button
              onClick={() => exportToCSV('top-events')}
              className="flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Ekspor Top Events (CSV)
            </button>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Ketentuan Penting:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Pendaftaran event otomatis tertutup saat waktu event dimulai</li>
                <li>• Admin hanya dapat membuat event maksimal H-3 dari tanggal pelaksanaan</li>
                <li>• Data peserta yang ditampilkan adalah yang telah mengisi daftar hadir</li>
                <li>• Ekspor data tersedia dalam format Excel (.xlsx) dan CSV (.csv)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
