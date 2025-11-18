import api from './api';

const organizerApi = {
  // Dashboard
  getDashboardData: () => api.get('/organizer/dashboard'),

  // Events
  getEvents: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
<<<<<<< HEAD
    if (params.status && params.status !== 'all') searchParams.append('status', params.status);
=======
    if (params.status) searchParams.append('status', params.status);
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
    
    const queryString = searchParams.toString();
    return api.get(`/organizer/events${queryString ? `?${queryString}` : ''}`);
  },

<<<<<<< HEAD
  getEventById: (id) => api.get(`/organizer/events/${id}`),
  
=======
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
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

<<<<<<< HEAD
  // Get participants for specific event
  getEventParticipants: (eventId) => {
    return api.get(`/organizer/events/${eventId}/participants`);
  },

  // Analytics
  getAnalytics: (timeRange = '6months') => {
    return api.get(`/organizer/analytics?timeRange=${timeRange}`);
  },

  exportAnalytics: (timeRange = '6months', format = 'csv') => {
    return api.get(`/organizer/analytics/export?timeRange=${timeRange}&format=${format}`);
  },

  // Certificates
  saveCertificateTemplate: (templateData) => {
    return api.post('/organizer/certificates/template', templateData);
  },

  getCertificateTemplates: () => {
    return api.get('/organizer/certificates/templates');
  },

  getCertificateTemplate: (eventId) => {
    return api.get(`/organizer/certificates/template/${eventId}`);
  },

  getEligibleParticipants: (eventId) => {
    return api.get(`/organizer/certificates/eligible/${eventId}`);
  },

  issueCertificate: (eventId, participantId) => {
    return api.post(`/organizer/certificates/issue/${eventId}/${participantId}`);
  },

  // Certificate Management (NEW)
  getCertificateEvents: () => {
    return api.get('/organizer/certificates/events');
  },

  getEventParticipantsForCertificate: (eventId) => {
    return api.get(`/organizer/certificates/events/${eventId}/participants`);
  },

  generateCertificate: (eventId, userId) => {
    return api.post(`/organizer/certificates/generate/${eventId}/${userId}`);
  },

  bulkGenerateCertificates: (eventId) => {
    return api.post(`/organizer/certificates/events/${eventId}/bulk-generate`);
  },

  // Debug and fix endpoints
  debugCertificates: () => {
    return api.get('/organizer/certificates/debug');
  },

  fixCertificateData: () => {
    return api.post('/organizer/certificates/fix');
  }
};

export { organizerApi as organizerAPI };
=======
  // Analytics
  getAnalytics: (timeRange = '6months') => {
    return api.get(`/organizer/analytics?timeRange=${timeRange}`);
  }
};

>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
export default organizerApi;
