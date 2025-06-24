import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Episodes from './pages/Episodes';
import About from './pages/About';
import Subscribe from './pages/Subscribe';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
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
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;