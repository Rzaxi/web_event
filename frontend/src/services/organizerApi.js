import api from './api';

const organizerApi = {
  // Dashboard
  getDashboardData: () => api.get('/organizer/dashboard'),

  // Events
  getEvents: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    return api.get(`/organizer/events${queryString ? `?${queryString}` : ''}`);
  },

  createEvent: (eventData) => api.post('/organizer/events', eventData),
  
  updateEvent: (id, eventData) => api.put(`/organizer/events/${id}`, eventData),
  
  deleteEvent: (id) => api.delete(`/organizer/events/${id}`),

  // Participants
  getParticipants: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.event_id) searchParams.append('event_id', params.event_id);
    if (params.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    return api.get(`/organizer/participants${queryString ? `?${queryString}` : ''}`);
  },

  // Analytics
  getAnalytics: (timeRange = '6months') => {
    return api.get(`/organizer/analytics?timeRange=${timeRange}`);
  }
};

export default organizerApi;
