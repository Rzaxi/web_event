import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar } from 'lucide-react';
import EventCard from '../components/event/EventCard';
import { eventsAPI } from '../services/api';
import { useDebounce } from '../hooks/useDebounce'; // Assuming you have a debounce hook

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('tanggal'); // Default sort by date
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  const fetchEvents = useCallback(async (page, search, sort, loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = {
        page,
        limit: 9,
        search: search || undefined,
        sortBy: sort,
        sortOrder: 'ASC',
      };

      const response = await eventsAPI.getAll(params);
      const { events: newEvents, pagination } = response.data;

      setEvents(prevEvents => loadMore ? [...prevEvents, ...newEvents] : newEvents);
      setTotalPages(pagination.totalPages || 1);
      setTotalEvents(pagination.total || 0);
      setCurrentPage(pagination.page || 1);

    } catch (error) {
      console.error('Error fetching events:', error);
      // Optionally, show a toast notification to the user
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial fetch and fetch on filter change
  useEffect(() => {
    fetchEvents(1, debouncedSearchTerm, sortBy);
  }, [debouncedSearchTerm, sortBy, fetchEvents]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchEvents(currentPage + 1, debouncedSearchTerm, sortBy, true);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('tanggal');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Events</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing opportunities to learn, compete, and grow with fellow students
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search events by title, description, or location..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="tanggal">Sort by Date</option>
                <option value="judul">Sort by Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{events.length}</span> of <span className="font-semibold text-gray-900">{totalEvents}</span> events
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-white text-gray-700 px-8 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading...' : 'Load More Events'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
