// src/pages/DepartamentosPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
// Asegúrate de importar el formulario correcto para Departamentos
import DepartamentoForm from '../components/Forms/DepartamentoForm.jsx';
import Input from '../components/Common/Input.jsx';

function DepartamentosPage() { // Nombre del componente
  // Estado para la lista de departamentos
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para almacenar el departamento que se está editando (o null para crear)
  const [editingDepartamento, setEditingDepartamento] = useState(null);
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');


  // Definición de las columnas para la tabla de Departamentos
  const columns = useMemo(() => [ // Usamos useMemo si la definición es compleja o usa estados/props
    { key: 'id_departamento', title: 'ID' }, // Columna para el ID
    { key: 'nombre', title: 'Nombre' }, // Columna para el nombre
    { key: 'descripcion', title: 'Descripción' }, // Columna para la descripción
    // Columna para mostrar el estado Activo (Sí/No)
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    // Columna para mostrar la fecha de creación
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    {
      key: 'actions',
      title: 'Acciones',
      // Renderiza los botones de acción para cada fila
      render: (value, item) => {
          // Determinar si el departamento está lógicamente inactivo (activo es false)
          const isInactive = !item.activo;

          return (
            <>
              {/* Botón Editar */}
              <Button
                  onClick={() => handleEdit(item)} // Llama a handleEdit con el item (departamento)
                  className="app-button"
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                   // Opcional: Deshabilitar edición si está inactivo, según tus reglas de negocio
                   // disabled={isInactive} // Si descomentas esto, no podrás editar departamentos inactivos
              >
                  Editar
              </Button>

              {/* Botón Activar/Desactivar (IMPLEMENTA EL BORRADO LÓGICO) */}
              {/* Este botón reemplaza al botón "Eliminar" físico */}
              <Button
                  onClick={() => handleToggleActivo(item.id_departamento)} // Llama a la función que toggle activo
                  // Cambia la clase del botón según el estado activo
                  className={item.activo ? "app-button-warning" : "app-button-success"}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                  // Deshabilita el botón si ya está en el estado que la acción realizaría
                  // (ej: no puedes "Desactivar" si ya está inactivo)
                  disabled={item.activo ? isInactive : !isInactive} // Deshabilita si activo y quieres desactivar (ya está inactivo), o si inactivo y quieres activar (ya está activo)
                  // Una lógica más simple: disabled={isInactive} // Deshabilita si el departamento está inactivo
              >
                  {/* Cambia el texto del botón según el estado activo */}
                  {item.activo ? 'Desactivar' : 'Activar'}
              </Button>

               {/* Si quisieras un botón de eliminación física APARTE del borrado lógico, iría aquí */}
               {/* Pero generalmente NO se recomienda borrar físicamente si hay relaciones */}
               {/* <Button onClick={() => handleDeleteFisico(item.id_departamento)} className="app-button-danger">Eliminar Físico</Button> */}
            </>
          );
      }
    },
  ], [departamentos]); // Depende de departamentos para que se re-rendericen los botones si cambian los datos


  // --- Carga de datos de Departamentos ---
  useEffect(() => {
    fetchDepartamentos(); // Llama a la función para obtener los departamentos al montar el componente
  }, []); // El array vacío asegura que se ejecute solo una vez

  const fetchDepartamentos = async () => {
    try {
      setLoading(true); // Activa el spinner de carga
       // Llama a la API para obtener todos los departamentos
      const data = await api.getAll('DEPARTAMENTOS');
      console.log("Datos de departamentos recibidos:", data);
      // CORREGIDO: Filtrar cualquier elemento nulo o indefinido que pueda venir de la API
      const cleanedData = data.filter(departamento => departamento != null);
      setDepartamentos(cleanedData); // Actualiza el estado con los datos limpios
    } catch (err) {
      setError('Error al cargar los departamentos.'); // Establece un mensaje de error si falla la carga
      console.error(err); // Loguea el error en la consola
    } finally {
      setLoading(false); // Desactiva el spinner de carga
    }
  };

  // --- Lógica de Filtrado de Departamentos (por término de búsqueda) ---
   // Usa useMemo para calcular la lista filtrada solo cuando 'departamentos' o 'searchTerm' cambian
  const filteredDepartamentos = useMemo(() => {
    // Si el término de búsqueda está vacío, devuelve la lista completa de departamentos
    if (searchTerm.trim() === '') {
      return departamentos;
    }

    // Convierte el término de búsqueda a minúsculas para comparación insensible a mayúsculas
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Filtra la lista de departamentos
    return departamentos.filter(departamento => {
        // Comprobación defensiva adicional por si acaso
        if (!departamento) return false;

      // Define qué campos del departamento son susceptibles de búsqueda
      // Puedes ajustar esta lista según los campos que quieras que sean buscables
      const searchableFields = ['nombre', 'descripcion']; // Ejemplo: buscar en nombre y descripción

      // Itera sobre los campos definidos como buscables
      for (const key of searchableFields) {
          const value = departamento[key];
           // Asegúrate de que el valor existe y es un string antes de buscar
           if (value && typeof value === 'string') {
               // Si el valor del campo (en minúsculas) incluye el término de búsqueda (en minúsculas)
               if (value.toLowerCase().includes(lowerCaseSearchTerm)) {
                 return true; // Incluye este departamento en la lista filtrada
               }
           }
           // Si tienes relaciones anidadas en Departamento que quieras buscar (ej: nombre del jefe), añádelas aquí
           // Ejemplo: if (departamento.jefe && departamento.jefe.nombre && departamento.jefe.nombre.toLowerCase().includes(lowerCaseSearchTerm)) return true;

      }
      return false; // Si el término no se encuentra en ningún campo searchable, excluye el departamento
    });
  }, [departamentos, searchTerm]); // Las dependencias: re-ejecuta el memo si cambian departamentos o searchTerm


  // --- Manejo de Modal y Formulario de Departamento ---
  const openModal = () => {
      setIsModalOpen(true); // Abre el modal
      console.log("Modal abierto.");
  };
  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal
    setEditingDepartamento(null); // Resetea el departamento que se estaba editando
    console.log("Modal cerrado.");
  };

  // Función para manejar el clic en "Crear Nuevo Departamento"
  const handleCreate = () => {
    setEditingDepartamento(null); // Establece editingDepartamento a null para indicar modo creación
    openModal(); // Abre el modal
    console.log("handleCreate llamado. editingDepartamento es null.");
  };

  // Función para manejar el clic en el botón "Editar" de una fila
  const handleEdit = (departamento) => { // Recibe el objeto departamento de la fila
    setEditingDepartamento(departamento); // Establece el departamento que se editará
    openModal(); // Abre el modal
    console.log("handleEdit llamado. editingDepartamento:", departamento);
  };

  // Función que se pasa al formulario y se llama cuando el formulario se envía (Crear o Editar)
  const handleSubmit = async (formData) => { // Recibe los datos del formulario
    try {
      setLoading(true); // Activa el spinner
      // Comprueba si hay un departamento en edición (si es null, estamos creando)
      if (editingDepartamento) {
        console.log("Intentando actualizar departamento:", editingDepartamento.id_departamento, formData);
         // Llama a la API para actualizar el departamento usando su ID
        await api.update('DEPARTAMENTOS', editingDepartamento.id_departamento, formData);
        console.log('Departamento actualizado:', formData);
      } else {
        console.log("Intentando crear nuevo departamento:", formData);
         // Llama a la API para crear un nuevo departamento
        await api.create('DEPARTAMENTOS', formData);
        console.log('Departamento creado:', formData);
      }
      closeModal(); // Cierra el modal después de guardar
      fetchDepartamentos(); // Recarga la lista de departamentos para ver los cambios
    } catch (err) {
      // Captura y maneja cualquier error durante la creación o actualización
      setError('Error al guardar el departamento.');
      const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
      console.error('Error al guardar departamento:', backendErrorMessage || err.message);
       // Muestra una alerta al usuario con el mensaje de error del backend si está disponible
       alert(`Error al guardar el departamento: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
    } finally {
       setLoading(false); // Desactiva el spinner
    }
  };

   // --- Manejo de Activar/Desactivar Departamento (Borrado Lógico) ---
   // ESTA FUNCIÓN REEMPLAZA LA FUNCIÓN handleDelete ORIGINAL
   const handleToggleActivo = async (id) => { // Recibe el ID del departamento
        // Encuentra el departamento en la lista actual por su ID
        const departamentoToToggle = departamentos.find(dep => dep.id_departamento === id);
        // Si no lo encuentra (lo cual no debería pasar), sale
        if (!departamentoToToggle) {
            console.warn(`Departamento con ID ${id} no encontrado en la lista local.`);
            return;
        }

        // Determina la acción y el mensaje de confirmación
        const action = departamentoToToggle.activo ? 'desactivar' : 'activar';
        const confirmMessage = departamentoToToggle.activo
            ? `¿Estás seguro de desactivar el departamento "${departamentoToToggle.nombre}"? Esto lo marcará como inactivo lógicamente.`
            : `¿Estás seguro de activar el departamento "${departamentoToToggle.nombre}"?`;

        // Muestra un cuadro de confirmación al usuario
        if (window.confirm(confirmMessage)) {
            try {
                setLoading(true); // Activa el spinner
                 // Prepara el payload con el estado 'activo' invertido
                 const updatePayload = { activo: !departamentoToToggle.activo };

                console.log(`Cambiando estado activo a ${!departamentoToToggle.activo} para departamento ${id}:`, updatePayload);
                 // Llama a la API para actualizar el departamento (realizando el borrado/activación lógico)
                 // Asumimos que tu backend PUT/PATCH /api/v1/departamentos/:id acepta actualizar { activo: boolean }
                await api.update('DEPARTAMENTOS', id, updatePayload);

                console.log(`Departamento ${action}do:`, id);
                fetchDepartamentos(); // Recarga la lista para reflejar el cambio
            } catch (err) {
                // Captura y maneja errores al cambiar el estado
                setError(`Error al ${action} el departamento.`);
                const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
                console.error(`Error al ${action} departamento:`, backendErrorMessage || err.message);
                alert(`Error al ${action} el departamento: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
            } finally {
                setLoading(false); // Desactiva el spinner
            }
        }
   };

   // La función handleDelete original que llamaba a api.remove ya no se usa para el borrado lógico


  // --- Renderizado del Componente ---
  if (loading) {
    return <LoadingSpinner />; // Muestra spinner mientras carga
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>; // Muestra mensaje de error si falla la carga inicial
  }

  return (
    <div>
      <h2>Gestión de Departamentos</h2> {/* Título de la página */}

       {/* Controles superiores: Botón Crear y Campo de Búsqueda */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
           <Button onClick={handleCreate} className="app-button-primary">
               Crear Nuevo Departamento {/* Texto del botón de creación */}
           </Button>
           {/* Campo de Búsqueda */}
           <div className="app-input-container" style={{ marginBottom: '0', width: '300px' }}>
               <Input
                   id="search"
                   type="text"
                   placeholder="Buscar departamentos..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   label="" // No label, solo placeholder
               />
           </div>
       </div>


      {/* Tabla para mostrar los departamentos (filtrados por búsqueda) */}
      <Table data={filteredDepartamentos} columns={columns} />

      {/* Modal para el formulario de Crear o Editar */}
      <Modal
        isOpen={isModalOpen} // Controla si el modal está abierto
        onClose={closeModal} // Función para cerrar el modal
        title={editingDepartamento ? 'Editar Departamento' : 'Crear Departamento'} // Título dinámico
      >
        {/* Renderiza el formulario de Departamento dentro del modal */}
        <DepartamentoForm
          initialData={editingDepartamento} // Pasa el departamento a editar (o null para crear)
          onSubmit={handleSubmit} // Pasa la función handleSubmit de esta página al formulario
        />
      </Modal>
    </div>
  );
}

export default DepartamentosPage; // Exporta el componente