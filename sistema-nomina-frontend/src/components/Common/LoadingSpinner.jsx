// src/components/Common/LoadingSpinner.js
import React from 'react';

function LoadingSpinner() {
  // Estilo muy básico para un spinner de texto
  const spinnerStyle = {
    fontSize: '1.5em',
    textAlign: 'center',
    padding: '20px',
  };

  return (
    <div style={spinnerStyle}>
      Cargando...
      {/* Aquí podrías poner un SVG o CSS más complejo para un spinner visual */}
    </div>
  );
}

export default LoadingSpinner;