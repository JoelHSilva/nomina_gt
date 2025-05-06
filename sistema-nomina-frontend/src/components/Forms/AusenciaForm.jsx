// src/components/Forms/AusenciaForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
// Si no usas ENDPOINTS directamente aquí, puedes quitar esta importación
// import { ENDPOINTS } from '../../api/endpoints.jsx'; 

function AusenciaForm({ initialData = null, onSubmit }) { // Explicitamente default a null si no se pasa
  const [formData, setFormData] = useState({
    id_empleado: '',
    fecha_inicio: '',
    fecha_fin: '',
    tipo: 'Permiso con goce', // Valor por defecto según ENUM
    motivo: '',
    documento_respaldo: '', // Para el nombre del archivo, la subida real es más compleja
    estado: 'Solicitada', // Valor por defecto según ENUM
    afecta_salario: false, // Valor por defecto boolean
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
    // --- MODIFICACIÓN CLAVE AQUÍ ---
    // Usar encadenamiento opcional para comprobar si initialData existe Y tiene id_ausencia
    if (initialData?.id_ausencia) { // <-- Línea 127 modificada
    // --- FIN MODIFICACIÓN CLAVE ---
      setFormData({
        id_empleado: initialData.id_empleado || '',
        fecha_inicio: initialData.fecha_inicio ? new Date(initialData.fecha_inicio).toISOString().split('T')[0] : '',
        fecha_fin: initialData.fecha_fin ? new Date(initialData.fecha_fin).toISOString().split('T')[0] : '',
        tipo: initialData.tipo || 'Permiso con goce',
        motivo: initialData.motivo || '',
        documento_respaldo: initialData.documento_respaldo || '',
        estado: initialData.estado || 'Solicitada',
        afecta_salario: initialData.afecta_salario || false, // Manejar booleanos
      });
    } else {
         // Si no hay initialData, resetear el formulario para creación
         setFormData({
            id_empleado: '',
            fecha_inicio: '',
            fecha_fin: '',
            tipo: 'Permiso con goce',
            motivo: '',
            documento_respaldo: '',
            estado: 'Solicitada',
            afecta_salario: false,
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
           [id]: value // El valor será el ID numérico o la cadena del ENUM
       });
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos si es necesario (ej: asegurar que id_empleado es número, fechas son strings-MM-DD)
    const dataToSend = {
        ...formData,
        // Asegurar que id_empleado es número (si no está vacío)
        id_empleado: formData.id_empleado ? parseInt(formData.id_empleado, 10) : null, // Usar null si está vacío
         // Fechas ya deberían estar en formato-MM-DD por input type="date"
         // motivo y documento_respaldo pueden ser null si son opcionales
        motivo: formData.motivo || null,
        documento_respaldo: formData.documento_respaldo || null,
         // afecta_salario ya es booleano por el checkbox
    };

     // Validaciones adicionales (ej: fecha_inicio <= fecha_fin)
      if (!dataToSend.id_empleado) {
          alert('Debe seleccionar un empleado.');
          return;
      }
      if (!formData.fecha_inicio || !formData.fecha_fin) {
          alert('Debe seleccionar fechas de inicio y fin.');
          return;
      }
      if (new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
          alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
          return;
      }

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
        {/* Usar encadenamiento opcional para el título por seguridad */}
        <h3>{initialData?.id_ausencia ? 'Editar' : 'Crear'} Solicitud de Ausencia/Permiso</h3> {/* Use ?. here */}

        {/* Selección de Empleado (Relación) - Deshabilitado en edición si el backend no permite cambiar el empleado */}
         <div className="app-input-container">
             <label htmlFor="id_empleado" className="app-input-label">Empleado:</label>
             <select
                 id="id_empleado"
                 value={formData.id_empleado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 disabled={!!initialData?.id_ausencia} // Use ?. here
             >
                  <option value="">-- Seleccione un Empleado --</option>
                 {empleados.map(empleado => (
                     <option key={empleado.id_empleado} value={empleado.id_empleado}>
                         {empleado.nombre} {empleado.apellido} ({empleado.codigo_empleado})
                     </option>
                 ))}
             </select>
         </div>

        {/* Campos de fecha de ausencia */}
        <Input label="Fecha de Inicio:" id="fecha_inicio" type="date" value={formData.fecha_inicio} onChange={handleInputChange} required />
        <Input label="Fecha de Fin:" id="fecha_fin" type="date" value={formData.fecha_fin} onChange={handleInputChange} required />

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
                 <option value="Permiso con goce">Permiso con goce</option>
                 <option value="Permiso sin goce">Permiso sin goce</option>
                 <option value="Enfermedad">Enfermedad</option>
                 <option value="Suspensión IGSS">Suspensión IGSS</option>
                 <option value="Otro">Otro</option>
             </select>
         </div>

        {/* Campo Motivo */}
        <Input label="Motivo:" id="motivo" value={formData.motivo} onChange={handleInputChange} type="textarea" required />

         {/* Campo Documento Respaldo (solo nombre de archivo por ahora) */}
         <Input label="Documento Respaldo (Nombre de archivo):" id="documento_respaldo" value={formData.documento_respaldo} onChange={handleInputChange} />
         {/* Nota: La funcionalidad real de subir archivos es más compleja y no está incluida aquí */}


        {/* Selección de Estado - Puede ser solo lectura dependiendo de quién usa el formulario (Empleado vs RRHH) */}
         <div className="app-input-container">
             <label htmlFor="estado" className="app-input-label">Estado:</label>
             <select
                 id="estado"
                 value={formData.estado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 // Deshabilitar si la lógica de negocio dice que solo RRHH/Admin cambia el estado
                 disabled={initialData?.estado === 'Completada' || initialData?.estado === 'Aprobada' || initialData?.estado === 'Rechazada'} // Puedes ajustar esta lógica según necesites deshabilitar en otros estados
             >
                 <option value="Solicitada">Solicitada</option>
                 <option value="Aprobada">Aprobada</option>
                 <option value="Rechazada">Rechazada</option>
                 <option value="Completada">Completada</option> 
             </select>
         </div>

        {/* Checkbox Afecta Salario */}
         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="afecta_salario" checked={formData.afecta_salario} onChange={handleInputChange} />
                 <label htmlFor="afecta_salario"> Afecta Salario</label>
              </div>
         </div>


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {initialData?.id_ausencia ? 'Actualizar' : 'Crear'} Solicitud {/* Use ?. here */}
        </Button>
    </form>
  );
}

export default AusenciaForm;