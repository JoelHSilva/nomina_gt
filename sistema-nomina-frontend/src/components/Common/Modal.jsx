// src/components/Common/Modal.jsx
import React from 'react';
// No necesitas importar el CSS aquí

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    // Usa las clases del CSS
    <div className="modal-overlay" onClick={onClose}> {/* Cerrar al hacer clic fuera */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Evitar cerrar si clic es dentro */}
        {/* Usa las clases del CSS */}
        <div className="modal-header">
          <h2>{title}</h2>
           {/* Usa la clase del CSS */}
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body"> {/* Clase para el cuerpo del modal si necesitas padding extra, etc. */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;