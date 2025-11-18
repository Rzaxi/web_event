import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Video, 
  Laptop, 
  GraduationCap, 
  Music, 
  Trophy, 
  MoreHorizontal,
  ChevronDown,
  ArrowRight,
  X
} from 'lucide-react';
import EventCard from '../components/event/EventCard';
import { EventListSkeleton } from '../components/ui/SkeletonLoader';
import { useLazyLoading } from '../hooks/useLazyLoading';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';
import { eventsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('tanggal');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const eventsPerPage = 9;
  const totalSlides = 3;

  // Animation hooks
  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [categoriesRef, categoriesVisible] = useScrollAnimation(0.1);
  const [eventsHeaderRef, eventsHeaderVisible] = useScrollAnimation(0.1);
  const [eventsGridRef, eventsGridVisible] = useScrollAnimation(0.1);

  const categories = [
    { value: 'webinar', label: 'Webinar', icon: Video, color: 'blue' },
    { value: 'bootcamp', label: 'Bootcamp', icon: Laptop, color: 'purple' },
    { value: 'pelatihan', label: 'Pelatihan', icon: GraduationCap, color: 'green' },
    { value: 'konser', label: 'Konser', icon: Music, color: 'pink' },
    { value: 'kompetisi', label: 'Kompetisi', icon: Trophy, color: 'orange' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [currentPage, sortBy, searchTerm, selectedCategory, selectedDifficulty, priceFilter]);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll({
        page: currentPage,
        limit: eventsPerPage,
        search: searchTerm,
        sortBy: sortBy,
        kategori: selectedCategory,
        tingkat_kesulitan: selectedDifficulty,
        price_filter: priceFilter
      });

      setEvents(response.data.data?.events || response.data.events || []);
      const total = response.data.data?.total || response.data.total || 0;
      setTotalEvents(total);
      setTotalPages(Math.ceil(total / eventsPerPage));
    } catch (error) {
      toast.error('Gagal memuat data events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
    setCurrentPage(1);
  };

  const handleDifficultyFilter = (difficulty) => {
    setSelectedDifficulty(selectedDifficulty === difficulty ? '' : difficulty);
    setCurrentPage(1);
  };

  const handlePriceFilter = (price) => {
    setPriceFilter(priceFilter === price ? '' : price);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedDifficulty('');
    setPriceFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Carousel functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedDifficulty) count++;
    if (priceFilter) count++;
    return count;
  };

  const handlePageChange = (page) => {
    if (page === currentPage || isTransitioning) return;

    setIsTransitioning(true);

    // Fade out current content
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 150);

    // Fade in new content after data loads
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={isTransitioning}
          className={`px-4 py-2 mx-1 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${currentPage === i
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-12 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isTransitioning}
          className="px-6 py-2 rounded-xl font-semibold bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-md"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isTransitioning}
          className="px-6 py-2 rounded-xl font-semibold bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-md"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div ref={heroRef} className="relative bg-white text-gray-900 pt-32 pb-16 overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Light effects */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-b from-gray-200/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-b from-gray-200/30 to-transparent rounded-full blur-2xl"></div>

          {/* Subtle structure */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-100/30 to-transparent transform -skew-x-12"></div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-100/30 to-transparent transform skew-x-12"></div>
          </div>

        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Event Future Section */}
          <div ref={categoriesRef} className={`max-w-6xl mx-auto mb-16 transition-all duration-1000 delay-400 ${
            hasLoaded || categoriesVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            {/* Event Carousel */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {/* Event Card 1 - AI Conference */}
                  <div className="w-full flex-shrink-0">
                    <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="AI Technology Conference"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-3xl font-bold mb-2">Future of AI & Technology</h3>
                          <p className="text-lg opacity-90">Dec 15, 2024 • Jakarta</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Card 2 - Business Summit */}
                  <div className="w-full flex-shrink-0">
                    <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="Business Summit"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-3xl font-bold mb-2">Digital Transformation Summit</h3>
                          <p className="text-lg opacity-90">Jan 20, 2025 • Bali</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Event Card 3 - Green Conference */}
                  <div className="w-full flex-shrink-0">
                    <div className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                        alt="Green Future Conference"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-3xl font-bold mb-2">Green Future Conference</h3>
                          <p className="text-lg opacity-90">Feb 10, 2025 • Surabaya</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-blue-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronDown className="w-6 h-6 text-gray-700 rotate-90" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronDown className="w-6 h-6 text-gray-700 -rotate-90" />
              </button>
            </div>
          </div>

          <h1 className={`text-6xl md:text-7xl font-bold mb-6 leading-tight transition-all duration-1000 ${
            hasLoaded || heroVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-8'
          }`}>
            Let there be live
          </h1>

          <p className={`text-xl mb-12 opacity-90 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
            hasLoaded || heroVisible 
              ? 'opacity-90 translate-y-0' 
              : 'opacity-0 -translate-y-8'
          }`}>
            Your next best-night-ever is waiting
          </p>

          {/* Search Bar */}
          <div className={`max-w-2xl mx-auto mb-8 transition-all duration-1000 delay-300 ${
            hasLoaded || heroVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="What do you want to see live?"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-14 pr-6 py-5 text-lg bg-white rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-500/20 focus:outline-none text-gray-900 placeholder-gray-500 shadow-lg"
              />
            </div>
          </div>

        </div>
      </div>


      {/* Events Section */}
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Events Header */}
          <div ref={eventsHeaderRef} className={`flex flex-col md:flex-row md:items-center md:justify-between mb-8 transition-all duration-1000 ${
            eventsHeaderVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory
                  ? `Events ${categories.find(c => c.value === selectedCategory)?.label}`
                  : 'Semua Events'
                }
              </h2>
              <p className="text-gray-600">
                {searchTerm
                  ? `Menampilkan hasil pencarian "${searchTerm}"`
                  : `Ditemukan ${totalEvents} events tersedia`
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-8">
              {/* Modern Category Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Kategori:</span>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 cursor-pointer min-w-[180px]"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Modern Sort Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Urutkan:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 cursor-pointer min-w-[140px]"
                  >
                    <option value="tanggal">📅 Tanggal</option>
                    <option value="judul">🔤 Judul</option>
                    <option value="lokasi">📍 Lokasi</option>
                    <option value="created_at">⭐ Terbaru</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading || isTransitioning ? (
            <EventListSkeleton count={12} />
          ) : events.length > 0 ? (
            <>
              <div ref={eventsGridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${
                isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
              }`}>
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`transition-all duration-700 transform ${
                      hasLoaded || eventsGridVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-12 scale-95'
                    } hover:scale-105 hover:-translate-y-2`}
                    style={{ 
                      transitionDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && renderPagination()}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                {/* Simple Icon */}
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {searchTerm || selectedCategory ? 'Tidak ada event ditemukan' : 'Belum ada event'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm
                      ? `Tidak ada hasil untuk "${searchTerm}"`
                      : selectedCategory
                        ? `Belum ada event untuk kategori ${categories.find(c => c.value === selectedCategory)?.label}`
                        : 'Event akan segera tersedia'
                    }
                  </p>

                  {/* Simple Action Button */}
                  {(searchTerm || selectedCategory) && (
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('');
                        }}
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hapus filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
