import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Footer = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendLink = () => {
    if (phoneNumber) {
      alert(`Link sent to ${phoneNumber}`);
      setPhoneNumber('');
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Download the App */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6">Download the App</h4>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Enter phone number to send a link"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendLink}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900 hover:text-gray-700"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">Message and data rates may apply</p>
                
                {/* App Store Buttons */}
                <div className="flex space-x-3 pt-2">
                  <a href="#" className="block">
                    <img 
                      src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" 
                      alt="Download on App Store" 
                      className="h-10"
                    />
                  </a>
                  <a href="#" className="block">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                      alt="Get it on Google Play" 
                      className="h-10"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Press
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Inclusion
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Digital Accessibility
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Evoria Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Help & Support
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Sell on Evoria
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Evoria Enterprise
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Evoria Creators
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6">Social</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6">Developers</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Platform
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Developer Blog
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4">
              <span className="font-bold text-gray-900 text-lg">Evoria</span>
              <span className="text-sm text-gray-500">© 2025 Evoria. All rights reserved.</span>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <span>🇺🇸</span>
                <span>USD</span>
              </span>
              <Link to="/privacy" className="hover:text-gray-900 transition-colors">
                Your privacy choices
              </Link>
              <Link to="/terms" className="hover:text-gray-900 transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-gray-900 transition-colors">
                Privacy
              </Link>
              <Link to="/sitemap" className="hover:text-gray-900 transition-colors">
                Site map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
