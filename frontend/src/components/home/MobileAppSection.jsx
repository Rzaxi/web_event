import React from 'react';
import { Download, Star, Users, Rocket, Smartphone, Bell, Cloud } from 'lucide-react';

const MobileAppSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-teal-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-pink-200 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-gray-900 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-blue-100/80 text-blue-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Aplikasi Mobile Terbaru
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Download Aplikasi
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                  SchoolEvents!
                </span>
              </h2>

              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full my-4"></div>

              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                Nikmati kemudahan mendaftar event, kompetisi, dan workshop favorit langsung dari smartphone kamu. 
                Cepat, mudah, dan bebas ribet!
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">Akses Instan</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Langsung buka platform tanpa ribet, tanpa perlu download aplikasi.</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 hover:border-green-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">Mobile & Tablet Friendly</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Tampilan optimal di smartphone dan tablet untuk pengalaman terbaik.</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 hover:border-purple-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">Real-time Updates</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Dapatkan notifikasi langsung untuk event dan pengumuman terbaru.</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 hover:border-orange-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <Cloud className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">Cloud Storage Aman</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Data tersimpan aman di cloud, bisa diakses dari mana saja.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="sm:static fixed bottom-4 left-4 right-4 z-50 flex justify-center sm:justify-start">
              <button 
                aria-label="Download SchoolEvents app" 
                className="group relative bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden w-full max-w-xs sm:max-w-none sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center sm:justify-start space-x-2.5">
                  <Download className="w-5 h-5 group-hover:animate-bounce motion-reduce:animate-none" />
                  <div className="text-center sm:text-left">
                    <div className="font-semibold text-sm sm:text-base">Download Sekarang</div>
                    <div className="text-xs text-blue-100/90 font-medium">Gratis untuk semua siswa</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-teal-500 rounded-[4rem] transform rotate-3 scale-105 opacity-20 blur-2xl"></div>

            <div className="relative mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                {/* Phone Screen */}
                <div className="bg-black rounded-[2rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6 h-[600px] relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm font-bold text-gray-900">9:41</div>
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                        </div>
                        <div className="w-6 h-3 bg-green-500 rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <div className="w-6 h-6 bg-white rounded-xl flex items-center justify-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg"></div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">SchoolEvents</h3>
                          <p className="text-xs text-gray-500">Event Sekolah Terbaik</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-5 h-5 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg border border-blue-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"></div>
                        <div className="text-sm text-gray-500 font-medium">Temukan event seru...</div>
                      </div>
                    </div>

                    {/* Event Cards */}
                    <div className="space-y-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-blue-100/30">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl shadow-lg flex items-center justify-center">
                            <Star className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gradient-to-r from-blue-200 to-teal-200 rounded-lg mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded-lg mb-3 w-4/5"></div>
                            <div className="flex space-x-2">
                              <div className="px-2 py-1 bg-blue-100 rounded-full">
                                <div className="text-xs text-blue-700 font-semibold">Popular</div>
                              </div>
                              <div className="px-2 py-1 bg-teal-100 rounded-full">
                                <div className="text-xs text-teal-700 font-semibold">New</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-100/30">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded-lg mb-3 w-3/4"></div>
                            <div className="flex space-x-2">
                              <div className="px-2 py-1 bg-purple-100 rounded-full">
                                <div className="text-xs text-purple-700 font-semibold">Workshop</div>
                              </div>
                              <div className="px-2 py-1 bg-pink-100 rounded-full">
                                <div className="text-xs text-pink-700 font-semibold">Free</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-100/30">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg flex items-center justify-center">
                            <Star className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded-lg mb-3 w-5/6"></div>
                            <div className="flex space-x-2">
                              <div className="px-2 py-1 bg-orange-100 rounded-full">
                                <div className="text-xs text-orange-700 font-semibold">Competition</div>
                              </div>
                              <div className="px-2 py-1 bg-red-100 rounded-full">
                                <div className="text-xs text-red-700 font-semibold">Prize</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-blue-100/50">
                        <div className="flex justify-around items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-lg"></div>
                          </div>
                          <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-2xl shadow-2xl animate-pulse motion-reduce:animate-none">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-400 to-teal-500 p-4 rounded-2xl shadow-2xl animate-bounce motion-reduce:animate-none">
                <Download className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-1/3 -left-4 bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl shadow-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="absolute bottom-1/3 -right-4 bg-gradient-to-r from-blue-400 to-indigo-500 p-3 rounded-xl shadow-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;

