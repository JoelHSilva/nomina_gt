import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './navigation/AppRoutes.jsx';
import Header from './components/Layout/Header.jsx';
import Navigation from './components/Layout/Navigation.jsx';
import Footer from './components/Layout/Footer.jsx';

import './App.css';

const Layout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isPublicPage = ['/login', '/register', '/error'].includes(location.pathname); // Añadir más rutas públicas si es necesario

  return (
    <div className="app-container">
      {!isPublicPage && <Header />}
      {!isPublicPage && <Navigation />}
      <main className="main-content">
        <AppRoutes />
      </main>
      {!isPublicPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
