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

const EventCard = ({ event, featured = false }) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-gray-200">
      {/* Header dengan gradient dan image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400 overflow-hidden">
        {flyer_url ? (
          <img 
            src={flyer_url} 
            alt={judul}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-teal-400 flex items-center justify-center">
            <CategoryIcon className="w-16 h-16 text-white/80" />
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <div className={`inline-flex items-center ${categoryInfo.bgColor} ${categoryInfo.textColor} px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm border border-white/20`}>
            <CategoryIcon className="w-3 h-3 mr-1.5" />
            {categoryInfo.label}
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
            {formatPrice(biaya)}
          </div>
        </div>

        {/* Difficulty Badge */}
        {tingkat_kesulitan && (
          <div className="absolute bottom-4 left-4">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tingkat_kesulitan)} backdrop-blur-sm`}>
              {tingkat_kesulitan.charAt(0).toUpperCase() + tingkat_kesulitan.slice(1)}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {judul}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {deskripsi || 'Deskripsi event akan segera tersedia.'}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          {/* Date & Time */}
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{formatDate(tanggal)}</div>
              {waktu_mulai && (
                <div className="text-xs text-gray-500">{formatTime(waktu_mulai)} WIB</div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3">
              <MapPin className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 truncate">{lokasi}</div>
            </div>
          </div>

          {/* Participants & Capacity */}
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
              <UserCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {participantCount || 0}
                {kapasitas_peserta && ` / ${kapasitas_peserta}`} peserta
              </div>
              {kapasitas_peserta && (
                <div className="text-xs text-gray-500">
                  {Math.round(((participantCount || 0) / kapasitas_peserta) * 100)}% terisi
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar (if capacity exists) */}
        {kapasitas_peserta && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(((participantCount || 0) / kapasitas_peserta) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Button */}
        <Link
          to={`/events/${id}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
        >
          <span className="flex items-center justify-center">
            Lihat Detail
            <Star className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
