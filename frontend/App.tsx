import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import ManageProjects from './pages/Admin/ManageProjects';
import ManageServices from './pages/Admin/ManageServices';
import ManageClients from './pages/Admin/ManageClients';
import ManageInfo from './pages/Admin/ManageInfo';
import ProtectedRoute from './components/ProtectedRoute';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Layout><PageTransition><Home /></PageTransition></Layout>} />
        <Route path="/about" element={<Layout><PageTransition><About /></PageTransition></Layout>} />
        <Route path="/services" element={<Layout><PageTransition><Services /></PageTransition></Layout>} />
        <Route path="/projects" element={<Layout><PageTransition><Projects /></PageTransition></Layout>} />
        <Route path="/contact" element={<Layout><PageTransition><Contact /></PageTransition></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute><AdminLayout><ManageProjects /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute><AdminLayout><ManageServices /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/clients" element={<ProtectedRoute><AdminLayout><ManageClients /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/info" element={<ProtectedRoute><AdminLayout><ManageInfo /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
};

export default App;