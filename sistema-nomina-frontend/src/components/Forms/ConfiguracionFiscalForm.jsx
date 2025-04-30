// src/components/Forms/ConfiguracionFiscalForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx'; // Asegúrate de la extensión .jsx
import Button from '../Common/Button.jsx'; // Asegúrate de la extensión .jsx
// No necesitamos LoadingSpinner ni api/endpoints si este formulario solo maneja datos

function ConfiguracionFiscalForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    anio: '', // Año (puede ser number input o text)
    porcentaje_igss_empleado: '',
    porcentaje_igss_patronal: '',
    rango_isr_tramo1: '',
    porcentaje_isr_tramo1: '',
    rango_isr_tramo2: '',
    porcentaje_isr_tramo2: '',
    monto_bonificacion_incentivo: '',
    activo: true, // Valor por defecto boolean TRUE
    // fecha_actualizacion no es editable
  });

  // Actualiza el estado del formulario si cambia initialData (para el modo edición)
  useEffect(() => {
    if (initialData && initialData.id_configuracion) { // Verificar si estamos en modo edición
      setFormData({
        anio: initialData.anio || '',
        porcentaje_igss_empleado: initialData.porcentaje_igss_empleado || '',
        porcentaje_igss_patronal: initialData.porcentaje_igss_patronal || '',
        rango_isr_tramo1: initialData.rango_isr_tramo1 || '',
        porcentaje_isr_tramo1: initialData.porcentaje_isr_tramo1 || '',
        rango_isr_tramo2: initialData.rango_isr_tramo2 || '',
        porcentaje_isr_tramo2: initialData.porcentaje_isr_tramo2 || '',
        monto_bonificacion_incentivo: initialData.monto_bonificacion_incentivo || '',
        activo: initialData.activo || false, // Manejar booleanos
      });
    } else {
         // Si no hay initialData, resetear el formulario para creación
         setFormData({
            anio: '', porcentaje_igss_empleado: '', porcentaje_igss_patronal: '',
            rango_isr_tramo1: '', porcentaje_isr_tramo1: '', rango_isr_tramo2: '',
            porcentaje_isr_tramo2: '', monto_bonificacion_incentivo: '', activo: true,
         });
     }
  }, [initialData]); // Depende de initialData


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      // Manejar checkboxes y otros tipos de input
      [id]: type === 'checkbox' ? checked : value,
    });
  };

   // Manejar inputs numéricos (porcentajes, montos, año si es number)
    const handleNumberInputChange = (e) => {
        const { id, value } = e.target;
        // Permite cadena vacía para campos opcionales, si no, convierte a número
        // Para el año, parseInt puede ser suficiente si es un año entero
        const numericValue = id === 'anio' ? parseInt(value, 10) : parseFloat(value);

        setFormData({
            ...formData,
            [id]: value === '' ? '' : (isNaN(numericValue) ? value : numericValue) // Guardar como número, string vacío o valor original si NaN
        });
    };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos si es necesario (ej: asegurar que los numéricos son numbers)
    const dataToSend = {
        ...formData,
         // Asegurar que los campos numéricos sean números, no strings vacíos o NaN
         anio: parseInt(formData.anio, 10) || 0, // Año debe ser número
         porcentaje_igss_empleado: parseFloat(formData.porcentaje_igss_empleado) || 0,
         porcentaje_igss_patronal: parseFloat(formData.porcentaje_igss_patronal) || 0,
         rango_isr_tramo1: parseFloat(formData.rango_isr_tramo1) || 0,
         porcentaje_isr_tramo1: parseFloat(formData.porcentaje_isr_tramo1) || 0,
         rango_isr_tramo2: parseFloat(formData.rango_isr_tramo2) || 0,
         porcentaje_isr_tramo2: parseFloat(formData.porcentaje_isr_tramo2) || 0,
         monto_bonificacion_incentivo: parseFloat(formData.monto_bonificacion_incentivo) || 0,
         // activo ya es booleano por el checkbox
    };

     // Validación adicional simple: asegurar que los rangos de ISR tienen sentido (tramo1 <= tramo2)
     if (dataToSend.rango_isr_tramo1 > dataToSend.rango_isr_tramo2 && dataToSend.rango_isr_tramo2 !== 0) {
         alert('El Rango ISR Tramo 1 no puede ser mayor que el Rango ISR Tramo 2.');
         return; // Detener el envío
     }


    onSubmit(dataToSend);
  };


  return (
    <form onSubmit={handleSubmit}>
        <h3>{initialData.id_configuracion ? 'Editar' : 'Crear'} Configuración Fiscal</h3>

        {/* Campo Año */}
        <Input
            label="Año:"
            id="anio"
            type="number" // O type="text" con pattern para año
            value={formData.anio}
            onChange={handleNumberInputChange}
            required
            min="2000" // Validar años razonables
            step="1"
            // disable en edición si el backend no permite cambiar el año de una config existente
            disabled={!!initialData.id_configuracion}
        />

        {/* Campos IGSS */}
        <Input label="Porcentaje IGSS Empleado (%):" id="porcentaje_igss_empleado" type="number" value={formData.porcentaje_igss_empleado} onChange={handleNumberInputChange} required step="0.01" min="0" />
        <Input label="Porcentaje IGSS Patronal (%):" id="porcentaje_igss_patronal" type="number" value={formData.porcentaje_igss_patronal} onChange={handleNumberInputChange} required step="0.01" min="0" />

        {/* Campos ISR */}
        <Input label="Rango ISR Tramo 1 (Q):" id="rango_isr_tramo1" type="number" value={formData.rango_isr_tramo1} onChange={handleNumberInputChange} required step="0.01" min="0" />
        <Input label="Porcentaje ISR Tramo 1 (%):" id="porcentaje_isr_tramo1" type="number" value={formData.porcentaje_isr_tramo1} onChange={handleNumberInputChange} required step="0.01" min="0" max="100" />
        <Input label="Rango ISR Tramo 2 (Q):" id="rango_isr_tramo2" type="number" value={formData.rango_isr_tramo2} onChange={handleNumberInputChange} required step="0.01" min="0" />
        <Input label="Porcentaje ISR Tramo 2 (%):" id="porcentaje_isr_tramo2" type="number" value={formData.porcentaje_isr_tramo2} onChange={handleNumberInputChange} required step="0.01" min="0" max="100" />

        {/* Campo Bonificación Incentivo */}
        <Input label="Monto Bonificación Incentivo (Q):" id="monto_bonificacion_incentivo" type="number" value={formData.monto_bonificacion_incentivo} onChange={handleNumberInputChange} required step="0.01" min="0" />

        {/* Checkbox Activo */}
         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Configuración Activa</label>
              </div>
         </div>


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {initialData.id_configuracion ? 'Actualizar' : 'Crear'} Configuración
        </Button>
    </form>
  );
}

export default ConfiguracionFiscalForm;