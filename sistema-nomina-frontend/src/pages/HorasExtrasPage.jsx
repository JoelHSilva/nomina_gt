import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
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
  const [editingHoraExtra, setEditingHoraExtra] = useState(null);

  // Función para normalizar los datos de la API
  const normalizeHoraExtraData = (data) => {
    // Obtener nombre del empleado de diferentes fuentes
    let nombreEmpleado = [
      data.empleado_nombre_completo,
      data.empleado?.nombre_completo,
      data.empleado ? `${data.empleado.nombre || ''} ${data.empleado.apellido || ''}`.trim() : null
    ].find(name => name && name.trim() !== '');
    
    // Si no encontramos nombre, usar el ID como fallback
    if (!nombreEmpleado) {
      nombreEmpleado = `ID: ${data.id_empleado}`;
    }

    return {
      id_hora_extra: data.id_hora_extra,
      id_empleado: data.id_empleado,
      empleado_nombre_completo: nombreEmpleado,
      fecha: data.fecha,
      horas: data.horas || 0,
      multiplicador: data.multiplicador || 1.5,
      motivo: data.motivo || '',
      estado: data.estado || 'Pendiente',
      aprobado_por: data.aprobado_por || '',
      id_detalle_nomina: data.id_detalle_nomina || null,
      activo: data.activo !== false,
      fecha_creacion: data.fecha_creacion,
      // Mantenemos el objeto empleado completo si existe
      ...(data.empleado && { empleado: data.empleado })
    };
  };

  const columns = [
    { key: 'id_hora_extra', title: 'ID' },
    { key: 'empleado_nombre_completo', title: 'Empleado' },
    { 
      key: 'fecha', 
      title: 'Fecha', 
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' 
    },
    { key: 'horas', title: 'Cantidad Horas' },
    { key: 'multiplicador', title: 'Multiplicador' },
    { key: 'motivo', title: 'Motivo' },
    { key: 'estado', title: 'Estado' },
    { key: 'aprobado_por', title: 'Aprobado Por' },
    { 
      key: 'id_detalle_nomina', 
      title: 'Procesado en Nómina ID', 
      render: (value) => value || 'No' 
    },
    { 
      key: 'activo', 
      title: 'Activo?', 
      render: (value) => (value ? 'Sí' : 'No') 
    },
    { 
      key: 'fecha_creacion', 
      title: 'Fecha Creación', 
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' 
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => {
        const isProcessed = !!item.id_detalle_nomina;
        return (
          <>
            <Button 
              onClick={() => handleEdit(item)} 
              className="app-button" 
              style={{ marginRight: '5px', marginBottom: '5px' }} 
              disabled={isProcessed}
            >
              Editar
            </Button>
            <Button 
              onClick={() => handleDelete(item.id_hora_extra)} 
              className="app-button-danger" 
              style={{ marginBottom: '5px' }} 
              disabled={isProcessed}
            >
              Eliminar
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    fetchHorasExtras();
  }, []);

  const fetchHorasExtras = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('HORAS_EXTRAS');
      
      if (!Array.isArray(data)) {
        throw new Error('La respuesta de la API no es un array válido');
      }

      // Normalizar los datos antes de guardarlos en el estado
      const normalizedData = data.map(normalizeHoraExtraData);
      setHorasExtras(normalizedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching horas extras:', err);
      setError(`Error al cargar los datos: ${err.message}`);
      setHorasExtras([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHoraExtra(null);
  };

  const handleCreate = () => {
    setEditingHoraExtra(null);
    openModal();
  };

  const handleEdit = (horaExtra) => {
    if (!!horaExtra.id_detalle_nomina) {
      alert('Este registro ya fue procesado en nómina y no puede ser modificado.');
      return;
    }
    setEditingHoraExtra(normalizeHoraExtraData(horaExtra));
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingHoraExtra?.id_hora_extra) {
        await api.update('HORAS_EXTRAS', editingHoraExtra.id_hora_extra, formData);
      } else {
        await api.create('HORAS_EXTRAS', formData);
      }
      closeModal();
      await fetchHorasExtras();
    } catch (err) {
      console.error('Error saving data:', err);
      setError(`Error al guardar: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const registroToDelete = horasExtras.find(h => h.id_hora_extra === id);
    if (registroToDelete && !!registroToDelete.id_detalle_nomina) {
      alert('Este registro ya fue procesado en nómina y no puede ser eliminado.');
      return;
    }

    if (window.confirm(`¿Estás seguro de eliminar el registro con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('HORAS_EXTRAS', id);
        await fetchHorasExtras();
      } catch (err) {
        console.error('Error deleting record:', err);
        setError(`Error al eliminar: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2>Gestión de Horas Extras</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', border: '1px solid red' }}>
          {error}
          <button 
            onClick={() => setError(null)} 
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      <Button 
        onClick={handleCreate} 
        className="app-button-primary" 
        style={{ marginBottom: '20px' }}
      >
        Registrar Horas Extra
      </Button>

      <Table 
        data={horasExtras} 
        columns={columns} 
        emptyMessage="No hay registros de horas extras disponibles"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingHoraExtra ? 'Editar Horas Extra' : 'Registrar Horas Extra'}
      >
        <HorasExtrasForm
          initialData={editingHoraExtra || {}}
          onSubmit={handleSubmit}
          onCancel={closeModal}
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