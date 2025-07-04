import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestProvider } from '@questlabs/react-sdk';
import '@questlabs/react-sdk/dist/style.css';
import { AuthProvider } from './contexts/AuthContext';
import questConfig from './config/questConfig';
import Header from './components/Header';
import Footer from './components/Footer';
import ChefBot from './components/ChefBot';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import About from './pages/About';
import Subscribe from './pages/Subscribe';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Reviews from './pages/Reviews';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const location = useLocation();

  // Determine current page for ChefBot context
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/contact') return 'contact';
    if (path === '/subscribe') return 'subscribe';
    if (path === '/episodes') return 'episodes';
    if (path === '/blog') return 'blog';
    if (path === '/about') return 'about';
    if (path === '/reviews') return 'reviews';
    if (path === '/admin') return 'admin';
    return 'general';
  };

  return (
    <QuestProvider
      apiKey={questConfig.APIKEY}
      entityId={questConfig.ENTITYID}
      apiType="PRODUCTION"
    >
      <div className="min-h-screen bg-white">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/about" element={<About />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
        <Footer />
        
        {/* ChefBot - Context-aware */}
        <ChefBot page={getCurrentPage()} />
      </div>
    </QuestProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;