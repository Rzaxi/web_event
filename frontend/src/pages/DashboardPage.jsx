import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';

const DashboardPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h1 className="text-3xl font-bold font-serif text-gray-900 mb-6">Dashboard</h1>
              <p className="text-gray-600">Welcome to your dashboard. Here you can manage your events, profile, and settings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
