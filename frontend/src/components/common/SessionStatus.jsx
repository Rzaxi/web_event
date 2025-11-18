import React, { useState, useEffect } from 'react';
import { useAutoLogoutContext } from './AutoLogoutProvider';

// Optional component to show session status (for development/testing)
const SessionStatus = ({ show = false }) => {
  const { isLoggedIn } = useAutoLogoutContext();
  const [timeLeft, setTimeLeft] = useState(null);
  
  useEffect(() => {
    if (!show || !isLoggedIn()) return;
    
    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity);
        const remaining = (60 * 60 * 1000) - elapsed; // 1 hour - elapsed time
        
        if (remaining > 0) {
          const minutes = Math.floor(remaining / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setTimeLeft('Expired');
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [show, isLoggedIn]);
  
  if (!show || !isLoggedIn()) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm z-50">
      Session: {timeLeft || 'Active'}
    </div>
  );
};

export default SessionStatus;
