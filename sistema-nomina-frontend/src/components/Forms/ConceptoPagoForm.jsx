// src/components/Forms/ConceptoPagoForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx'; // Asegúrate de la extensión .jsx
import Button from '../Common/Button.jsx'; // Asegúrate de la extensión .jsx
// No necesitamos LoadingSpinner ni api/endpoints si este formulario solo maneja datos y no carga relaciones

function ConceptoPagoForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    tipo: 'Ingreso', // Valor por defecto según ENUM
    es_fijo: false, // Valor por defecto boolean
    afecta_igss: false,
    afecta_isr: false,
    es_viatico: false,
    porcentaje: '', // Numérico
    monto_fijo: '', // Numérico
    obligatorio: false,
    // activo y fecha_creacion no son editables
  });

  // Actualiza el estado del formulario si cambia initialData (para el modo edición)
  useEffect(() => {
    if (initialData && initialData.id_concepto) { // Verificar si estamos en modo edición
      setFormData({
        codigo: initialData.codigo || '',
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        tipo: initialData.tipo || 'Ingreso',
        es_fijo: initialData.es_fijo || false, // Manejar booleanos
        afecta_igss: initialData.afecta_igss || false,
        afecta_isr: initialData.afecta_isr || false,
        es_viatico: initialData.es_viatico || false,
        porcentaje: initialData.porcentaje || '', // Puede ser null en DB, manejar string vacío
        monto_fijo: initialData.monto_fijo || '', // Puede ser null en DB
        obligatorio: initialData.obligatorio || false,
      });
    } else {
         // Si no hay initialData, resetear el formulario para creación
         setFormData({
            codigo: '', nombre: '', descripcion: '', tipo: 'Ingreso',
            es_fijo: false, afecta_igss: false, afecta_isr: false, es_viatico: false,
            porcentaje: '', monto_fijo: '', obligatorio: false,
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

   // Manejar inputs de tipo select
   const handleSelectChange = (e) => {
       const { id, value } = e.target;
       setFormData({
           ...formData,
           [id]: value // El valor ya es la cadena del ENUM
       });
   };

    // Manejar inputs numéricos (salario_base, porcentaje, monto_fijo)
    const handleNumberInputChange = (e) => {
        const { id, value } = e.target;
        // Permite cadena vacía para campos opcionales, si no, convierte a número
        setFormData({
            ...formData,
            [id]: value === '' ? '' : parseFloat(value) // Guardar como número o string vacío
        });
    };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos si es necesario (ej: null para campos opcionales no llenados)
    const dataToSend = {
        ...formData,
        // Convertir string vacío a null para campos opcionales numéricos si la API lo requiere
        porcentaje: formData.porcentaje === '' ? null : parseFloat(formData.porcentaje),
        monto_fijo: formData.monto_fijo === '' ? null : parseFloat(formData.monto_fijo),
         // Asegurarse de que los booleanos sean booleanos (useState ya los maneja bien con checkboxes)
    };
     // Validación adicional: si es_fijo es true, monto_fijo debe tener valor, si es_fijo es false, porcentaje debe tener valor
     if (formData.es_fijo && (formData.monto_fijo === '' || formData.monto_fijo === null)) {
         alert('Si el concepto es fijo, debe especificar un Monto Fijo.');
         return;
     }
      if (!formData.es_fijo && (formData.porcentaje === '' || formData.porcentaje === null)) {
         alert('Si el concepto no es fijo (es por porcentaje), debe especificar un Porcentaje.');
         return;
     }
       // Si el concepto es fijo, porcentaje debe ser null. Si no es fijo, monto_fijo debe ser null.
       if (formData.es_fijo) {
           dataToSend.porcentaje = null;
       } else {
           dataToSend.monto_fijo = null;
       }


    onSubmit(dataToSend);
  };


  return (
    <form onSubmit={handleSubmit}>
        <h3>{initialData.id_concepto ? 'Editar' : 'Crear'} Concepto de Pago</h3>

        {/* Campos de texto */}
        <Input label="Código:" id="codigo" value={formData.codigo} onChange={handleInputChange} required />
        <Input label="Nombre:" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
        <Input label="Descripción:" id="descripcion" value={formData.descripcion} onChange={handleInputChange} type="textarea" />

         {/* Selección de Tipo (ENUM) */}
         <div className="app-input-container">
             <label htmlFor="tipo" className="app-input-label">Tipo:</label>
             <select
                 id="tipo"
                 value={formData.tipo}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
             >
                 <option value="Ingreso">Ingreso</option>
                 <option value="Descuento">Descuento</option>
                 <option value="Aporte">Aporte</option>
             </select>
         </div>

        {/* Checkboxes booleanos */}
         <div className="app-input-container">
             <label className="app-input-label">Propiedades:</label>
              <div>
                 <input type="checkbox" id="es_fijo" checked={formData.es_fijo} onChange={handleInputChange} />
                 <label htmlFor="es_fijo"> Es Fijo</label>
              </div>
              <div>
                 <input type="checkbox" id="afecta_igss" checked={formData.afecta_igss} onChange={handleInputChange} />
                 <label htmlFor="afecta_igss"> Afecta IGSS</label>
              </div>
               <div>
                 <input type="checkbox" id="afecta_isr" checked={formData.afecta_isr} onChange={handleInputChange} />
                 <label htmlFor="afecta_isr"> Afecta ISR</label>
              </div>
               <div>
                 <input type="checkbox" id="es_viatico" checked={formData.es_viatico} onChange={handleInputChange} />
                 <label htmlFor="es_viatico"> Es Viático</label>
              </div>
               <div>
                 <input type="checkbox" id="obligatorio" checked={formData.obligatorio} onChange={handleInputChange} />
                 <label htmlFor="obligatorio"> Es Obligatorio</label>
              </div>
         </div>

         {/* Campos condicionales (Porcentaje o Monto Fijo) */}
          {/* Mostrar Porcentaje si NO es fijo */}
         {!formData.es_fijo && (
              <Input
                 label="Porcentaje (%):"
                 id="porcentaje"
                 type="number"
                 value={formData.porcentaje}
                 onChange={handleNumberInputChange}
                 required={!formData.es_fijo} // Requerido si no es fijo
                 step="0.01"
                 min="0"
             />
         )}
          {/* Mostrar Monto Fijo si ES fijo */}
         {formData.es_fijo && (
              <Input
                 label="Monto Fijo (Q):"
                 id="monto_fijo"
                 type="number"
                 value={formData.monto_fijo}
                 onChange={handleNumberInputChange}
                 required={formData.es_fijo} // Requerido si es fijo
                 step="0.01"
                 min="0"
             />
         )}


        <Button type="submit" style={{marginTop: '15px'}}>
            {initialData.id_concepto ? 'Actualizar' : 'Crear'} Concepto
        </Button>
    </form>
  );
}

export default ConceptoPagoForm;