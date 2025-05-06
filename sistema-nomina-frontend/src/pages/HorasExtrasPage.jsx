import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
// Si no usas ENDPOINTS, puedes quitar esta importación
// import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import HorasExtrasForm from '../components/Forms/HorasExtrasForm.jsx';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px' }}>
          <h3>Algo salió mal</h3>
          <p>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}>Recargar página</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function HorasExtrasPage() {
  const [horasExtras, setHorasExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoraExtra, setEditingHoraExtra] = useState(null); // Registro seleccionado para editar

  // Columnas para la tabla de Horas Extras - Sin multiplicador
  const columns = [
    { key: 'id_hora_extra', title: 'ID' }, 
    // --- Columna de Empleado ---
    {
      key: 'empleado', // <-- La clave es 'empleado'
      title: 'Empleado',
      render: (empleado, item) => empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Empleado no disponible'
    },
    // --- Fin Columna Empleado ---
    { key: 'fecha', title: 'Fecha', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'horas', title: 'Cantidad Horas' }, 
    // REMOVIDO: { key: 'multiplicador', title: 'Multiplicador' }, 
    { key: 'motivo', title: 'Motivo' }, 
    { key: 'estado', title: 'Estado' }, 
    { key: 'aprobado_por', title: 'Aprobado Por' }, 
    { key: 'id_detalle_nomina', title: 'Procesado en Nómina ID', render: (value) => value || 'No' },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => {
        // Determinar si el registro fue procesado en nómina
        const isProcessed = !!item.id_detalle_nomina;
        // Determinar si el registro ya está inactivo
        const isInactivo = !item.activo;

        return ( 
            <>
              {/* Deshabilitar Editar si ya fue procesado */}
              <Button 
                  onClick={() => handleEdit(item)} 
                  className="app-button" 
                  style={{ marginRight: '5px', marginBottom: '5px' }} 
                  disabled={isProcessed}
              >
                  Editar
              </Button>
              {/* Botón Eliminar (Borrado Lógico) - Deshabilitado si ya está procesado o ya está inactivo */}
              <Button 
                  onClick={() => handleDelete(item.id_hora_extra)} 
                  className="app-button-danger" 
                  style={{ marginBottom: '5px' }} 
                  disabled={isProcessed || isInactivo} 
              >
                  {isInactivo ? 'Inactivo' : 'Desactivar'} 
              </Button> 
            </>
        );
      }, 
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchHorasExtras();
  }, []);

  const fetchHorasExtras = async () => {
    try {
      setLoading(true);
      setError(null);
       // Asumimos que el backend ya incluye el empleado
       // Asegúrate de que tu controlador getAllHorasExtras tiene include: [{ model: Empleado, as: 'empleado' }]
      const data = await api.getAll('HORAS_EXTRAS'); 
      setHorasExtras(data);
    } catch (err) {
      setError('Error al cargar los registros de horas extras.');
      console.error(err);
      setHorasExtras([]); 
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHoraExtra(null); 
     fetchHorasExtras(); 
  };

  const handleCreate = () => {
    setEditingHoraExtra(null); 
    openModal();
  };

  const handleEdit = (horaExtra) => {
       // No permitir editar si ya fue procesado en nómina
       if (!!horaExtra.id_detalle_nomina) {
            alert('Este registro de horas extras ya fue procesado en nómina y no puede ser modificado.');
            return;
       }
    setEditingHoraExtra(horaExtra); 
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingHoraExtra) {
        await api.update('HORAS_EXTRAS', editingHoraExtra.id_hora_extra, formData); 
        console.log('Registro de horas extras actualizado:', formData);
      } else {
        await api.create('HORAS_EXTRAS', formData); 
        console.log('Registro de horas extras creado:', formData);
      }
      closeModal(); 
    } catch (err) {
      setError('Error al guardar el registro de horas extras.'); 
      console.error('Error al guardar horas extras:', err.response?.data || err.message);
        alert('Error al guardar el registro: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación (Borrado Lógico) ---
  const handleDelete = async (id) => {
       // Buscar el registro para verificar si no está procesado o ya inactivo
       const registroToDeactivate = horasExtras.find(h => h.id_hora_extra === id); 
        if (registroToDeactivate && !!registroToDeactivate.id_detalle_nomina) {
            alert('Este registro de horas extras ya fue procesado en nómina y no puede ser desactivado.');
            return;
        }
        if (registroToDeactivate && !registroToDeactivate.activo) {
             alert('Este registro de horas extras ya está inactivo.');
             return;
        }

    // --- Cambiar a mensaje de desactivación ---
    if (window.confirm(`¿Estás seguro de desactivar el registro de horas extras con ID ${id}? (Se marcará como inactivo)`)) {
      try {
        setLoading(true);
        // --- Llamar a update con activo: false ---
         await api.update('HORAS_EXTRAS', id, { activo: false }); 
        console.log('Registro de horas extras desactivado:', id);
        fetchHorasExtras(); // Recargar la lista (incluirá el registro ahora inactivo)
      } catch (err) {
        setError('Error al desactivar el registro de horas extras.');
        console.error('Error al desactivar horas extras:', err.response?.data || err.message);
        alert('Error al desactivar el registro: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
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
      <h2>Gestión de Horas Extras</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Registrar Horas Extra
      </Button>

      {/* Tabla para mostrar los registros */}
      <Table data={horasExtras} columns={columns} />

      {/* Modal para crear o editar registro */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingHoraExtra?.id_hora_extra ? 'Editar Horas Extra' : 'Registrar Horas Extra'}
      >
        <HorasExtrasForm
          initialData={editingHoraExtra} 
          onSubmit={handleSubmit} 
        />
      </Modal>
    </div>
  );
}

export default function HorasExtrasPageWithBoundary() {
  return (
    <ErrorBoundary>
      <HorasExtrasPage />
    </ErrorBoundary>
  );
}