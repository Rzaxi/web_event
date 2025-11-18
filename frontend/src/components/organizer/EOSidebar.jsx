import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BarChart3, 
  UserCheck,
  Wallet,
  Settings,
  LogOut,
  ArrowLeft,
  X,
  Award
} from 'lucide-react';

const EOSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const navigation = [
    { name: 'Dashboard', href: '/organizer', icon: LayoutDashboard },
    { name: 'Event Saya', href: '/organizer/events', icon: Calendar },
    { name: 'Peserta', href: '/organizer/participants', icon: Users },
    { name: 'Analytics', href: '/organizer/analytics', icon: BarChart3 },
    { name: 'Attendance', href: '/organizer/attendance', icon: UserCheck },
    { name: 'Sertifikat', href: '/organizer/certificates', icon: Award },
    { name: 'Keuangan', href: '/organizer/finance', icon: Wallet },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleBackToUser = () => {
    navigate('/');
  };

  return (
    <div className={`${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
      
      {/* Sidebar header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">EO Mode</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* User info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user?.nama_lengkap?.charAt(0).toUpperCase() || user?.nama?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{user?.nama_lengkap || user?.nama}</p>
            <p className="text-xs text-gray-500">
              {user?.role === 'event_organizer_pro' ? 'Event Organizer Pro' : 'Event Organizer Basic'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/organizer' && location.pathname.startsWith(item.href));
          
          return (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.href);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={handleBackToUser}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Kembali ke User Mode
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default EOSidebar;
