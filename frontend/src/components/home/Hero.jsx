import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, Star, CheckCircle, Sparkles, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../common/AnimatedSection';

const Hero = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Start from 0 (card 1)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardOffset, setCardOffset] = useState(0);
  const [slidingOut, setSlidingOut] = useState(null);
  const [displayOrder, setDisplayOrder] = useState([1, 2, 3, 4, 0]); // Card display order: show 2,3,4,5 first (hide card 1 as it's background)
<<<<<<< HEAD

=======
  
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
  // Use ref to always have latest currentCardIndex
  const currentCardIndexRef = useRef(currentCardIndex);
  useEffect(() => {
    currentCardIndexRef.current = currentCardIndex;
  }, [currentCardIndex]);

  // Featured event destinations/categories - matching reference image
  const eventDestinations = [
    {
      id: 1,
      title: "NAGANO PREFECTURE",
      region: "ASIA",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
      description: "Experience traditional Japanese festivals and cultural celebrations in the heart of the Japanese Alps. From cherry blossom festivals to winter illuminations.",
      shortDescription: "Music Festivals & Concerts"
    },
    {
      id: 2,
      title: "MARRAKECH MOROCCO",
      region: "AFRICA",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=300&h=400&fit=crop",
      backgroundImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1920&h=1080&fit=crop",
      description: "Immerse yourself in the vibrant culture of Morocco with traditional music, dance, and art festivals in the enchanting red city.",
      shortDescription: "Cultural Events & Arts"
    },
    {
      id: 3,
      title: "YOSEMITE NATIONAL",
      region: "USA",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
      backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
      description: "Join outdoor adventures and nature-focused events in one of America's most iconic national parks. Rock climbing, hiking, and stargazing events.",
      shortDescription: "Adventure & Outdoor"
    },
    {
      id: 4,
      title: "LOS CABOS BEACH",
      region: "MEXICO",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=400&fit=crop",
      backgroundImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=1080&fit=crop",
      description: "Enjoy beach parties, water sports, and sunset celebrations on the beautiful shores of Baja California Sur.",
      shortDescription: "Beach Parties & Sports"
    },
    {
      id: 5,
      title: "SANTORINI GREECE",
      region: "EUROPE",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=400&fit=crop",
      backgroundImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1920&h=1080&fit=crop",
      description: "Experience magical sunsets and traditional Greek celebrations on the stunning cliffs of Santorini. Wine festivals, cultural events, and breathtaking views.",
      shortDescription: "Wine & Cultural Events"
    }
  ];

  // Get current destination for background and content
  const getCurrentDestination = () => {
    const destination = eventDestinations[currentCardIndex % eventDestinations.length];
    return destination;
  };

  // Original content for initial load
  const getOriginalContent = () => {
    return {
      title: "DISCOVER\nEVENTS",
      region: "JOIN AMAZING EVENTS",
      description: "Ready to experience something extraordinary? Join thousands of participants in amazing events worldwide. From concerts and festivals to cultural celebrations - your next adventure awaits!"
    };
  };

  // Get leftmost visible card index - this will be the next background
  const getLeftmostCardIndex = () => {
    // Simple sequence: next card after current background
    // Card 0 → Card 1 → Card 2 → Card 3 → Card 0 (loop)
    return (currentCardIndex + 1) % eventDestinations.length;
  };

  // Navigation functions - next card in sequence becomes background
  const nextCards = () => {
    if (isTransitioning) return; // Prevent multiple calls
<<<<<<< HEAD

    setIsTransitioning(true);

    // Get the next card using ref to get latest value
    const nextBackgroundCard = (currentCardIndexRef.current + 1) % eventDestinations.length;

    // STEP 1: Start card expansion animation
    setSlidingOut(nextBackgroundCard);

=======
    
    setIsTransitioning(true);
    
    // Get the next card using ref to get latest value
    const nextBackgroundCard = (currentCardIndexRef.current + 1) % eventDestinations.length;
    
    // STEP 1: Start card expansion animation
    setSlidingOut(nextBackgroundCard);
    
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    // STEP 2: Background changes AFTER animation completes (1.5s)
    setTimeout(() => {
      setCurrentCardIndex(nextBackgroundCard);
    }, 1500); // Background changes AFTER full animation
<<<<<<< HEAD

=======
    
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    // STEP 3: Cards slide AFTER background changes (1.7s)
    setTimeout(() => {
      setDisplayOrder(prev => {
        const newOrder = [...prev];
        newOrder.shift(); // Remove first card
        newOrder.push(nextBackgroundCard); // Add it to the end
        return newOrder;
      });
      setSlidingOut(null);
<<<<<<< HEAD

=======
      
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      setTimeout(() => {
        // STEP 4: Animation complete
        setIsTransitioning(false);
      }, 800);
    }, 1700); // Cards slide after background change
  };

  // Auto-rotate cards with infinite loop and initial delay
  useEffect(() => {
    // Initial delay of 2 seconds before starting animation
    const initialTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        nextCards();
      }, 6000); // 6 seconds for complete card overlay sequence

      // Store interval ID for cleanup
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(initialTimeout);
  }, []);

  const prevCards = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
