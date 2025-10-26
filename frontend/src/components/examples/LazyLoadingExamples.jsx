import React from 'react';
import LazyWrapper from '../ui/LazyWrapper';
import { 
  EventListSkeleton, 
  DashboardStatsSkeleton, 
  TableSkeleton, 
  ProfileSkeleton,
  FormSkeleton 
} from '../ui/SkeletonLoader';
import { eventsAPI } from '../../services/api';

// Contoh penggunaan Lazy Loading dengan Skeleton

// 1. Events List dengan Skeleton
export const LazyEventsList = () => {
  const fetchEvents = async () => {
    const response = await eventsAPI.getAll();
    return response.data?.data?.events || [];
  };

  return (
    <LazyWrapper
      fetchFunction={fetchEvents}
      SkeletonComponent={EventListSkeleton}
      count={8}
      delay={1200}
    >
      {(events) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900">{event.judul}</h3>
              <p className="text-gray-600 text-sm mt-2">{event.deskripsi}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>{event.lokasi}</span>
                <span className="mx-2">•</span>
                <span>{new Date(event.tanggal).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </LazyWrapper>
  );
};

// 2. Dashboard Stats dengan Skeleton
export const LazyDashboardStats = () => {
  const fetchStats = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      totalEvents: 156,
      totalUsers: 2340,
      totalRegistrations: 8920,
      activeEvents: 23
    };
  };

  return (
    <LazyWrapper
      fetchFunction={fetchStats}
      SkeletonComponent={DashboardStatsSkeleton}
      delay={1500}
    >
      {(stats) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                📅
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                👥
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                📝
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                🔥
              </div>
            </div>
          </div>
        </div>
      )}
    </LazyWrapper>
  );
};

// 3. User Table dengan Skeleton
export const LazyUserTable = () => {
  const fetchUsers = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    ];
  };

  return (
    <LazyWrapper
      fetchFunction={fetchUsers}
      SkeletonComponent={TableSkeleton}
      rows={5}
      columns={4}
      delay={1000}
    >
      {(users) => (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </LazyWrapper>
  );
};

// 4. Profile dengan Skeleton
export const LazyProfile = () => {
  const fetchProfile = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/api/placeholder/64/64',
      bio: 'Full-stack developer passionate about creating amazing user experiences.'
    };
  };

  return (
    <LazyWrapper
      fetchFunction={fetchProfile}
      SkeletonComponent={ProfileSkeleton}
      delay={800}
    >
      {(profile) => (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4 mb-6">
            <img 
              src={profile.avatar} 
              alt={profile.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}
    </LazyWrapper>
  );
};

export default {
  LazyEventsList,
  LazyDashboardStats,
  LazyUserTable,
  LazyProfile
};
