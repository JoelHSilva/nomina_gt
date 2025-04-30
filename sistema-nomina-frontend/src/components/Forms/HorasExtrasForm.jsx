// src/components/Forms/HorasExtrasForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';

function HorasExtrasForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    id_empleado: '',
    fecha: '',
    horas: '', // <-- Usar 'horas'
    multiplicador: '1.5', // Valor por defecto (si tu backend lo maneja)
    motivo: '', // <-- Campo motivo
    estado: 'Solicitada', // <-- Usar 'estado' (default Solicitada?)
    activo: true, // <-- Añadir campo activo, default TRUE
    // aprobado_por, id_detalle_nomina, fecha_creacion no editables aquí
  });

  const [empleados, setEmpleados] = useState([]);
  const [loadingRelaciones, setLoadingRelaciones] = useState(true);
  const [errorRelaciones, setErrorRelaciones] = useState(null);


  // Cargar la lista de Empleados al montar el componente
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoadingRelaciones(true);
        const data = await api.getAll('EMPLEADOS'); // Usar la clave string
        setEmpleados(data);
      } catch (err) {
        setErrorRelaciones('Error al cargar la lista de empleados.');
        console.error('Error fetching empleados:', err);
      } finally {
        setLoadingRelaciones(false);
      }
    };
    fetchEmpleados();
  }, []);

  // Actualiza el estado del formulario si cambia initialData (para el modo edición)
  useEffect(() => {
    // Usar initialData.id_hora_extra para verificar modo edición
    if (initialData && initialData.id_hora_extra) {
      setFormData({
        id_empleado: initialData.id_empleado || '',
        fecha: initialData.fecha ? new Date(initialData.fecha).toISOString().split('T')[0] : '',
        horas: initialData.horas || '', // <-- Usar 'horas'
        multiplicador: initialData.multiplicador || '1.5', // Cargar si existe
        motivo: initialData.motivo || '', // <-- Usar 'motivo'
        estado: initialData.estado || 'Solicitada', // <-- Usar 'estado'
        activo: initialData.activo === undefined ? true : initialData.activo, // <-- Cargar activo, default true si undefined
         // id_detalle_nomina NO se carga aquí, es gestionado por backend
      });
    } else {
         // Si no hay initialData, resetear el formulario para creación
         setFormData({
            id_empleado: '',
            fecha: '',
            horas: '',
            multiplicador: '1.5',
            motivo: '',
            estado: 'Solicitada',
            activo: true, // Default true para creación
         });
     }
  }, [initialData]);


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
     // Para campos numéricos, permitir cadena vacía, para otros usar valor directo
     let newValue = value;
     if (type === 'number' && value !== '') {
         newValue = parseFloat(value);
         // Opcional: si parseFloat da NaN, quizás mantener el string original o ''
         if (isNaN(newValue)) newValue = value; // Mantener el input del usuario si no es un número válido aún
     }


    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : newValue, // Checkbox usa 'checked', otros usan newValue
    });
  };

   // Manejar inputs de tipo select
   const handleSelectChange = (e) => {
       const { id, value } = e.target;
       setFormData({
           ...formData,
           [id]: value // El valor será el ID numérico o la cadena
       });
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos si es necesario
    const dataToSend = {
        ...formData,
        // Asegurar que id_empleado es número
        id_empleado: parseInt(formData.id_empleado, 10),
        // Asegurar que campos numéricos son números (convertir strings vacíos a null si backend lo prefiere, o a 0)
        horas: formData.horas === '' ? null : parseFloat(formData.horas), // <-- Usar 'horas'
        multiplicador: formData.multiplicador === '' ? null : parseFloat(formData.multiplicador), // Incluir si es editable
         // Fecha ya debería estar en formato-MM-DD por input type="date"
         // motivo puede ser null si es opcional
        motivo: formData.motivo || null, // <-- Usar 'motivo'
         // estado ya es string del select
         // activo ya es booleano
    };

     // Validaciones adicionales (ej: horas > 0, multiplicador > 0 si no son null)
     if (dataToSend.horas !== null && dataToSend.horas <= 0) {
         alert('La cantidad de horas debe ser mayor a 0 si se especifica.');
         return;
     }
      if (dataToSend.multiplicador !== null && dataToSend.multiplicador <= 0) {
         alert('El multiplicador debe ser mayor a 0 si se especifica.');
         return;
     }

    onSubmit(dataToSend);
  };

  if (loadingRelaciones) {
      return <LoadingSpinner />;
  }

   if (errorRelaciones) {
      return <div style={{ color: 'red' }}>{errorRelaciones}</div>;
   }

    // Determinar si el formulario debe estar deshabilitado (ej: si ya fue procesado en nómina)
    const isProcessed = !!initialData.id_detalle_nomina;


  return (
    <form onSubmit={handleSubmit}>
        {/* Usar id_hora_extra para verificar modo edición */}
        <h3>{initialData.id_hora_extra ? 'Editar' : 'Registrar'} Horas Extra</h3>

        {/* Selección de Empleado - Deshabilitado si ya está procesado en nómina */}
         <div className="app-input-container">
             <label htmlFor="id_empleado" className="app-input-label">Empleado:</label>
             <select
                 id="id_empleado"
                 value={formData.id_empleado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 disabled={isProcessed} // Deshabilitar si ya está procesado
             >
                  <option value="">-- Seleccione un Empleado --</option>
                 {empleados.map(empleado => (
                     <option key={empleado.id_empleado} value={empleado.id_empleado}>
                         {empleado.nombre} {empleado.apellido} ({empleado.codigo_empleado})
                     </option>
                 ))}
             </select>
         </div>

        {/* Campo Fecha - Deshabilitado si ya está procesado */}
        <Input label="Fecha:" id="fecha" type="date" value={formData.fecha} onChange={handleInputChange} required disabled={isProcessed} />

        {/* Campos numéricos */}
        <Input label="Cantidad de Horas:" id="horas" type="number" value={formData.horas} onChange={handleInputChange} required step="0.5" min="0" disabled={isProcessed} /> {/* <-- Usar 'horas' como ID y clave */}
        <Input label="Multiplicador:" id="multiplicador" type="number" value={formData.multiplicador} onChange={handleInputChange} required step="0.1" min="0" disabled={isProcessed} />

        {/* Campo Motivo */}
         <Input label="Motivo:" id="motivo" value={formData.motivo} onChange={handleInputChange} type="textarea" disabled={isProcessed} /> {/* <-- Añadir campo motivo */}


        {/* Selección de Estado */}
         <div className="app-input-container">
             <label htmlFor="estado" className="app-input-label">Estado:</label>
             <select
                 id="estado" // <-- Usar 'estado' como ID y clave
                 value={formData.estado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 // Deshabilitar si ya está procesado o si solo RRHH/Admin cambia el estado
                 disabled={isProcessed} // Deshabilitar si ya está procesado
             >
                 {/* Ajusta las opciones según los estados reales de tu ENUM en DB */}
                 <option value="Solicitada">Solicitada</option>
                 <option value="Aprobada">Aprobada</option>
                 <option value="Rechazada">Rechazada</option>
                 <option value="Pagada">Pagada</option> {/* <-- Incluir "Pagada" si existe en tu ENUM */}
             </select>
         </div>

        {/* Checkbox Activo */}
         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} disabled={isProcessed} /> {/* <-- Añadir checkbox activo */}
                 <label htmlFor="activo"> Activo</label>
              </div>
         </div>


         {/* Mostrar ID Detalle Nomina si existe (solo lectura) */}
         {initialData.id_detalle_nomina && (
              <div className="app-input-container">
                  <label className="app-input-label">Procesado en Nómina Detalle ID:</label>
                  <p>{initialData.id_detalle_nomina}</p>
              </div>
         )}


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}} disabled={isProcessed}> {/* Deshabilitar botón si está procesado */}
            {initialData.id_hora_extra ? 'Actualizar' : 'Registrar'} Horas Extra {/* <-- Usar id_hora_extra */}
        </Button>
         {isProcessed && (
             <p style={{ color: 'red', marginTop: '10px' }}>* Este registro ya fue procesado en nómina y no puede ser modificado/eliminado.</p>
         )}
    </form>
  );
}

export default HorasExtrasForm;