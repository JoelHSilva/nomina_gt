import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';

function ConfiguracionFiscalForm({ initialData, onSubmit }) {
  // Estado inicial del formulario
  const initialFormState = {
    anio: '',
    porcentaje_igss_empleado: '',
    porcentaje_igss_patronal: '',
    rango_isr_tramo1: '',
    porcentaje_isr_tramo1: '',
    rango_isr_tramo2: '',
    porcentaje_isr_tramo2: '',
    monto_bonificacion_incentivo: '',
    activo: true
  };

  const [formData, setFormData] = useState(initialFormState);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialData?.id_configuracion) {
      // Si estamos editando, cargamos los datos iniciales
      setFormData({
        anio: initialData.anio.toString(),
        porcentaje_igss_empleado: initialData.porcentaje_igss_empleado.toString(),
        porcentaje_igss_patronal: initialData.porcentaje_igss_patronal.toString(),
        rango_isr_tramo1: initialData.rango_isr_tramo1.toString(),
        porcentaje_isr_tramo1: initialData.porcentaje_isr_tramo1.toString(),
        rango_isr_tramo2: initialData.rango_isr_tramo2.toString(),
        porcentaje_isr_tramo2: initialData.porcentaje_isr_tramo2.toString(),
        monto_bonificacion_incentivo: initialData.monto_bonificacion_incentivo.toString(),
        activo: Boolean(initialData.activo)
      });
      setHasChanges(false);
    } else {
      // Si estamos creando nuevo, reseteamos el formulario
      setFormData(initialFormState);
      setHasChanges(true);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const newData = {...prev, [id]: newValue};
      
      // Verificamos si hay cambios comparando con los datos iniciales
      if (initialData?.id_configuracion) {
        const originalData = {
          anio: initialData.anio.toString(),
          porcentaje_igss_empleado: initialData.porcentaje_igss_empleado.toString(),
          porcentaje_igss_patronal: initialData.porcentaje_igss_patronal.toString(),
          rango_isr_tramo1: initialData.rango_isr_tramo1.toString(),
          porcentaje_isr_tramo1: initialData.porcentaje_isr_tramo1.toString(),
          rango_isr_tramo2: initialData.rango_isr_tramo2.toString(),
          porcentaje_isr_tramo2: initialData.porcentaje_isr_tramo2.toString(),
          monto_bonificacion_incentivo: initialData.monto_bonificacion_incentivo.toString(),
          activo: Boolean(initialData.activo)
        };
        
        const changesExist = Object.keys(newData).some(key => {
          return originalData[key] !== newData[key];
        });
        
        setHasChanges(changesExist);
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isDeleting) {
      // Enviar solo el campo activo como false para borrado lógico
      onSubmit({ activo: false });
      return;
    }

    const dataToSend = {
      anio: parseInt(formData.anio, 10),
      porcentaje_igss_empleado: parseFloat(formData.porcentaje_igss_empleado),
      porcentaje_igss_patronal: parseFloat(formData.porcentaje_igss_patronal),
      rango_isr_tramo1: parseFloat(formData.rango_isr_tramo1),
      porcentaje_isr_tramo1: parseFloat(formData.porcentaje_isr_tramo1),
      rango_isr_tramo2: parseFloat(formData.rango_isr_tramo2),
      porcentaje_isr_tramo2: parseFloat(formData.porcentaje_isr_tramo2),
      monto_bonificacion_incentivo: parseFloat(formData.monto_bonificacion_incentivo),
      activo: formData.activo
    };

    // Validación de rangos ISR
    if (dataToSend.rango_isr_tramo1 > dataToSend.rango_isr_tramo2) {
      alert('El Rango ISR Tramo 1 no puede ser mayor que el Rango ISR Tramo 2.');
      return;
    }

    onSubmit(dataToSend);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de desactivar esta configuración fiscal?')) {
      setIsDeleting(true);
      // Disparamos el submit con activo: false
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      const form = document.querySelector('form');
      form.dispatchEvent(submitEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData?.id_configuracion ? 'Editar' : 'Crear'} Configuración Fiscal</h3>

      {initialData?.id_configuracion && (
        <div style={{ 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: formData.activo ? '#e8f5e9' : '#ffebee',
          borderRadius: '4px',
          borderLeft: `4px solid ${formData.activo ? '#4caf50' : '#f44336'}`
        }}>
          Estado actual: 
          <span style={{ 
            color: formData.activo ? '#2e7d32' : '#c62828',
            fontWeight: 'bold',
            marginLeft: '5px'
          }}>
            {formData.activo ? 'ACTIVA' : 'INACTIVA'}
          </span>
        </div>
      )}

      {/* Campos del formulario (se mantienen igual) */}
      <Input
        label="Año:"
        id="anio"
        type="number"
        value={formData.anio}
        onChange={handleChange}
        required
        min="2000"
        max="2100"
        step="1"
        disabled={!!initialData?.id_configuracion}
        title={initialData?.id_configuracion ? "No se puede modificar el año de una configuración existente" : ""}
      />

      <Input 
        label="Porcentaje IGSS Empleado (%):" 
        id="porcentaje_igss_empleado" 
        type="number" 
        value={formData.porcentaje_igss_empleado} 
        onChange={handleChange} 
        required 
        step="0.01" 
        min="0" 
        max="100"
        placeholder="4.83"
      />

      <Input 
        label="Porcentaje IGSS Patronal (%):" 
        id="porcentaje_igss_patronal" 
        type="number" 
        value={formData.porcentaje_igss_patronal} 
        onChange={handleChange} 
        required 
        step="0.01" 
        min="0" 
        max="100"
        placeholder="10.67"
      />

      <Input 
        label="Rango ISR Tramo 1 (Q):" 
        id="rango_isr_tramo1" 
        type="number" 
        value={formData.rango_isr_tramo1} 
        onChange={handleChange} 
        required 
        step="0.01" 
        min="0"
        placeholder="48000.00"
      />

      <Input 
        label="Porcentaje ISR Tramo 1 (%):" 
        id="porcentaje_isr_tramo1" 
        type="number" 
        value={formData.porcentaje_isr_tramo1} 
        onChange={handleChange} 
        required 
        step="0.01" 
        min="0" 
        max="100"
        placeholder="5.00"
      />

      <Input 
        label="Rango ISR Tramo 2 (Q):" 
        id="rango_isr_tramo2" 
        type="number" 
        value={formData.rango_isr_tramo2} 
        onChange={handleChange} 
        required 
        step="0.01" 
        min="0"
        placeholder="300000.00"
      />

      <Input 
        label="Porcentaje ISR Tramo 2 (%):" 
        id="porcentaje_isr_tramo2" 
        type="number" 
        value={formData.porcentaje_isr_tramo2} 
        onChange={handleChange} 
        required 
        step="0.01" 
        min="0" 
        max="100"
        placeholder="7.00"
      />

      <Input 
        label="Monto Bonificación Incentivo (Q):" 
        id="monto_bonificacion_incentivo" 
        type="number" 
        value={formData.monto_bonificacion_incentivo} 
        onChange={handleChange} 
        required 
        step="0.01" 
        min="0"
        placeholder="250.00"
      />

      <div className="app-input-container" style={{ margin: '15px 0' }}>
        <div>
          <input 
            type="checkbox" 
            id="activo" 
            checked={formData.activo} 
            onChange={handleChange} 
            disabled={isDeleting}
          />
          <label htmlFor="activo" style={{ marginLeft: '8px' }}>
            Configuración Activa
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {initialData?.id_configuracion && (
          <Button
            type="button"
            className="app-button-danger"
            onClick={handleDelete}
            disabled={isDeleting || !formData.activo}
          >
            Desactivar Configuración
          </Button>
        )}

        <Button
          type="submit"
          className="app-button-primary"
          disabled={(initialData?.id_configuracion && !hasChanges) || isDeleting}
        >
          {initialData?.id_configuracion ? 'Actualizar' : 'Crear'} Configuración
        </Button>
      </div>

      {initialData?.id_configuracion && !hasChanges && !isDeleting && (
        <p style={{ color: '#666', marginTop: '10px', fontSize: '0.9em' }}>
          Modifica algún campo para habilitar la actualización
        </p>
      )}
    </form>
  );
}

export default ConfiguracionFiscalForm;