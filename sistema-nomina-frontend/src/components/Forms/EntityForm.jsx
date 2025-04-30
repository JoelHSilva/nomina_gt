// src/components/Forms/EntityForm.js
import React, { useState } from 'react';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Modal from '../Common/Modal'; // Si quieres que el formulario se use dentro de un modal

function EntityForm({ initialData = {}, onSubmit, isEditing = false, isOpen = true, onClose = () => {} }) {
  // Estado local para los datos del formulario
  const [formData, setFormData] = useState(initialData);

  // Maneja el cambio en cualquier campo de entrada
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Llama a la función onSubmit pasada como prop, enviando los datos del formulario
    onSubmit(formData);
  };

  // Estilo básico para el formulario
  const formStyle = {
      display: isOpen ? 'block' : 'none', // Controla visibilidad si se usa fuera de Modal
      padding: '20px',
      border: '1px solid #eee',
      borderRadius: '5px',
      backgroundColor: '#fff',
  };


  // Nota: Este es un formulario *genérico*.
  // En una aplicación real, crearías formularios específicos
  // como EmpleadoForm.js, DepartamentoForm.js, etc.,
  // que usarían el componente Input y Button.
  // Este componente sirve más como placeholder y ejemplo básico.

  return (
      <form onSubmit={handleSubmit} /*style={formStyle}*/> {/* El estilo se aplicaría si no está en Modal */}
          <h3>{isEditing ? 'Editar' : 'Crear'} Entidad</h3>

          {/*
            Aquí irían los campos específicos de la entidad.
            Por ejemplo:
          */}
          <Input
            label="Nombre:"
            id="nombre" // Debe coincidir con la clave en initialData y formData
            value={formData.nombre || ''} // Usa || '' para manejar undefined si initialData está vacío
            onChange={handleInputChange}
            required
          />

           <Input
            label="Descripción:"
            id="descripcion" // Debe coincidir con la clave en initialData y formData
            value={formData.descripcion || ''}
            onChange={handleInputChange}
          />

          {/* Agrega aquí todos los campos necesarios para la entidad */}
          {/* Ejemplo: Input para salario, Select para departamento, etc. */}

          <Button type="submit">
              {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
           {/*
           <Button type="button" onClick={onClose} style={{marginLeft: '10px', backgroundColor: '#6c757d'}}>
               Cancelar
           </Button>
           */}
      </form>
  );
}

export default EntityForm;