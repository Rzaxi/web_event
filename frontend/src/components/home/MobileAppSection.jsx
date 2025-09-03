import React from 'react';
import { Download, Star, Users, Rocket, Smartphone, Bell, Cloud, Zap, Heart } from 'lucide-react';

const MobileAppSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden">
      {/* Simple Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-200 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-gray-900 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Aplikasi Mobile Terbaru
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Akses SchoolEvents
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dimana Saja
                </span>
              </h2>

              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full my-4"></div>

              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                Nikmati kemudahan mendaftar event, kompetisi, dan workshop favorit langsung dari smartphone Anda. 
                Interface yang bersih dan mudah digunakan.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Akses Cepat</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Buka platform langsung dari browser tanpa perlu instalasi aplikasi.</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                    <Smartphone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Responsif</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Tampilan optimal di semua perangkat, dari smartphone hingga desktop.</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                    <Bell className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Notifikasi Real-time</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Dapatkan update langsung untuk event dan pengumuman terbaru.</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md">
                    <Cloud className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Cloud Sync</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Data tersimpan aman dan tersinkronisasi di semua perangkat Anda.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                aria-label="Akses Platform SchoolEvents" 
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Akses Platform</span>
                </div>
              </button>
              
              <button 
                aria-label="Pelajari lebih lanjut" 
                className="group relative bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="relative flex items-center justify-center space-x-3">
                  <Star className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Pelajari Lebih Lanjut</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 rounded-[4rem] transform rotate-3 scale-105 opacity-10 blur-2xl"></div>

            <div className="relative mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                {/* Phone Screen */}
                <div className="bg-black rounded-[2rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6 h-[600px] relative">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm font-bold text-gray-900">19:28</div>
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
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <div className="w-6 h-6 bg-white rounded-xl flex items-center justify-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"></div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">SchoolEvents</h3>
                          <p className="text-xs text-gray-500">Event Sekolah Terbaik</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-5 h-5 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg border border-blue-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        <div className="text-sm text-gray-500 font-medium">Temukan event seru...</div>
                      </div>
                    </div>

                    {/* Event Cards */}
                    <div className="space-y-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-blue-100/30">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center">
                            <Star className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded-lg mb-3 w-4/5"></div>
                            <div className="flex space-x-2">
                              <div className="px-2 py-1 bg-blue-100 rounded-full">
                                <div className="text-xs text-blue-700 font-semibold">Popular</div>
                              </div>
                              <div className="px-2 py-1 bg-purple-100 rounded-full">
                                <div className="text-xs text-purple-700 font-semibold">New</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-teal-100/30">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl shadow-lg flex items-center justify-center">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gradient-to-r from-teal-200 to-green-200 rounded-lg mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded-lg mb-3 w-3/4"></div>
                            <div className="flex space-x-2">
                              <div className="px-2 py-1 bg-teal-100 rounded-full">
                                <div className="text-xs text-teal-700 font-semibold">Workshop</div>
                              </div>
                              <div className="px-2 py-1 bg-green-100 rounded-full">
                                <div className="text-xs text-green-700 font-semibold">Free</div>
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

                    {/* Futuristic Bottom Navigation */}
                    <div className="absolute bottom-8 left-6 right-6">
                      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/10">
                        <div className="flex justify-around items-center">
                          <div className="relative w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl shadow-lg shadow-cyan-500/25 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white/90 rounded-xl backdrop-blur-sm"></div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
                          </div>
                          <div className="w-10 h-10 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                          <div className="w-10 h-10 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                          <div className="w-10 h-10 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-8 -right-8 bg-gradient-to-r from-orange-400 to-red-500 p-5 rounded-3xl shadow-2xl shadow-orange-500/25 animate-float">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-emerald-400 to-teal-500 p-5 rounded-3xl shadow-2xl shadow-emerald-500/25 animate-bounce">
                <Download className="w-10 h-10 text-white" />
              </div>
              <div className="absolute top-1/4 -left-6 bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-2xl shadow-xl shadow-purple-500/25 animate-pulse">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-1/4 -right-6 bg-gradient-to-r from-cyan-400 to-blue-500 p-4 rounded-2xl shadow-xl shadow-cyan-500/25 animate-bounce delay-500">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-pink-400 to-rose-500 p-3 rounded-xl shadow-lg animate-pulse delay-1000">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;

