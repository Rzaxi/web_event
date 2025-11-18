<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, ArrowRight, CheckCircle, Star, MapPin, Clock } from 'lucide-react';
import Hero from 'src/components/home/Hero';
import AdvantagesSection from 'src/components/home/AdvantagesSection';
import TestimonialSection from 'src/components/home/TestimonialSection';
import EventCard from 'src/components/event/EventCard';
import MobileAppSection from 'src/components/home/MobileAppSection';
import Sponsored from 'src/components/home/Sponsored';
import PageTransition from 'src/components/common/PageTransition';
import AnimatedSection from 'src/components/common/AnimatedSection';
import ProfileCompletionPopup from 'src/components/common/ProfileCompletionPopup';
import { EventListSkeleton } from '../components/ui/SkeletonLoader';
import { useLazyLoading } from '../hooks/useLazyLoading';
import { useStaggeredAnimation } from '../hooks/useScrollAnimation';
import { eventsAPI } from '../services/api';
import { isProfileComplete } from '../utils/profileUtils';

const Home = () => {
  // State untuk profile completion popup
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  // Lazy loading untuk events
<<<<<<< HEAD
  const fetchEvents = useCallback(async () => {
    try {
      const response = await eventsAPI.getAll();
      return response.data?.data?.events || response.data?.events || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }, []);

  const { data: events, loading } = useLazyLoading(fetchEvents, [], 800);
=======
  const fetchEvents = async () => {
    const response = await eventsAPI.getAll();
    return response.data?.data?.events || response.data?.events || [];
  };

  const { data: events, loading } = useLazyLoading(fetchEvents, [], 1200);
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216

  const featuredEvents = (events || []).slice(0, 3);
  const [eventsRef, visibleEvents] = useStaggeredAnimation(featuredEvents, 150);

  // Check if profile completion popup should be shown
  useEffect(() => {
    const checkProfileCompletion = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check if popup was already shown in this session
      const popupShownThisSession = sessionStorage.getItem('profile_popup_shown');
      
      // Only show popup if:
      // 1. User is logged in
      // 2. Profile is not complete
      // 3. User hasn't skipped
      // 4. Popup hasn't been shown in this session
      if (token && user && user.id && !isProfileComplete(user) && !user.profile_skipped && !popupShownThisSession) {
        // Show popup after a short delay for better UX
        setTimeout(() => {
          setShowProfilePopup(true);
          // Mark popup as shown in this session
          sessionStorage.setItem('profile_popup_shown', 'true');
        }, 2000);
      }
    };

    checkProfileCompletion();
  }, []);

  // Handle popup close
  const handlePopupClose = () => {
    setShowProfilePopup(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div id="home">
          <Hero />
        </div>

        {/* Advantages Section */}
        <AnimatedSection animation="fade-up" delay={200}>
          <AdvantagesSection />
        </AnimatedSection>

        {/* Featured Events Section */}
        <AnimatedSection animation="fade-up" delay={300}>
          <section id="events" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatedSection animation="fade-right" delay={100}>
                <div className="text-center mb-16">
                  <span className="text-sm font-medium text-indigo-600 mb-4 block uppercase tracking-wide">
                    Event Unggulan
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight mb-4">
                    Temukan Event Menarik
                  </h2>
                  <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Bergabunglah dalam konser, festival, acara olahraga, dan perayaan budaya
                  </p>
                </div>
              </AnimatedSection>

              {loading ? (
                <EventListSkeleton count={3} />
              ) : featuredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredEvents.map((event, index) => (
                    <AnimatedSection
                      key={event.id}
                      animation="fade-up"
                      delay={index * 150}
                      duration={600}
                    >
                      <EventCard
                        event={event}
                        featured={index === 0}
                        variant={index === 1 || index === 3 ? 'dark' : 'light'}
                      />
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <AnimatedSection animation="fade-up">
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Event</h3>
                    <p className="text-gray-600">Event menarik akan segera hadir. Nantikan!</p>
                  </div>
                </AnimatedSection>
              )}

              {/* View All Button */}
              <AnimatedSection animation="fade-up" delay={600}>
                <div className="text-center mt-16">
                  <Link
                    to="/events"
                    className="inline-flex items-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg group"
                  >
                    Lihat Semua Event
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </AnimatedSection>



        {/* Testimonial Section */}
        <TestimonialSection />

        {/* Sponsored Section */}
        <AnimatedSection animation="fade-up" delay={300}>
          <section id="sponsored">
            <Sponsored />
          </section>
        </AnimatedSection>

        {/* Mobile App Section */}
        <AnimatedSection animation="fade-up" delay={200}>
          <section id="mobile-app">
            <MobileAppSection />
          </section>
        </AnimatedSection>

      </div>

      {/* Profile Completion Popup */}
      <ProfileCompletionPopup 
        isOpen={showProfilePopup} 
        onClose={handlePopupClose} 
      />
    </PageTransition>
  );
};

export default Home;
