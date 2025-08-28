import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, Settings, Home } from 'lucide-react';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  const isSettingsPage = location.pathname === '/account-settings';

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
      ? 'bg-indigo-100 text-indigo-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
        <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center text-2xl font-bold">
          {user?.nama_lengkap?.charAt(0).toUpperCase() || user?.nama?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">{user?.nama_lengkap || user?.nama || 'User'}</h2>
          <p className="text-sm text-gray-500 truncate">{user?.email || 'No email'}</p>
        </div>
      </div>

      <nav className="space-y-2">
        <Link
          to="/"
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 mb-4 border-b border-gray-200 pb-4"
        >
          <Home size={18} className="mr-3" />
          Back to Home
        </Link>

        <NavLink to="/dashboard" end className={navLinkClass}>
          <LayoutDashboard size={18} className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink to="/my-events" className={navLinkClass}>
          <Calendar size={18} className="mr-3" />
          My Events
        </NavLink>
        <NavLink to="/profile" className={navLinkClass}>
          <User size={18} className="mr-3" />
          Profile
        </NavLink>
        <NavLink to="/account-settings" className={navLinkClass}>
          <Settings size={18} className="mr-3" />
          Settings
        </NavLink>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
