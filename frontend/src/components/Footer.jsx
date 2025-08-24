import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Stay Updated
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Jangan Lewatkan Event Terbaru!
            </h2>

            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Dapatkan notifikasi event terbaru, tips sukses kompetisi, dan kesempatan
              eksklusif langsung di inbox kamu.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email kamu"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="bg-indigo-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-600 transition-colors">
                Subscribe
              </button>
            </div>

            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                100% Gratis
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                No Spam
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Unsubscribe Kapan Saja
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-500 p-2 rounded-lg">
                  <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-indigo-500 font-bold text-sm">SE</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">SchoolEvents</h3>
                  <p className="text-sm text-gray-400">Platform #1 Indonesia</p>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed">
                Platform terdepan untuk event sekolah yang menginspirasi dan mengembangkan potensi siswa Indonesia.
              </p>

              {/* Stats */}
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">200+</div>
                  <div className="text-xs text-gray-500">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">10K+</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">4.9</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                    Semua Events
                  </Link>
                </li>
                <li>
                  <Link to="/events/featured" className="text-gray-400 hover:text-white transition-colors">
                    Event Unggulan
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Kategori</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/events?category=kompetisi" className="text-gray-400 hover:text-white transition-colors">
                    Kompetisi Akademik
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=seminar" className="text-gray-400 hover:text-white transition-colors">
                    Seminar Leadership
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=workshop" className="text-gray-400 hover:text-white transition-colors">
                    Workshop Kreatif
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=teknologi" className="text-gray-400 hover:text-white transition-colors">
                    Event Teknologi
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=olahraga" className="text-gray-400 hover:text-white transition-colors">
                    Turnamen Olahraga
                  </Link>
                </li>
                <li>
                  <Link to="/events?category=budaya" className="text-gray-400 hover:text-white transition-colors">
                    Festival Budaya
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Kontak Kami</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm text-gray-300">Email</div>
                    <div className="text-white">hello@schoolevents.id</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm text-gray-300">Phone</div>
                    <div className="text-white">+62 21 1234 5678</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm text-gray-300">Lokasi</div>
                    <div className="text-white">Jakarta, Indonesia</div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <div className="text-sm text-gray-300 mb-3">Follow Us</div>
                <div className="flex space-x-3">
                  <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-indigo-500 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-indigo-500 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-indigo-500 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-indigo-500 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 SchoolEvents. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
