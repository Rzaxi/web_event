import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const EventCard = ({ event, featured = false }) => {
  const categoryColors = {
    kompetisi: 'bg-orange-100 text-orange-800',
    seminar: 'bg-indigo-100 text-indigo-800',
    workshop: 'bg-green-100 text-green-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const categoryColor = categoryColors[event.kategori?.toLowerCase()] || categoryColors.default;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString?.slice(0, 5) || '';
  };

  if (featured) {
    return (
      <Link to={`/events/${event.id}`} className="relative bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 block">
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-indigo-500 to-green-500 overflow-hidden">
          {event.flyer && (
            <img
              src={`http://localhost:3000${event.flyer}`}
              alt={event.judul}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}>
              {event.kategori || 'Event'}
            </span>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Content Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-2xl font-bold mb-2 line-clamp-2">{event.judul}</h3>
            <p className="text-gray-200 text-sm line-clamp-2 mb-4">{event.deskripsi}</p>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(event.tanggal)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.lokasi}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center text-sm mb-1">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{event.registered_count || 0} participants</span>
                </div>
                <div className="text-xs text-gray-300">
                  {event.max_participants ? `${event.registered_count || 0}/${event.max_participants} spots` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/events/${event.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-green-400 overflow-hidden">
        {event.flyer && (
          <img
            src={`http://localhost:3000${event.flyer}`}
            alt={event.judul}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
            {event.kategori || 'Event'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {event.judul}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.deskripsi}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
            <span>{formatDate(event.tanggal)}</span>
            {event.waktu && (
              <>
                <Clock className="w-4 h-4 ml-4 mr-2 text-indigo-500" />
                <span>{formatTime(event.waktu)}</span>
              </>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
            <span className="line-clamp-1">{event.lokasi}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2 text-indigo-500" />
            <span>{event.registered_count || 0} participants</span>
            {event.max_participants && (
              <span className="text-xs text-gray-400 ml-1">
                / {event.max_participants} spots
              </span>
            )}
          </div>
        </div>

        {/* Registration Progress */}
        {event.max_participants && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Registration Progress</span>
              <span>{Math.round(((event.registered_count || 0) / event.max_participants) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(((event.registered_count || 0) / event.max_participants) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors group-hover:bg-indigo-700 text-center">
          Lihat Detail
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
