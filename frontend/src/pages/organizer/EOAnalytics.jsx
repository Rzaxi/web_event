import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Eye,
  DollarSign,
  Target,
  Award,
  UserCheck,
  FileText,
  Activity,
  Filter,
  ChevronDown,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import organizerApi from '../../services/organizerApi';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import LazyWrapper from '../../components/ui/LazyWrapper';
import { DashboardStatsSkeleton } from '../../components/ui/SkeletonLoader';

const EOAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedChart, setSelectedChart] = useState('growth');
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'all'
  const [chartType, setChartType] = useState('auto'); // 'auto', 'line', 'bar', 'area', 'pie'

  // Fetch analytics data function for LazyWrapper
  const fetchAnalyticsData = async () => {
    try {
      // Try to fetch from API first
      const response = await organizerApi.getAnalytics(timeRange);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      // If API fails, throw error to use fallback
      throw new Error('API response not successful');
      
    } catch (error) {
      console.error('⚠️ Analytics API failed:', error.message);
      
      // Show toast for 403 errors (authentication issues)
      if (error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Gagal memuat data analytics');
      }
      
      // Return empty data structure instead of mock
      return {
        monthlyEvents: [],
        growthTrend: [],
        performanceTrend: [],
        eventCategories: [],
        eventStatusData: [],
        topEvents: [],
        stats: {
          totalEvents: 0,
          totalParticipants: 0,
          totalRevenue: 0,
          avgParticipants: 0,
          completionRate: 0,
          attendanceRate: 0,
          growthRate: 0,
          satisfactionRate: 0,
          bestMonth: null,
          totalMonthsActive: 0,
          averageMonthlyRevenue: 0
        }
      };
    }
  };


  // Export analytics data
  const handleExport = async (format = 'csv') => {
    try {
      const response = await organizerApi.exportAnalytics(timeRange, format);
      
      if (response.data.success) {
        const { summary, events, exportedAt } = response.data.data;
        
        if (format === 'csv') {
          // Create CSV content
          const summaryCSV = Papa.unparse([summary]);
          const eventsCSV = Papa.unparse(events);
          
          const csvContent = `RINGKASAN ANALYTICS\n${summaryCSV}\n\nDETAIL EVENT\n${eventsCSV}\n\nDiekspor pada: ${new Date(exportedAt).toLocaleString('id-ID')}`;
          
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`);
        } else {
          // For Excel format, we'll use JSON and let user save as Excel
          const jsonContent = JSON.stringify({ summary, events, exportedAt }, null, 2);
          const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
          saveAs(blob, `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`);
        }
        
        toast.success(`Data analytics berhasil diekspor ke ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data analytics');
    }
  };



  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = 'blue' }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Chart configuration options
  const chartOptions = [
    {
      id: 'growth',
      title: 'Pertumbuhan Kumulatif',
      description: 'Perkembangan total event, peserta, dan revenue dari awal',
      icon: TrendingUp,
      type: 'line'
    },
    {
      id: 'performance',
      title: 'Performa Bulanan',
      description: 'Event dan peserta per bulan',
      icon: BarChartIcon,
      type: 'bar'
    },
    {
      id: 'attendance',
      title: 'Tren Kehadiran',
      description: 'Tingkat kehadiran per bulan',
      icon: UserCheck,
      type: 'line'
    },
    {
      id: 'revenue',
      title: 'Tren Pendapatan',
      description: 'Revenue bulanan dan kumulatif',
      icon: DollarSign,
      type: 'area'
    },
    {
      id: 'correlation',
      title: 'Peserta vs Revenue',
      description: 'Korelasi peserta dan pendapatan',
      icon: BarChart3,
      type: 'line'
    },
    {
      id: 'distribution',
      title: 'Distribusi Status & Kategori',
      description: 'Status event dan kategori event',
      icon: PieChartIcon,
      type: 'pie'
    }
  ];

  // Function to render selected chart with custom type
  const renderChart = (chartId, customType = 'auto', data = {}) => {
    const option = chartOptions.find(opt => opt.id === chartId);
    if (!option) return null;

    const Icon = option.icon;
    const effectiveType = customType === 'auto' ? option.type : customType;

    switch (chartId) {
      case 'growth':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description} - {effectiveType === 'line' ? 'Line Chart' : effectiveType === 'bar' ? 'Bar Chart' : effectiveType === 'area' ? 'Area Chart' : 'Line Chart'}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              {effectiveType === 'bar' ? (
                <BarChart data={data.growthTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => value.toLocaleString()} stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} stroke="#64748b" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Total Revenue') return [`Rp ${value.toLocaleString('id-ID')}`, name];
                      return [value.toLocaleString(), name];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="totalEvents" fill="#3b82f6" name="Total Event" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="totalParticipants" fill="#10b981" name="Total Peserta" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : effectiveType === 'area' ? (
                <AreaChart data={data.growthTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => value.toLocaleString()} stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} stroke="#64748b" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Total Revenue') return [`Rp ${value.toLocaleString('id-ID')}`, name];
                      return [value.toLocaleString(), name];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="totalEvents" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Area yAxisId="left" type="monotone" dataKey="totalParticipants" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              ) : (
                <LineChart data={data.growthTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => value.toLocaleString()} stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} stroke="#64748b" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Total Revenue') return [`Rp ${value.toLocaleString('id-ID')}`, name];
                      return [value.toLocaleString(), name];
                    }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="totalEvents" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} name="Total Event" />
                  <Line yAxisId="left" type="monotone" dataKey="totalParticipants" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} name="Total Peserta" />
                  <Line yAxisId="right" type="monotone" dataKey="totalRevenue" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} name="Total Revenue" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        );

      case 'performance':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description} - {effectiveType === 'line' ? 'Line Chart' : effectiveType === 'bar' ? 'Bar Chart' : effectiveType === 'area' ? 'Area Chart' : 'Bar Chart'}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              {effectiveType === 'line' ? (
                <LineChart data={data.monthlyEvents || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="displayName" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} name="Event" />
                  <Line type="monotone" dataKey="participants" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} name="Peserta" />
                </LineChart>
              ) : effectiveType === 'area' ? (
                <AreaChart data={data.monthlyEvents || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="displayName" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="events" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="participants" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              ) : (
                <BarChart data={data.monthlyEvents || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="displayName" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="events" fill="#3b82f6" name="Event" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="participants" fill="#10b981" name="Peserta" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description} - {effectiveType === 'line' ? 'Line Chart' : effectiveType === 'bar' ? 'Bar Chart' : effectiveType === 'area' ? 'Area Chart' : 'Line Chart'}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              {effectiveType === 'bar' ? (
                <BarChart data={data.performanceTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis domain={[0, 100]} stroke="#64748b" />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Tingkat Kehadiran']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="attendanceRate" fill="#8b5cf6" name="Kehadiran %" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : effectiveType === 'area' ? (
                <AreaChart data={data.performanceTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis domain={[0, 100]} stroke="#64748b" />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Tingkat Kehadiran']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area type="monotone" dataKey="attendanceRate" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </AreaChart>
              ) : (
                <LineChart data={data.performanceTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                  <YAxis domain={[0, 100]} stroke="#64748b" />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Tingkat Kehadiran']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="attendanceRate" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6' }} name="Kehadiran %" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        );

      case 'revenue':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <AreaChart data={data.performanceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                <YAxis tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} stroke="#64748b" />
                <Tooltip 
                  formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'correlation':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={data.performanceTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} stroke="#64748b" />
                <YAxis yAxisId="left" orientation="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`} stroke="#64748b" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'Revenue') return [`Rp ${value.toLocaleString('id-ID')}`, name];
                    return [value, name];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="participants" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} name="Peserta" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'distribution':
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Status Event</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.eventStatusData || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {(data.eventStatusData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#6b7280', '#f59e0b'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Kategori Event</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.eventCategories || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {(data.eventCategories || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-600">Analisis performa event dan peserta</p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Time Range */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="1month">1 Bulan</option>
                <option value="3months">3 Bulan</option>
                <option value="6months">6 Bulan</option>
                <option value="1year">1 Tahun</option>
              </select>

              {/* Export Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleExport('csv')}
                  className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4 mr-1" />
                  CSV
                </button>
                <button 
                  onClick={() => handleExport('json')}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LazyWrapper
          fetchFunction={fetchAnalyticsData}
          dependencies={[timeRange]}
          SkeletonComponent={() => (
            <div className="space-y-8">
              <DashboardStatsSkeleton />
              <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          delay={600}
        >
          {(data) => (
            <>
              {/* Analytics Overview */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ringkasan Analytics</h2>
                  <p className="text-gray-600 mt-1">Ringkasan performa event Anda dalam periode {timeRange}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Periode Aktif</div>
                  <div className="text-lg font-semibold text-gray-900">{data.stats?.totalMonthsActive || 0} Bulan</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{data.stats?.totalEvents || 0}</div>
                  <div className="text-sm font-medium text-gray-600">Total Event</div>
                  <div className="text-xs text-gray-500 mt-1">Diselenggarakan</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{data.stats?.totalParticipants || 0}</div>
                  <div className="text-sm font-medium text-gray-600">Total Peserta</div>
                  <div className="text-xs text-gray-500 mt-1">Terdaftar</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{data.stats?.avgParticipants || 0}</div>
                  <div className="text-sm font-medium text-gray-600">Rata-rata</div>
                  <div className="text-xs text-gray-500 mt-1">Peserta per event</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(data.stats?.totalRevenue || 0)}</div>
                  <div className="text-sm font-medium text-gray-600">Total Revenue</div>
                  <div className="text-xs text-gray-500 mt-1">Pendapatan kotor</div>
                </div>
              </div>
            </div>

            {/* Chart Visualization Section */}
            <div className="space-y-8">
              {viewMode === 'single' ? (
                // Single Chart Mode - Simple Controls
                <>
                  {/* Chart Controls */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Left: Chart Selector */}
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <select
                            value={selectedChart}
                            onChange={(e) => setSelectedChart(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10 min-w-[200px]"
                          >
                            {chartOptions.map(option => (
                              <option key={option.id} value={option.id}>{option.title}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Chart Type Selector */}
                        <div className="relative">
                          <select
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
                          >
                            <option value="auto">Auto</option>
                            <option value="line">Line Chart</option>
                            <option value="bar">Bar Chart</option>
                            <option value="area">Area Chart</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Right: View Mode Toggle */}
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('single')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'single' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Satu Chart
                        </button>
                        <button
                          onClick={() => setViewMode('all')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'all' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Semua Chart
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Chart Display */}
                  <div className="transition-all duration-500 ease-in-out">
                    {renderChart(selectedChart, chartType, data)}
                  </div>
                </>
              ) : (
                // All Charts Mode - Grid Layout
                <>
                  {/* All Charts Controls */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Left: Chart Type for All */}
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">Semua Visualisasi</h3>
                        <div className="relative">
                          <select
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
                          >
                            <option value="auto">Auto (Default)</option>
                            <option value="line">Semua Line Chart</option>
                            <option value="bar">Semua Bar Chart</option>
                            <option value="area">Semua Area Chart</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Right: View Mode Toggle */}
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('single')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'single' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Satu Chart
                        </button>
                        <button
                          onClick={() => setViewMode('all')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            viewMode === 'all' 
                              ? 'bg-white text-gray-900 shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Semua Chart
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    {chartOptions.map((option, index) => (
                      <div key={option.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        {renderChart(option.id, chartType, data)}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Key Performance Metrics */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Metrik Kinerja Utama</h3>
                <p className="text-sm text-gray-600">Indikator performa event organizer</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Completion Rate Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-green-700 bg-green-200 px-3 py-1 rounded-full">Penyelesaian</span>
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-green-900">
                        {data.stats?.completionRate || 0}%
                      </div>
                      <p className="text-sm text-green-700 font-medium">Event yang diselesaikan</p>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.stats?.completionRate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Rate Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-blue-700 bg-blue-200 px-3 py-1 rounded-full">Kehadiran</span>
                    </div>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-blue-900">
                        {data.stats?.attendanceRate || 0}%
                      </div>
                      <p className="text-sm text-blue-700 font-medium">Tingkat kehadiran rata-rata</p>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.stats?.attendanceRate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Growth Rate Card */}
                  <div className={`bg-gradient-to-br rounded-xl p-6 border ${
                    (data.stats?.growthRate || 0) >= 0 
                      ? 'from-purple-50 to-purple-100 border-purple-200' 
                      : 'from-red-50 to-red-100 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        (data.stats?.growthRate || 0) >= 0 ? 'bg-purple-500' : 'bg-red-500'
                      }`}>
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        (data.stats?.growthRate || 0) >= 0 
                          ? 'text-purple-700 bg-purple-200' 
                          : 'text-red-700 bg-red-200'
                      }`}>
                        Pertumbuhan
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className={`text-3xl font-bold ${
                        (data.stats?.growthRate || 0) >= 0 ? 'text-purple-900' : 'text-red-900'
                      }`}>
                        {data.stats?.growthRate > 0 ? '+' : ''}{data.stats?.growthRate || 0}%
                      </div>
                      <p className={`text-sm font-medium ${
                        (data.stats?.growthRate || 0) >= 0 ? 'text-purple-700' : 'text-red-700'
                      }`}>
                        Pertumbuhan periode ini
                      </p>
                      <p className={`text-xs ${
                        (data.stats?.growthRate || 0) >= 0 ? 'text-purple-600' : 'text-red-600'
                      }`}>
                        vs periode sebelumnya
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performing Events */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Event Terpopuler</h3>
                  <p className="text-sm text-gray-600">Event dengan peserta dan revenue tertinggi</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {(data.topEvents || []).map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 shadow-sm">
                            <span className="text-sm font-bold text-white">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{event.name}</h4>
                            <p className="text-sm text-gray-600">{event.participants} peserta terdaftar</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {event.revenue > 0 ? formatCurrency(event.revenue) : 'Gratis'}
                          </p>
                          <p className="text-xs text-gray-500">Total Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Smart Insights */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Smart Insights</h3>
                      <p className="text-sm text-gray-600">Rekomendasi berdasarkan data analytics</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Simplified insights without colors */}
                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Fokus Utama</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Tingkatkan engagement peserta dengan konten yang lebih interaktif dan follow-up yang konsisten.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Strategi Pertumbuhan</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Diversifikasi jenis event dan perluas target audience untuk meningkatkan partisipasi.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Optimasi Operasional</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Implementasikan sistem reminder otomatis dan feedback collection untuk meningkatkan kualitas event.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Peningkatan Kualitas</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Analisis feedback peserta dan tingkatkan kualitas materi serta fasilitas event.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </LazyWrapper>
      </div>
    </div>
  );
};

export default EOAnalytics;
