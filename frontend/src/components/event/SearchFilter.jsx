import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilter = ({ onSearch, onFilterChange, activeFilter = 'all' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filters = [
    { key: 'all', label: 'All Events', count: 47 },
    { key: 'kompetisi', label: 'Competitions', count: 23 },
    { key: 'seminar', label: 'Seminars', count: 15 },
    { key: 'workshop', label: 'Workshops', count: 9 }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterClick = (filterKey) => {
    onFilterChange(filterKey);
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Featured Events Collection
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover Your Next
            <br />
            <span className="text-orange-500">Amazing Journey</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bergabunglah dengan ribuan siswa dalam kompetisi, workshop, dan seminar
            yang akan mengubah masa depan akademik dan karier kamu.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Cari event, kompetisi, workshop yang menarik..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterClick(filter.key)}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200
                  ${activeFilter === filter.key
                    ? 'bg-indigo-600 text-white shadow-lg'
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

            <button className="flex items-center space-x-2 px-6 py-3 rounded-full font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200">
              <Filter className="w-4 h-4" />
              <span>Advanced</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
