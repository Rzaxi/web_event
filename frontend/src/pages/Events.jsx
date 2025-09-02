import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ChevronDown,
  BookOpen,
  Trophy,
  Palette,
  Code,
  Briefcase,
  Heart,
  Target,
  Presentation,
  MoreHorizontal,
  X,
  SlidersHorizontal
} from 'lucide-react';
import EventCard from '../components/event/EventCard';
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
  const eventsPerPage = 9;

  const categories = [
    { value: 'akademik', label: 'Akademik', icon: BookOpen, color: 'blue' },
    { value: 'olahraga', label: 'Olahraga', icon: Trophy, color: 'green' },
    { value: 'seni_budaya', label: 'Seni & Budaya', icon: Palette, color: 'purple' },
    { value: 'teknologi', label: 'Teknologi', icon: Code, color: 'indigo' },
    { value: 'kewirausahaan', label: 'Kewirausahaan', icon: Briefcase, color: 'orange' },
    { value: 'sosial', label: 'Sosial', icon: Heart, color: 'pink' },
    { value: 'kompetisi', label: 'Kompetisi', icon: Target, color: 'red' },
    { value: 'workshop', label: 'Workshop', icon: Presentation, color: 'teal' },
    { value: 'seminar', label: 'Seminar', icon: Users, color: 'cyan' },
    { value: 'lainnya', label: 'Lainnya', icon: MoreHorizontal, color: 'gray' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [currentPage, sortBy, searchTerm, selectedCategory, selectedDifficulty, priceFilter]);

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
      
      console.log('API Response:', response.data);
      setEvents(response.data.data?.events || response.data.events || []);
      const total = response.data.data?.total || response.data.total || 0;
      setTotalEvents(total);
      setTotalPages(Math.ceil(total / eventsPerPage));
    } catch (error) {
      console.error('Error fetching events:', error);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          className={`px-4 py-2 mx-1 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
            currentPage === i
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Semua Events
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Temukan berbagai event menarik yang sesuai dengan minat dan passion Anda. 
              Dari workshop teknologi hingga kompetisi olahraga, semua ada di sini!
            </p>
            <div className="mt-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <span className="text-white/90 font-medium">
                  {totalEvents} Events Tersedia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari event berdasarkan judul, lokasi, atau deskripsi..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="flex gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-6 py-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                >
                  <option value="tanggal">Urutkan: Tanggal</option>
                  <option value="judul">Urutkan: Judul</option>
                  <option value="lokasi">Urutkan: Lokasi</option>
                  <option value="created_at">Urutkan: Terbaru</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  showFilters || getActiveFiltersCount() > 0
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filter
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" />
                  Kategori
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategory === category.value;
                    return (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryFilter(category.value)}
                        className={`flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200 min-h-[48px] ${
                          isSelected
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:shadow-sm'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm text-center">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tingkat Kesulitan</h3>
                <div className="flex flex-wrap gap-3">
                  {['pemula', 'menengah', 'lanjutan'].map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => handleDifficultyFilter(difficulty)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        selectedDifficulty === difficulty
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Harga</h3>
                <div className="flex flex-wrap gap-3">
                  {['gratis', 'berbayar'].map((price) => (
                    <button
                      key={price}
                      onClick={() => handlePriceFilter(price)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        priceFilter === price
                          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      {price.charAt(0).toUpperCase() + price.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {getActiveFiltersCount() > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hapus Semua Filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {categories.find(c => c.value === selectedCategory)?.label}
                <button
                  onClick={() => setSelectedCategory('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDifficulty && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                <button
                  onClick={() => setSelectedDifficulty('')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {priceFilter.charAt(0).toUpperCase() + priceFilter.slice(1)}
                <button
                  onClick={() => setPriceFilter('')}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Events Grid */}
        {loading || isTransitioning ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        ) : events.length > 0 ? (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out ${
              isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}>
              {events.map((event, index) => (
                <div 
                  key={event.id} 
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
            {totalPages > 1 && renderPagination()}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-12 max-w-md mx-auto">
              <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tidak ada event ditemukan
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || getActiveFiltersCount() > 0
                  ? 'Coba ubah kata kunci pencarian atau filter yang digunakan'
                  : 'Belum ada event yang tersedia saat ini'
                }
              </p>
              {(searchTerm || getActiveFiltersCount() > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Hapus Semua Filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
