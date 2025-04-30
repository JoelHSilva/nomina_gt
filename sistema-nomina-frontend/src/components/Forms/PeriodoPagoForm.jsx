// src/components/Forms/PeriodoPagoForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';


// Manejo explícito de initialData usando el nombre correcto del ID: id_periodo
function PeriodoPagoForm({ initialData = { id_periodo: undefined }, onSubmit }) {
  // Si initialData es null o undefined, usará { id_periodo: undefined }
  const safeInitialData = initialData || { id_periodo: undefined };

  // Estado local para los datos del formulario de Período de Pago
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    fecha_pago: '',
    activo: true, // Por defecto activo en creación
    tipo: 'Quincenal', // Default basado en tu comentario
    estado: 'Abierto', // Default basado en tu ENUM y comentario
  });

  const [loadingRelaciones, setLoadingRelaciones] = useState(false);
  const [errorRelaciones, setErrorRelaciones] = useState(null);


  // Efecto para inicializar el estado del formulario (formData)
  useEffect(() => {
    console.log("PeriodoPagoForm useEffect initialData:", initialData); // Log para depuración

    // Comprueba si initialData tiene un id_periodo válido (modo edición)
    if (safeInitialData && safeInitialData.id_periodo !== undefined && safeInitialData.id_periodo !== null) {
      console.log("PeriodoPagoForm: Inicializando en modo Edición con datos:", safeInitialData);
      // Si estamos editando, llenamos el formulario con los datos existentes
      setFormData({
        nombre: safeInitialData.nombre || '',
        fecha_inicio: safeInitialData.fecha_inicio ? new Date(safeInitialData.fecha_inicio).toISOString().split('T')[0] : '',
        fecha_fin: safeInitialData.fecha_fin ? new Date(safeInitialData.fecha_fin).toISOString().split('T')[0] : '',
        fecha_pago: safeInitialData.fecha_pago ? new Date(safeInitialData.fecha_pago).toISOString().split('T')[0] : '',
        activo: safeInitialData.activo === undefined ? true : safeInitialData.activo,
        tipo: safeInitialData.tipo || '', // Cargar tipo existente
        estado: safeInitialData.estado || '', // Cargar estado existente
      });
    } else {
      console.log("PeriodoPagoForm: Inicializando en modo Creación.");
      // Si estamos creando, reseteamos el formulario a valores por defecto/vacíos
      setFormData({
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        fecha_pago: '',
        activo: true,
        tipo: 'Quincenal', // Default para nuevos períodos
        estado: 'Abierto', // Default para nuevos períodos (primer valor común del ENUM)
      });
    }
  }, [initialData]);


  // Maneja cambios en inputs (texto, número, textarea, checkbox, date)
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
     let newValue = value;

     if (type === 'number' && value !== '') {
         newValue = parseFloat(value);
         if (isNaN(newValue)) newValue = value;
     }

    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: type === 'checkbox' ? checked : newValue,
    }));
  };

   // Maneja cambios en selectores (Dropdowns) - AHORA USADO PARA ESTADO Y TIPO
    const handleSelectChange = (e) => {
        const { id, value } = e.target;
        // No se necesita parseInt para valores de string como los ENUMs
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value // El valor ya es el string del ENUM
        }));
    };


  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("PeriodoPagoForm: handleSubmit llamado. Datos del formulario:", formData);

    const dataToSend = {
        ...formData,
        fecha_inicio: formData.fecha_inicio || null,
        fecha_fin: formData.fecha_fin || null,
        fecha_pago: formData.fecha_pago || null,
        activo: formData.activo, // Ya es booleano
        // tipo y estado ya están en formData con el valor correcto del select
    };

     // --- Validaciones Básicas ---
     if (!dataToSend.nombre) {
         console.warn('Validación: El nombre del período de pago es requerido.');
         return;
     }
     if (!dataToSend.fecha_inicio) {
         console.warn('Validación: La fecha de inicio es requerida.');
         return;
     }
     if (!dataToSend.fecha_fin) {
         console.warn('Validación: La fecha de fin es requerida.');
         return;
     }
      if (!dataToSend.fecha_pago) {
         console.warn('Validación: La fecha de pago es requerida.');
         return;
     }

      // Validar consistencia de fechas
     const inicio = dataToSend.fecha_inicio ? new Date(dataToSend.fecha_inicio) : null;
     const fin = dataToSend.fecha_fin ? new Date(dataToSend.fecha_fin) : null;
      const pago = dataToSend.fecha_pago ? new Date(dataToSend.fecha_pago) : null;


      if (inicio && fin && inicio.getTime() > fin.getTime()) {
          console.warn('Validación: La fecha de inicio ('+dataToSend.fecha_inicio+') no puede ser posterior a la fecha de fin ('+dataToSend.fecha_fin+').');
          return;
      }
      if (pago && fin && pago.getTime() < fin.getTime()) {
           console.warn('Validación: La fecha de pago ('+dataToSend.fecha_pago+') no puede ser anterior a la fecha de fin ('+dataToSend.fecha_fin+').');
           return;
      }

     // Validar que tipo y estado no estén vacíos si son requeridos en BD
     // (El selector ya fuerza selección si el primer option no tiene value="")
     if (!dataToSend.tipo) { console.warn('Validación: Tipo es requerido.'); return; }
     if (!dataToSend.estado) { console.warn('Validación: Estado es requerido.'); return; }


     // --- Fin Validaciones ---


    console.log("PeriodoPagoForm: Llamando a onSubmit con datos para API:", dataToSend);
    onSubmit(dataToSend);
  };


  if (loadingRelaciones) {
      return <LoadingSpinner />;
  }
   if (errorRelaciones) {
       return <div style={{ color: 'red' }}>{errorRelaciones}</div>;
   }


  return (
    <form onSubmit={handleSubmit}>
        {/* Título dinámico según modo creación/edición */}
        <h3>{safeInitialData && safeInitialData.id_periodo ? 'Editar' : 'Crear'} Período de Pago</h3>

        <Input label="Nombre del Período:" id="nombre" value={formData.nombre} onChange={handleInputChange} required />

        <Input label="Fecha de Inicio:" id="fecha_inicio" type="date" value={formData.fecha_inicio} onChange={handleInputChange} required />
        <Input label="Fecha de Fin:" id="fecha_fin" type="date" value={formData.fecha_fin} onChange={handleInputChange} required />
        <Input label="Fecha de Pago:" id="fecha_pago" type="date" value={formData.fecha_pago} onChange={handleInputChange} required />

         {/* Selector para Tipo (si es un conjunto fijo de valores) */}
         {/* Si 'Tipo' solo puede ser "Quincenal", podrías usar un input simple deshabilitado con ese valor por defecto */}
         <div className="app-input-container">
             <label htmlFor="tipo" className="app-input-label">Tipo:</label>
              {/* Asumiendo que Tipo es un ENUM o lista fija. Si solo es "Quincenal", considera un input deshabilitado. */}
             <select id="tipo" value={formData.tipo} onChange={handleSelectChange} required className="app-input-field">
                 <option value="">-- Seleccione Tipo --</option> {/* Añadir opción vacía si la BD permite null/vacío */}
                 <option value="Quincenal">Quincenal</option>
                 {/* Añadir otras opciones de tipo si existen (Mensual, Semanal, etc.) */}
             </select>
         </div>

         {/* Selector para Estado (ENUM) */}
         <div className="app-input-container">
             <label htmlFor="estado" className="app-input-label">Estado:</label>
             {/* Usar handleSelectChange para selectores */}
             <select id="estado" value={formData.estado} onChange={handleSelectChange} required className="app-input-field">
                  <option value="">-- Seleccione Estado --</option> {/* Añadir opción vacía si la BD permite null/vacío */}
                 <option value="Abierto">Abierto</option>
                 <option value="Procesando">Procesando</option>
                 <option value="Cerrado">Cerrado</option>
             </select>
         </div>


         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Activo</label>
              </div>
         </div>


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {safeInitialData && safeInitialData.id_periodo ? 'Actualizar' : 'Crear'} Período de Pago
        </Button>
    </form>
  );
}

export default PeriodoPagoForm;