// src/components/Layout/Footer.jsx
import React from 'react';
// No necesitas importar el CSS aquí

function Footer() {
  return (
    // Usa la clase del CSS
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Sistema de Nómina Guatemalteca. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;