// src/index.js (o main.jsx si no lo renombraste)
import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde react-dom/client
import App from './App.jsx'; // Importa el componente App
import './index.css'; // Importa estilos globales si los tienes
import './Styles/styles.css';

// Usa createRoot para montar la aplicación (API moderna de React 18+)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> {/* Modo estricto para desarrollo */}
    <App /> {/* Renderiza tu componente App */}
  </React.StrictMode>,
);

// Si usaste Create React App (no Vite), tu index.js podría ser diferente,
// pero el concepto de renderizar <App /> en un elemento DOM es el mismo.