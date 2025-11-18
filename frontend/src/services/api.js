import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create public axios instance (no auth headers)
const publicApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available (only for authenticated api)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Configure response interceptor to handle expected validation responses and auto logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - Auto logout
        if (error.response?.status === 401) {
            // Don't auto-logout for login attempts - let the login form handle the error
            if (error.config?.url?.includes('/auth/login') || 
                error.config?.url?.includes('/admin/login')) {
                return Promise.reject(error);
            }
            
            // Clear all auth data for other 401 errors (expired tokens, etc.)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('adminToken');
            sessionStorage.clear();
            
            // Redirect to appropriate login page
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin')) {
                window.location.href = '/admin/login';
            } else {
                window.location.href = '/login';
            }
            
            return Promise.reject(error);
        }
        
        // Handle 403 Forbidden - Session expired
        if (error.response?.status === 403) {
            // Don't auto-logout for login attempts - let the login form handle the error
            if (error.config?.url?.includes('/auth/login') || 
                error.config?.url?.includes('/admin/login')) {
                return Promise.reject(error);
            }
            
            // Clear all auth data for other 403 errors (session expired, etc.)
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('adminToken');
            sessionStorage.clear();
            
            // Redirect to appropriate login page
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/admin')) {
                window.location.href = '/admin/login';
            } else {
                window.location.href = '/login';
            }
            
            return Promise.reject(error);
        }
        
        // Don't treat 400 Bad Request as errors for attendance checks - these are expected validation responses
        if (error.response?.status === 400 && error.config?.url?.includes('/attendance/check')) {
            // Return the error response as if it was successful, but mark it as validation
            return Promise.resolve({
                data: error.response.data,
                status: error.response.status,
                isValidation: true
            });
        }
        
        return Promise.reject(error);
    }
);

// Auth API (User/Public)
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
    changePassword: (passwordData) => api.put('/users/change-password', passwordData),
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
    getMyEvents: () => axios.get('http://localhost:3000/api/users/events', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    }), // Fixed: add /api prefix
    getMyCertificates: () => axios.get('http://localhost:3000/api/users/certificates', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    }), // Fixed: add /api prefix
};

// Events API (User/Public - hanya read dan register)
export const eventsAPI = {
    getAll: (params) => publicApi.get('/events', { params }), // Use public API for listing
    getById: (id) => api.get(`/events/${id}`),
    getTicketCategories: (eventId) => api.get(`/events/${eventId}/ticket-categories`),
    register: (eventId) => api.post(`/events/${eventId}/register`), // Auth required for registration
    unregister: (eventId) => api.delete(`/events/${eventId}/register`), // Auth required
};

export default api;
