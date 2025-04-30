// src/components/Forms/PrestamoForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';

function PrestamoForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    id_empleado: '',
    monto_total: '',
    saldo_pendiente: '', // Podría ser calculado o editable inicialmente
    cuota_mensual: '',
    cantidad_cuotas: '',
    cuotas_pagadas: '', // Probablemente gestionado por backend
    fecha_inicio: '',
    fecha_fin_estimada: '', // Probablemente calculado o editable
    motivo: '',
    estado: 'Aprobado', // Valor por defecto para ENUM
    // activo y fecha_creacion no editables
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
    if (initialData && initialData.id_prestamo) { // Verificar si estamos en modo edición
      setFormData({
        id_empleado: initialData.id_empleado || '',
        monto_total: initialData.monto_total || '',
        saldo_pendiente: initialData.saldo_pendiente || '', // Cargar saldo existente
        cuota_mensual: initialData.cuota_mensual || '',
        cantidad_cuotas: initialData.cantidad_cuotas || '',
         cuotas_pagadas: initialData.cuotas_pagadas || 0, // Cargar cuotas pagadas
        fecha_inicio: initialData.fecha_inicio ? new Date(initialData.fecha_inicio).toISOString().split('T')[0] : '',
        fecha_fin_estimada: initialData.fecha_fin_estimada ? new Date(initialData.fecha_fin_estimada).toISOString().split('T')[0] : '',
        motivo: initialData.motivo || '',
        estado: initialData.estado || 'Aprobado',
      });
    } else {
         // Si no hay initialData, resetear el formulario para creación
         setFormData({
            id_empleado: '', monto_total: '', saldo_pendiente: '', cuota_mensual: '',
            cantidad_cuotas: '', cuotas_pagadas: 0, fecha_inicio: '', fecha_fin_estimada: '',
            motivo: '', estado: 'Aprobado',
         });
     }
  }, [initialData]); // Depende de initialData


  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
     // Para campos numéricos, permitir cadena vacía, para otros usar valor directo
     const newValue = (type === 'number' || id === 'cantidad_cuotas' || id === 'cuotas_pagadas') && value !== '' ? parseFloat(value) : value;

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
           [id]: value
       });
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos si es necesario (ej: asegurar que los numéricos son numbers, fechas son strings YYYY-MM-DD)
    const dataToSend = {
        ...formData,
        // Asegurar que id_empleado es número
        id_empleado: parseInt(formData.id_empleado, 10),
        // Asegurar que numéricos son números (ya manejado parcialmente en handleInputChange)
        monto_total: parseFloat(formData.monto_total),
        saldo_pendiente: parseFloat(formData.saldo_pendiente),
        cuota_mensual: parseFloat(formData.cuota_mensual),
        cantidad_cuotas: parseInt(formData.cantidad_cuotas, 10),
        cuotas_pagadas: parseInt(formData.cuotas_pagadas, 10),
         // Fechas ya deberían estar en formato YYYY-MM-DD por input type="date"
         // Si fecha_fin_estimada es opcional y está vacía, enviar null
        fecha_fin_estimada: formData.fecha_fin_estimada || null,
         // motivo puede ser null si es opcional
        motivo: formData.motivo || null,
    };

     // Validaciones adicionales (ej: monto > 0, cuota > 0, cantidad > 0, fecha_inicio válida)
     if (dataToSend.monto_total <= 0 || dataToSend.cuota_mensual <= 0 || dataToSend.cantidad_cuotas <= 0) {
         alert('Monto total, Cuota mensual y Cantidad de cuotas deben ser mayores a 0.');
         return;
     }
      // Si se edita, saldo_pendiente y cuotas_pagadas deberían ser consistentes,
      // pero quizás el backend maneje esto.

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
        <h3>{initialData.id_prestamo ? 'Editar' : 'Crear'} Préstamo</h3>

        {/* Selección de Empleado (Relación) - Deshabilitado en edición si el backend no permite cambiar el empleado */}
         <div className="app-input-container">
             <label htmlFor="id_empleado" className="app-input-label">Empleado:</label>
             <select
                 id="id_empleado"
                 value={formData.id_empleado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 disabled={!!initialData.id_prestamo} // Deshabilitar si estamos editando
             >
                  <option value="">-- Seleccione un Empleado --</option>
                 {empleados.map(empleado => (
                     <option key={empleado.id_empleado} value={empleado.id_empleado}>
                         {empleado.nombre} {empleado.apellido} ({empleado.codigo_empleado})
                     </option>
                 ))}
             </select>
         </div>

        {/* Campos numéricos del préstamo */}
        <Input label="Monto Total (Q):" id="monto_total" type="number" value={formData.monto_total} onChange={handleInputChange} required step="0.01" min="0.01" />
        <Input label="Cuota Mensual (Q):" id="cuota_mensual" type="number" value={formData.cuota_mensual} onChange={handleInputChange} required step="0.01" min="0.01" />
        <Input label="Cantidad de Cuotas:" id="cantidad_cuotas" type="number" value={formData.cantidad_cuotas} onChange={handleInputChange} required step="1" min="1" />

        {/* Campo Saldo Pendiente (Mostrar en edición, puede ser editable o solo informativo) */}
        {initialData.id_prestamo && (
             <Input label="Saldo Pendiente (Q):" id="saldo_pendiente" type="number" value={formData.saldo_pendiente} onChange={handleInputChange} required step="0.01" min="0" />
        )}

         {/* Campo Cuotas Pagadas (Mostrar en edición, probablemente solo informativo) */}
         {initialData.id_prestamo && (
             <Input label="Cuotas Pagadas:" id="cuotas_pagadas" type="number" value={formData.cuotas_pagadas} onChange={handleInputChange} required step="1" min="0" disabled /> //{/* Deshabilitado si solo es informativo */}
         )}


        {/* Campos de fecha */}
        <Input label="Fecha de Inicio:" id="fecha_inicio" type="date" value={formData.fecha_inicio} onChange={handleInputChange} required />
         {/* Fecha Fin Estimada puede ser calculada por el backend */}
        {/* <Input label="Fecha Fin Estimada:" id="fecha_fin_estimada" type="date" value={formData.fecha_fin_estimada} onChange={handleInputChange} /> */}


        {/* Campo Motivo */}
        <Input label="Motivo:" id="motivo" value={formData.motivo} onChange={handleInputChange} type="textarea" />

        {/* Selección de Estado */}
         <div className="app-input-container">
             <label htmlFor="estado" className="app-input-label">Estado:</label>
             <select
                 id="estado"
                 value={formData.estado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 // Deshabilitar ciertos estados si la lógica de negocio no permite cambiarlos manualmente
                 disabled={initialData.estado === 'Pagado' || initialData.estado === 'Cancelado'}
             >
                 <option value="Aprobado">Aprobado</option>
                 <option value="En Curso">En Curso</option>
                 <option value="Pagado">Pagado</option>
                 <option value="Cancelado">Cancelado</option>
             </select>
         </div>

        {/* Considera validaciones más robustas (ej: cuota * cantidad >= monto) */}

        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {initialData.id_prestamo ? 'Actualizar' : 'Crear'} Préstamo
        </Button>
    </form>
  );
}

export default PrestamoForm;