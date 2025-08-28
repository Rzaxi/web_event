import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RouteTransition = ({ children }) => {
  const [displayLocation, setDisplayLocation] = useState(useLocation());
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  const location = useLocation();

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        transitionStage === 'fadeOut' 
          ? 'opacity-0 scale-95 translate-y-4' 
          : 'opacity-100 scale-100 translate-y-0'
      }`}
      onTransitionEnd={() => {
        if (transitionStage === 'fadeOut') {
          setDisplayLocation(location);
          setTransitionStage('fadeIn');
        }
      }}
    >
      {children}
    </div>
  );
};

export default RouteTransition;
