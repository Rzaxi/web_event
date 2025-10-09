import React, { useState, useEffect } from 'react';
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
import { useStaggeredAnimation } from '../hooks/useScrollAnimation';
import { eventsAPI } from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      console.log('Home page API response:', response.data);
      const eventsData = response.data?.data?.events || response.data?.events || [];
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredEvents = (events || []).slice(0, 4);
  const [eventsRef, visibleEvents] = useStaggeredAnimation(featuredEvents, 150);

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
                    Featured Events
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight mb-4">
                    Discover Amazing Events
                  </h2>
                  <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Join concerts, festivals, sports events, and cultural celebrations
                  </p>
                </div>
              </AnimatedSection>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-5 space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="space-y-3 mt-4">
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="h-1 bg-gray-200 rounded-full w-full mt-4"></div>
                          <div className="h-12 bg-gray-200 rounded-xl mt-4"></div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              ) : featuredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
                    <p className="text-gray-600">Amazing events are coming soon. Stay tuned!</p>
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
                    View All Events
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
    </PageTransition>
  );
};

export default Home;
