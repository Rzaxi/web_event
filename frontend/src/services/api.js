import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API (User/Public)
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
    updateProfile: (userData) => api.put('/users/profile', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

// User Profile API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (userData) => api.put('/users/profile', userData),
    changePassword: (passwordData) => api.put('/users/change-password', passwordData),
    getMyEvents: () => api.get('/users/events'), // User event history
};

// Events API (User/Public - hanya read dan register)
export const eventsAPI = {
    getAll: (params) => api.get('/events', { params }),
    getById: (id) => {
        // Try authenticated route first (with registration status), fallback to public route
        const token = localStorage.getItem('token');
        if (token) {
            return api.get(`/users/events/${id}`);
        }
        return api.get(`/events/${id}`);
    },
    register: (eventId) => api.post(`/events/${eventId}/register`),
    unregister: (eventId) => api.delete(`/events/${eventId}/register`),
};

export default api;
