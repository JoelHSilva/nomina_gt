// src/navigation/RutaPrivada.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function RutaPrivada({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return usuario ? children : <Navigate to="/login" replace />;
}

export default RutaPrivada;
