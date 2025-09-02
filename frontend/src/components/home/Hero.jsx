import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, Star, CheckCircle, Sparkles, Play } from 'lucide-react';
import AnimatedSection from '../common/AnimatedSection';

const Hero = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mock events for demonstration (will be replaced by API data)
  const mockEvents = [
    {
      id: 1,
      judul: "Pentas Seni & Budaya 2025",
      tanggal: "2025-08-26",
      waktu_mulai: "19:00",
      lokasi: "Aula Sekolah",
      deskripsi: "Pertunjukan seni dan budaya tahunan sekolah",
      participantCount: 250,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      judul: "Webinar Karir & Masa Depan",
      tanggal: "2025-08-27",
      waktu_mulai: "14:00",
      lokasi: "Online Platform",
      deskripsi: "Panduan memilih jurusan dan karir untuk siswa",
      participantCount: 180,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      judul: "Seminar Kesehatan Mental",
      tanggal: "2025-08-28",
      waktu_mulai: "10:00",
      lokasi: "Auditorium",
      deskripsi: "Pentingnya menjaga kesehatan mental remaja",
      participantCount: 120,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      judul: "Pelatihan Leadership Siswa",
      tanggal: "2025-08-29",
      waktu_mulai: "08:00",
      lokasi: "Ruang OSIS",
      deskripsi: "Mengembangkan jiwa kepemimpinan siswa",
      participantCount: 45,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
    }
  ];

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?limit=10');
        const data = await response.json();

        if (data.success && data.data && data.data.events && data.data.events.length > 0) {
          setAllEvents(data.data.events);
        } else {
          // Use mock events if no API data
          setAllEvents(mockEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        // Use mock events as fallback
        setAllEvents(mockEvents);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get events within next 7 days
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);

  // Filter today's events
  const todayDate = getTodayDate();
  const todayEvents = allEvents.filter(event => {
    const eventDate = new Date(event.tanggal).toISOString().split('T')[0];
    return eventDate === todayDate;
  });

  // Filter events within next 7 days
  const upcomingEvents = allEvents.filter(event => {
    const eventDate = new Date(event.tanggal);
    return eventDate >= today && eventDate <= sevenDaysFromNow;
  });

  // Use today's events first, then upcoming events within 7 days
  const displayEvents = todayEvents.length > 0 ? todayEvents : upcomingEvents;

  // Auto-rotate events (only today's events)
  useEffect(() => {
    if (displayEvents.length > 1) {
      const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentEventIndex((prev) => (prev + 1) % displayEvents.length);
        }, 400);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [displayEvents.length]);

  // Reset index when events change
  useEffect(() => {
    setCurrentEventIndex(0);
  }, [displayEvents.length]);

  // Manual navigation with smooth slow transitions
  const goToEvent = (index) => {
    if (index !== currentEventIndex && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentEventIndex(index);
      }, 400);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }
  };

  const nextEvent = () => {
    if (!isTransitioning) {
      goToEvent((currentEventIndex + 1) % displayEvents.length);
    }
  };

  const prevEvent = () => {
    if (!isTransitioning) {
      goToEvent(currentEventIndex === 0 ? displayEvents.length - 1 : currentEventIndex - 1);
    }
  };

  const currentEvent = displayEvents[currentEventIndex];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-8 pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-sm border border-blue-200/50 shadow-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Platform Event Terdepan
                </div>

                {/* Main heading */}
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                    Temukan Event
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Impianmu
                    </span>
                  </h1>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    <p className="text-sm text-gray-500 font-medium tracking-wider uppercase">
                      Sekolah • Universitas • Komunitas
                    </p>
                  </div>
                </div>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg font-light">
                  Bergabunglah dengan ribuan peserta dalam event-event menarik. 
                  Dari workshop, seminar, hingga kompetisi yang akan mengembangkan potensimu.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    to="/events"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                  >
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Jelajahi Event
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Daftar Gratis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500 font-medium">Event Tersedia</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-500 font-medium">Peserta Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-500 font-medium">Kepuasan</div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Content - Modern Event Card */}
          <div className="relative">
            <AnimatedSection animation="fade-left" delay={600}>
              {/* Floating background elements */}
              <div className="absolute -inset-6 bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl transform rotate-1 scale-105 blur-3xl"></div>
              
              {isLoading ? (
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4 font-medium">Memuat event terbaru...</p>
                  </div>
                </div>
              ) : displayEvents.length > 0 && currentEvent ? (
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  {/* Event Badge */}
                  <div className="absolute top-6 left-6 z-20">
                    <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200/50 shadow-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Event Mendatang
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className={`transition-all duration-700 ease-in-out ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
                    <div className="p-8 pt-20">
                      {/* Event Title */}
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                          {currentEvent.judul}
                        </h3>
                        <p className="text-gray-600 leading-relaxed line-clamp-2">
                          {currentEvent.deskripsi || 'Workshop intensif untuk mempelajari pengembangan web modern menggunakan React.js'}
                        </p>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-6 mb-8">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center text-gray-700">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="font-semibold">Tanggal</span>
                          </div>
                          <span className="text-gray-900 font-bold">
                            {new Date(currentEvent.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center text-gray-700">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-4">
                              <Clock className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="font-semibold">Waktu</span>
                          </div>
                          <span className="text-gray-900 font-bold">{currentEvent.waktu_mulai || '10:30'}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center text-gray-700">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                              <MapPin className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="font-semibold">Lokasi</span>
                          </div>
                          <span className="text-gray-900 font-bold text-right max-w-[140px] truncate">{currentEvent.lokasi}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-center text-gray-700">
                            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mr-4">
                              <Users className="w-5 h-5 text-teal-600" />
                            </div>
                            <span className="font-semibold">Peserta</span>
                          </div>
                          <span className="text-gray-900 font-bold">{currentEvent.participantCount || 3} terdaftar</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/events/${currentEvent.id}`}
                        className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
                      >
                        <span className="flex items-center justify-center">
                          Daftar Sekarang
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 text-center">
                  <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Segera Hadir</h4>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                    Event-event menarik akan segera tersedia. Daftar sekarang untuk mendapat notifikasi!
                  </p>
                  <Link
                    to="/events"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Jelajahi Event
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              )}

              {/* Navigation Dots */}
              {displayEvents.length > 1 && (
                <div className="flex justify-center space-x-3 mt-8">
                  {displayEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToEvent(index)}
                      disabled={isTransitioning}
                      className={`transition-all duration-300 ${
                        index === currentEventIndex
                          ? 'w-10 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md'
                          : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                      } disabled:cursor-not-allowed`}
                    />
                  ))}
                </div>
              )}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
