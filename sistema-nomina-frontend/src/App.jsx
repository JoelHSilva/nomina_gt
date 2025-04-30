// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './navigation/AppRoutes.jsx'; // Asegúrate de la extensión .jsx
import Header from './components/Layout/Header.jsx';
import Navigation from './components/Layout/Navigation.jsx';
import Footer from './components/Layout/Footer.jsx';

import './App.css'; // <-- Importa el archivo CSS global

function App() {
  return (
    <Router>
      {/* Usa la clase del CSS */}
      <div className="app-container">
        <Header />
        <Navigation />
        {/* Usa la clase del CSS */}
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;