<<<<<<< HEAD

=======
      
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      if (showOriginalBackground) {
        setShowOriginalBackground(false);
        setCurrentCardIndex(4); // Last card becomes background
        setSlidingOut(4);
      } else {
        // Get rightmost card and make it background
        const rightmostCard = (getLeftmostCardIndex() + 4) % eventDestinations.length;
        setCurrentCardIndex(rightmostCard);
        setSlidingOut(rightmostCard);
      }
<<<<<<< HEAD

=======
      
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      setTimeout(() => {
        // Slide cards right
        setCardOffset(prev => prev + 208);
        setSlidingOut(null);
<<<<<<< HEAD

=======
        
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        setTimeout(() => {
          setIsTransitioning(false);
        }, 800);
      }, 600);
    }
  };

  // Get all 5 cards for display
  const getCurrentCards = () => {
    return eventDestinations; // Show all 5 cards
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{ boxShadow: 'none !important' }}>
      {/* Animated Background with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentCardIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
<<<<<<< HEAD
          transition={{
            duration: 0.8,
=======
          transition={{ 
            duration: 0.8, 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
            ease: "easeOut"
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${getCurrentDestination()?.backgroundImage || eventDestinations[0].backgroundImage}')`,
            willChange: 'opacity'
          }}
        />
      </AnimatePresence>
<<<<<<< HEAD

=======
      
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      {/* Dynamic overlay that changes with background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`overlay-${currentCardIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
<<<<<<< HEAD
          className={`absolute inset-0 z-10 ${currentCardIndex === 0
            ? 'bg-gradient-to-r from-blue-900/30 via-black/40 to-purple-900/30'
            : currentCardIndex === 1
              ? 'bg-gradient-to-r from-orange-900/30 via-black/40 to-red-900/30'
              : currentCardIndex === 2
                ? 'bg-gradient-to-r from-green-900/30 via-black/40 to-teal-900/30'
                : currentCardIndex === 3
                  ? 'bg-gradient-to-r from-purple-900/30 via-black/40 to-pink-900/30'
                  : 'bg-gradient-to-r from-indigo-900/30 via-black/40 to-blue-900/30'
            }`}
=======
          className={`absolute inset-0 z-10 ${
            currentCardIndex === 0 
              ? 'bg-gradient-to-r from-blue-900/30 via-black/40 to-purple-900/30'
              : currentCardIndex === 1
                ? 'bg-gradient-to-r from-orange-900/30 via-black/40 to-red-900/30'
                : currentCardIndex === 2
                  ? 'bg-gradient-to-r from-green-900/30 via-black/40 to-teal-900/30'
                  : currentCardIndex === 3
                    ? 'bg-gradient-to-r from-purple-900/30 via-black/40 to-pink-900/30'
                    : 'bg-gradient-to-r from-indigo-900/30 via-black/40 to-blue-900/30'
          }`}
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        />
      </AnimatePresence>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        <motion.div
<<<<<<< HEAD
          animate={{
=======
          animate={{ 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            scale: [1, 1.1, 1]
          }}
<<<<<<< HEAD
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
=======
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
        />
        <motion.div
<<<<<<< HEAD
          animate={{
=======
          animate={{ 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
            y: [0, 30, 0],
            rotate: [0, -10, 0],
            scale: [1, 0.8, 1]
          }}
<<<<<<< HEAD
          transition={{
            duration: 8,
            repeat: Infinity,
=======
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 right-20 w-24 h-24 bg-white/3 rounded-full blur-2xl"
        />
        <motion.div
<<<<<<< HEAD
          animate={{
=======
          animate={{ 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
            x: [0, 20, 0],
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
<<<<<<< HEAD
          transition={{
            duration: 10,
            repeat: Infinity,
=======
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/4 rounded-full blur-lg"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="w-full">
<<<<<<< HEAD
          {/* Mobile-first responsive layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-12 items-center min-h-screen">

            {/* Left Hero Content */}
            <div className="lg:col-span-6 relative px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0 text-center lg:text-left">
