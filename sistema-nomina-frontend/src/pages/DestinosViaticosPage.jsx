// src/pages/DestinosViaticosPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import DestinoViaticoForm from '../components/Forms/DestinoViaticoForm.jsx'; // Importa el formulario específico

function DestinosViaticosPage() {
  const [destinosViaticos, setDestinosViaticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestinoViatico, setEditingDestinoViatico] = useState(null); // Destino seleccionado para editar

  // Columnas para la tabla de Destinos de Viáticos
  const columns = [
    { key: 'id_destino_viatico', title: 'ID' },
    { key: 'codigo', title: 'Código' },
    { key: 'nombre', title: 'Nombre' },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( // item es el objeto completo del destino
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px' }}>Editar</Button>
          <Button onClick={() => handleDelete(item.id_destino_viatico)} className="app-button-danger">Eliminar</Button>
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchDestinosViaticos();
  }, []); // Se ejecuta solo una vez al montar

  const fetchDestinosViaticos = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('DESTINOS_VIATICOS'); // Usar la clave string
      setDestinosViaticos(data);
    } catch (err) {
      setError('Error al cargar los destinos de viáticos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDestinoViatico(null); // Limpiar el destino de edición al cerrar
  };

  const handleCreate = () => {
    setEditingDestinoViatico(null); // Asegurarse de que no estamos editando
    openModal();
  };

  const handleEdit = (destinoViatico) => {
    setEditingDestinoViatico(destinoViatico); // Cargar datos en el formulario
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingDestinoViatico) {
        // Actualizar destino existente
        await api.update('DESTINOS_VIATICOS', editingDestinoViatico.id_destino_viatico, formData); // Usar la clave string
        console.log('Destino de viático actualizado:', formData);
      } else {
        // Crear nuevo destino
        await api.create('DESTINOS_VIATICOS', formData); // Usar la clave string
        console.log('Destino de viático creado:', formData);
      }
      closeModal(); // Cerrar modal después de guardar
      fetchDestinosViaticos(); // Recargar la lista
    } catch (err) {
      setError('Error al guardar el destino de viático.'); // Manejo de error básico
      console.error('Error al guardar destino:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el destino de viático con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('DESTINOS_VIATICOS', id); // Usar la clave string
        console.log('Destino de viático eliminado:', id);
        fetchDestinosViaticos(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el destino de viático.'); // Manejo de error básico
        console.error('Error al eliminar destino:', err.response?.data || err.message);
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
      <h2>Gestión de Destinos de Viáticos</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nuevo Destino
      </Button>

      <Table data={destinosViaticos} columns={columns} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingDestinoViatico ? 'Editar Destino de Viático' : 'Crear Destino de Viático'}
      >
        <DestinoViaticoForm
          initialData={editingDestinoViatico}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

export default DestinosViaticosPage;