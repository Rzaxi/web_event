import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Calendar as CalendarIcon, Settings, Ticket, Briefcase } from 'lucide-react';
import NotificationBell from '../NotificationBell';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  // Check if current page should have white navbar
  const isWhiteNavPages = ['/events', '/about', '/contact', '/pricing', '/profile/settings'].includes(location.pathname) || 
    // For 404 pages and other non-home pages
    (location.pathname !== '/' && 
     !location.pathname.startsWith('/login') && 
     !location.pathname.startsWith('/register') && 
     !location.pathname.startsWith('/verify-email') && 
     !location.pathname.startsWith('/forgot-password') && 
     !location.pathname.startsWith('/reset-password') && 
     !location.pathname.startsWith('/admin') && 
     !location.pathname.match(/^\/events\/\d+/));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('profile_popup_shown'); // Clear popup session flag
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
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isHomePage
        ? 'bg-transparent'
        : isWhiteNavPages
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg'
          : 'bg-black/20 backdrop-blur-md border-b border-white/10 shadow-lg'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <RouterLink to="/" className="flex items-center">
            <h1 className={`text-2xl font-bold transition-colors ${isWhiteNavPages ? 'text-gray-900' : 'text-white'
              }`}>Evoria</h1>
          </RouterLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <RouterLink
              to="/"
              className={`font-medium transition-all duration-300 hover:scale-105 ${location.pathname === '/'
                  ? isWhiteNavPages
                    ? 'text-indigo-600'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`}
            >
              Home
            </RouterLink>
            <RouterLink
              to="/events"
              className={`font-medium transition-all duration-300 hover:scale-105 ${location.pathname === '/events' || location.pathname.startsWith('/events/')
                  ? isWhiteNavPages
                    ? 'text-indigo-600'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`}
            >
              Events
            </RouterLink>
            <RouterLink
              to="/about"
              className={`font-medium transition-all duration-300 hover:scale-105 ${location.pathname === '/about'
                  ? isWhiteNavPages
                    ? 'text-indigo-600'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`}
            >
              About
            </RouterLink>
            <RouterLink
              to="/contact"
              className={`font-medium transition-all duration-300 hover:scale-105 ${location.pathname === '/contact'
                  ? isWhiteNavPages
                    ? 'text-indigo-600'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`}
            >
              Contact
            </RouterLink>
            <RouterLink
              to="/pricing"
              className={`font-medium transition-all duration-300 hover:scale-105 ${location.pathname === '/pricing'
                  ? isWhiteNavPages
                    ? 'text-indigo-600'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`}
            >
              Pricing
            </RouterLink>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notification Bell */}
                <NotificationBell isWhiteNavPages={isWhiteNavPages} />
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`text-base font-medium transition-colors duration-200 flex items-center space-x-2 ${isWhiteNavPages ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                    }`}
                >
                  <User size={20} />
                  <span className="font-medium">{user.nama}</span>
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-800">{user.nama}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                   
                    {/* Show EO Mode option only for event organizers */}
                    {(user.role?.includes('event_organizer_basic') || user.role?.includes('event_organizer_pro')) && (
                      <RouterLink 
                        to="/organizer" 
                        onClick={() => setIsProfileOpen(false)} 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <Briefcase size={16} className="mr-3" /> Switch to EO Mode
                      </RouterLink>
                    )}
                    
                    <RouterLink to="/profile/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <Settings size={16} className="mr-3" /> Settings
                    </RouterLink>
                    <div className="my-2 border-t border-gray-100"></div>
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50">
                      <LogOut size={16} className="mr-3" /> Logout
                    </button>
                  </div>
                )}
              </div>
              </>
            ) : (
              <>
                <RouterLink
                  to="/login"
                  className={`font-medium transition-all duration-300 hover:scale-105 ${isWhiteNavPages ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                    }`}
                >
                  Sign In
                </RouterLink>
                <RouterLink
                  to="/register"
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${isWhiteNavPages
                      ? 'text-white bg-gray-900 border border-gray-900 hover:bg-gray-800 hover:border-gray-800'
                      : 'text-white border border-white/30 hover:text-white/80 hover:border-white/50'
                    }`}
                >
                  Get Started
                </RouterLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 transition-colors ${isWhiteNavPages ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
              }`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t ${isWhiteNavPages ? 'border-gray-200/50' : 'border-white/20'
            }`}>
            <div className="flex flex-col space-y-4">
              <RouterLink to="/" className={`font-medium transition-all duration-300 cursor-pointer ${location.pathname === '/'
                  ? isWhiteNavPages
                    ? 'text-indigo-600 font-semibold'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`} onClick={() => setIsMenuOpen(false)}>
                Home
              </RouterLink>
              <RouterLink to="/events" className={`font-medium transition-all duration-300 cursor-pointer ${location.pathname === '/events' || location.pathname.startsWith('/events/')
                  ? isWhiteNavPages
                    ? 'text-indigo-600 font-semibold'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`} onClick={() => setIsMenuOpen(false)}>
                Events
              </RouterLink>
              <RouterLink to="/about" className={`font-medium transition-all duration-300 cursor-pointer ${location.pathname === '/about'
                  ? isWhiteNavPages
                    ? 'text-indigo-600 font-semibold'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`} onClick={() => setIsMenuOpen(false)}>
                About
              </RouterLink>
              <RouterLink to="/contact" className={`font-medium transition-all duration-300 cursor-pointer ${location.pathname === '/contact'
                  ? isWhiteNavPages
                    ? 'text-indigo-600 font-semibold'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`} onClick={() => setIsMenuOpen(false)}>
                Contact
              </RouterLink>
              <RouterLink to="/pricing" className={`font-medium transition-all duration-300 cursor-pointer ${location.pathname === '/pricing'
                  ? isWhiteNavPages
                    ? 'text-indigo-600 font-semibold'
                    : 'text-white font-semibold'
                  : isWhiteNavPages
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white hover:text-white/80'
                }`} onClick={() => setIsMenuOpen(false)}>
                Pricing
              </RouterLink>


              {user ? (
                <div className={`pt-4 border-t space-y-3 ${isWhiteNavPages ? 'border-gray-200/50' : 'border-white/20'
                  }`}>
                  <div className="px-2">
                    <p className={`font-bold ${isWhiteNavPages ? 'text-gray-900' : 'text-white'
                      }`}>{user.nama}</p>
                    <p className={`text-sm ${isWhiteNavPages ? 'text-gray-600' : 'text-white/70'
                      }`}>{user.email}</p>
                  </div>
                  <RouterLink to="/profile/settings?tab=my-events" onClick={() => setIsMenuOpen(false)} className={`flex items-center px-2 py-2 font-medium transition-colors ${isWhiteNavPages ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                    }`}>
                    <Ticket size={18} className="mr-3" /> My Events
                  </RouterLink>
                  <RouterLink to="/profile/settings" onClick={() => setIsMenuOpen(false)} className={`flex items-center px-2 py-2 font-medium transition-colors ${isWhiteNavPages ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                    }`}>
                    <Settings size={18} className="mr-3" /> Settings
                  </RouterLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-2 py-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={18} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className={`pt-4 border-t space-y-3 ${isWhiteNavPages ? 'border-gray-200/50' : 'border-white/20'
                  }`}>
                  <RouterLink
                    to="/login"
                    className={`block font-medium transition-colors ${isWhiteNavPages ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </RouterLink>
                  <RouterLink
                    to="/register"
                    className={`block px-6 py-2 rounded-full font-medium transition-colors text-center border ${isWhiteNavPages
                        ? 'bg-gray-900 text-white border-gray-900 hover:bg-gray-800'
                        : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                      }`}
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
