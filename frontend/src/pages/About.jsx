import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Award, 
  Calendar, 
  BookOpen, 
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Trophy,
  Sparkles
} from 'lucide-react';
import AnimatedSection from '../components/common/AnimatedSection';

const About = () => {
  const stats = [
    { number: '500+', label: 'Event Terorganisir', icon: Calendar },
    { number: '10,000+', label: 'Peserta Aktif', icon: Users },
    { number: '50+', label: 'Sekolah Partner', icon: BookOpen },
    { number: '98%', label: 'Tingkat Kepuasan', icon: Award }
  ];

  const values = [
    {
      icon: Target,
      title: 'Inovasi Berkelanjutan',
      description: 'Menghadirkan solusi teknologi terdepan untuk mengelola event sekolah dengan efisien dan modern.'
    },
    {
      icon: Heart,
      title: 'Fokus pada Siswa',
      description: 'Mengutamakan pengalaman siswa dalam setiap event untuk menciptakan momen berharga dan berkesan.'
    },
    {
      icon: Trophy,
      title: 'Kualitas Terjamin',
      description: 'Berkomitmen memberikan layanan berkualitas tinggi dengan standar profesional yang konsisten.'
    },
    {
      icon: Sparkles,
      title: 'Kolaborasi Aktif',
      description: 'Membangun kemitraan yang kuat dengan sekolah untuk menciptakan ekosistem pendidikan yang dinamis.'
    }
  ];

  const milestones = [
    { year: '2023', title: 'Peluncuran Platform', description: 'Memulai perjalanan dengan visi digitalisasi event sekolah' },
    { year: '2024', title: 'Ekspansi Regional', description: 'Melayani 50+ sekolah di berbagai daerah' },
    { year: '2024', title: 'Fitur Mobile App', description: 'Menghadirkan aplikasi mobile untuk kemudahan akses' },
    { year: '2025', title: 'AI Integration', description: 'Implementasi AI untuk rekomendasi event personal' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-blue-200/50 shadow-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Tentang SchoolEvents
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Membangun Masa Depan
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Event Sekolah
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
                SchoolEvents adalah platform digital terdepan yang menghadirkan revolusi dalam pengelolaan event sekolah. 
                Kami berkomitmen menciptakan pengalaman yang tak terlupakan bagi setiap siswa melalui teknologi inovatif.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/events"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Jelajahi Event
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection animation="fade-right">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Misi Kami</h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-8">
                    Menghadirkan platform digital yang memudahkan sekolah dalam mengelola event, 
                    meningkatkan partisipasi siswa, dan menciptakan pengalaman yang berkesan 
                    melalui teknologi yang inovatif dan user-friendly.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      'Digitalisasi pengelolaan event sekolah',
                      'Meningkatkan engagement siswa',
                      'Menyediakan analytics dan insights',
                      'Membangun komunitas sekolah yang aktif'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi Kami</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Menjadi platform event sekolah terdepan di Indonesia yang menginspirasi 
                    generasi muda untuk aktif berpartisipasi dalam kegiatan pendidikan dan 
                    pengembangan diri.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nilai-Nilai Kami</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Prinsip-prinsip yang menjadi fondasi dalam setiap langkah perjalanan kami
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <AnimatedSection key={index} animation="fade-up" delay={index * 200}>
                  <div className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Perjalanan Kami</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Milestone penting dalam pengembangan platform SchoolEvents
              </p>
            </div>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <AnimatedSection key={index} animation="fade-up" delay={index * 200}>
                  <div className="flex items-start space-x-6 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {milestone.year.slice(-2)}
                      </div>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {milestone.year}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection animation="fade-up">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-6">Siap Bergabung dengan Kami?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Mari bersama-sama menciptakan pengalaman event sekolah yang tak terlupakan 
                untuk generasi masa depan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-white text-blue-600 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center bg-transparent text-white font-semibold px-8 py-4 rounded-2xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default About;
