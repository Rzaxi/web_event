import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppLoader from './components/ui/AppLoader';
import PageLoader from './components/ui/PageLoader';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/user/Profile';
import MyEvents from './pages/user/MyEvents';
import EventDetail from './pages/events/EventDetail';
import EventConfirmation from './pages/events/EventConfirmation';
import ProfileCompletion from './pages/ProfileCompletion';

import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/user/Dashboard';
import AccountSettings from './pages/user/AccountSettings';

// Layout component to conditionally show header/footer
function Layout({ children }) {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location);

  const authPages = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/profile-completion'];
  const isAuthPage = authPages.some(page => location.pathname.startsWith(page));

  useEffect(() => {
    if (location !== prevLocation) {
      setIsPageLoading(true);

      // Simulate page loading time
      const timer = setTimeout(() => {
        setIsPageLoading(false);
        setPrevLocation(location);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [location, prevLocation]);

  if (isPageLoading) {
    return <PageLoader isVisible={true} />;
  }

  if (isAuthPage) {
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
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <AppLoader onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/confirm" element={<EventConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-completion" element={<ProfileCompletion />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* User Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/account-settings" element={<AccountSettings />} />

          {/* Dashboard Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
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
    </Router>
  );
}

export default App;
