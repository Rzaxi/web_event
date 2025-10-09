 import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Calendar as CalendarIcon, Settings, Globe } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHomePage 
        ? 'bg-transparent' 
        : 'bg-black/20 backdrop-blur-md border-b border-white/10 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <RouterLink to="/" className="flex items-center space-x-3">
            <div className="p-2 transition-colors">
              <Globe className="w-6 h-6 text-white transition-colors" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white transition-colors">EventHub</h1>
              <p className="text-xs text-white/70 transition-colors">Discover Amazing Events</p>
            </div>
          </RouterLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <RouterLink 
              to="/" 
              className="font-medium text-white hover:text-white/80 transition-all duration-300 hover:scale-105"
            >
              Home
            </RouterLink>
            <RouterLink 
              to="/events" 
              className="font-medium text-white hover:text-white/80 transition-all duration-300 hover:scale-105"
            >
              Highlights
            </RouterLink>
            <RouterLink 
              to="/events" 
              className="font-medium text-white hover:text-white/80 transition-all duration-300 hover:scale-105"
            >
              Destinations
            </RouterLink>
            <RouterLink 
              to="/events" 
              className="font-medium text-white hover:text-white/80 transition-all duration-300 hover:scale-105"
            >
              Events
            </RouterLink>
            <RouterLink 
              to="/about" 
              className="font-medium text-white hover:text-white/80 transition-all duration-300 hover:scale-105"
            >
              Offers
            </RouterLink>
            <RouterLink 
              to="/contact" 
              className="font-medium text-white hover:text-white/80 transition-all duration-300 hover:scale-105"
            >
              Contacts
            </RouterLink>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="text-base font-medium text-white hover:text-white/80 transition-colors duration-200 flex items-center space-x-2"
                >
                  <User size={18} />
                  <span className="font-medium">{user.nama}</span>
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-800">{user.nama}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <RouterLink to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <Settings size={16} className="mr-3" /> Settings
                    </RouterLink>
                    <div className="my-2 border-t border-gray-100"></div>
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50">
                      <LogOut size={16} className="mr-3" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <RouterLink
                  to="/login"
                  className="font-medium text-white hover:text-white/80 transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="px-6 py-3 rounded-full font-medium text-white border border-white/30 hover:text-white/80 hover:border-white/50 transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </RouterLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-white/80 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <RouterLink to="/" className="font-medium text-white hover:text-white/80 transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Home</RouterLink>
              <RouterLink to="/events" className="font-medium text-white hover:text-white/80 transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Events</RouterLink>
              <RouterLink to="/about" className="font-medium text-white hover:text-white/80 transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>About</RouterLink>
              <RouterLink to="/contact" className="font-medium text-white hover:text-white/80 transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Contact</RouterLink>

              {user ? (
                <div className="pt-4 border-t border-white/20 space-y-3">
                  <div className="px-2">
                    <p className="font-bold text-white">{user.nama}</p>
                    <p className="text-sm text-white/70">{user.email}</p>
                  </div>
                  <RouterLink to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center px-2 py-2 text-white hover:text-white/80 font-medium transition-colors">
                    <Settings size={18} className="mr-3" /> Settings
                  </RouterLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-2 py-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut size={18} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/20 space-y-3">
                  <RouterLink 
                    to="/login"
                    className="block text-white hover:text-white/80 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </RouterLink>
                  <RouterLink
                    to="/register"
                    className="block bg-white/20 text-white px-6 py-2 rounded-full font-medium hover:bg-white/30 transition-colors text-center border border-white/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </RouterLink>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
