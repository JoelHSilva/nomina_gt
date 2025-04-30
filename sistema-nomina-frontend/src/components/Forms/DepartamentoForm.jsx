// src/components/Forms/DepartamentoForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
// CORREGIDO: Ajustar la ruta de importación para api y endpoints
import api from '../../api/api.jsx'; // <-- Ruta corregida
import { ENDPOINTS } from '../../api/endpoints.jsx'; // <-- Ruta corregida


// CORREGIDO: Manejo explícito de initialData para asegurar que siempre es un objeto con id_departamento
function DepartamentoForm({ initialData = { id_departamento: undefined }, onSubmit }) {
  // Si initialData es null o undefined, usará { id_departamento: undefined }
  // Si initialData es un objeto (en edición), ese objeto será usado
  const safeInitialData = initialData || { id_departamento: undefined };


  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
    // No hay relaciones complejas directas en el formulario de Departamento para seleccionar
  });

  // No necesitamos cargar relaciones como puestos/departamentos en este formulario,
  // a menos que un departamento se relacione directamente con algo más que necesite selección aquí.
  // Si tu departamento tiene alguna relación (ej: con un usuario 'jefe'), necesitarías fetchRelaciones aquí también.
  // const [loadingRelaciones, setLoadingRelaciones] = useState(false); // No cargar nada por defecto
  // const [errorRelaciones, setErrorRelaciones] = useState(null);


  // Efecto para inicializar el formulario cuando initialData cambia
  // Esto maneja tanto la carga en edición como el reseteo en creación
  useEffect(() => {
    // Usamos safeInitialData aquí para determinar si estamos en modo edición
    if (safeInitialData && safeInitialData.id_departamento !== undefined && safeInitialData.id_departamento !== null) {
      console.log("DepartamentoForm: Inicializando en modo Edición con datos:", safeInitialData);
      // Inicializar el formData con los datos del departamento existente
      setFormData({
        nombre: safeInitialData.nombre || '',
        descripcion: safeInitialData.descripcion || '',
        activo: safeInitialData.activo === undefined ? true : safeInitialData.activo,
        // Incluir otros campos si los hay en tu tabla departamentos
      });
    } else {
      console.log("DepartamentoForm: Inicializando en modo Creación.");
      // Resetear el formData a valores por defecto para un nuevo departamento
      setFormData({
        nombre: '',
        descripcion: '',
        activo: true,
      });
    }
  }, [initialData]); // Depende de la prop initialData (la cruda)


  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value,
    });
  };

   // Si hay selectores (dropdowns) que no son para IDs, podrías usar una función similar a handleInputChange
   // o crear handleSelectChange si conviertes valores a números/booleanos
    const handleSelectChange = (e) => {
        const { id, value } = e.target;
        // Lógica si necesitas convertir el valor (ej: a número)
         // const processedValue = value === '' ? '' : parseInt(value, 10); // Ejemplo para IDs numéricos

        setFormData({
            ...formData,
            [id]: value // Para strings de select como ENUMs si los tienes aquí
        });
    };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("DepartamentoForm: handleSubmit llamado. Datos del formulario:", formData);

    // Preparar los datos para enviar a la API
    const dataToSend = {
        ...formData,
         // Convertir campos opcionales vacíos a null si tu backend lo espera
        descripcion: formData.descripcion || null,
        // activo ya es booleano por el checkbox
    };

     // --- Validaciones Básicas (usando console.warn por ahora) ---
     if (!dataToSend.nombre) {
         console.warn('Validación: El nombre del departamento es requerido.');
         // Aquí deberías actualizar un estado de error visible al usuario
         return; // Detener el envío
     }
      // Puedes añadir más validaciones aquí si es necesario
     // --- Fin Validaciones ---


    console.log("DepartamentoForm: Llamando a onSubmit con datos para API:", dataToSend);
    onSubmit(dataToSend); // Llama a la función onSubmit de la página principal
  };


  // Si no hay relaciones ni cargas adicionales en este formulario, no necesitas LoadingSpinner aquí
  // if (loadingRelaciones) {
  //     return <LoadingSpinner />;
  // }
  // if (errorRelaciones) {
  //     return <div style={{ color: 'red' }}>{errorRelaciones}</div>;
  // }


  return (
    <form onSubmit={handleSubmit}>
        {/* Usamos safeInitialData aquí también para evitar el error si initialData fuera null */}
        <h3>{safeInitialData && safeInitialData.id_departamento ? 'Editar' : 'Crear'} Departamento</h3>

        {/* Campos del formulario de Departamento */}
        <Input label="Nombre:" id="nombre" value={formData.nombre} onChange={handleInputChange} required />
        <Input label="Descripción:" id="descripcion" value={formData.descripcion} onChange={handleInputChange} type="textarea" />

         {/* Campo Activo (checkbox) */}
         <div className="app-input-container">
              <div>
                 <input type="checkbox" id="activo" checked={formData.activo} onChange={handleInputChange} />
                 <label htmlFor="activo"> Activo</label>
              </div>
         </div>

         {/* Si hay otros selectores (ej: Jefe de Departamento - id_jefe) irían aquí */}
         {/* Ejemplo de selector si tuvieras una relación id_jefe con Usuario */}
         {/* <div className="app-input-container">
             <label htmlFor="id_jefe" className="app-input-label">Jefe:</label>
             <select id="id_jefe" value={formData.id_jefe || ''} onChange={handleSelectChange} className="app-input-field">
                 <option value="">-- Seleccione Jefe --</option>
                 {usuarios.filter(usuario => usuario && usuario.id_usuario != null).map(usuario => (
                     <option key={usuario.id_usuario} value={usuario.id_usuario}>
                         {usuario.nombre_completo}
                     </option>
                 ))}
             </select>
         </div> */}


        <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
            {safeInitialData && safeInitialData.id_departamento ? 'Actualizar' : 'Crear'} Departamento
        </Button>
         {/* No hay lógica isDirty en este formulario por simplicidad, pero puedes añadirla si quieres */}
    </form>
  );
}

export default DepartamentoForm;