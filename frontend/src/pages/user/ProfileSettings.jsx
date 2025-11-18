import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { userAPI, authAPI } from '../../services/api';
import { toast } from 'react-toastify';

// Import layout components
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// Import settings components
import SettingsSidebar from '../../components/settings/SettingsSidebar';
import EditProfile from '../../components/settings/EditProfile';
import PasswordSettings from '../../components/settings/PasswordSettings';
import NotificationsSettings from '../../components/settings/NotificationsSettings';
import BookmarksTab from '../../components/settings/BookmarksTab';
import CertificatesTab from '../../components/settings/CertificatesTab';
import MyEventsTab from '../../components/settings/MyEventsTab';

const ProfileSettings = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'edit-profile');
  const [profile, setProfile] = useState({
    nama_lengkap: '',
    email: '',
    no_handphone: '',
    alamat: '',
    pendidikan_terakhir: ''
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchBookmarks();
    fetchCertificates();
    fetchMyEvents();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      toast.error('Gagal memuat profil');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Extract events from bookmark data
        const events = data.data.map(bookmark => ({
          id: bookmark.Event.id,
          judul: bookmark.Event.judul,
          tanggal: bookmark.Event.tanggal,
          waktu_mulai: bookmark.Event.waktu_mulai,
          lokasi: bookmark.Event.lokasi,
          flyer_url: bookmark.Event.flyer_url,
          kategori: bookmark.Event.kategori,
          bookmarked_at: bookmark.createdAt
        }));
        setBookmarkedEvents(events);
      }
    } catch (error) {
      console.error('Fetch bookmarks error:', error);
      setBookmarkedEvents([]);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await userAPI.getMyCertificates();
      console.log('Certificates response:', response.data);
      
      if (response.data.success) {
        setCertificates(response.data.data || []);
      } else {
        setCertificates([]);
      }
    } catch (error) {
      console.error('Fetch certificates error:', error);
      setCertificates([]);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const response = await userAPI.getMyEvents();
      setMyEvents(response.data || []);
    } catch (error) {
      setMyEvents([]);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await userAPI.updateProfile(profile);
      toast.success('Profile berhasil diperbarui');
      
      // Update localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      toast.error('Gagal memperbarui profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setIsSaving(true);
    try {
      await authAPI.changePassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      toast.success('Password berhasil diubah');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'edit-profile':
        return (
          <EditProfile 
            profile={profile}
            setProfile={setProfile}
            handleProfileUpdate={handleProfileUpdate}
            isSaving={isSaving}
          />
        );

      case 'password':
        return (
          <PasswordSettings 
            passwords={passwords}
            setPasswords={setPasswords}
            showOldPassword={showOldPassword}
            setShowOldPassword={setShowOldPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handlePasswordChange={handlePasswordChange}
            isSaving={isSaving}
          />
        );

      case 'notifications':
        return <NotificationsSettings />;

      case 'bookmarks':
        return <BookmarksTab bookmarkedEvents={bookmarkedEvents} />;

      case 'certificates':
        return <CertificatesTab certificates={certificates} />;

      case 'my-events':
        return <MyEventsTab myEvents={myEvents} />;

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileSettings;
