import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useAutoLogout = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  
  // Timeout duration: 1 hour (3600000 ms)
  const TIMEOUT_DURATION = 60 * 60 * 1000; // 1 jam
  
  // Function to logout user
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    
    // Clear any other session data
    sessionStorage.clear();
    
    // Show toast message
    toast.info('Session expired. Please login again.', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
    
    // Redirect to appropriate login page based on current path
    const currentPath = window.location.pathname;
    
    if (currentPath.startsWith('/admin')) {
      navigate('/admin/login', { replace: true });
    } else if (currentPath.startsWith('/organizer')) {
      navigate('/login', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);
  
  // Function to reset timeout
  const resetTimeout = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Update last activity time
    lastActivityRef.current = Date.now();
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, TIMEOUT_DURATION);
  }, [logout]);
  
  // Function to check if user is logged in
  const isLoggedIn = useCallback(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    const user = localStorage.getItem('user');
    
    return !!(token || adminToken) && !!user;
  }, []);
  
  // Activity event handler
  const handleActivity = useCallback(() => {
    if (isLoggedIn()) {
      resetTimeout();
    }
  }, [resetTimeout, isLoggedIn]);
  
  useEffect(() => {
    // Only start auto logout if user is logged in
    if (!isLoggedIn()) {
      return;
    }
    
    // Events that indicate user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown'
    ];
    
    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    
    // Start the initial timeout
    resetTimeout();
    
    // Cleanup function
    return () => {
      // Remove event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleActivity, resetTimeout, isLoggedIn]);
  
  // Function to manually trigger logout (for testing or manual logout)
  const manualLogout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    logout();
  }, [logout]);
  
  return {
    manualLogout,
    resetTimeout,
    isLoggedIn
  };
};

export default useAutoLogout;
