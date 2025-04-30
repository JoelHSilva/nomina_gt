// src/components/Common/Button.jsx
import React from 'react';
// No necesitas importar el CSS aquí

function Button({ onClick, children, type = 'button', className = '', style, ...props }) {
  // Concatena la clase base con cualquier clase adicional pasada
  const buttonClasses = `app-button ${className}`.trim();

  // Ya no se usa el estilo en línea directamente para el aspecto principal,
  // pero se puede pasar un estilo adicional si es necesario para casos específicos.
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses} // Usa las clases
      style={style} // Permite estilos adicionales si es necesario
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

/*
Ejemplo de uso con clases de color:
<Button onClick={handleSave} className="app-button-primary">Guardar</Button>
<Button onClick={handleDelete} className="app-button-danger">Eliminar</Button>
*/