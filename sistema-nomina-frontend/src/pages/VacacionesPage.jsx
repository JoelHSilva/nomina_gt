// src/pages/VacacionesPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import VacacionesForm from '../components/Forms/VacacionesForm.jsx'; // Importa el formulario específico

function VacacionesPage() {
  const [vacaciones, setVacaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacacion, setEditingVacacion] = useState(null); // Solicitud seleccionada para editar

  // Columnas para la tabla de Vacaciones
  const columns = [
    { key: 'id_vacaciones', title: 'ID' },
    // { key: 'id_empleado', title: 'ID Empleado' }, // Mostrar nombre empleado si unes
    { key: 'empleado_nombre_completo', title: 'Empleado' }, // Asumiendo que backend une y devuelve nombre
    { key: 'fecha_solicitud', title: 'Fecha Solicitud', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'fecha_inicio', title: 'Fecha Inicio', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'fecha_fin', title: 'Fecha Fin', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'dias_tomados', title: 'Días Tomados' },
    { key: 'estado', title: 'Estado' },
    // { key: 'aprobado_por', title: 'Aprobado Por' }, // Si tu backend lo devuelve
    // { key: 'observaciones', title: 'Observaciones' }, // Opcional mostrar en tabla
    { key: 'activo', title: 'Activa?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( // item es el objeto completo de la solicitud
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px' }} disabled={item.estado !== 'Solicitada'}>Editar</Button> {/* Editar solo si 'Solicitada' */}
          <Button onClick={() => handleDelete(item.id_vacaciones)} className="app-button-danger" disabled={item.estado !== 'Solicitada' && item.estado !== 'Cancelada'}>Eliminar</Button> {/* Eliminar si 'Solicitada' o 'Cancelada' */}
           {/* Botones de flujo de trabajo condicionales por estado */}
           {item.estado === 'Solicitada' && (
               <>
                 {/* Estas acciones de Aprobación/Rechazo podrían ser llamadas API específicas */}
                 <Button onClick={() => handleApprove(item.id_vacaciones)} className="app-button-success" style={{ marginRight: '5px', marginLeft: '5px' }}>Aprobar</Button> {/* Implementar esta función */}
                 <Button onClick={() => handleReject(item.id_vacaciones)} className="app-button-warning">Rechazar</Button> {/* Implementar esta función */}
               </>
           )}
            {item.estado === 'Aprobada' && (
                <Button onClick={() => handleCancel(item.id_vacaciones)} className="app-button-danger" style={{ marginLeft: '5px' }}>Cancelar</Button> //{/* Implementar esta función */}
            )}
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchVacaciones();
  }, []); // Se ejecuta solo una vez al montar

  const fetchVacaciones = async () => {
    try {
      setLoading(true);
       // Asegúrate de que tu backend une los datos del empleado para mostrar el nombre
      const data = await api.getAll('VACACIONES'); // Usar la clave string
      setVacaciones(data);
    } catch (err) {
      setError('Error al cargar las solicitudes de vacaciones.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVacacion(null); // Limpiar la solicitud de edición al cerrar
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
        // Actualizar solicitud existente
        // Al actualizar, puede que solo se permitan ciertos campos o estados dependiendo del estado actual
        await api.update('VACACIONES', editingVacacion.id_vacaciones, formData); // Usar la clave string
        console.log('Solicitud de vacaciones actualizada:', formData);
      } else {
        // Crear nueva solicitud
        await api.create('VACACIONES', formData); // Usar la clave string
        console.log('Solicitud de vacaciones creada:', formData);
      }
      closeModal(); // Cerrar modal después de guardar
      fetchVacaciones(); // Recargar la lista de solicitudes
    } catch (err) {
      setError('Error al guardar la solicitud de vacaciones.'); // Manejo de error básico
      console.error('Error al guardar solicitud:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
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
        await api.remove('VACACIONES', id); // Usar la clave string
        console.log('Solicitud de vacaciones eliminada:', id);
        fetchVacaciones(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar la solicitud de vacaciones.'); // Manejo de error básico
        console.error('Error al eliminar solicitud:', err.response?.data || err.message);
         // Mostrar mensaje de error al usuario
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
                 // Ejemplo: Llamada a una función API específica
                // await api.approveVacacion(id); // <-- Necesitas crear esta función en api.jsx
                 // O si tu PUT permite cambio de estado + usuario
                 // await api.update('VACACIONES', id, { estado: 'Aprobada', aprobado_por: 'UsuarioActual' });
                console.log(`Acción: Aprobar Solicitud Vacaciones ${id}`);
                fetchVacaciones(); // Recargar para reflejar el cambio de estado
            } catch (err) {
                setError('Error al aprobar la solicitud.');
                console.error('Error al aprobar solicitud:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }
    };

     const handleReject = async (id) => {
         if (window.confirm(`¿Estás seguro de rechazar la solicitud de vacaciones con ID ${id}?`)) {
            try {
                setLoading(true);
                 // Ejemplo: Llamada a una función API específica
                // await api.rejectVacacion(id); // <-- Necesitas crear esta función en api.jsx
                 // O si tu PUT permite cambio de estado + usuario
                 // await api.update('VACACIONES', id, { estado: 'Rechazada', aprobado_por: 'UsuarioActual' });
                 console.log(`Acción: Rechazar Solicitud Vacaciones ${id}`);
                fetchVacaciones(); // Recargar
            } catch (err) {
                setError('Error al rechazar la solicitud.');
                console.error('Error al rechazar solicitud:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
         }
    };

     const handleCancel = async (id) => {
         if (window.confirm(`¿Estás seguro de cancelar la solicitud de vacaciones con ID ${id}?`)) {
            try {
                setLoading(true);
                 // Ejemplo: Llamada a una función API específica
                // await api.cancelVacacion(id); // <-- Necesitas crear esta función en api.jsx
                 // O si tu PUT permite cambio de estado + usuario
                 // await api.update('VACACIONES', id, { estado: 'Cancelada', aprobado_por: 'UsuarioActual' });
                 console.log(`Acción: Cancelar Solicitud Vacaciones ${id}`);
                fetchVacaciones(); // Recargar
            } catch (err) {
                setError('Error al cancelar la solicitud.');
                console.error('Error al cancelar solicitud:', err.response?.data || err.message);
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
    // La clase 'main-content' ya provee padding gracias a App.jsx
    <div>
      <h2>Gestión de Solicitudes de Vacaciones</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nueva Solicitud
      </Button>

      {/* Tabla para mostrar las solicitudes */}
      <Table data={vacaciones} columns={columns} />

      {/* Modal para crear o editar solicitud */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingVacacion ? 'Editar Solicitud de Vacaciones' : 'Crear Solicitud de Vacaciones'}
      >
        <VacacionesForm
          initialData={editingVacacion} // Pasa los datos para edición
          onSubmit={handleSubmit} // Pasa la función de envío
        />
      </Modal>
    </div>
  );
}

export default VacacionesPage;