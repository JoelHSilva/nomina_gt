// src/pages/VacacionesPage.jsx
import React, { useState, useEffect } from 'react';
// --- VERIFICA ESTA RUTA ---
import api from '../api/api.jsx'; 

// --- VERIFICA ESTAS RUTAS ---
import Table from '../components/Common/Table.jsx'; 
import Button from '../components/Common/Button.jsx'; 
import Modal from '../components/Common/Modal.jsx'; 
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx'; 
import VacacionesForm from '../components/Forms/VacacionesForm.jsx'; 

// --- Si usas filtros en frontend, esta importación también debe ser correcta ---
// import Input from '../components/Common/Input.jsx';
// import { useMemo } from 'react';


function VacacionesPage() {
  // Estado para almacenar las solicitudes de vacaciones
  const [vacaciones, setVacaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para controlar el modal del formulario
  const [isModalOpen, setIsModalOpen] = useState(false); 
  // Solicitud seleccionada para editar (o null para crear)
  const [editingVacacion, setEditingVacacion] = useState(null); 

  // Si implementas filtros en frontend, necesitas este estado
  // const [filters, setFilters] = useState({ /* ... */ });

  // Columnas para la tabla de Vacaciones - Modificada para mostrar nombre del empleado
  const columns = [
    { key: 'id_vacaciones', title: 'ID' },
    // --- Verifica que la key 'empleado' y el acceso a .nombre .apellido coinciden con la estructura del backend ---
    { 
      key: 'empleado', 
      title: 'Empleado', 
      render: (empleado, item) => empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Empleado no disponible' 
    }, 
    // --- Fin verificación ---
    { key: 'fecha_solicitud', title: 'Fecha Solicitud', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'fecha_inicio', title: 'Fecha Inicio', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'fecha_fin', title: 'Fecha Fin', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'dias_tomados', title: 'Días Tomados' },
    { key: 'estado', title: 'Estado' },
    { key: 'activo', title: 'Activa?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( 
        <>
            {/* Botón Editar - Deshabilitado si el estado no es 'Solicitada' */}
          <Button 
                onClick={() => handleEdit(item)} 
                className="app-button" 
                style={{ marginRight: '5px' }} 
                disabled={item.estado !== 'Solicitada'}
            >
                Editar
            </Button> 
          {/* Botón Eliminar - Deshabilitado si el estado no es 'Solicitada' o 'Cancelada' */}
          <Button 
                onClick={() => handleDelete(item.id_vacaciones)} 
                className="app-button-danger" 
                disabled={item.estado !== 'Solicitada' && item.estado !== 'Cancelada'}
            >
                Eliminar
            </Button> 
           {/* Botones de flujo de trabajo condicionales por estado */}
           {item.estado === 'Solicitada' && (
               <>
                 <Button onClick={() => handleApprove(item.id_vacaciones)} className="app-button-success" style={{ marginRight: '5px', marginLeft: '5px' }}>Aprobar</Button> 
                 <Button onClick={() => handleReject(item.id_vacaciones)} className="app-button-warning">Rechazar</Button> 
               </>
           )}
            {item.estado === 'Aprobada' && (
                <Button onClick={() => handleCancel(item.id_vacaciones)} className="app-button-danger" style={{ marginLeft: '5px' }}>Cancelar</Button> 
            )}
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  // Si implementas filtro en frontend, necesitas useMemo y handleFilterChange
  // const filteredVacaciones = useMemo(() => { /* ... */ }, [vacaciones, filters]);
  // const handleFilterChange = (e) => { /* ... */ };


  useEffect(() => {
    fetchVacaciones();
  }, []); 


  const fetchVacaciones = async () => {
    try {
      setLoading(true);
      setError(null); 
      // Si implementas filtro en backend: const data = await api.getAll('VACACIONES', { params: filters });
       // Si el backend NO filtra: const data = await api.getAll('VACACIONES');
       // Usa la versión que corresponda a tu backend actual:
       const data = await api.getAll('VACACIONES'); 
      setVacaciones(data);
    } catch (err) {
      setError('Error al cargar las solicitudes de vacaciones.');
      console.error(err);
      setVacaciones([]); 
    } finally {
      setLoading(false);
    }
  };


  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVacacion(null); 
    // Después de guardar (crear/editar), recargar la lista 
    fetchVacaciones(); // <-- Recargar la lista al cerrar el modal después de guardar
  };

  const handleCreate = () => {
    setEditingVacacion(null); // Asegurarse de que no estamos editando
    openModal();
  };

  const handleEdit = (vacacion) => {
      // Solo permitir editar si está en estado 'Solicitada'
      if (vacacion.estado !== 'Solicitada') {
          alert('Solo se pueden editar solicitudes de vacaciones en estado "Solicitada".');
          return;
      }
    setEditingVacacion(vacacion); // Cargar datos en el formulario
    openModal();
  };

  const handleSubmit = async (formData) => { 
    try {
        setLoading(true);
        if (editingVacacion) {
            await api.update('VACACIONES', editingVacacion.id_vacaciones, formData); 
            console.log('Solicitud de vacaciones actualizada:', formData);
        } else {
            await api.create('VACACIONES', formData); 
            console.log('Solicitud de vacaciones creada:', formData);
        }
        closeModal(); // Cerrar modal después de guardar
        fetchVacaciones(); // Recargar la lista de solicitudes
    } catch (err) {
        setError('Error al guardar la solicitud de vacaciones.'); 
        console.error('Error al guardar solicitud:', err.response?.data || err.message);
        alert('Error al guardar la solicitud: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
    } finally {
        setLoading(false);
    }
};


  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
       // Solo permitir eliminar si está en estado 'Solicitada' o 'Cancelada'
       const vacacionToDelete = vacaciones.find(v => v.id_vacaciones === id);
       if (vacacionToDelete && vacacionToDelete.estado !== 'Solicitada' && vacacionToDelete.estado !== 'Cancelada') {
            alert('Solo se pueden eliminar solicitudes de vacaciones en estado "Solicitada" o "Cancelada".');
            return;
       }

    if (window.confirm(`¿Estás seguro de eliminar la solicitud de vacaciones con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('VACACIONES', id); 
        console.log('Solicitud de vacaciones eliminada:', id);
        fetchVacaciones(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar la solicitud de vacaciones.'); 
        console.error('Error al eliminar solicitud:', err.response?.data || err.message);
        alert('Error al eliminar la solicitud: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
      } finally {
         setLoading(false);
      }
    }
  };


    // --- Manejo de Acciones de Flujo de Trabajo ---
    // Estas acciones (Aprobar, Rechazar, Cancelar) probablemente llaman a endpoints API específicos
    // o usan la ruta PUT /vacaciones/:id con un body que cambia el estado y quizás 'aprobado_por'
    // Necesitas implementar estas funciones en api.jsx y los endpoints en backend.

    const handleApprove = async (id) => {
        if (window.confirm(`¿Estás seguro de aprobar la solicitud de vacaciones con ID ${id}?`)) {
            try {
                setLoading(true);
                 // Ejemplo: update simple del estado
                 await api.update('VACACIONES', id, { estado: 'Aprobada' }); 
                console.log(`Acción: Aprobar Solicitud Vacaciones ${id}`);
                fetchVacaciones(); 
            } catch (err) {
                setError('Error al aprobar la solicitud.');
                console.error('Error al aprobar solicitud:', err.response?.data || err.message);
                alert('Error al aprobar la solicitud: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
            } finally {
                setLoading(false);
            }
        }
    };

     const handleReject = async (id) => {
         if (window.confirm(`¿Estás seguro de rechazar la solicitud de vacaciones con ID ${id}?`)) {
            try {
                setLoading(true);
                 // Ejemplo: update simple del estado
                 await api.update('VACACIONES', id, { estado: 'Rechazada' }); 
                console.log(`Acción: Rechazar Solicitud Vacaciones ${id}`);
                fetchVacaciones(); 
            } catch (err) {
                setError('Error al rechazar la solicitud.');
                console.error('Error al rechazar solicitud:', err.response?.data || err.message);
                alert('Error al rechazar la solicitud: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
            } finally {
                setLoading(false);
            }
         }
    };

     const handleCancel = async (id) => {
         if (window.confirm(`¿Estás seguro de cancelar la solicitud de vacaciones con ID ${id}?`)) {
            try {
                setLoading(true);
                 // Ejemplo: update simple del estado
                 await api.update('VACACIONES', id, { estado: 'Cancelada' }); 
                console.log(`Acción: Cancelar Solicitud Vacaciones ${id}`);
                fetchVacaciones(); 
            } catch (err) {
                setError('Error al cancelar la solicitud.');
                console.error('Error al cancelar solicitud:', err.response?.data || err.message);
                alert('Error al cancelar la solicitud: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
            } finally {
                setLoading(false);
            }
         }
    };


  // --- Renderizado ---
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Gestión de Solicitudes de Vacaciones</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nueva Solicitud
      </Button>

      {/* Si implementas filtros en frontend, necesitas la sección de filtros aquí */}
       {/* <div style={{ marginBottom: '20px', /* ...  }}> ... </div> */}


      {/* Tabla para mostrar las solicitudes */}
       {/* Si implementas filtro en frontend, usa `filteredVacaciones` en lugar de `vacaciones` */}
      <Table data={vacaciones} columns={columns} /> 

      {/* Modal para crear o editar solicitud */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVacacion ? 'Editar Solicitud de Vacaciones' : 'Crear Solicitud de Vacaciones'}
      >
        {/* initialData será null para creación, VacacionesForm maneja esto usando ?. */}
        <VacacionesForm initialData={editingVacacion} onSubmit={handleSubmit} /> 
      </Modal>

    </div>
  );
}

export default VacacionesPage;