=======
          <div className="grid lg:grid-cols-12 items-center min-h-screen">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 relative px-6 lg:px-8">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
              {/* Animated content with Framer Motion */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`card-${currentCardIndex}`}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
<<<<<<< HEAD
                  transition={{
                    duration: 1.0,
=======
                  transition={{ 
                    duration: 1.0, 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: 0.8 },
                    y: { duration: 1.0 },
                    filter: { duration: 0.6 }
                  }}
                >
<<<<<<< HEAD
                  <div className="mb-4 sm:mb-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-white leading-[0.9] tracking-tight">
=======
                  <div className="mb-6">
                    <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.9] tracking-tight">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                      {getCurrentDestination()?.title || "LOADING..."}
                    </h1>
                  </div>

                  {/* Small region label */}
<<<<<<< HEAD
                  <div className="mb-4 sm:mb-6 lg:mb-8">
                    <span className="text-white/80 text-sm sm:text-base lg:text-lg font-medium tracking-wider uppercase">
                      {getCurrentDestination()?.region || "LOADING..."}
                    </span>
                  </div>

                  {/* Dynamic description */}
                  <div className="mb-6 sm:mb-8">
                    <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-sm sm:max-w-md mx-auto lg:mx-0">
=======
                  <div className="mb-8">
                    <span className="text-white/80 text-lg font-medium tracking-wider uppercase">
                      {getCurrentDestination()?.region || "LOADING..."}
                    </span>
                  </div>
                  
                  {/* Dynamic description */}
                  <div className="mb-8">
                    <p className="text-white/90 text-lg leading-relaxed max-w-md">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                      {getCurrentDestination()?.description || "Loading event description..."}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Rounded button with play icon */}
              <Link
                to="/events"
<<<<<<< HEAD
                className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group text-sm sm:text-base"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
=======
                className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group"
              >
                <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                JOIN NOW
              </Link>
            </div>

            {/* Right Hero Content - Interactive Cards */}
