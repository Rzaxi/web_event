import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Sponsored = () => {
  const topRowPartners = [
    { 
      name: 'Zoom',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.5 9.5V14.5L11.5 12L7.5 9.5Z M21 6.5C21 5.67 20.33 5 19.5 5H4.5C3.67 5 3 5.67 3 6.5V17.5C3 18.33 3.67 19 4.5 19H19.5C20.33 19 21 18.33 21 17.5V6.5Z"/>
        </svg>
      )
    },
    { 
      name: 'GitLab',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 13.5c-1 1-2.5 1-3.5 1s-2.5 0-3.5-1c-1-1-1-2.5-1-3.5s0-2.5 1-3.5c1-1 2.5-1 3.5-1s2.5 0 3.5 1c1 1 1 2.5 1 3.5s0 2.5-1 3.5z"/>
        </svg>
      )
    },
    { 
      name: 'Meta',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 13.5c-1 1-2.5 1-3.5 1s-2.5 0-3.5-1c-1-1-1-2.5-1-3.5s0-2.5 1-3.5c1-1 2.5-1 3.5-1s2.5 0 3.5 1c1 1 1 2.5 1 3.5s0 2.5-1 3.5z"/>
        </svg>
      )
    },
    { 
      name: 'YouTube',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    { 
      name: 'Visa',
      icon: (
        <svg className="w-9 h-9 md:w-11 md:h-11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.539 9.186a4.155 4.155 0 00-1.451-.251c-1.6 0-2.73.806-2.738 1.963-.01.85.803 1.329 1.418 1.613.631.292.842.476.84.737-.004.397-.504.577-.969.577-.639 0-.988-.089-1.525-.312l-.199-.093-.227 1.332c.389.162 1.09.3 1.814.313 1.701 0 2.813-.801 2.826-2.032.014-.679-.426-1.192-1.352-1.616-.563-.275-.912-.459-.912-.738 0-.247.299-.511.924-.511a2.95 2.95 0 011.213.229l.15.067.227-1.287-.039.009zm4.152-.143h-1.25c-.389 0-.682.107-.852.493l-2.404 5.446h1.701l.34-.893 2.076.002c.049.209.199.891.199.891h1.5l-1.31-5.939zm-10.642-.05h1.621l-1.014 5.942H9.037l1.012-5.944v.002zm-4.115 3.275.168.825 1.584-4.05h1.717l-2.551 5.931H5.139l-1.4-5.022a.339.339 0 00-.149-.199 6.948 6.948 0 00-1.592-.589l.022-.125h2.609c.354.014.639.125.734.503l.57 2.729v-.003z"/>
        </svg>
      )
    },
    { 
      name: 'Vimeo',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/>
        </svg>
      )
    },
    { 
      name: 'Telegram',
      icon: (
        <svg className="w-7 h-7 md:w-9 md:h-9" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      )
    },
    { 
      name: 'Windows',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
        </svg>
      )
    },
    { 
      name: 'Notion',
      icon: (
        <svg className="w-7 h-7 md:w-9 md:h-9" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z"/>
        </svg>
      )
    }
  ];

  const bottomRowPartners = [
    { 
      name: 'Cadence',
      icon: (
        <svg className="w-24 h-6" viewBox="0 0 100 24" fill="currentColor">
          <text x="0" y="18" fontSize="16" fontWeight="600">CADENCE</text>
        </svg>
      )
    },
    { 
      name: 'Atlassian',
      icon: (
        <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 13.5c-1 1-2.5 1-3.5 1s-2.5 0-3.5-1c-1-1-1-2.5-1-3.5s0-2.5 1-3.5c1-1 2.5-1 3.5-1s2.5 0 3.5 1c1 1 1 2.5 1 3.5s0 2.5-1 3.5z"/>
        </svg>
      )
    },
    { 
      name: 'Daring',
      icon: (
        <svg className="w-20 h-6" viewBox="0 0 80 24" fill="currentColor">
          <text x="0" y="18" fontSize="16" fontWeight="700">Daring.</text>
        </svg>
      )
    },
    { 
      name: 'Flowcode',
      icon: (
        <svg className="w-24 h-6" viewBox="0 0 100 24" fill="currentColor">
          <text x="0" y="18" fontSize="14" fontWeight="700">⊡ FLOWCODE®</text>
        </svg>
      )
    },
    { 
      name: 'EvolutionIQ',
      icon: (
        <svg className="w-28 h-6" viewBox="0 0 110 24" fill="currentColor">
          <text x="0" y="18" fontSize="14" fontWeight="600">EvolutionIQ</text>
        </svg>
      )
    },
    { 
      name: 'Earned',
      icon: (
        <svg className="w-20 h-6" viewBox="0 0 80 24" fill="currentColor">
          <text x="0" y="18" fontSize="16" fontWeight="600">Earned</text>
        </svg>
      )
    },
    { 
      name: 'FlyByJing',
      icon: (
        <svg className="w-28 h-10" viewBox="0 0 110 40" fill="#7C3AED">
          <rect width="110" height="40" rx="4" fill="#7C3AED"/>
          <text x="55" y="25" fontSize="12" fontWeight="700" fill="white" textAnchor="middle">FLY BY JING</text>
        </svg>
      )
    }
  ];

  return (
    <section className="relative py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="text-sm font-medium text-indigo-600 mb-4 block uppercase tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Partners
          </motion.span>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Trusted by Leading Companies
          </motion.h2>
        </div>

        {/* Top Row - Slides Left */}
        <div className="relative mb-8 overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -1674], // Width of one set (9 items * 186px)
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {[...topRowPartners, ...topRowPartners, ...topRowPartners, ...topRowPartners].map((partner, index) => (
              <div
                key={`top-${index}`}
                className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-6 flex items-center justify-center hover:shadow-md transition-shadow duration-300"
                style={{ minWidth: '180px', height: '80px' }}
              >
                <div className="text-gray-800">
                  {partner.icon}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Row - Slides Right */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [-1302, 0], // Width of one set (7 items * 186px)
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {[...bottomRowPartners, ...bottomRowPartners, ...bottomRowPartners, ...bottomRowPartners].map((partner, index) => (
              <div
                key={`bottom-${index}`}
                className="flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 px-8 py-6 flex items-center justify-center hover:shadow-md transition-shadow duration-300"
                style={{ minWidth: '180px', height: '80px' }}
              >
                <div className="text-gray-800">
                  {partner.icon}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <motion.button
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See our clients
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Sponsored;
