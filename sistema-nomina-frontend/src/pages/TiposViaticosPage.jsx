// src/pages/TiposViaticosPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import TipoViaticoForm from '../components/Forms/TipoViaticoForm.jsx'; // Importa el formulario específico

function TiposViaticosPage() {
  const [tiposViaticos, setTiposViaticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTipoViatico, setEditingTipoViatico] = useState(null); // Tipo seleccionado para editar

  // Columnas para la tabla de Tipos de Viáticos
  const columns = [
    { key: 'id_tipo_viatico', title: 'ID' },
    { key: 'nombre', title: 'Nombre' },
    { key: 'descripcion', title: 'Descripción' },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( // item es el objeto completo del tipo
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px' }}>Editar</Button>
          <Button onClick={() => handleDelete(item.id_tipo_viatico)} className="app-button-danger">Eliminar</Button>
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchTiposViaticos();
  }, []); // Se ejecuta solo una vez al montar

  const fetchTiposViaticos = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('TIPOS_VIATICOS'); // Usar la clave string
      setTiposViaticos(data);
    } catch (err) {
      setError('Error al cargar los tipos de viáticos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTipoViatico(null); // Limpiar el tipo de edición al cerrar
  };

  const handleCreate = () => {
    setEditingTipoViatico(null); // Asegurarse de que no estamos editando
    openModal();
  };

  const handleEdit = (tipoViatico) => {
    setEditingTipoViatico(tipoViatico); // Cargar datos en el formulario
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingTipoViatico) {
        // Actualizar tipo existente
        await api.update('TIPOS_VIATICOS', editingTipoViatico.id_tipo_viatico, formData); // Usar la clave string
        console.log('Tipo de viático actualizado:', formData);
      } else {
        // Crear nuevo tipo
        await api.create('TIPOS_VIATICOS', formData); // Usar la clave string
        console.log('Tipo de viático creado:', formData);
      }
      closeModal(); // Cerrar modal después de guardar
      fetchTiposViaticos(); // Recargar la lista
    } catch (err) {
      setError('Error al guardar el tipo de viático.'); // Manejo de error básico
      console.error('Error al guardar tipo:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el tipo de viático con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('TIPOS_VIATICOS', id); // Usar la clave string
        console.log('Tipo de viático eliminado:', id);
        fetchTiposViaticos(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el tipo de viático.'); // Manejo de error básico
        console.error('Error al eliminar tipo:', err.response?.data || err.message);
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
    <div>
      <h2>Gestión de Tipos de Viáticos</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nuevo Tipo
      </Button>

      <Table data={tiposViaticos} columns={columns} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTipoViatico ? 'Editar Tipo de Viático' : 'Crear Tipo de Viático'}
      >
        <TipoViaticoForm
          initialData={editingTipoViatico}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

export default TiposViaticosPage;