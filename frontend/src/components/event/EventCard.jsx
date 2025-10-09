import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Trophy,
  Palette,
  Code,
  Briefcase,
  Heart,
  Target,
  Presentation,
  MoreHorizontal,
  DollarSign,
  UserCheck
} from 'lucide-react';

const EventCard = ({ event, featured = false, variant = 'light' }) => {
  if (!event) {
    return null;
  }

  const { 
    id, 
    judul, 
    tanggal, 
    lokasi, 
    flyer_url, 
    deskripsi, 
    status, 
    waktu_mulai, 
    participantCount,
    kategori,
    tingkat_kesulitan,
    kapasitas_peserta,
    biaya
  } = event;

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

  const formatPrice = (price) => {
    if (!price || price == 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryInfo = (category) => {
    const categories = {
      akademik: { icon: BookOpen, label: 'Akademik', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
      olahraga: { icon: Trophy, label: 'Olahraga', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
      seni_budaya: { icon: Palette, label: 'Seni & Budaya', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
      teknologi: { icon: Code, label: 'Teknologi', color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700' },
      kewirausahaan: { icon: Briefcase, label: 'Kewirausahaan', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
      sosial: { icon: Heart, label: 'Sosial', color: 'pink', bgColor: 'bg-pink-100', textColor: 'text-pink-700' },
      kompetisi: { icon: Target, label: 'Kompetisi', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
      workshop: { icon: Presentation, label: 'Workshop', color: 'teal', bgColor: 'bg-teal-100', textColor: 'text-teal-700' },
      seminar: { icon: Users, label: 'Seminar', color: 'cyan', bgColor: 'bg-cyan-100', textColor: 'text-cyan-700' },
      lainnya: { icon: MoreHorizontal, label: 'Lainnya', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-700' }
    };
    return categories[category] || categories.lainnya;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      pemula: 'bg-green-100 text-green-700',
      menengah: 'bg-yellow-100 text-yellow-700',
      lanjutan: 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || colors.pemula;
  };

  const categoryInfo = getCategoryInfo(kategori);
  const CategoryIcon = categoryInfo.icon;

  // Determine card styling based on variant
  const isDark = variant === 'dark';
  const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-200/50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtextColor = isDark ? 'text-gray-300' : 'text-gray-500';
  const detailsColor = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`${cardBg} rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border ${borderColor} h-full flex flex-col`}>
      {/* Header dengan gradient sphere */}
      <div className="p-5 pb-0">
        <div className={`relative h-40 overflow-hidden ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} flex items-center justify-center rounded-xl`}>
          {flyer_url ? (
            <img 
              src={flyer_url} 
              alt={judul}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Gradient Sphere/Blob - Different colors for dark/light */}
              <div className="relative">
                {isDark ? (
                  <>
                    {/* Dark variant - More vibrant colors */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 opacity-90 blur-sm"></div>
                    <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 opacity-80"></div>
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-white/50 to-white/20 blur-sm"></div>
                    <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 opacity-70"></div>
                  </>
                ) : (
                  <>
                    {/* Light variant - Softer colors */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 opacity-90 blur-sm"></div>
                    <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-purple-300 via-purple-400 to-indigo-500 opacity-70"></div>
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-white/40 to-white/10 blur-sm"></div>
                    <div className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-500 opacity-60"></div>
                  </>
                )}
              </div>
            </div>
          )}
        
          {/* Category Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <div className={`${isDark ? 'bg-gray-800/90 text-gray-300 border-gray-600/50' : 'bg-white/90 text-gray-600 border-gray-200/50'} backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border`}>
              {categoryInfo.label}
            </div>
          </div>

          {/* Price Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <div className={`${isDark ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} px-3 py-1 rounded-full text-xs font-medium`}>
              {formatPrice(biaya)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className={`text-lg font-semibold ${textColor} mb-3 line-clamp-2 leading-snug`}>
          {judul}
        </h3>

        {/* Description */}
        <p className={`text-sm ${subtextColor} mb-4 line-clamp-2 leading-relaxed`}>
          {deskripsi || 'Bergabunglah dengan event menarik ini dan dapatkan pengalaman berharga bersama komunitas yang luar biasa.'}
        </p>

        {/* Event Details - Ultra Clean - Always at bottom */}
        <div className="mt-auto space-y-2 mb-5">
          {/* Date & Time */}
          <div className={`flex items-center text-sm ${detailsColor}`}>
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatDate(tanggal)}</span>
            {waktu_mulai && <span className="ml-2 text-xs">• {formatTime(waktu_mulai)} WIB</span>}
          </div>

          {/* Location */}
          <div className={`flex items-center text-sm ${detailsColor}`}>
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{lokasi}</span>
          </div>

          {/* Participants */}
          <div className={`flex items-center text-sm ${detailsColor}`}>
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{participantCount || 0} / {kapasitas_peserta || 0} peserta</span>
          </div>
        </div>

        {/* Button - Minimal */}
        <div>
          <Link
            to={`/events/${id}`}
            className={`inline-flex items-center text-sm font-medium ${textColor} ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-700'} transition-colors group`}
          >
            Learn more
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