<<<<<<< HEAD
            <div className="lg:col-span-6 relative mt-8 lg:mt-0 w-full px-4 sm:px-6 lg:px-0">
              <div className="overflow-visible w-full h-full" style={{ boxShadow: 'none !important' }}>
                <motion.div
                  className="flex gap-2 sm:gap-3 lg:gap-4 overflow-visible justify-center lg:justify-start"
                  style={{
=======
            <div className="lg:col-span-6 relative">
              <div className="overflow-visible w-full h-full" style={{ boxShadow: 'none !important' }}>
                <motion.div 
                  className="flex gap-4 overflow-visible"
                  style={{ 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                    willChange: 'transform',
                    boxShadow: 'none !important',
                    filter: 'drop-shadow(none)'
                  }}
                  layout
<<<<<<< HEAD
                  transition={{
=======
                  transition={{ 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                    layout: {
                      duration: 0.8,
                      ease: "easeOut"
                    }
                  }}
                >
                  <AnimatePresence mode="popLayout">
<<<<<<< HEAD
                    {/* Display cards in queue order - leftmost visible becomes background */}
                    {displayOrder.map((cardIndex, position) => {
                      const destination = eventDestinations[cardIndex];
                      const originalIndex = cardIndex;

                      // Show transformation animation for card that will become background
                      if (originalIndex === slidingOut && slidingOut !== null) {
                        return (
                          <motion.div
                            key={`transforming-${originalIndex}-${position}`}
                            className="relative w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 xl:w-52 xl:h-80 rounded-xl lg:rounded-2xl overflow-hidden flex-shrink-0"
                            style={{ boxShadow: 'none !important', filter: 'drop-shadow(none)' }}
                            layout
                            initial={{
                              scale: 1,
                              opacity: 1,
                              zIndex: 100,
                              borderRadius: "16px"
                            }}
                            animate={{
                              scale: 1.05,
                              opacity: 1,
                              zIndex: 100
                            }}
                            exit={{
                              opacity: [1, 1, 0.8, 0],
                              scale: 1,
                              filter: [
                                "brightness(1) blur(0px)",
                                "brightness(1.05) blur(5px)",
                                "brightness(1.1) blur(15px)",
                                "brightness(1.15) blur(25px)"
                              ],
                              zIndex: 200,
                              transition: {
                                duration: 1.5,
                                ease: [0.25, 0.46, 0.45, 0.94],
                                times: [0, 0.4, 0.75, 1],
                                zIndex: { duration: 0 }
                              }
                            }}
                            transition={{
                              animate: {
                                duration: 0.8,
                                ease: "easeOut"
                              },
                              layout: {
                                duration: 1.2,
                                ease: [0.19, 1, 0.22, 1]
                              }
                            }}
                          >
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage: `url('${destination.image}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4 text-white">
                              <div className="space-y-1 sm:space-y-2">
                                <p className="text-xs font-medium text-white/90 uppercase tracking-widest">
                                  {destination.region}
                                </p>
                                <h3 className="text-xs sm:text-sm font-bold leading-tight uppercase tracking-wide">
                                  {destination.shortDescription}
                                </h3>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      // Hide card that is currently the background
                      if (originalIndex === currentCardIndex) {
                        return null; // Don't render this card in carousel
                      }

                      return (
                        <motion.div
                          key={`${destination.id}-${originalIndex}-${position}`}
                          layout
                          initial={{ x: 128, opacity: 0, scale: 0.9 }}
                          animate={{
                            x: 0,
                            opacity: 0.85,
                            scale: 1
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.8,
                            transition: { duration: 0.4, ease: "easeOut" }
                          }}
                          className="relative w-32 h-48 sm:w-40 sm:h-60 lg:w-48 lg:h-72 xl:w-52 xl:h-80 rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 bg-black/60 opacity-80"
                          style={{
                            boxShadow: 'none !important',
                            filter: 'none !important',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)'
                          }}
                          onClick={() => {
                            if (!isTransitioning) {
                              if (showOriginalBackground) {
                                setShowOriginalBackground(false);
                              }
                              setIsTransitioning(true);
                              setCurrentCardIndex(originalIndex);
                              setSlidingOut(originalIndex);
                              setTimeout(() => {
                                setSlidingOut(null);
                                setIsTransitioning(false);
                              }, 1000);
                            }
                          }}
                          whileHover={{
                            scale: 1.02,
                            y: -2,
                            transition: {
                              duration: 0.3,
                              ease: "easeOut"
                            }
                          }}
                          whileTap={{
                            scale: 0.96,
                            transition: { duration: 0.15 }
                          }}
                          transition={{
                            layout: {
                              duration: 1.0,
                              delay: position * 0.15,
                              ease: "easeOut"
                            },
                            opacity: {
                              duration: 0.8,
                              delay: position * 0.2,
                              ease: "easeOut"
                            },
                            scale: {
                              duration: 0.8,
                              delay: position * 0.2,
                              ease: "easeOut"
                            },
                            x: {
                              duration: 1.0,
                              delay: position * 0.15,
                              ease: "easeOut"
                            }
                          }}
                        >
                          {/* Background Image */}
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${destination.image}')` }}
                          >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          </div>

                          {/* Overlay text at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4 text-white">
                            <div className="space-y-1 sm:space-y-2">
                              {/* Region/continent in small caps */}
                              <p className="text-xs font-medium text-white/90 uppercase tracking-widest">
                                {destination.region}
                              </p>
                              {/* Destination name in bold uppercase */}
                              <h3 className="text-xs sm:text-sm font-bold leading-tight uppercase tracking-wide">
=======
                  {/* Display cards in queue order - leftmost visible becomes background */}
                  {displayOrder.map((cardIndex, position) => {
                    const destination = eventDestinations[cardIndex];
                    const originalIndex = cardIndex;
                    
                    // Show transformation animation for card that will become background
                    if (originalIndex === slidingOut && slidingOut !== null) {
                      return (
                        <motion.div
                          key={`transforming-${originalIndex}-${position}`}
                          className="relative w-48 h-72 lg:w-52 lg:h-80 rounded-2xl overflow-hidden flex-shrink-0"
                          style={{ boxShadow: 'none !important', filter: 'drop-shadow(none)' }}
                          layout
                          initial={{ 
                            scale: 1, 
                            opacity: 1, 
                            zIndex: 100,
                            borderRadius: "16px"
                          }}
                          animate={{
                            scale: 1.05,
                            opacity: 1,
                            zIndex: 100
                          }}
                          exit={{ 
                            opacity: [1, 1, 0.8, 0],
                            scale: 1,
                            filter: [
                              "brightness(1) blur(0px)",
                              "brightness(1.05) blur(5px)",
                              "brightness(1.1) blur(15px)",
                              "brightness(1.15) blur(25px)"
                            ],
                            zIndex: 200,
                            transition: {
                              duration: 1.5,
                              ease: [0.25, 0.46, 0.45, 0.94],
                              times: [0, 0.4, 0.75, 1],
                              zIndex: { duration: 0 }
                            }
                          }}
                          transition={{ 
                            animate: {
                              duration: 0.8,
                              ease: "easeOut"
                            },
                            layout: {
                              duration: 1.2,
                              ease: [0.19, 1, 0.22, 1]
                            }
                          }}
                        >
                          <div 
                            className="absolute inset-0"
                            style={{ 
                              backgroundImage: `url('${destination.image}')`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-white/90 uppercase tracking-widest">
                                {destination.region}
                              </p>
                              <h3 className="text-sm font-bold leading-tight uppercase tracking-wide">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                                {destination.shortDescription}
                              </h3>
                            </div>
                          </div>
                        </motion.div>
                      );
<<<<<<< HEAD
                    })}
=======
                    }
                    
                    // Hide card that is currently the background
                    if (originalIndex === currentCardIndex) {
                      return null; // Don't render this card in carousel
                    }
                    
                    return (
                      <motion.div
                        key={`${destination.id}-${originalIndex}-${position}`}
                        layout
                        initial={{ x: 208, opacity: 0, scale: 0.9 }}
                        animate={{ 
                          x: 0,
                          opacity: 0.85,
                          scale: 1
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.8,
                          transition: { duration: 0.4, ease: "easeOut" }
                        }}
                        className="relative w-48 h-72 lg:w-52 lg:h-80 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 bg-black/60 opacity-80"
                        style={{ 
                          boxShadow: 'none !important', 
                          filter: 'none !important',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)'
                        }}
                        onClick={() => {
                          if (!isTransitioning) {
                            if (showOriginalBackground) {
                              setShowOriginalBackground(false);
                            }
                            setIsTransitioning(true);
                            setCurrentCardIndex(originalIndex);
                            setSlidingOut(originalIndex);
                            setTimeout(() => {
                              setSlidingOut(null);
                              setIsTransitioning(false);
                            }, 1000);
                          }
                        }}
                        whileHover={{ 
                          scale: 1.02, 
                          y: -2,
                          transition: { 
                            duration: 0.3, 
                            ease: "easeOut"
                          }
                        }}
                        whileTap={{ 
                          scale: 0.96,
                          transition: { duration: 0.15 }
                        }}
                        transition={{
                          layout: {
                            duration: 1.0,
                            delay: position * 0.15,
                            ease: "easeOut"
                          },
                          opacity: {
                            duration: 0.8,
                            delay: position * 0.2,
                            ease: "easeOut"
                          },
                          scale: {
                            duration: 0.8,
                            delay: position * 0.2,
                            ease: "easeOut"
                          },
                          x: {
                            duration: 1.0,
                            delay: position * 0.15,
                            ease: "easeOut"
                          }
                        }}
                      >
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${destination.image}')` }}
                      >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      </div>

                      {/* Overlay text at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="space-y-2">
                          {/* Region/continent in small caps */}
                          <p className="text-xs font-medium text-white/90 uppercase tracking-widest">
                            {destination.region}
                          </p>
                          {/* Destination name in bold uppercase */}
                          <h3 className="text-sm font-bold leading-tight uppercase tracking-wide">
                            {destination.shortDescription}
                          </h3>
                        </div>
                      </div>
                      </motion.div>
                    );
                  })}
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Navigation Bar - Below cards */}
<<<<<<< HEAD
              <div className="mt-6 sm:mt-8 w-full px-4 sm:px-6 lg:px-4">
                {/* Navigation controls - responsive layout */}
                <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 sm:gap-0">
                  {/* Mobile: Center buttons and progress, Desktop: buttons left, progress center, number right */}
                  <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 flex-shrink-0 order-2 sm:order-1">
                    <motion.button
                      onClick={prevCards}
                      disabled={isTransitioning}
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
=======
              <div className="mt-8 w-full px-4">
                {/* Navigation controls - buttons left, progress center, number right */}
                <div className="flex justify-between items-center w-full">
                  {/* Left side - Navigation buttons */}
                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <motion.button
                      onClick={prevCards}
                      disabled={isTransitioning}
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-6 h-6" />
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                    </motion.button>

                    <motion.button
                      onClick={nextCards}
                      disabled={isTransitioning}
<<<<<<< HEAD
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
=======
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-6 h-6" />
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                    </motion.button>
                  </div>

                  {/* Center - Progress Line */}
<<<<<<< HEAD
                  <div className="relative w-32 sm:flex-1 sm:max-w-sm h-px bg-white/20 mx-0 sm:mx-8 order-1 sm:order-2">
                    <motion.div
                      className="absolute top-0 left-0 h-px bg-white"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${((currentCardIndex + 1) / eventDestinations.length) * 100}%`
=======
                  <div className="relative flex-1 max-w-sm h-px bg-white/20 mx-8">
                    <motion.div 
                      className="absolute top-0 left-0 h-px bg-white"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: `${((currentCardIndex + 1) / eventDestinations.length) * 100}%` 
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  {/* Right side - Number indicator */}
<<<<<<< HEAD
                  <div className="flex-shrink-0 order-3">
                    <motion.span
                      key={currentCardIndex}
                      className="text-white font-bold text-lg sm:text-xl tracking-wider"
=======
                  <div className="flex-shrink-0">
                    <motion.span 
                      key={currentCardIndex}
                      className="text-white font-bold text-xl tracking-wider"
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {String(currentCardIndex + 1).padStart(2, '0')}
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
