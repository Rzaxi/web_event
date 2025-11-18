import React from 'react';
import { Bookmark, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookmarksTab = ({ bookmarkedEvents }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getEventStatus = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return { label: 'Completed', color: 'bg-gray-100 text-gray-600' };
    } else if (eventDate.getTime() === today.getTime()) {
      return { label: 'Today', color: 'bg-green-100 text-green-600' };
    } else {
      return { label: 'Upcoming', color: 'bg-blue-100 text-blue-600' };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bookmarked Events</h2>
      
      {bookmarkedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No bookmarked events yet</p>
          <p className="text-gray-400 text-sm mt-2">Events you bookmark will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarkedEvents.map((event) => {
            const status = getEventStatus(event.tanggal);
            
            return (
              <div 
                key={event.id} 
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {/* Left Section - Icon & Info */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Calendar Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {event.judul}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(event.tanggal)}</span>
                      </div>
                      
                      {event.lokasi && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[200px]">{event.lokasi}</span>
                        </div>
                      )}
                    </div>

                    {/* View Details Link */}
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Right Section - Status Badge */}
                <div className="flex-shrink-0 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookmarksTab;
