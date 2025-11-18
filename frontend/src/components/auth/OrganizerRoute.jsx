import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrganizerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // Immediate check - no delay
  const hasOrganizerRole = user.role && (
    user.role.includes('event_organizer_basic') || 
    user.role.includes('event_organizer_pro')
  );

  // Check if user is logged in
  if (!token || !user.id) {
    // Don't show toast immediately to avoid flash
    setTimeout(() => toast.error('Silakan login terlebih dahulu'), 100);
    return <Navigate to="/login" replace />;
  }

  // Check if user has organizer role - IMMEDIATE redirect
  if (!hasOrganizerRole) {
    // Don't show toast immediately to avoid flash
    setTimeout(() => toast.error('Halaman tidak ditemukan atau akses ditolak.'), 100);
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default OrganizerRoute;
