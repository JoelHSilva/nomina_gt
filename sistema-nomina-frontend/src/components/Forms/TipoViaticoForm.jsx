// src/components/Forms/TipoViaticoForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
// No necesita LoadingSpinner ni api/endpoints

function TipoViaticoForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true, // Default TRUE
    // fecha_creacion no editable
  });

  // Actualiza el estado del formulario si cambia initialData (para el modo edición)
  useEffect(() => {
    if (initialData && initialData.id_tipo_viatico) { // Verificar si estamos en modo edición
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        activo: initialData.activo === undefined ? true : initialData.activo, // Cargar activo, default true si undefined
      });
    } else {
         // Si no hay initialData, resetear el formulario para creación
         setFormData({
             nombre: '',
             descripcion: '',
             activo: true,
         });
     }
  }, [initialData]);


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // No se necesita transformación compleja
    onSubmit(formData);
  };


  return (
    <form onSubmit={handleSubmit}>
        <h3>{initialData.id_tipo_viatico ? 'Editar' : 'Crear'} Tipo de Viático</h3>

        {/* Campos de texto */}
        <Input label="Nombre:" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
        <Input label="Descripción:" id="descripcion" value={formData.descripcion} onChange={handleInputChange} type="textarea" />

        {/* Checkbox Activo */}
         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Activo</label>
              </div>
         </div>


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {initialData.id_tipo_viatico ? 'Actualizar' : 'Crear'} Tipo
        </Button>
    </form>
  );
}

export default TipoViaticoForm;