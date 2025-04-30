// src/pages/PuestosPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
// CORREGIDO: Ajustar la ruta de importación
import api from '../api/api.jsx'; // <-- Ruta corregida
import { ENDPOINTS } from '../api/endpoints.jsx'; // <-- Ruta corregida
// Importar componentes comunes
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
// Importar el formulario de Puestos
import PuestoForm from '../components/Forms/PuestoForm.jsx';
import Input from '../components/Common/Input.jsx';

function PuestosPage() { // Nombre del componente
  // Estado para la lista de puestos
  const [puestos, setPuestos] = useState([]);
  // Estados para manejar carga y errores de la página principal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para controlar la visibilidad del modal de formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para almacenar el puesto que se está editando (o null para crear)
  const [editingPuesto, setEditingPuesto] = useState(null);
  // Estado para el término de búsqueda en la tabla
  const [searchTerm, setSearchTerm] = useState('');


  // Definición de las columnas para la tabla de Puestos
  // Usamos useMemo porque la definición de columnas solo depende del estado 'puestos' si la renderización es compleja
  const columns = useMemo(() => [
    { key: 'id_puesto', title: 'ID' }, // Columna para el ID del puesto
    { key: 'nombre', title: 'Nombre' }, // Columna para el nombre
    { key: 'descripcion', title: 'Descripción' }, // Columna para la descripción
    { key: 'salario_base', title: 'Salario Base (Q)', render: (value) => `Q ${parseFloat(value).toFixed(2)}` }, // <-- Columna para Salario Base
    // Columna para mostrar el departamento asociado (usando el campo anidado 'departamento')
     {
        key: 'departamento_nombre',
        title: 'Departamento',
        // Acceder al nombre del departamento a través del objeto 'departamento' anidado
        // Comprobación defensiva: si item.departamento es null/undefined, muestra "Sin Departamento"
        render: (value, item) => item.departamento ? item.departamento.nombre : 'Sin Departamento'
    },
    // Columna para mostrar el estado Activo (Sí/No)
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    // Columna para mostrar la fecha de creación
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    {
      key: 'actions',
      title: 'Acciones',
      // Renderiza los botones de acción para cada fila
      render: (value, item) => {
          // Determinar si el puesto está lógicamente inactivo (activo es false)
          const isInactive = !item.activo;

          return (
            <>
              {/* Botón Editar */}
              <Button
                  onClick={() => handleEdit(item)} // Llama a handleEdit con el item (puesto)
                  className="app-button"
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                   // Opcional: Deshabilitar edición si está inactivo, según tus reglas de negocio
                   // disabled={isInactive} // Si descomentas esto, no podrás editar puestos inactivos
              >
                  Editar
              </Button>

              {/* Botón Activar/Desactivar (IMPLEMENTA EL BORRADO LÓGICO) */}
              {/* Este botón REEMPLAZA al botón "Eliminar" físico */}
              <Button
                  onClick={() => handleToggleActivo(item.id_puesto)} // Llama a la función que toggle activo con el ID del puesto
                  // Cambia la clase del botón según el estado activo
                  className={item.activo ? "app-button-warning" : "app-button-success"}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                  // Deshabilita el botón si ya está en el estado que la acción realizaría
                  // (ej: no puedes "Desactivar" si ya está activo: false)
                  disabled={item.activo ? isInactive : !isInactive}
              >
                  {/* Cambia el texto del botón según el estado activo */}
                  {item.activo ? 'Desactivar' : 'Activar'}
              </Button>

               {/* Si quisieras un botón de eliminación física APARTE, iría aquí */}
               {/* Pero generalmente NO se recomienda borrar físicamente si hay relaciones */}
            </>
          );
      }
    },
  ], [puestos]); // Depende de 'puestos' para que se re-rendericen los botones si cambian los datos

  // --- Carga de datos de Puestos ---
  // Efecto que se ejecuta al montar el componente para cargar la lista inicial de puestos
  useEffect(() => {
    fetchPuestos(); // Llama a la función para obtener los puestos
  }, []); // Array de dependencias vacío: se ejecuta solo una vez al montar

  const fetchPuestos = async () => {
    try {
      setLoading(true); // Activa el spinner de carga
       // Llama a la API para obtener todos los puestos
       // Asegúrate de que tu backend incluye la información del departamento asociado en la respuesta de Puestos (eager loading)
      const data = await api.getAll('PUESTOS'); // Usa el endpoint de Puestos definido en endpoints.jsx
      console.log("Datos de puestos recibidos:", data);
      // CORREGIDO: Filtrar cualquier elemento nulo o indefinido que pueda venir de la API
      const cleanedData = data.filter(puesto => puesto != null);
      setPuestos(cleanedData); // Actualiza el estado con los datos limpios
    } catch (err) {
      setError('Error al cargar los puestos.'); // Establece un mensaje de error si falla la carga
      console.error(err); // Loguea el error en la consola
    } finally {
      setLoading(false); // Desactiva el spinner de carga
    }
  };

  // --- Lógica de Filtrado de Puestos (por término de búsqueda) ---
   // Usa useMemo para calcular la lista filtrada solo cuando 'puestos' o 'searchTerm' cambian
  const filteredPuestos = useMemo(() => {
    // Si el término de búsqueda está vacío, devuelve la lista completa de puestos
    if (searchTerm.trim() === '') {
      return puestos;
    }

    // Convierte el término de búsqueda a minúsculas para comparación insensible a mayúsculas
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Filtra la lista de puestos
    return puestos.filter(puesto => {
        // Comprobación defensiva adicional por si acaso un puesto es nulo en la lista
        if (!puesto) return false;

      // Define qué campos del puesto son susceptibles de búsqueda
      // Puedes ajustar esta lista según los campos que quieras que sean buscables
      const searchableFields = ['nombre', 'descripcion']; // Ejemplo: buscar en nombre y descripción

      // Itera sobre los campos definidos como buscables
      for (const key of searchableFields) {
          const value = puesto[key];
           // Asegúrate de que el valor existe y es un string antes de buscar en él
           if (value && typeof value === 'string') {
               // Si el valor del campo (en minúsculas) incluye el término de búsqueda (en minúsculas)
               if (value.toLowerCase().includes(lowerCaseSearchTerm)) {
                 return true; // Incluye este puesto en la lista filtrada
               }
           }
      }
       // También buscar en el nombre del departamento asociado si existe
       if (puesto.departamento && puesto.departamento.nombre) {
           if (puesto.departamento.nombre.toLowerCase().includes(lowerCaseSearchTerm)) {
               return true; // Incluye si el término coincide con el nombre del departamento
           }
       }

      return false; // Si el término no se encuentra en ningún campo searchable, excluye el puesto
    });
  }, [puestos, searchTerm]); // Las dependencias: re-ejecuta el memo si cambian puestos o searchTerm


  // --- Manejo de Modal y Formulario de Puesto ---
  // Función para abrir el modal
  const openModal = () => {
      setIsModalOpen(true); // Abre el modal
      console.log("Modal abierto.");
  };
  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false); // Cierra el modal
    setEditingPuesto(null); // Resetea el puesto que se estaba editando
    console.log("Modal cerrado.");
  };

  // Función para manejar el clic en el botón "Crear Nuevo Puesto"
  const handleCreate = () => {
    setEditingPuesto(null); // Establece editingPuesto a null para indicar modo creación
    openModal(); // Abre el modal
    console.log("handleCreate llamado. editingPuesto es null.");
  };

  // Función para manejar el clic en el botón "Editar" de una fila de puesto
  const handleEdit = (puesto) => { // Recibe el objeto puesto de la fila
    setEditingPuesto(puesto); // Establece el puesto que se editará
    openModal(); // Abre el modal
    console.log("handleEdit llamado. editingPuesto:", puesto);
  };

  // Función que se pasa al formulario PuestoForm y se llama cuando el formulario se envía (Crear o Editar)
  const handleSubmit = async (formData) => { // Recibe los datos del formulario
    try {
      setLoading(true); // Activa el spinner
      // Comprueba si hay un puesto en edición (si editingPuesto no es null)
      if (editingPuesto) {
        console.log("Intentando actualizar puesto:", editingPuesto.id_puesto, formData);
         // Llama a la API para actualizar el puesto usando su ID
        await api.update('PUESTOS', editingPuesto.id_puesto, formData);
        console.log('Puesto actualizado:', formData);
      } else {
        console.log("Intentando crear nuevo puesto:", formData);
         // Llama a la API para crear un nuevo puesto
        await api.create('PUESTOS', formData);
        console.log('Puesto creado:', formData);
      }
      closeModal(); // Cierra el modal después de guardar
      fetchPuestos(); // Recarga la lista de puestos para ver los cambios
    } catch (err) {
      // Captura y maneja cualquier error durante la creación o actualización
      setError('Error al guardar el puesto.');
      const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
      console.error('Error al guardar puesto:', backendErrorMessage || err.message);
       // Muestra una alerta al usuario con el mensaje de error del backend si está disponible
       alert(`Error al guardar el puesto: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
    } finally {
       setLoading(false); // Desactiva el spinner
    }
  };

   // --- Manejo de Activar/Desactivar Puesto (Borrado Lógico) ---
   // ESTA FUNCIÓN REEMPLAZA LA FUNCIÓN handleDelete ORIGINAL PARA HACER BORRADO LÓGICO
   const handleToggleActivo = async (id) => { // Recibe el ID del puesto
        // Encuentra el puesto en la lista actual por su ID
        const puestoToToggle = puestos.find(pst => pst.id_puesto === id);
        // Si no lo encuentra (lo cual no debería pasar), sale
        if (!puestoToToggle) {
            console.warn(`Puesto con ID ${id} no encontrado en la lista local.`);
            return;
        }

        // Determina la acción a realizar y el mensaje de confirmación
        const action = puestoToToggle.activo ? 'desactivar' : 'activar';
        const confirmMessage = puestoToToggle.activo
            ? `¿Estás seguro de desactivar el puesto "${puestoToToggle.nombre}"? Esto lo marcará como inactivo lógicamente.`
            : `¿Estás seguro de activar el puesto "${puestoToToggle.nombre}"?`;

        // Muestra un cuadro de confirmación al usuario
        if (window.confirm(confirmMessage)) {
            try {
                setLoading(true); // Activa el spinner
                 // Prepara el payload con el estado 'activo' invertido
                 // Asumimos que tu backend PUT/PATCH /api/v1/puestos/:id acepta actualizar { activo: boolean }
                 const updatePayload = { activo: !puestoToToggle.activo };

                console.log(`Cambiando estado activo a ${!puestoToToggle.activo} para puesto ${id}:`, updatePayload);
                 // Llama a la API para actualizar el puesto (realizando el borrado/activación lógico)
                await api.update('PUESTOS', id, updatePayload);

                console.log(`Puesto ${action}do:`, id);
                fetchPuestos(); // Recarga la lista para reflejar el cambio
            } catch (err) {
                // Captura y maneja errores al cambiar el estado
                setError(`Error al ${action} el puesto.`);
                const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
                console.error(`Error al ${action} puesto:`, backendErrorMessage || err.message);
                alert(`Error al ${action} el puesto: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
            } finally {
                setLoading(false); // Desactiva el spinner
            }
        }
   };

   // La función handleDelete original (borrado físico) ya no se usa si implementas borrado lógico con handleToggleActivo


  // --- Renderizado del Componente ---
  if (loading) {
    return <LoadingSpinner />; // Muestra spinner mientras carga la página
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>; // Muestra mensaje de error si falla la carga inicial
  }

  return (
    <div>
      <h2>Gestión de Puestos</h2> {/* Título de la página */}

       {/* Controles superiores: Botón Crear y Campo de Búsqueda */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
           <Button onClick={handleCreate} className="app-button-primary">
               Crear Nuevo Puesto {/* Texto del botón de creación */}
           </Button>
           {/* Campo de Búsqueda */}
           <div className="app-input-container" style={{ marginBottom: '0', width: '300px' }}>
               <Input
                   id="search"
                   type="text"
                   placeholder="Buscar puestos..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   label="" // No label, solo placeholder
               />
           </div>
       </div>


      {/* Tabla para mostrar los puestos (filtrados por búsqueda) */}
      <Table data={filteredPuestos} columns={columns} />

      {/* Modal para el formulario de Crear o Editar */}
      <Modal
        isOpen={isModalOpen} // Controla si el modal está abierto
        onClose={closeModal} // Función para cerrar el modal
        title={editingPuesto ? 'Editar Puesto' : 'Crear Puesto'} // Título dinámico
      >
        {/* Renderiza el formulario de Puesto dentro del modal */}
        <PuestoForm // Renderiza el formulario de Puesto
          initialData={editingPuesto} // Pasa el puesto a editar (o null para crear)
          onSubmit={handleSubmit} // Pasa la función handleSubmit de esta página al formulario
        />
      </Modal>
    </div>
  );
}

export default PuestosPage; // Exporta el componente de la página