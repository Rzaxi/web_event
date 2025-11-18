import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const EventCard = ({ event, onViewTicket, onViewEvent }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{event.judul}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status === 'confirmed' ? 'Terkonfirmasi' : 'Menunggu'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(event.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {event.waktu} WIB
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {event.lokasi}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Terdaftar pada</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(event.registeredAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Biaya</p>
                  <p className="text-sm font-medium text-gray-900">
                    {event.biaya > 0 ? `Rp ${event.biaya.toLocaleString('id-ID')}` : 'Gratis'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onViewTicket(event.id, event.registrationId)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Lihat E-Tiket
          </button>
          <button
            onClick={() => onViewEvent(event.id)}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Detail Event
          </button>
        </div>
      </div>
    </div>
  );
};

const MyEventsTab = () => {
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // Add event listener for when user registers for new events
  useEffect(() => {
    const handleEventRegistration = () => {
      fetchMyEvents(); // Refresh the list when user registers for new event
    };

    window.addEventListener('eventRegistered', handleEventRegistration);
    
    return () => {
      window.removeEventListener('eventRegistered', handleEventRegistration);
    };
  }, []);

  const fetchMyEvents = async () => {
    try {
      // Get user's registered events from API
      const token = localStorage.getItem('token');
      if (!token) {
        setRegisteredEvents([]);
        setIsLoading(false);
        return;
      }

      // Try the new endpoint first, fallback to existing endpoint
      let response;
      try {
        response = await fetch('http://localhost:3000/users/my-events', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // If response is not ok (500, 404, etc), try fallback
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (fetchError) {
        // Fallback to existing endpoint
        try {
          response = await fetch('http://localhost:3000/users/events', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (fallbackError) {
          throw new Error('Both endpoints failed');
        }
      }

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          let transformedEvents = [];
          
          if (result.data) {
            // New endpoint format with registration data
            transformedEvents = result.data.map(registration => ({
              id: registration.Event?.id || registration.event_id,
              judul: registration.Event?.judul || registration.nama_event,
              tanggal: registration.Event?.tanggal || registration.tanggal,
              waktu: registration.Event?.waktu || registration.waktu,
              lokasi: registration.Event?.lokasi || registration.lokasi,
              biaya: registration.Event?.biaya || registration.biaya || 0,
              registrationId: registration.id,
              status: registration.status || 'confirmed',
              registeredAt: registration.createdAt || registration.created_at || new Date().toISOString()
            }));
          } else if (result.events) {
            // Fallback endpoint format with events data
            transformedEvents = result.events.map(event => ({
              id: event.id,
              judul: event.judul,
              tanggal: event.tanggal,
              waktu: event.waktu,
              lokasi: event.lokasi,
              biaya: event.biaya || 0,
              registrationId: `reg-${event.id}-${Date.now()}`,
              status: 'confirmed',
              registeredAt: new Date().toISOString()
            }));
          }
          
          setRegisteredEvents(transformedEvents);
        } else {
          setRegisteredEvents([]);
        }
      } else {
        setRegisteredEvents([]);
      }
    } catch (error) {
      // Silently handle errors and show empty state
      setRegisteredEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTicket = (eventId, registrationId) => {
    navigate(`/events/${eventId}/ticket/${registrationId}`);
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Terdaftar</h2>
        <p className="text-gray-600">Kelola tiket dan akses event Anda</p>
      </div>
      
      {registeredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Event</h3>
          <p className="text-gray-600 mb-6">Anda belum mendaftar event apapun</p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Jelajahi Event
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {registeredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewTicket={handleViewTicket}
              onViewEvent={handleViewEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsTab;
