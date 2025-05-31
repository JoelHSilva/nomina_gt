import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './navigation/AppRoutes.jsx';
import Header from './components/Layout/Header.jsx';
import Navigation from './components/Layout/Navigation.jsx';
import Footer from './components/Layout/Footer.jsx';
import { ViaticosProvider } from './pages/modviaticos/context/ViaticosContext.jsx'; // Importa el provider

import './App.css';

const Layout = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLogin && <Header />}
      {!isLogin && <Navigation />}
      <main className="main-content">
        <ViaticosProvider> {/* Envuelve AppRoutes con el provider */}
          <AppRoutes />
        </ViaticosProvider>
      </main>
      {!isLogin && <Footer />}
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