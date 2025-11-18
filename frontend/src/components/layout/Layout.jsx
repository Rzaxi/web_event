import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Hide header and footer on event detail pages (e.g., /events/1, /events/2, etc.)
  const isEventDetailPage = /^\/events\/\d+/.test(location.pathname);
  
  return (
    <div className="min-h-screen bg-white">
      {!isEventDetailPage && <Header />}
      <main>
        {children}
      </main>
      {!isEventDetailPage && <Footer />}
    </div>
  );
};

export default Layout;
