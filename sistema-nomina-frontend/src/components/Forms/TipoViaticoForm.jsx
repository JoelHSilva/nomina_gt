// src/components/Forms/TipoViaticoForm.jsx
import React, { useState, useEffect, useRef } from 'react'; 
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
// No necesita LoadingSpinner ni api/endpoints para este form si no carga relaciones

function TipoViaticoForm({ initialData = null, onSubmit }) { 
  const [formData, setFormData] = useState({
    // --- NUEVOS CAMPOS EN EL ESTADO ---
    codigo: '',
    nombre: '',
    descripcion: '',
    monto_maximo: '', // Usamos string para el input de número
    requiere_factura: false, // Booleano
    afecta_isr: false, // Booleano
    // --- FIN NUEVOS CAMPOS ---
    activo: true, 
  });

  // --- ESTADO Y REF PARA DETECCIÓN DE CAMBIOS ---
  const originalFormDataRef = useRef(null); 
  const [isFormChanged, setIsFormChanged] = useState(false); 
  // --- FIN ESTADO Y REF ---


  // Actualiza el estado del formulario si cambia initialData (para el modo edición)
  useEffect(() => {
    if (initialData?.id_tipo_viatico) { 
        const initialFormState = {
            // --- CARGAR NUEVOS CAMPOS ---
            codigo: initialData.codigo || '',
            nombre: initialData.nombre || '',
            descripcion: initialData.descripcion || '',
            monto_maximo: initialData.monto_maximo != null ? String(initialData.monto_maximo) : '', // Convertir a string
            requiere_factura: initialData.requiere_factura === undefined ? false : initialData.requiere_factura, // Cargar booleano
            afecta_isr: initialData.afecta_isr === undefined ? false : initialData.afecta_isr, // Cargar booleano
            // --- FIN CARGAR NUEVOS CAMPOS ---
            activo: initialData.activo === undefined ? true : initialData.activo, 
        };
        setFormData(initialFormState);

        // Almacenar una copia EXACTA de los datos iniciales del formulario en la ref
        originalFormDataRef.current = initialFormState; 
        setIsFormChanged(false); 
    } else {
         // Si no hay initialData, resetear el formulario para creación (incluye nuevos campos)
         setFormData({
            // --- DEFAULT PARA CREACIÓN ---
            codigo: '', nombre: '', descripcion: '', monto_maximo: '', 
            requiere_factura: false, afecta_isr: false, activo: true, 
            // --- FIN DEFAULT PARA CREACIÓN ---
         });
        originalFormDataRef.current = null; 
        setIsFormChanged(true); 
     }
  }, [initialData]); 


  // --- EFECTO PARA DETECTAR CAMBIOS EN EL FORMULARIO ---
  useEffect(() => {
    if (originalFormDataRef.current) {
        // Comparar el objeto formData actual con el objeto original almacenado en la ref
        const areEqual = Object.keys(formData).every(key => {
            // Comparación simple campo por campo para todos los campos en formData
            return formData[key] === originalFormDataRef.current[key];
        });

        // El formulario ha cambiado si no son iguales
        setIsFormChanged(!areEqual);
    }
  }, [formData]); // Este efecto se ejecuta cada vez que formData cambia


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
     let newValue = value;
     // Manejo especial para inputs de tipo number para parsear a float si no están vacíos
     if (type === 'number' && value !== '') {
         newValue = parseFloat(value);
         if (isNaN(newValue)) newValue = value; // Si no es un número válido, mantén el string
     }

    setFormData({
      ...formData,
      // Checkbox usa 'checked', otros usan el valor (parseado si es number)
      [id]: type === 'checkbox' ? checked : newValue, 
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos para enviar al backend
    const dataToSend = {
        ...formData,
        // --- TRANSFORMAR NUEVOS CAMPOS PARA BACKEND ---
        // Asegurar que monto_maximo es número o null
        monto_maximo: formData.monto_maximo === '' ? null : parseFloat(formData.monto_maximo), 
        // Los booleanos ya están en el formato correcto
        // El código y la descripción ya son strings/null
        // --- FIN TRANSFORMAR NUEVOS CAMPOS ---
    };

     // Validaciones adicionales 
      if (!formData.nombre) { // Validar campo nombre (asumido como requerido)
          alert('El nombre del tipo de viático es requerido.');
          return;
      }
       if (!formData.codigo) { // Validar campo codigo (asumido como requerido)
          alert('El código del tipo de viático es requerido.');
          return;
      }
      // Puedes añadir validación para monto_maximo si debe ser >= 0
      if (dataToSend.monto_maximo !== null && dataToSend.monto_maximo < 0) {
          alert('El monto máximo no puede ser negativo.');
          return;
      }


    onSubmit(dataToSend);
  };


  return (
    <form onSubmit={handleSubmit}>
        <h3>{initialData?.id_tipo_viatico ? 'Editar' : 'Crear'} Tipo de Viático</h3> 

        {/* Campos de texto/número/textarea (incluye nuevos campos) */}
        {/* Asumiendo que id="codigo" es un input de texto */}
        <Input label="Código:" id="codigo" value={formData.codigo} onChange={handleInputChange} required /> 
        <Input label="Nombre:" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
        <Input label="Descripción:" id="descripcion" value={formData.descripcion} onChange={handleInputChange} type="textarea" />
        {/* Asumiendo que id="monto_maximo" es un input de número */}
        <Input label="Monto Máximo:" id="monto_maximo" value={formData.monto_maximo} onChange={handleInputChange} type="number" step="0.01" min="0" /> 

        {/* Checkboxes (incluye nuevos campos) */}
         <div className="app-input-container">
              <div>
                {/* Asumiendo id="requiere_factura" es un checkbox */}
                 <input type="checkbox" id="requiere_factura" checked={formData.requiere_factura} onChange={handleInputChange} />
                 <label htmlFor="requiere_factura"> Requiere Factura</label>
              </div>
         </div>
           <div className="app-input-container">
              <div>
                {/* Asumiendo id="afecta_isr" es un checkbox */}
                 <input type="checkbox" id="afecta_isr" checked={formData.afecta_isr} onChange={handleInputChange} />
                 <label htmlFor="afecta_isr"> Afecta ISR</label>
              </div>
         </div>
         <div className="app-input-container">
              <div>
                {/* Checkbox Activo (ya existía) */}
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Activo</label>
              </div>
         </div>


        {/* Botón de Submit - Deshabilitado si estamos editando Y no hay cambios */}
        <Button 
            type="submit" 
            className="app-button-primary" 
            style={{marginTop: '15px'}}
            disabled={initialData?.id_tipo_viatico && !isFormChanged} 
        >
            {initialData?.id_tipo_viatico ? 'Actualizar' : 'Crear'} Tipo 
        </Button>
    </form>
  );
}

export default TipoViaticoForm;