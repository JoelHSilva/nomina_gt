// src/components/Forms/UsuarioForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';

function UsuarioForm({ initialData = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    contrasena: '', // Solo para creación o cambio de contraseña
    rol: 'Empleado', // Valor por defecto según ENUM
    id_empleado: '', // Campo para la relación opcional con Empleado
    activo: true, // Default TRUE
    // fecha_creacion, ultimo_login no editables
  });

  const [empleados, setEmpleados] = useState([]);
  const [loadingRelaciones, setLoadingRelaciones] = useState(true);
  const [errorRelaciones, setErrorRelaciones] = useState(null);


  // Cargar la lista de Empleados al montar el componente
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoadingRelaciones(true);
        // Puedes cargar solo empleados que *no* tienen usuario ya asociado,
        // pero requiere un endpoint específico en el backend. Por ahora, cargamos todos.
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
    if (initialData && initialData.id_usuario) { // Verificar si estamos en modo edición
      setFormData({
        nombre_usuario: initialData.nombre_usuario || '',
        // NOTA DE SEGURIDAD: Nunca cargar la contraseña existente
        contrasena: '', // Dejar vacío en edición
        rol: initialData.rol || 'Empleado',
        // Asegurar que id_empleado se carga correctamente (puede ser null)
        id_empleado: initialData.id_empleado || '', // Cargar el ID del empleado asociado (puede ser '')
        activo: initialData.activo === undefined ? true : initialData.activo, // Cargar activo, default true si undefined
      });
    } else {
         // Si no hay initialData, resetear el formulario para creación
         setFormData({
            nombre_usuario: '',
            contrasena: '',
            rol: 'Empleado',
            id_empleado: '',
            activo: true,
         });
     }
  }, [initialData]); // Depende de initialData


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

   // Manejar inputs de tipo select
   const handleSelectChange = (e) => {
       const { id, value } = e.target;
       setFormData({
           ...formData,
           // Convertir el valor a número si es id_empleado y no es vacío
           [id]: id === 'id_empleado' && value !== '' ? parseInt(value, 10) : value
       });
   };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Transformar datos si es necesario (ej: asegurar que id_empleado es null si no se selecciona)
    const dataToSend = {
        ...formData,
        // Convertir id_empleado a null si es string vacío, de lo contrario usar el número
        id_empleado: formData.id_empleado === '' ? null : parseInt(formData.id_empleado, 10),
        //activo ya es booleano
    };

     // Eliminar la contraseña si estamos editando y no se ha ingresado una nueva
     // (asumiendo que la API no requiere enviar la contraseña si no cambia,
     // o que hay un endpoint separado para cambio de contraseña)
     if (initialData.id_usuario && dataToSend.contrasena === '') {
         delete dataToSend.contrasena;
     }
      // Validación: La contraseña es requerida solo en creación
      if (!initialData.id_usuario && dataToSend.contrasena === '') {
          alert('La contraseña es requerida para crear un usuario.');
          return; // Detener el envío
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
        <h3>{initialData.id_usuario ? 'Editar' : 'Crear'} Usuario</h3>

        {/* Campo Nombre de Usuario */}
        <Input label="Nombre de Usuario:" id="nombre_usuario" value={formData.nombre_usuario} onChange={handleInputChange} required />

         {/* Campo Contraseña (Solo visible y requerido en creación) */}
         {!initialData.id_usuario && (
              <Input label="Contraseña:" id="contrasena" type="password" value={formData.contrasena} onChange={handleInputChange} required={!initialData.id_usuario} />
         )}
          {/* Opcional: Un botón o enlace para cambiar contraseña en edición */}
          {initialData.id_usuario && (
              <p style={{ marginTop: '10px', marginBottom: '15px', fontSize: '0.9em' }}>
                  Para cambiar la contraseña, usa la opción de "Cambiar Contraseña" (funcionalidad no implementada aquí).
                  {/* O podrías poner un botón: <Button type="button">Cambiar Contraseña</Button> */}
              </p>
          )}


         {/* Selección de Rol (ENUM) */}
         <div className="app-input-container">
             <label htmlFor="rol" className="app-input-label">Rol:</label>
             <select
                 id="rol"
                 value={formData.rol}
                 onChange={handleSelectChange}
                 required
                 className="app-input-field"
             >
                 <option value="Administrador">Administrador</option>
                 <option value="RRHH">RRHH</option>
                 <option value="Empleado">Empleado</option>
                 <option value="Supervisor">Supervisor</option>
             </select>
         </div>

         {/* Selección de Empleado Asociado (Relación opcional) */}
         <div className="app-input-container">
             <label htmlFor="id_empleado" className="app-input-label">Empleado Asociado:</label>
             <select
                 id="id_empleado"
                 value={formData.id_empleado || ''} // Usar '' para la opción nula/vacía
                 onChange={handleSelectChange}
                 className="app-input-field"
                 // Puede que quieras deshabilitar si ya está asociado un empleado y no se permite cambiarlo
                 // disabled={!!initialData.id_empleado}
             >
                  <option value="">-- Sin Empleado Asociado --</option> {/* Opción para no asociar empleado */}
                 {empleados.map(empleado => (
                     <option key={empleado.id_empleado} value={empleado.id_empleado}>
                         {empleado.nombre} {empleado.apellido} ({empleado.codigo_empleado})
                     </option>
                 ))}
             </select>
              {/* Mostrar nombre del empleado asociado si existe en initialData y no está en modo creación */}
             {initialData.id_usuario && initialData.empleado_nombre_completo && !formData.id_empleado && (
                 <p style={{ fontSize: '0.9em', color: '#555', marginTop: '5px' }}>
                     Actualmente asociado a: {initialData.empleado_nombre_completo}
                     {/* Nota: La lógica de la lista desplegable permite desasociar */}
                 </p>
             )}
         </div>

        {/* Checkbox Activo */}
         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Activo</label>
              </div>
         </div>


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {initialData.id_usuario ? 'Actualizar' : 'Crear'} Usuario
        </Button>
    </form>
  );
}

export default UsuarioForm;