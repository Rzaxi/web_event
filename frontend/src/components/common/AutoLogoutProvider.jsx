import React, { createContext, useContext } from 'react';
import useAutoLogout from '../../hooks/useAutoLogout';

// Create context for auto logout
const AutoLogoutContext = createContext();

// Provider component
export const AutoLogoutProvider = ({ children }) => {
  const autoLogout = useAutoLogout();
  
  return (
    <AutoLogoutContext.Provider value={autoLogout}>
      {children}
    </AutoLogoutContext.Provider>
  );
};

// Hook to use auto logout context
export const useAutoLogoutContext = () => {
  const context = useContext(AutoLogoutContext);
  if (!context) {
    throw new Error('useAutoLogoutContext must be used within AutoLogoutProvider');
  }
  return context;
};

export default AutoLogoutProvider;
