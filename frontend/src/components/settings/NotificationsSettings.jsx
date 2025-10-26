import React, { useState, useEffect } from 'react';
import { Calendar, Award, CheckCircle, Bell, Trash2, Check, X, Circle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const NotificationsSettings = () => {
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/notifications?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'unread', label: 'Belum Dibaca' },
    { value: 'read', label: 'Sudah Dibaca' }
  ];

  const filteredNotifications = 
    filter === 'all' ? notifications :
    filter === 'unread' ? notifications.filter(n => !n.is_read) :
    notifications.filter(n => n.is_read);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const toggleRead = async (id) => {
    try {
      const notification = notifications.find(n => n.id === id);
      const token = localStorage.getItem('token');

      if (!notification.is_read) {
        // Mark as read
        const response = await fetch(`/api/notifications/${id}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setNotifications(notifications.map(n => 
            n.id === id ? { ...n, is_read: true, read_at: new Date() } : n
          ));
          toast.success('Notifikasi ditandai sudah dibaca');
        }
      } else {
        // For now, just toggle locally (no API endpoint to mark as unread)
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, is_read: false, read_at: null } : n
        ));
        toast.info('Notifikasi ditandai belum dibaca');
      }
    } catch (error) {
      console.error('Toggle read error:', error);
      toast.error('Gagal mengubah status notifikasi');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, is_read: true, read_at: new Date() })));
        toast.success('Semua notifikasi ditandai sudah dibaca');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      toast.error('Gagal menandai semua notifikasi');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== id));
        toast.success('Notifikasi dihapus');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      toast.error('Gagal menghapus notifikasi');
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/notifications/clear-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications([]);
        toast.success('Semua notifikasi dihapus');
      }
    } catch (error) {
      console.error('Clear all error:', error);
      toast.error('Gagal menghapus semua notifikasi');
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_registered':
        return CheckCircle;
      case 'event_cancelled':
        return AlertCircle;
      case 'event_updated':
        return Bell;
      case 'event_reminder':
        return Calendar;
      case 'certificate':
        return Award;
      default:
        return Bell;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'event_registered':
        return 'text-green-500';
      case 'event_cancelled':
        return 'text-red-500';
      case 'event_updated':
        return 'text-orange-500';
      case 'event_reminder':
        return 'text-blue-500';
      case 'certificate':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifikasi</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} belum dibaca
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Tandai Semua Dibaca
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === option.value
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada notifikasi</p>
            <p className="text-gray-400 text-sm mt-1">
              {filter === 'all' 
                ? 'Notifikasi akan muncul di sini' 
                : filter === 'unread'
                ? 'Semua notifikasi sudah dibaca'
                : 'Belum ada notifikasi yang dibaca'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const Icon = getNotificationIcon(notif.type);
            const iconColor = getIconColor(notif.type);
            
            return (
              <div
                key={notif.id}
                className={`group relative p-4 rounded-lg border transition-all ${
                  notif.is_read
                    ? 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-1">
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold mb-1 ${notif.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notif.title}
                      </h3>
                      {!notif.is_read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${notif.is_read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getTimeAgo(notif.createdAt)}
                    </p>
                  </div>

                  {/* Actions - Right Side */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(notif.id);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title={notif.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                    >
                      {notif.is_read ? (
                        <Circle className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus notifikasi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsSettings;
