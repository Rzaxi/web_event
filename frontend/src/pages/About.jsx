import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight,
  Building2,
  BarChart3,
  MapPin,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const platformFeatures = [
    {
      title: 'Sertifikat Digital',
      description: 'Dapatkan sertifikat digital otomatis setelah mengikuti event dengan sistem validasi yang aman dan terpercaya.',
      icon: <CheckCircle />
    },
    {
      title: 'Event Organizer Tools',
      description: 'Buat dan kelola event dengan mudah menggunakan dashboard lengkap dengan analytics dan export data peserta.',
      icon: <BarChart3 />
    },
    {
      title: 'QR Code Check-in',
      description: 'Sistem absensi digital dengan QR code untuk mempermudah proses check-in peserta di hari event.',
      icon: <Sparkles />
    },
    {
      title: 'Secure Payment',
      description: 'Sistem pembayaran yang aman dan terpercaya untuk upgrade ke Event Organizer Basic atau Pro.',
      icon: <Building2 />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-white overflow-hidden">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                🎉 Platform Event Management #1 di Indonesia
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Tentang <span className="text-blue-600">Evoria</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Platform event management #1 di Indonesia yang menghubungkan organizer dan peserta. Dilengkapi sertifikat digital otomatis, QR code check-in, analytics lengkap, dan sistem pembayaran yang aman.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-8">
                <p className="text-sm text-gray-700">
                  💡 <strong>Untuk Event Organizer:</strong> Kelola event unlimited dengan dashboard profesional mulai dari Rp 99K/bulan
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-blue-600 mb-1">10K+</div>
                  <div className="text-sm text-gray-600">Event Terdaftar</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-blue-600 mb-1">50K+</div>
                  <div className="text-sm text-gray-600">Peserta Aktif</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-blue-600 mb-1">1K+</div>
                  <div className="text-sm text-gray-600">Organizer</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Jelajahi Event</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>

            {/* Right Content - Feature Cards */}
            <div className="relative">
              <div className="space-y-4">
                <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Sertifikat Digital</h3>
                      <p className="text-sm text-gray-600">Peserta mendapat sertifikat otomatis setelah event</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">QR Code Check-in</h3>
                      <p className="text-sm text-gray-600">Sistem absensi digital yang cepat dan akurat</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
                      <p className="text-sm text-gray-600">Pembayaran terenkripsi dan terpercaya</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Platform Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Platform
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Content */}
            <div className="flex-1">
              {/* Top Row - 2 Large Cards */}
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                {platformFeatures.slice(0, 2).map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex-1">
                        {feature.title}
                      </h3>
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 ml-4">
                        {React.cloneElement(feature.icon, { 
                          className: "w-6 h-6 text-blue-600" 
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Row - 2 Small Cards + Button */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Two Feature Cards */}
                {platformFeatures.slice(2, 4).map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex-1">
                        {feature.title}
                      </h3>
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 ml-4">
                        {React.cloneElement(feature.icon, { 
                          className: "w-6 h-6 text-blue-600" 
                        })}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}

                {/* View Tickets Button */}
                <Link
                  to="/events"
                  className="bg-blue-500 hover:bg-blue-600 rounded-2xl p-4 transition-colors flex flex-col items-center justify-center text-white group min-h-[120px]"
                >
                  <span className="text-lg font-bold mb-2">View Tickets</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
