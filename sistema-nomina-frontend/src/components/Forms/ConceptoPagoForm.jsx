import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';

function ConceptoPagoForm({ initialData, onSubmit }) {
  // Estado inicial del formulario
  const initialFormState = {
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: 'Ingreso',
    es_fijo: false,
    afecta_igss: false,
    afecta_isr: false,
    es_viatico: false,
    porcentaje: '',
    monto_fijo: '',
    obligatorio: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (initialData?.id_concepto) {
      // Si estamos editando, cargamos los datos iniciales
      setFormData({
        codigo: initialData.codigo || '',
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        tipo: initialData.tipo || 'Ingreso',
        es_fijo: Boolean(initialData.es_fijo),
        afecta_igss: Boolean(initialData.afecta_igss),
        afecta_isr: Boolean(initialData.afecta_isr),
        es_viatico: Boolean(initialData.es_viatico),
        porcentaje: initialData.porcentaje !== null ? String(initialData.porcentaje) : '',
        monto_fijo: initialData.monto_fijo !== null ? String(initialData.monto_fijo) : '',
        obligatorio: Boolean(initialData.obligatorio),
      });
      setHasChanges(false);
    } else {
      // Si estamos creando nuevo, reseteamos el formulario
      setFormData(initialFormState);
      setHasChanges(true); // En creación siempre permitimos guardar
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const newData = {...prev, [id]: newValue};
      
      // Verificamos si hay cambios comparando con los datos iniciales
      if (initialData?.id_concepto) {
        const originalData = {
          codigo: initialData.codigo || '',
          nombre: initialData.nombre || '',
          descripcion: initialData.descripcion || '',
          tipo: initialData.tipo || 'Ingreso',
          es_fijo: Boolean(initialData.es_fijo),
          afecta_igss: Boolean(initialData.afecta_igss),
          afecta_isr: Boolean(initialData.afecta_isr),
          es_viatico: Boolean(initialData.es_viatico),
          porcentaje: initialData.porcentaje !== null ? String(initialData.porcentaje) : '',
          monto_fijo: initialData.monto_fijo !== null ? String(initialData.monto_fijo) : '',
          obligatorio: Boolean(initialData.obligatorio),
        };
        
        const changesExist = Object.keys(newData).some(key => {
          // Comparación especial para campos numéricos
          if (['porcentaje', 'monto_fijo'].includes(key)) {
            return (originalData[key] || '') !== (newData[key] || '');
          }
          return originalData[key] !== newData[key];
        });
        
        setHasChanges(changesExist);
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      porcentaje: formData.porcentaje === '' ? null : parseFloat(formData.porcentaje),
      monto_fijo: formData.monto_fijo === '' ? null : parseFloat(formData.monto_fijo),
    };

    // Validaciones existentes...
    if (formData.es_fijo && !dataToSend.monto_fijo) {
      alert('Si el concepto es fijo, debe especificar un Monto Fijo.');
      return;
    }

    if (!formData.es_fijo && !dataToSend.porcentaje) {
      alert('Si el concepto no es fijo, debe especificar un Porcentaje.');
      return;
    }

    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData?.id_concepto ? 'Editar' : 'Crear'} Concepto de Pago</h3>

      <Input label="Código:" id="codigo" value={formData.codigo} onChange={handleChange} required />
      <Input label="Nombre:" id="nombre" value={formData.nombre} onChange={handleChange} required />
      <Input label="Descripción:" id="descripcion" value={formData.descripcion} onChange={handleChange} type="textarea" />

      <div className="app-input-container">
        <label htmlFor="tipo" className="app-input-label">Tipo:</label>
        <select
          id="tipo"
          value={formData.tipo}
          onChange={handleChange}
          required
          className="app-input-field"
        >
          <option value="Ingreso">Ingreso</option>
          <option value="Descuento">Descuento</option>
          <option value="Aporte">Aporte</option>
        </select>
      </div>

      <div className="app-input-container">
        <label className="app-input-label">Propiedades:</label>
        <div>
          <input type="checkbox" id="es_fijo" checked={formData.es_fijo} onChange={handleChange} />
          <label htmlFor="es_fijo"> Es Fijo</label>
        </div>
        <div>
          <input type="checkbox" id="afecta_igss" checked={formData.afecta_igss} onChange={handleChange} />
          <label htmlFor="afecta_igss"> Afecta IGSS</label>
        </div>
        <div>
          <input type="checkbox" id="afecta_isr" checked={formData.afecta_isr} onChange={handleChange} />
          <label htmlFor="afecta_isr"> Afecta ISR</label>
        </div>
        <div>
          <input type="checkbox" id="es_viatico" checked={formData.es_viatico} onChange={handleChange} />
          <label htmlFor="es_viatico"> Es Viático</label>
        </div>
        <div>
          <input type="checkbox" id="obligatorio" checked={formData.obligatorio} onChange={handleChange} />
          <label htmlFor="obligatorio"> Es Obligatorio</label>
        </div>
      </div>

      {!formData.es_fijo && (
        <Input
          label="Porcentaje (%):"
          id="porcentaje"
          type="number"
          value={formData.porcentaje}
          onChange={handleChange}
          required={!formData.es_fijo}
          step="0.01"
          min="0"
        />
      )}

      {formData.es_fijo && (
        <Input
          label="Monto Fijo (Q):"
          id="monto_fijo"
          type="number"
          value={formData.monto_fijo}
          onChange={handleChange}
          required={formData.es_fijo}
          step="0.01"
          min="0"
        />
      )}

      <Button 
        type="submit" 
        style={{marginTop: '15px'}}
        disabled={initialData?.id_concepto && !hasChanges}
        title={initialData?.id_concepto && !hasChanges ? "No hay cambios para guardar" : ""}
      >
        {initialData?.id_concepto ? 'Actualizar' : 'Crear'} Concepto
      </Button>

      {initialData?.id_concepto && !hasChanges && (
        <p style={{color: '#666', marginTop: '10px', fontSize: '0.9em'}}>
          Modifica algún campo para habilitar la actualización
        </p>
      )}
    </form>
  );
}

export default ConceptoPagoForm;