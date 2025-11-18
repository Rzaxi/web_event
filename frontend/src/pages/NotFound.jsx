import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Separate useEffect for navigation to avoid setState during render
  useEffect(() => {
    if (countdown === 0) {
      navigate('/');
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-32 pb-20">
      <div className="flex items-center justify-center w-full max-w-6xl mx-auto">
        {/* Left Side - Simple Event Logo */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            {/* Simple Event Logo */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Main Logo Circle */}
              <div className="w-64 h-64 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center relative animate-pulse">
                {/* Inner Circle */}
                <div className="w-48 h-48 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-full shadow-inner flex items-center justify-center relative">
                  {/* Event Calendar Icon */}
                  <div className="relative">
                    {/* Calendar Base */}
                    <div className="w-24 h-20 bg-gradient-to-b from-gray-100 to-white rounded-lg shadow-lg border-2 border-gray-300 relative">
                      {/* Calendar Header */}
                      <div className="w-full h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-md flex items-center justify-center">
                        <div className="flex space-x-2">
                          <div className="w-1 h-3 bg-white rounded-full"></div>
                          <div className="w-1 h-3 bg-white rounded-full"></div>
                          <div className="w-1 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Calendar Body */}
                      <div className="p-2 space-y-1">
                        <div className="flex justify-center space-x-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                        </div>
                        <div className="flex justify-center space-x-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* Calendar Rings */}
                      <div className="absolute -top-2 left-2 w-2 h-4 bg-gray-400 rounded-full"></div>
                      <div className="absolute -top-2 right-2 w-2 h-4 bg-gray-400 rounded-full"></div>
                    </div>
                    
                    {/* 404 Badge */}
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs">404</span>
                    </div>
                  </div>
                </div>
                
                {/* Logo Border Decoration */}
                <div className="absolute inset-2 border-4 border-white/30 rounded-full"></div>
                <div className="absolute inset-6 border-2 border-blue-300/50 rounded-full"></div>
              </div>
              
              {/* Simple Floating Elements */}
              <div className="absolute top-16 left-16 text-3xl animate-bounce opacity-60" style={{ animationDelay: '0s' }}>📅</div>
              <div className="absolute top-20 right-20 text-2xl animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}>🎪</div>
              <div className="absolute bottom-20 left-20 text-2xl animate-bounce opacity-60" style={{ animationDelay: '1s' }}>🎭</div>
              <div className="absolute bottom-16 right-16 text-3xl animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}>⭐</div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 text-left pl-12">
          {/* Large 404 */}
          <div className="mb-8">
            <h1 className="text-[12rem] font-black text-blue-500 leading-none">404</h1>
          </div>

          {/* Main Message */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-gray-800 mb-6 uppercase tracking-wide">
              Event Not Found
            </h2>
            <p className="text-2xl text-gray-600 leading-relaxed">
              Sepertinya event yang Anda cari sudah berakhir atau tidak tersedia!
            </p>
          </div>

          {/* Enhanced Button */}
          <Link
            to="/"
            className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold uppercase tracking-wide rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group border-2 border-blue-500 hover:border-blue-600"
          >
            <span>Kembali ke EventHub</span>
            <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>

          {/* Auto Redirect Counter */}
          <div className="mt-8 text-lg text-gray-500">
            <p>Otomatis kembali ke beranda dalam {countdown} detik</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
