// src/components/Common/Input.jsx
import React from 'react';
// No necesitas importar el CSS aquí

function Input({ label, id, type = 'text', value, onChange, className = '', ...props }) {
  // Usa las clases del CSS
  const containerClasses = "app-input-container";
  const labelClasses = "app-input-label";
  const inputClasses = `app-input-field ${className}`.trim(); // Permite añadir clases adicionales

  // Puedes decidir si quieres un componente Textarea separado o manejar type="textarea" aquí
  if (type === 'textarea') {
      return (
           <div className={containerClasses}>
               {label && <label htmlFor={id} className={labelClasses}>{label}</label>}
               <textarea
                   id={id}
                   value={value}
                   onChange={onChange}
                   className={inputClasses}
                   {...props}
               />
           </div>
      );
  }


  return (
    <div className={containerClasses}>
      {label && <label htmlFor={id} className={labelClasses}>{label}</label>}
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className={inputClasses} // Usa las clases
        {...props}
      />
    </div>
  );
}

export default Input;