// src/components/Forms/HorasExtrasForm.jsx
import React, { useState, useEffect, useRef } from 'react'; 
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
// Si no usas ENDPOINTS directamente aquí, puedes quitar esta importación
// import { ENDPOINTS } from '../../api/endpoints.jsx'; 

function HorasExtrasForm({ initialData = null, onSubmit }) { 
  const [formData, setFormData] = useState({
    id_empleado: '',
    fecha: '',
    horas: '', 
    // REMOVIDO: multiplicador: '1.5', 
    motivo: '', 
    estado: 'Pendiente', 
    activo: true, 
  });

  const [empleados, setEmpleados] = useState([]);
  const [loadingRelaciones, setLoadingRelaciones] = useState(true);
  const [errorRelaciones, setErrorRelaciones] = useState(null);

  // --- ESTADO Y REF PARA DETECCIÓN DE CAMBIOS ---
  const originalFormDataRef = useRef(null); // Para almacenar una copia de los datos iniciales
  const [isFormChanged, setIsFormChanged] = useState(false); // Estado para indicar si el formulario ha cambiado
  // --- FIN ESTADO Y REF ---


  // Cargar la lista de Empleados al montar el componente
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoadingRelaciones(true);
        const data = await api.getAll('EMPLEADOS'); 
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
    if (initialData?.id_hora_extra) { // Modo edición
        const initialFormState = {
            id_empleado: initialData.id_empleado || '',
            fecha: initialData.fecha ? new Date(initialData.fecha).toISOString().split('T')[0] : '',
            horas: initialData.horas != null ? String(initialData.horas) : '', 
            // REMOVIDO: multiplicador: initialData.multiplicador != null ? String(initialData.multiplicador) : '', 
            motivo: initialData.motivo || '',
            estado: initialData.estado || 'Pendiente', 
            activo: initialData.activo === undefined ? true : initialData.activo, 
        };
        setFormData(initialFormState);

        // Almacenar una copia EXACTA de los datos iniciales del formulario en la ref
        originalFormDataRef.current = initialFormState; 
        setIsFormChanged(false); // Inicialmente, no hay cambios
    } else { // Modo creación
         // Resetear el formulario para creación
         setFormData({
            id_empleado: '', fecha: '', horas: '', 
            motivo: '', estado: 'Pendiente', activo: true, 
         });
        originalFormDataRef.current = null; 
        setIsFormChanged(true); // En creación, el formulario siempre se considera "cambiado" (listo para ser enviado si es válido)
     }
  }, [initialData]); 


  // --- EFECTO PARA DETECTAR CAMBIOS EN EL FORMULARIO ---
  useEffect(() => {
    // Solo ejecutar si estamos en modo edición (hay datos originales para comparar)
    if (originalFormDataRef.current) {
        // Comparar el objeto formData actual con el objeto original almacenado en la ref
        const areEqual = Object.keys(formData).every(key => {
            // Comparación simple campo por campo
            return formData[key] === originalFormDataRef.current[key];
        });

        // El formulario ha cambiado si no son iguales
        setIsFormChanged(!areEqual);
    }
  }, [formData]); // Este efecto se ejecuta cada vez que formData cambia


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
     let newValue = value;
     if (type === 'number' && value !== '') {
         newValue = parseFloat(value);
         if (isNaN(newValue)) newValue = value; 
     }

    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : newValue, 
    });
  };

   const handleSelectChange = (e) => {
       const { id, value } = e.target;
       setFormData({
           ...formData,
           [id]: value 
       });
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos para enviar al backend
    const dataToSend = {
        ...formData,
        id_empleado: formData.id_empleado ? parseInt(formData.id_empleado, 10) : null, 
        horas: formData.horas === '' ? null : parseFloat(formData.horas), 
        // REMOVIDO: multiplicador: formData.multiplicador === '' ? null : parseFloat(formData.multiplicador), 
        motivo: formData.motivo || null, 
    };

     // Validaciones adicionales 
      if (!dataToSend.id_empleado) {
          alert('Debe seleccionar un empleado.');
          return;
      }
      if (!formData.fecha) {
          alert('Debe seleccionar una fecha.');
          return;
      }
     if (dataToSend.horas !== null && dataToSend.horas < 0) { 
         alert('La cantidad de horas no puede ser negativa.');
         return;
     }
      // REMOVIDA validación de multiplicador
      // if (dataToSend.multiplicador !== null && dataToSend.multiplicador < 0) { 
      //    alert('El multiplicador no puede ser negativo.');
      //    return;
      // }

    onSubmit(dataToSend);
  };

  if (loadingRelaciones) {
      return <LoadingSpinner />;
  }

   if (errorRelaciones) {
      return <div style={{ color: 'red' }}>{errorRelaciones}</div>;
   }

    const isProcessed = !!initialData?.id_detalle_nomina; 

  return (
    <form onSubmit={handleSubmit}>
        <h3>{initialData?.id_hora_extra ? 'Editar' : 'Registrar'} Horas Extra</h3> 

         <div className="app-input-container">
             <label htmlFor="id_empleado" className="app-input-label">Empleado:</label>
             <select
                 id="id_empleado" 
                 value={formData.id_empleado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 disabled={!!initialData?.id_hora_extra || isProcessed} 
             >
                  <option value="">-- Seleccione un Empleado --</option>
                 {empleados.map(empleado => (
                     <option key={empleado.id_empleado} value={empleado.id_empleado}>
                         {empleado.nombre} {empleado.apellido} ({empleado.codigo_empleado})
                     </option>
                 ))}
             </select>
         </div>

        {/* Campos restantes deshabilitados si ya está procesado */}
        <Input label="Fecha:" id="fecha" type="date" value={formData.fecha} onChange={handleInputChange} required disabled={isProcessed} />
        <Input label="Cantidad de Horas:" id="horas" type="number" value={formData.horas} onChange={handleInputChange} required step="0.5" min="0" disabled={isProcessed} /> 
        {/* REMOVIDO: Input para multiplicador */}
        <Input label="Motivo:" id="motivo" value={formData.motivo} onChange={handleInputChange} type="textarea" disabled={isProcessed} /> 

        {/* Selección de Estado */}
        {/* Deshabilitado si ya está procesado */}
         <div className="app-input-container">
             <label htmlFor="estado" className="app-input-label">Estado:</label>
             <select
                 id="estado" 
                 value={formData.estado}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
                 disabled={isProcessed} 
             >
                 <option value="Pendiente">Pendiente</option> 
                 <option value="Aprobada">Aprobada</option>
                 <option value="Rechazada">Rechazada</option>
                 <option value="Pagada">Pagada</option> 
             </select>
         </div>

        {/* Checkbox Activo */}
         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} disabled={isProcessed} /> 
                 <label htmlFor="activo"> Activo</label>
              </div>
         </div>


         {/* Mostrar ID Detalle Nomina si existe (solo lectura) */}
         {initialData?.id_detalle_nomina && ( 
              <div className="app-input-container">
                  <label className="app-input-label">Procesado en Nómina Detalle ID:</label>
                  <p>{initialData.id_detalle_nomina}</p>
              </div>
         )}

        {/* Botón de Submit - Deshabilitado si está procesado O si estamos editando Y no hay cambios */}
        <Button 
            type="submit" 
            className="app-button-primary" 
            style={{marginTop: '15px'}} 
            disabled={isProcessed || (initialData?.id_hora_extra && !isFormChanged)} 
        > 
            {initialData?.id_hora_extra ? 'Actualizar' : 'Registrar'} Horas Extra 
        </Button>
         {isProcessed && (
             <p style={{ color: 'red', marginTop: '10px' }}>* Este registro ya fue procesado en nómina y no puede ser modificado/eliminado.</p>
         )}
    </form>
  );
}

export default HorasExtrasForm;