import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Users } from 'lucide-react';
import EventCard from '../components/EventCard';
import { eventsAPI } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filters = [
    { key: 'all', label: 'All Events', count: 0 },
    { key: 'kompetisi', label: 'Competitions', count: 0 },
    { key: 'seminar', label: 'Seminars', count: 0 },
    { key: 'workshop', label: 'Workshops', count: 0 }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      const eventsData = (response.data && response.data.events) || [];
      setEvents(eventsData);
      setFilteredEvents(eventsData);

      // Update filter counts
      filters[0].count = eventsData.length;
      filters[1].count = eventsData.filter(e => e.kategori?.toLowerCase() === 'kompetisi').length;
      filters[2].count = eventsData.filter(e => e.kategori?.toLowerCase() === 'seminar').length;
      filters[3].count = eventsData.filter(e => e.kategori?.toLowerCase() === 'workshop').length;
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setFilteredEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterAndSortEvents(term, activeFilter, sortBy);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    filterAndSortEvents(searchTerm, filter, sortBy);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    filterAndSortEvents(searchTerm, activeFilter, sort);
  };

  const filterAndSortEvents = (search, filter, sort) => {
    let filtered = [...events];

    // Filter by search term
    if (search) {
      filtered = filtered.filter(event =>
        event.judul.toLowerCase().includes(search.toLowerCase()) ||
        event.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
        event.lokasi.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(event =>
        event.kategori && event.kategori.toLowerCase() === filter.toLowerCase()
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sort) {
        case 'date':
          return new Date(a.tanggal) - new Date(b.tanggal);
        case 'popularity':
          return (b.registered_count || 0) - (a.registered_count || 0);
        case 'name':
          return a.judul.localeCompare(b.judul);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
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
                  onChange={handleSearch}
                  placeholder="Search events, competitions, workshops..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="popularity">Sort by Popularity</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${activeFilter === filter.key
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <span>{filter.label}</span>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-bold
                  ${activeFilter === filter.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events
            {activeFilter !== 'all' && (
              <span> in <span className="font-semibold text-blue-600 capitalize">{activeFilter}</span></span>
            )}
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
        ) : filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
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
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
                setFilteredEvents(events);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredEvents.length > 0 && filteredEvents.length >= 9 && (
          <div className="text-center mt-12">
            <button className="bg-white text-gray-700 px-8 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
              Load More Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
