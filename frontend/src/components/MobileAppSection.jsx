import React from 'react';
import { Download, Star, Users, Zap } from 'lucide-react';

const MobileAppSection = () => {
  return (
    <section className="bg-gray-50 py-20 relative">
      {/* Simple background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-gray-900 space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                Coba Aplikasi Event Terbaru
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Jangan Lewatkan Event
                <br />
                <span className="text-indigo-600">Impian Kamu!</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Bergabunglah dengan ribuan siswa yang sudah merasakan kemudahan mendaftar event, 
                kompetisi, dan workshop favorit mereka. Wujudkan potensi terbaikmu sekarang!
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900">Pendaftaran Mudah</h4>
                  <p className="text-sm text-gray-600">
                    Daftar event impian dengan sekali klik
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900">Temukan Teman Baru</h4>
                  <p className="text-sm text-gray-600">
                    Bertemu dengan siswa berprestasi dari berbagai sekolah
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900">Raih Prestasi</h4>
                  <p className="text-sm text-gray-600">
                    Kumpulkan sertifikat dan tingkatkan portofolio kamu
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Download className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-gray-900">Akses Kapan Saja</h4>
                  <p className="text-sm text-gray-600">
                    Lihat informasi event favorit tanpa batas waktu
                  </p>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center space-x-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-medium hover:bg-indigo-700 transition-all transform hover:scale-105">
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-lg font-semibold">Mulai Sekarang</div>
                  <div className="text-xs text-indigo-100">Gratis untuk semua siswa</div>
                </div>
              </button>
              
              <button className="flex items-center justify-center space-x-3 bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-2xl font-medium hover:bg-gray-50 transition-all">
                <Star className="w-6 h-6 text-orange-500" />
                <div className="text-left">
                  <div className="text-lg font-semibold">Lihat Demo</div>
                  <div className="text-xs text-gray-500">Coba fitur-fitur menarik</div>
                </div>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">2000+</div>
                <div className="text-sm text-gray-600">Siswa Bergabung</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">150+</div>
                <div className="text-sm text-gray-600">Event Tersedia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">50+</div>
                <div className="text-sm text-gray-600">Sekolah Partner</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative">
            <div className="relative mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Screen Content */}
                  <div className="bg-gradient-to-br from-indigo-50 to-green-50 p-6 h-[600px]">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm font-medium">9:41</div>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-gray-300 rounded-full"></div>
                        <div className="w-4 h-2 bg-gray-300 rounded-full"></div>
                        <div className="w-6 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                          <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">SchoolEvents</h3>
                          <p className="text-xs text-gray-500">Find your passion</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-2xl p-3 mb-6 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="text-sm text-gray-400">Search events...</div>
                      </div>
                    </div>

                    {/* Event Cards */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-green-400 rounded-xl"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="h-2 bg-gray-100 rounded mb-2 w-3/4"></div>
                            <div className="flex space-x-2">
                              <div className="h-2 bg-indigo-200 rounded w-12"></div>
                              <div className="h-2 bg-orange-200 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-indigo-500 rounded-xl"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded mb-2"></div>
                            <div className="h-2 bg-gray-100 rounded mb-2 w-2/3"></div>
                            <div className="flex space-x-2">
                              <div className="h-2 bg-green-200 rounded w-14"></div>
                              <div className="h-2 bg-orange-200 rounded w-12"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white rounded-2xl p-3 shadow-lg">
                        <div className="flex justify-around">
                          <div className="w-6 h-6 bg-indigo-500 rounded"></div>
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-orange-400 p-3 rounded-2xl shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-orange-500 p-3 rounded-2xl shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
