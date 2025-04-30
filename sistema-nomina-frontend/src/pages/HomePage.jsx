// src/pages/HomePage.jsx
import React from 'react';
// No necesitas importar el CSS aquí

function HomePage() {
  return (
    // Eliminar style={{ padding: '20px', textAlign: 'center' }}
    <div style={{ textAlign: 'center' }}> {/* Mantener text-align si lo quieres centrado */}
      <h2>Bienvenido al Sistema de Nómina Guatemalteca</h2>
      <p>Utiliza el menú de navegación para acceder a las diferentes secciones del sistema.</p>
      {/* Puedes añadir aquí un dashboard básico o información relevante */}
    </div>
  );
}

export default HomePage;

// Haz lo mismo para DepartamentosPage.jsx, EmpleadosPage.jsx, LogsSistemaPage.jsx, NotFoundPage.jsx
// Simplemente quita el style={{ padding: '20px' }} del div contenedor principal en cada una.
// El padding ahora lo maneja la clase .main-content en App.jsx