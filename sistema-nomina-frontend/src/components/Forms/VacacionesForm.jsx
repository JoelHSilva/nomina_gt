// src/components/Forms/VacacionesForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';

function VacacionesForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    id_empleado: '',
    fecha_solicitud: new Date().toISOString().split('T')[0], // Default a fecha actual para creación
    fecha_inicio: '',
    fecha_fin: '',
    dias_tomados: '',
    estado: 'Solicitada', // Valor por defecto para ENUM
    observaciones: '',
    // aprobado_por, activo, fecha_creacion no editables
  });

  const [empleados, setEmpleados] = useState([]);
  const [loadingRelaciones, setLoadingRelaciones] = useState(true);
  const [errorRelaciones, setErrorRelaciones] = useState(null);


  // Cargar la lista de Empleados al montar el componente
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoadingRelaciones(true);
        // Puedes filtrar solo empleados activos si es necesario
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
  }, []); // Solo se ejecuta al montar

  // Actualiza el estado del formulario si cambia initialData (para el modo edición)
  useEffect(() => {
    if (initialData && initialData.id_vacaciones) { // Verificar si estamos en modo edición
      setFormData({
        id_empleado: initialData.id_empleado || '',
        fecha_solicitud: initialData.fecha_solicitud ? new Date(initialData.fecha_solicitud).toISOString().split('T')[0] : '',
        fecha_inicio: initialData.fecha_inicio ? new Date(initialData.fecha_inicio).toISOString().split('T')[0] : '',
        fecha_fin: initialData.fecha_fin ? new Date(initialData.fecha_fin).toISOString().split('T')[0] : '',
        dias_tomados: initialData.dias_tomados || '',
        estado: initialData.estado || 'Solicitada',
        observaciones: initialData.observaciones || '',
      });
    } else {
         // Si no hay initialData, resetear el formulario para creación
         setFormData({
            id_empleado: '',
            fecha_solicitud: new Date().toISOString().split('T')[0], // Default a fecha actual
            fecha_inicio: '',
            fecha_fin: '',
            dias_tomados: '',
            estado: 'Solicitada',
            observaciones: '',
         });
     }
  }, [initialData]); // Depende de initialData


  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
     // Para campo numérico (dias_tomados), permitir cadena vacía, para otros usar valor directo
     const newValue = (type === 'number') && value !== '' ? parseFloat(value) : value;

    setFormData({
      ...formData,
      [id]: newValue,
    });
  };

   // Manejar inputs de tipo select
   const handleSelectChange = (e) => {
       const { id, value } = e.target;
       setFormData({
           ...formData,
           [id]: value // El valor será el ID numérico o la cadena del ENUM
       });
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos si es necesario (ej: asegurar que dias_tomados es número, fechas son strings-MM-DD)
    const dataToSend = {
        ...formData,
        // Asegurar que id_empleado es número
        id_empleado: parseInt(formData.id_empleado, 10),
        // Asegurar que dias_tomados es número
        dias_tomados: parseFloat(formData.dias_tomados),
         // Fechas ya deberían estar en formato-MM-DD por input type="date"
         // observaciones puede ser null si es opcional
        observaciones: formData.observaciones || null,
         // fecha_solicitud en creación se toma del default, en edición se carga
    };

     // Validaciones adicionales (ej: fecha_inicio <= fecha_fin, dias_tomados > 0)
     if (dataToSend.dias_tomados <= 0) {
         alert('La cantidad de días tomados debe ser mayor a 0.');
         return;
     }
      // Validación de fechas si no está vacía
      if (dataToSend.fecha_inicio && dataToSend.fecha_fin && new Date(dataToSend.fecha_inicio) > new Date(dataToSend.fecha_fin)) {
          alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
          return;
      }
       // Idealmente, calcular dias_tomados automáticamente si no se ingresa o validar consistencia

    onSubmit(dataToSend);
  };

  if (loadingRelaciones) {
      return <LoadingSpinner />; // Mostrar spinner mientras se cargan empleados
  }

   if (errorRelaciones) {
      return <div style={{ color: 'red' }}>{errorRelaciones}</div>;
   }


  return (
    <form onSubmit={handleSubmit}>
        <h3>{initialData.id_vacaciones ? 'Editar' : 'Crear'} Solicitud de Vacaciones</h3>

        {/* Selección de Empleado (Relación) - Deshabilitado en edición si el backend no permite cambiar el empleado */}
         <div className="app-input-container">
             <label htmlFor="id_empleado" className="app-input-label">Empleado:</label>
             <select
                 id="id_empleado"
                 value={formData.id_empleado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 disabled={!!initialData.id_vacaciones} // Deshabilitar si estamos editando
             >
                  <option value="">-- Seleccione un Empleado --</option>
                 {empleados.map(empleado => (
                     <option key={empleado.id_empleado} value={empleado.id_empleado}>
                         {empleado.nombre} {empleado.apellido} ({empleado.codigo_empleado})
                     </option>
                 ))}
             </select>
         </div>

        {/* Campo Fecha Solicitud (normalmente solo lectura en edición) */}
         <Input label="Fecha Solicitud:" id="fecha_solicitud" type="date" value={formData.fecha_solicitud} onChange={handleInputChange} required disabled={!!initialData.id_vacaciones} />


        {/* Campos de fecha de vacaciones */}
        <Input label="Fecha de Inicio:" id="fecha_inicio" type="date" value={formData.fecha_inicio} onChange={handleInputChange} required />
        <Input label="Fecha de Fin:" id="fecha_fin" type="date" value={formData.fecha_fin} onChange={handleInputChange} required />

         {/* Campo Días Tomados (puede ser manual o calculado por JS/Backend) */}
        <Input label="Días Tomados:" id="dias_tomados" type="number" value={formData.dias_tomados} onChange={handleInputChange} required step="0.5" min="0.5" />


        {/* Selección de Estado */}
         <div className="app-input-container">
             <label htmlFor="estado" className="app-input-label">Estado:</label>
             <select
                 id="estado"
                 value={formData.estado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 // Deshabilitar ciertos estados si la lógica de negocio no permite cambiarlos manualmente desde aquí
                 disabled={initialData.estado === 'Completada' || initialData.estado === 'Rechazada' || initialData.estado === 'Cancelada'}
             >
                 <option value="Solicitada">Solicitada</option>
                 <option value="Aprobada">Aprobada</option>
                 <option value="Rechazada">Rechazada</option>
                 <option value="Cancelada">Cancelada</option>
                 <option value="Completada">Completada</option> {/* Puede que este estado solo lo ponga el sistema */}
             </select>
         </div>

        {/* Campo Observaciones */}
        <Input label="Observaciones:" id="observaciones" value={formData.observaciones} onChange={handleInputChange} type="textarea" />


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {initialData.id_vacaciones ? 'Actualizar' : 'Crear'} Solicitud
        </Button>
    </form>
  );
}

export default VacacionesForm;