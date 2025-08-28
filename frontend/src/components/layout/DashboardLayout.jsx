import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Outlet /> {/* Nested routes will render here */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
