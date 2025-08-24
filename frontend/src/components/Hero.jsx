import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowRight, Play, CheckCircle2, Sparkles, TrendingUp, Award, Zap, Star } from 'lucide-react';
import { eventsAPI } from '../services/api';

const Hero = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  const [translateX, setTranslateX] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayEvents();
  }, []);

  useEffect(() => {
    if (todayEvents.length > 0) {
      const interval = setInterval(() => {
        setTranslateX((prev) => {
          const nextPosition = prev - 100;
          // Reset when we've moved through 2 full sets (1/3 of our 6x duplicated array)
          if (Math.abs(nextPosition) >= todayEvents.length * 400) {
            return 0;
          }
          return nextPosition;
        });
      }, 5000); // Change slide every 6 seconds

      return () => clearInterval(interval);
    }
  }, [todayEvents.length]);

  const fetchTodayEvents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await eventsAPI.getAll();
      const events = response.data.events || [];

      // Filter events for today
      const todaysEvents = events.filter(event => {
        const eventDate = new Date(event.tanggal).toISOString().split('T')[0];
        return eventDate === today;
      });

      setTodayEvents(todaysEvents);
    } catch (error) {
      console.error('Error fetching today events:', error);
      setTodayEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/5 to-orange-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start min-h-[calc(100vh-5rem)]">
          {/* Left Content */}
          <div className="space-y-6 order-2 lg:order-1 pt-8">

            {/* Main headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight text-gray-900 font-serif">
                <span className="block">Wujudkan Potensi,</span>
                <span className="block bg-gradient-to-r from-indigo-500 to-green-500 bg-clip-text text-transparent">Raih Prestasi</span> 
              </h1>
              
              <div className="flex items-center gap-4 pt-2">
                <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider font-sans">Panggung Kreasi & Ajang Kompetisi Sekolahmu</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-600 leading-snug max-w-lg font-sans">
              Temukan keseruan pensi, semangat classmeet, dan wawasan baru dari seminar di sekolahmu. Semua informasi event ada di sini!
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Zap, text: 'Jelajahi beragam event: mulai dari seni, olahraga, hingga akademik.' },
                { icon: Star, text: 'Jangan lewatkan momen berharga dan bangun kenangan tak terlupakan.' },
                { icon: CheckCircle2, text: 'Pendaftaran cepat, mudah, dan terintegrasi langsung untuk acaramu.' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 font-medium leading-relaxed">{feature.text}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Visual */}
          <div className="relative order-1 lg:order-2">
            <div className="relative max-w-md mx-auto lg:max-w-lg">
              {/* Main image container */}
              <div className="aspect-[4/5] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl relative group">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                  </div>
                ) : todayEvents.length > 0 ? (
                  <div className="relative h-full">
                    {/* Event Slider */}
                    <div
                      className="flex h-full transition-transform duration-1000 ease-linear"
                      style={{ transform: `translateX(${translateX}%)` }}
                    >
                      {[...todayEvents, ...todayEvents, ...todayEvents, ...todayEvents, ...todayEvents, ...todayEvents].map((event, index) => (
                        <div key={`${event.id}-${index}`} className="w-full flex-shrink-0 relative h-full">
                          {/* Event Image */}
                          <div className="absolute inset-0">
                            {event.flyer ? (
                              <img
                                src={`http://localhost:3000${event.flyer}`}
                                alt={event.judul}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-green-500"></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>

                          {/* Event Content Card */}
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                              <div className="space-y-4">
                                {/* Event Badge */}
                                <div className="inline-flex items-center bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                  🎯 Event Berlangsung
                                </div>

                                {/* Event Title */}
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">{event.judul}</h3>

                                {/* Event Details */}
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-3 text-gray-600">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-medium">{formatDate(event.tanggal)}</span>
                                  </div>

                                  {event.waktu && (
                                    <div className="flex items-center space-x-3 text-gray-600">
                                      <Clock className="w-5 h-5" />
                                      <span className="font-medium">{formatTime(event.waktu)}</span>
                                    </div>
                                  )}

                                  <div className="flex items-center space-x-3 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span className="font-medium">{event.lokasi}</span>
                                  </div>

                                  <div className="flex items-center space-x-3 text-gray-600">
                                    <Users className="w-5 h-5" />
                                    <span className="font-medium">{event.registered_count || 0} peserta terdaftar</span>
                                  </div>
                                </div>

                                {/* CTA Button */}
                                <Link
                                  to={`/events/${event.id}`}
                                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-indigo-500 to-green-500 hover:from-indigo-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                  Daftar Sekarang
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center p-8">
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Calendar className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-700">Tidak Ada Event Hari Ini</h3>
                      <p className="text-gray-500">Lihat event lainnya yang tersedia</p>
                    </div>
                  </div>
                )}
              </div>


              {/* Background decorations */}
              <div className="absolute -top-16 -right-16 w-32 h-32 border-2 border-indigo-200/20 rounded-full -z-10"></div>
              <div className="absolute -bottom-16 -left-16 w-24 h-24 bg-orange-400/10 rounded-3xl -z-10 rotate-12"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
