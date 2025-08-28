import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, ArrowRight, CheckCircle, Star, MapPin, Clock } from 'lucide-react';
import Hero from 'src/components/home/Hero';
import AdvantagesSection from 'src/components/home/AdvantagesSection';
import EventCard from 'src/components/event/EventCard';
import MobileAppSection from 'src/components/home/MobileAppSection';
import PageTransition from 'src/components/common/PageTransition';
import AnimatedSection from 'src/components/common/AnimatedSection';
import { useStaggeredAnimation } from '../hooks/useScrollAnimation';
import { eventsAPI } from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      const eventsData = (response.data && response.data.events) || [];
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredEvents = (events || []).slice(0, 4);
  const [eventsRef, visibleEvents] = useStaggeredAnimation(featuredEvents, 150);

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div id="home">
          <Hero />
        </div>

        {/* Advantages Section */}
        <AnimatedSection animation="fade-up" delay={200}>
          <AdvantagesSection />
        </AnimatedSection>

        {/* Featured Events Section */}
        <AnimatedSection animation="fade-up" delay={300}>
          <section id="events" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="fade-right" delay={100}>
                <div className="text-center mb-16">
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-6 py-3 rounded-full text-sm font-semibold mb-6">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    ⚡ Event Populer Minggu Ini
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Featured Events
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Jangan lewatkan event-event menarik yang sedang trending di platform kami
                  </p>
                </div>
              </AnimatedSection>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                        <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                        <div className="p-5 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              ) : featuredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {featuredEvents.map((event, index) => (
                    <AnimatedSection
                      key={event.id}
                      animation="fade-up"
                      delay={index * 150}
                      duration={600}
                    >
                      <div className="transform hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                        <EventCard event={event} featured={index === 0} />
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <AnimatedSection animation="fade-up">
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Event</h3>
                    <p className="text-gray-600">Event menarik akan segera hadir. Stay tuned!</p>
                  </div>
                </AnimatedSection>
              )}

              {/* View All Button */}
              <AnimatedSection animation="fade-up" delay={600}>
                <div className="text-center mt-12">
                  <Link
                    to="/events"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    Lihat Semua Event
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </AnimatedSection>

        

        {/* About Section */}
        <AnimatedSection animation="fade-up" delay={300}>
          <section id="about" className="py-20 bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-200 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-200 rounded-full blur-2xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <AnimatedSection animation="fade-down" delay={100}>
                  <div className="inline-flex items-center bg-blue-100/80 text-blue-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50 mb-6">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    Tentang Kami
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Mengapa Memilih
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent block">
                      SchoolEvents?
                    </span>
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mx-auto mb-6"></div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={200}>
                  <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                    Platform terdepan untuk mengelola dan menemukan acara sekolah terbaik.
                    Kami menyediakan solusi lengkap yang memudahkan organisasi pendidikan
                    dalam mengatur berbagai kegiatan dengan teknologi modern.
                  </p>
                </AnimatedSection>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AnimatedSection animation="fade-up" delay={300}>
                  <div className="group relative h-full">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-100/50 hover:border-blue-200/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                          Pendidikan Berkualitas
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Fokus pada kegiatan pendidikan yang berkualitas tinggi dengan kurikulum
                          yang disesuaikan dengan kebutuhan siswa modern.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={400}>
                  <div className="group relative h-full">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-teal-100/50 hover:border-teal-200/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                          Komunitas Solid
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Membangun komunitas sekolah yang kuat dan saling mendukung
                          untuk menciptakan lingkungan belajar yang positif.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={500}>
                  <div className="group relative h-full">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-purple-100/50 hover:border-purple-200/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                          Teknologi Modern
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Platform canggih dengan interface yang intuitif dan fitur-fitur
                          terdepan untuk pengalaman pengguna yang optimal.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

            </div>
          </section>
        </AnimatedSection>
        
        {/* Mobile App Section */}
        <AnimatedSection animation="fade-up" delay={200}>
          <section id="mobile-app">
            <MobileAppSection />
          </section>
        </AnimatedSection>

      </div>
          </PageTransition>
  );
};

export default Home;
