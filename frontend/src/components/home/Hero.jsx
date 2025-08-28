import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ArrowRight, Star, CheckCircle } from 'lucide-react';
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

        if (data.events && data.events.length > 0) {
          setAllEvents(data.events);
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
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 pt-4 pb-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <AnimatedSection animation="fade-up">
              <div className="space-y-8">
                <div className="inline-flex items-center bg-blue-100/80 text-blue-700 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                  <Star className="w-4 h-4 mr-2" />
                  Platform Terpercaya
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                    Wujudkan Potensi,
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                      Raih Prestasi
                    </span>
                  </h1>

                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>

                  <p className="text-sm text-gray-600 font-medium tracking-wider uppercase">
                    PANGGUNG KREASI & AJANG KOMPETISI SEKOLAHMU
                  </p>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
                  Temukan keseruan pensi, semangat classmeet, dan wawasan baru dari seminar di
                  sekolahmu. Semua informasi event ada di sini!
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              {/* Feature Points */}
              <div className="space-y-5">
                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-medium">Jelajahi beragam event: mulai dari seni, olahraga, hingga akademik.</span>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-green-100/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-medium">Jangan lewatkan momen berharga dan bangun kenangan tak terlupakan.</span>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed font-medium">Pendaftaran cepat, mudah, dan terintegrasi langsung untuk acaramu.</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Content - Event Card */}
          <div className="relative">
            <AnimatedSection animation="fade-left" delay={600}>
              {/* Gradient Background */}
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 via-blue-500 to-teal-500 rounded-3xl transform rotate-2 scale-110 opacity-25 blur-2xl"></div>

              {/* Main Event Card */}
              <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 rounded-3xl p-4 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

                {isLoading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="text-white/80 mt-2">Memuat event...</p>
                  </div>
                ) : displayEvents.length > 0 && currentEvent ? (
                  <div className="relative z-10">
                    {/* Event Badge */}
                    <div className="inline-flex items-center bg-white/25 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/30 shadow-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      {todayEvents.some(event => event.id === currentEvent.id) ? 'Event Berlangsung' : 'Event Mendatang'}
                    </div>

                    {/* Event Content */}
                    <div className="relative h-[450px] w-full">
                      <div className={`absolute inset-0 w-full transition-all duration-800 ease-in-out ${isTransitioning
                        ? 'opacity-0 transform translate-y-2'
                        : 'opacity-100 transform translate-y-0'
                        }`}>
                        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full flex flex-col">
                          <div className="flex-1 flex flex-col">
                            <div className="mb-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                                {currentEvent.judul}
                              </h3>

                              <div className="h-16 overflow-hidden">
                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                  {currentEvent.deskripsi || 'Workshop intensif untuk mempelajari pengembangan web modern menggunakan React.js. Peserta akan belajar komponen, state management, dan best practices dalam pengembangan aplikasi web.'}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4 flex-1">
                              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div className="flex items-center text-gray-700">
                                  <Calendar className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                                  <span className="text-sm font-medium">Tanggal</span>
                                </div>
                                <span className="text-sm text-gray-900 font-medium">
                                  {new Date(currentEvent.tanggal).toLocaleDateString('id-ID', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>

                              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div className="flex items-center text-gray-700">
                                  <Clock className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                                  <span className="text-sm font-medium">Waktu</span>
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{currentEvent.waktu_mulai || '10:30'}</span>
                              </div>

                              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div className="flex items-center text-gray-700">
                                  <MapPin className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                                  <span className="text-sm font-medium">Lokasi</span>
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{currentEvent.lokasi}</span>
                              </div>

                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center text-gray-700">
                                  <Users className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                                  <span className="text-sm font-medium">Peserta</span>
                                </div>
                                <span className="text-sm text-gray-900 font-medium">{currentEvent.participantCount || 2} terdaftar</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6">
                              <Link
                                to={`/events/${currentEvent.id}`}
                                className="block w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 text-center text-sm group shadow-lg hover:shadow-xl"
                              >
                                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                                  Daftar Sekarang
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-16 relative z-10">
                    <Calendar className="w-16 h-16 text-white/60 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-white mb-2">Event Mendatang</h4>
                    <p className="text-white/80 text-sm mb-6">Daftar sekarang dan dapatkan early bird discount!</p>
                    <Link
                      to="/events"
                      className="inline-flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      Jelajahi Event
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Navigation Dots - Moved outside the card */}
              {displayEvents.length > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  {displayEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToEvent(index)}
                      disabled={isTransitioning}
                      className={`transition-all duration-300 ${index === currentEventIndex
                        ? 'w-8 h-2 bg-blue-500 rounded-full shadow-sm'
                        : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
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
