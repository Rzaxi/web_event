import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Video, 
  Laptop, 
  GraduationCap, 
  Music, 
  Trophy, 
  MoreHorizontal 
} from 'lucide-react';

const EventCard = ({ event, featured = false, variant = 'light' }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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
      webinar: { icon: Video, label: 'Webinar', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
      bootcamp: { icon: Laptop, label: 'Bootcamp', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
      pelatihan: { icon: GraduationCap, label: 'Pelatihan', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
      konser: { icon: Music, label: 'Konser', color: 'pink', bgColor: 'bg-pink-100', textColor: 'text-pink-700' },
      kompetisi: { icon: Trophy, label: 'Kompetisi', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
      lainnya: { icon: MoreHorizontal, label: 'Lainnya', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-700' }
    };
    return categories[category] || categories.lainnya;
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

  // Single gradient color for all cards like reference
  const getGradientColors = () => {
    return 'from-blue-500 to-blue-700'; // Same blue gradient for all cards
  };

  return (
    <Link to={`/events/${id}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-300 hover:border-gray-400 transition-all duration-300 overflow-hidden flex flex-col transform hover:scale-[1.02]" 
           style={{ height: '450px' }}>
        {/* Header Section - FOTO LEBIH BESAR */}
        <div className="relative overflow-hidden bg-gray-200" style={{ height: '280px' }}>
          {/* Gambar dengan penanganan error CORB yang efisien */}
          {flyer_url && !imageError ? (
            <>
              {/* Loading skeleton */}
              {imageLoading && (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center animate-pulse">
                  <CategoryIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {/* Gambar utama dengan proteksi CORB */}
              <img 
                src={flyer_url} 
                alt={judul}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            </>
          ) : (
            /* Fallback jika tidak ada gambar atau error */
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <CategoryIcon className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>

        {/* Content Section - Minimal layout */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category tag hitam di atas judul */}
          <div className="mb-2">
            <span className="text-gray-900 text-xs font-medium">
              {categoryInfo.label}
            </span>
          </div>

          {/* Title - Hanya judul tanpa deskripsi */}
          <div className="mb-4">
            <h3 className="text-gray-900 text-base font-bold leading-tight line-clamp-3" 
                style={{ minHeight: '48px', maxHeight: '72px', overflow: 'hidden' }}>
              {judul}
            </h3>
          </div>

          {/* Event Details - Lebih spaced */}
          <div className="space-y-2 mb-4">
            {/* Date */}
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{formatDate(tanggal)}</span>
              {waktu_mulai && <span className="ml-2 flex-shrink-0">• {formatTime(waktu_mulai)}</span>}
            </div>

            {/* Location */}
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{lokasi}</span>
            </div>

            {/* Price Info */}
            <div className="flex items-center text-gray-500 text-sm">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className={`font-medium ${!biaya || biaya == 0 ? 'text-green-600' : 'text-blue-600'}`}>
                {formatPrice(biaya)}
              </span>
            </div>
          </div>

          {/* Bottom Section - Lebih prominent */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            {/* Participants */}
            <div className="flex items-center text-gray-500 text-sm">
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              <span>{participantCount || 0} Peserta</span>
            </div>

            {/* Action Arrow - Normal size */}
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0">
              <svg className="w-4 h-4 text-gray-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
