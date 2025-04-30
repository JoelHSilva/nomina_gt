// src/pages/AusenciasPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import AusenciaForm from '../components/Forms/AusenciaForm.jsx'; // Importa el formulario específico

function AusenciasPage() {
  const [ausencias, setAusencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAusencia, setEditingAusencia] = useState(null); // Solicitud seleccionada para editar

  // Columnas para la tabla de Ausencias
  const columns = [
    { key: 'id_ausencia', title: 'ID' },
    // { key: 'id_empleado', title: 'ID Empleado' }, // Mostrar nombre empleado si unes
    { key: 'empleado_nombre_completo', title: 'Empleado' }, // Asumiendo que backend une y devuelve nombre
    { key: 'fecha_inicio', title: 'Fecha Inicio', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'fecha_fin', title: 'Fecha Fin', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'tipo', title: 'Tipo' },
    { key: 'estado', title: 'Estado' },
    { key: 'afecta_salario', title: 'Afecta Salario?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'documento_respaldo', title: 'Documento', render: (value) => value || 'N/A' }, // Mostrar nombre o N/A
    // { key: 'motivo', title: 'Motivo' }, // Opcional mostrar en tabla
    // { key: 'aprobado_por', title: 'Aprobado Por' }, // Si tu backend lo devuelve
    { key: 'activo', title: 'Activa?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( // item es el objeto completo de la solicitud
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px', marginBottom: '5px' }} disabled={item.estado !== 'Solicitada'}>Editar</Button> {/* Editar solo si 'Solicitada' */}
          <Button onClick={() => handleDelete(item.id_ausencia)} className="app-button-danger" style={{ marginBottom: '5px' }} disabled={item.estado !== 'Solicitada' && item.estado !== 'Rechazada'}>Eliminar</Button> {/* Eliminar si 'Solicitada' o 'Rechazada' */}
           {/* Botones de flujo de trabajo condicionales por estado */}
           {item.estado === 'Solicitada' && (
               <>
                 {/* Estas acciones de Aprobación/Rechazo podrían ser llamadas API específicas */}
                 <Button onClick={() => handleApprove(item.id_ausencia)} className="app-button-success" style={{ marginRight: '5px', marginLeft: '5px', marginBottom: '5px' }}>Aprobar</Button> {/* Implementar esta función */}
                 <Button onClick={() => handleReject(item.id_ausencia)} className="app-button-warning" style={{ marginBottom: '5px' }}>Rechazar</Button> {/* Implementar esta función */}
               </>
           )}
            {/* El estado 'Completada' probablemente lo pone el sistema (ej: al pasar las fechas) */}
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchAusencias();
  }, []); // Se ejecuta solo una vez al montar

  const fetchAusencias = async () => {
    try {
      setLoading(true);
       // Asegúrate de que tu backend une los datos del empleado para mostrar el nombre
      const data = await api.getAll('AUSENCIAS'); // Usar la clave string
      setAusencias(data);
    } catch (err) {
      setError('Error al cargar las ausencias y permisos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAusencia(null); // Limpiar la solicitud de edición al cerrar
  };

  const handleCreate = () => {
    setEditingAusencia(null); // Asegurarse de que no estamos editando
    openModal();
  };

  const handleEdit = (ausencia) => {
      // Solo permitir editar si está en estado 'Solicitada'
      if (ausencia.estado !== 'Solicitada') {
          alert('Solo se pueden editar solicitudes de ausencia en estado "Solicitada".');
          return;
      }
    setEditingAusencia(ausencia); // Cargar datos en el formulario
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingAusencia) {
        // Actualizar solicitud existente
        // Al actualizar, puede que solo se permitan ciertos campos o estados dependiendo del estado actual
        await api.update('AUSENCIAS', editingAusencia.id_ausencia, formData); // Usar la clave string
        console.log('Solicitud de ausencia actualizada:', formData);
      } else {
        // Crear nueva solicitud
        await api.create('AUSENCIAS', formData); // Usar la clave string
        console.log('Solicitud de ausencia creada:', formData);
      }
      closeModal(); // Cerrar modal después de guardar
      fetchAusencias(); // Recargar la lista de solicitudes
    } catch (err) {
      setError('Error al guardar la solicitud de ausencia.'); // Manejo de error básico
      console.error('Error al guardar solicitud:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
       // Solo permitir eliminar si está en estado 'Solicitada' o 'Rechazada'
       const ausenciaToDelete = ausencias.find(a => a.id_ausencia === id);
       if (ausenciaToDelete && ausenciaToDelete.estado !== 'Solicitada' && ausenciaToDelete.estado !== 'Rechazada') {
            alert('Solo se pueden eliminar solicitudes de ausencia en estado "Solicitada" o "Rechazada".');
            return;
       }

    if (window.confirm(`¿Estás seguro de eliminar la solicitud de ausencia con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('AUSENCIAS', id); // Usar la clave string
        console.log('Solicitud de ausencia eliminada:', id);
        fetchAusencias(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar la solicitud de ausencia.'); // Manejo de error básico
        console.error('Error al eliminar solicitud:', err.response?.data || err.message);
         // Mostrar mensaje de error al usuario
      } finally {
         setLoading(false);
      }
    }
  };

    // --- Manejo de Acciones de Flujo de Trabajo ---
    // Estas acciones (Aprobar, Rechazar) probablemente llaman a endpoints API específicos
    // o usan la ruta PUT /ausencias/:id con un body que cambia el estado y quizás 'aprobado_por'
    // Necesitas implementar estas funciones en api.jsx y los endpoints en backend.

    const handleApprove = async (id) => {
        if (window.confirm(`¿Estás seguro de aprobar la solicitud de ausencia con ID ${id}?`)) {
            try {
                setLoading(true);
                 // Ejemplo: Llamada a una función API específica
                // await api.approveAusencia(id); // <-- Necesitas crear esta función en api.jsx
                 // O si tu PUT permite cambio de estado + usuario
                 // await api.update('AUSENCIAS', id, { estado: 'Aprobada', aprobado_por: 'UsuarioActual' });
                console.log(`Acción: Aprobar Solicitud Ausencia ${id}`);
                fetchAusencias(); // Recargar para reflejar el cambio de estado
            } catch (err) {
                setError('Error al aprobar la solicitud.');
                console.error('Error al aprobar solicitud:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }
    };

     const handleReject = async (id) => {
         if (window.confirm(`¿Estás seguro de rechazar la solicitud de ausencia con ID ${id}?`)) {
            try {
                setLoading(true);
                 // Ejemplo: Llamada a una función API específica
                // await api.rejectAusencia(id); // <-- Necesitas crear esta función en api.jsx
                 // O si tu PUT permite cambio de estado + usuario
                 // await api.update('AUSENCIAS', id, { estado: 'Rechazada', aprobado_por: 'UsuarioActual' });
                 console.log(`Acción: Rechazar Solicitud Ausencia ${id}`);
                fetchAusencias(); // Recargar
            } catch (err) {
                setError('Error al rechazar la solicitud.');
                console.error('Error al rechazar solicitud:', err.response?.data || err.message);
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
      <h2>Gestión de Ausencias y Permisos</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nueva Solicitud
      </Button>

      {/* Tabla para mostrar las solicitudes */}
      <Table data={ausencias} columns={columns} />

      {/* Modal para crear o editar solicitud */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAusencia ? 'Editar Solicitud de Ausencia/Permiso' : 'Crear Solicitud de Ausencia/Permiso'}
      >
        <AusenciaForm
          initialData={editingAusencia} // Pasa los datos para edición
          onSubmit={handleSubmit} // Pasa la función de envío
        />
      </Modal>
    </div>
  );
}

export default AusenciasPage;