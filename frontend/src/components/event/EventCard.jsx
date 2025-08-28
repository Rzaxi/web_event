import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const EventCard = ({ event, featured = false }) => {
  if (!event) {
    return null;
  }

  const { id, judul, tanggal, lokasi, flyer_url, deskripsi, status, waktu_mulai, participantCount } = event;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('id-ID', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // Format HH:MM
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header dengan gradient */}
      <div className="relative h-40 bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400">
        {/* Badge Event */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
            Event
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {judul}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {deskripsi}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-5">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            <span>{formatDate(tanggal)}</span>
            {waktu_mulai && (
              <>
                <Clock className="w-4 h-4 ml-4 mr-2 text-green-500" />
                <span>{formatTime(waktu_mulai)}</span>
              </>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
            <span className="truncate">{lokasi}</span>
          </div>

          {/* Participants */}
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-purple-500" />
            <span>{participantCount || 0} participants</span>
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/events/${id}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
