import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/skeleton.css';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import AutoLogoutProvider from './components/common/AutoLogoutProvider';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfileSettings from './pages/user/ProfileSettings';
import EventDetail from './pages/events/EventDetail';
import EventConfirmation from './pages/events/EventConfirmation';
import EventTicket from './pages/events/EventTicket';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ParticipantsManagement from './pages/admin/ParticipantsManagement';
import AdminEvents from './pages/admin/AdminEvents';
import CreateEventPage from './pages/admin/CreateEventPage';
import EditEventPage from './pages/admin/EditEventPage';
import EventDetailPage from './pages/admin/EventDetailPage';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Event Organizer Auth
import OrganizerRoute from './components/auth/OrganizerRoute';

// Event Organizer Pages
import EODashboard from './pages/organizer/EODashboard';
import EOEvents from './pages/organizer/EOEvents';
import CreateEvent from './pages/organizer/CreateEvent';
import EditEvent from './pages/organizer/EditEvent';
import EOParticipants from './pages/organizer/EOParticipants';
import EOAnalytics from './pages/organizer/EOAnalytics';
import EOAttendance from './pages/organizer/EOAttendance';
import CertificateManagement from './pages/organizer/CertificateManagement';
import EOFinance from './pages/organizer/EOFinance';
import OrganizerEventDetail from './pages/organizer/EventDetail';
import EOLayout from './components/organizer/EOLayout';

// Layout component to conditionally show header/footer
function Layout({ children }) {
  const location = useLocation();

  const authPages = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/login/admin'];
  const isAuthPage = authPages.some(page => location.pathname.startsWith(page));
  const isAdminPage = location.pathname.startsWith('/admin');
  const isOrganizerPage = location.pathname.startsWith('/organizer');
  const isProfileSettingsPage = location.pathname.startsWith('/profile/settings');
  const is404Page = false; // Always show navbar and footer

  // Hide header and footer on event detail pages (e.g., /events/1, /events/2, etc.)
  const isEventDetailPage = /^\/events\/\d+$/.test(location.pathname);
  const isEventConfirmPage = /^\/events\/\d+\/confirm/.test(location.pathname);
  const isEventTicketPage = /^\/events\/\d+\/ticket/.test(location.pathname);

  if (isAuthPage || isAdminPage || isOrganizerPage || isEventDetailPage || isEventConfirmPage || isEventTicketPage || isProfileSettingsPage || is404Page) {
    return (
      <div className="animate-fade-in">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <Header />
      <main className="page-transition">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AutoLogoutProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/confirm" element={<EventConfirmation />} />
          <Route path="/events/:id/ticket/:registrationId" element={<EventTicket />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* User Routes */}
          <Route path="/profile/settings" element={<ProfileSettings />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="participants" element={<AdminRoute><ParticipantsManagement /></AdminRoute>} />
            <Route path="events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
            <Route path="events/create" element={<AdminRoute><CreateEventPage /></AdminRoute>} />
            <Route path="events/:id" element={<AdminRoute><EventDetailPage /></AdminRoute>} />
            <Route path="events/:id/edit" element={<AdminRoute><EditEventPage /></AdminRoute>} />
          </Route>

          {/* Event Organizer Routes */}
          <Route path="/organizer" element={<EOLayout />}>
            <Route index element={<OrganizerRoute><EODashboard /></OrganizerRoute>} />
            <Route path="events" element={<OrganizerRoute><EOEvents /></OrganizerRoute>} />
            <Route path="events/create" element={<OrganizerRoute><CreateEvent /></OrganizerRoute>} />
            <Route path="events/:id" element={<OrganizerRoute><OrganizerEventDetail /></OrganizerRoute>} />
            <Route path="events/:id/edit" element={<OrganizerRoute><EditEvent /></OrganizerRoute>} />
            <Route path="participants" element={<OrganizerRoute><EOParticipants /></OrganizerRoute>} />
            <Route path="analytics" element={<OrganizerRoute><EOAnalytics /></OrganizerRoute>} />
            <Route path="attendance" element={<OrganizerRoute><EOAttendance /></OrganizerRoute>} />
            <Route path="certificates" element={<OrganizerRoute><CertificateManagement /></OrganizerRoute>} />
            <Route path="finance" element={<OrganizerRoute><EOFinance /></OrganizerRoute>} />
          </Route>

          {/* Admin Login Route */}
          <Route path="/login/admin" element={<AdminLogin />} />
          
          {/* 404 Routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AutoLogoutProvider>
    </Router>
  );
}

export default App;
