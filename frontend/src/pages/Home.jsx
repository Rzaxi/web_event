import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import AdvantagesSection from '../components/AdvantagesSection';
import EventCard from '../components/EventCard';
import MobileAppSection from '../components/MobileAppSection';
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
      const eventsData = (response.data && response.data.events) || [];
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredEvents = (events || []).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Advantages Section */}
      <AdvantagesSection />

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div className="space-y-4">
                {/* Notification Badge */}
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  ⚡ Event Populer Minggu Ini
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
              </div>
              <Link to="/events" className="text-blue-600 hover:text-blue-700 font-medium">
                View All Featured →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredEvents.map((event) => (
                <div key={event.id}>
                  <EventCard event={event} featured={false} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Mobile App Section */}
      <MobileAppSection />
    </div>
  );
};

export default Home;
