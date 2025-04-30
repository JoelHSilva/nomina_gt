// src/pages/ConfiguracionFiscalPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx'; // Asegúrate de la extensión .jsx
import { ENDPOINTS } from '../api/endpoints.jsx'; // Asegúrate de la extensión .jsx
import Table from '../components/Common/Table.jsx'; // Asegúrate de la extensión .jsx
import Button from '../components/Common/Button.jsx'; // Asegúrate de la extensión .jsx
import Modal from '../components/Common/Modal.jsx'; // Asegúrate de la extensión .jsx
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx'; // Asegúrate de la extensión .jsx
import ConfiguracionFiscalForm from '../components/Forms/ConfiguracionFiscalForm.jsx'; // Importa el formulario específico

function ConfiguracionFiscalPage() {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfiguracion, setEditingConfiguracion] = useState(null); // Configuración seleccionada para editar

  // Columnas para la tabla de Configuración Fiscal
  const columns = [
    { key: 'id_configuracion', title: 'ID' },
    { key: 'anio', title: 'Año' },
    { key: 'porcentaje_igss_empleado', title: '% IGSS Empleado', render: (value) => `${parseFloat(value).toFixed(2)}%` },
    { key: 'porcentaje_igss_patronal', title: '% IGSS Patronal', render: (value) => `${parseFloat(value).toFixed(2)}%` },
    { key: 'rango_isr_tramo1', title: 'ISR Tramo 1 Rango (Q)', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'porcentaje_isr_tramo1', title: 'ISR Tramo 1 %', render: (value) => `${parseFloat(value).toFixed(2)}%` },
    { key: 'rango_isr_tramo2', title: 'ISR Tramo 2 Rango (Q)', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'porcentaje_isr_tramo2', title: 'ISR Tramo 2 %', render: (value) => `${parseFloat(value).toFixed(2)}%` },
    { key: 'monto_bonificacion_incentivo', title: 'Bonif. Incentivo (Q)', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'activo', title: 'Activa?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_actualizacion', title: 'Última Actualización', render: (value) => new Date(value).toLocaleDateString() }, // O toLocaleString() si incluye hora
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( // item es el objeto completo de configuración
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px' }}>Editar</Button>
          <Button onClick={() => handleDelete(item.id_configuracion)} className="app-button-danger">Eliminar</Button>
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchConfiguraciones();
  }, []); // Se ejecuta solo una vez al montar

  const fetchConfiguraciones = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('CONFIGURACION_FISCAL'); // Usar la clave string
      setConfiguraciones(data);
    } catch (err) {
      setError('Error al cargar las configuraciones fiscales.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingConfiguracion(null); // Limpiar la configuración de edición al cerrar
  };

  const handleCreate = () => {
    setEditingConfiguracion(null); // Asegurarse de que no estamos editando
    openModal();
  };

  const handleEdit = (configuracion) => {
    setEditingConfiguracion(configuracion); // Cargar datos en el formulario
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingConfiguracion) {
        // Actualizar configuración existente
        await api.update('CONFIGURACION_FISCAL', editingConfiguracion.id_configuracion, formData); // Usar la clave string
        console.log('Configuración fiscal actualizada:', formData);
      } else {
        // Crear nueva configuración
        await api.create('CONFIGURACION_FISCAL', formData); // Usar la clave string
        console.log('Configuración fiscal creada:', formData);
      }
      closeModal(); // Cerrar modal después de guardar
      fetchConfiguraciones(); // Recargar la lista
    } catch (err) {
      setError('Error al guardar la configuración fiscal.'); // Manejo de error básico
      console.error('Error al guardar configuración:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar la configuración fiscal con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('CONFIGURACION_FISCAL', id); // Usar la clave string
        console.log('Configuración fiscal eliminada:', id);
        fetchConfiguraciones(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar la configuración fiscal.'); // Manejo de error básico
        console.error('Error al eliminar configuración:', err.response?.data || err.message);
         // Mostrar mensaje de error al usuario
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
      <h2>Gestión de Configuración Fiscal</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nueva Configuración
      </Button>

      {/* Tabla para mostrar las configuraciones */}
      <Table data={configuraciones} columns={columns} />

      {/* Modal para crear o editar configuración */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingConfiguracion ? 'Editar Configuración Fiscal' : 'Crear Configuración Fiscal'}
      >
        <ConfiguracionFiscalForm
          initialData={editingConfiguracion} // Pasa los datos para edición
          onSubmit={handleSubmit} // Pasa la función de envío
        />
      </Modal>
    </div>
  );
}

export default ConfiguracionFiscalPage;