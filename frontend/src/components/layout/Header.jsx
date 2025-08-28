import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X, User, LogOut, ChevronDown, LayoutDashboard, Calendar as CalendarIcon, Settings } from 'lucide-react';

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
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <RouterLink to="/" className="flex items-center space-x-2">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-indigo-500 font-bold text-sm">SE</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SchoolEvents</h1>
              <p className="text-xs text-gray-500">Platform Terpercaya</p>
            </div>
          </RouterLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              <>
                <ScrollLink to="home" spy={true} smooth={true} duration={500} offset={-70} className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer">Home</ScrollLink>
                <ScrollLink to="events" spy={true} smooth={true} duration={500} offset={-70} className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer">Events</ScrollLink>
                <ScrollLink to="about" spy={true} smooth={true} duration={500} offset={-70} className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer">About</ScrollLink>
                <ScrollLink to="mobile-app" spy={true} smooth={true} duration={500} offset={-70} className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer">Mobile App</ScrollLink>
               
              </>
            ) : (
              <>
                <RouterLink to="/#home" className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer">Home</RouterLink>
                <RouterLink to="/events" className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer">Events</RouterLink>
                <RouterLink to="/#mobile-app" className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer">Mobile App</RouterLink>
                <RouterLink to="/#about" className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer">About</RouterLink>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-2 text-gray-700 hover:text-indigo-500 transition-colors ${
                    location.pathname === '/account-settings' ? 'hidden' : ''
                  }`}
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
                    <RouterLink to="/account-settings" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
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
                  className="text-gray-700 hover:text-indigo-500 font-medium transition-all duration-300 hover:scale-105 relative group"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-indigo-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="bg-indigo-500 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-600 transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
                >
                  Get Started
                </RouterLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-500 hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {isHomePage ? (
                <>
                  <ScrollLink to="home" spy={true} smooth={true} duration={500} offset={-70} className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Home</ScrollLink>
                  <ScrollLink to="events" spy={true} smooth={true} duration={500} offset={-70} className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Events</ScrollLink>
                  <ScrollLink to="mobile-app" spy={true} smooth={true} duration={500} offset={-70} className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Mobile App</ScrollLink>
                  <ScrollLink to="about" spy={true} smooth={true} duration={500} offset={-70} className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>About</ScrollLink>
                </>
              ) : (
                <>
                  <RouterLink to="/#home" className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Home</RouterLink>
                  <RouterLink to="/events" className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Events</RouterLink>
                  <RouterLink to="/#mobile-app" className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>Mobile App</RouterLink>
                  <RouterLink to="/#about" className="text-gray-700 hover:text-indigo-500 font-medium transition-colors cursor-pointer" onClick={() => setIsMenuOpen(false)}>About</RouterLink>
                </>
              )}

              {user ? (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="px-2">
                    <p className="font-bold text-gray-800">{user.nama}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <RouterLink to="/account-settings" onClick={() => setIsMenuOpen(false)} className="flex items-center px-2 py-2 text-gray-700 hover:text-indigo-500 font-medium transition-colors">
                    <Settings size={18} className="mr-3" /> Settings
                  </RouterLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-2 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut size={18} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <RouterLink
                    to="/login"
                    className="block text-gray-700 hover:text-indigo-500 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </RouterLink>
                  <RouterLink
                    to="/register"
                    className="block bg-indigo-500 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-600 transition-colors text-center"
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
