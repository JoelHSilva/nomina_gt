// src/pages/TiposViaticosPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import TipoViaticoForm from '../components/Forms/TipoViaticoForm.jsx'; 

function TiposViaticosPage() {
  const [tiposViaticos, setTiposViaticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTipoViatico, setEditingTipoViatico] = useState(null); 

  // Columnas para la tabla de Tipos de Viáticos - AHORA CON LOS NUEVOS CAMPOS
  const columns = [
    { key: 'id_tipo_viatico', title: 'ID' },
    { key: 'codigo', title: 'Código' }, // <-- Nuevo campo
    { key: 'nombre', title: 'Nombre' },
    { key: 'descripcion', title: 'Descripción' },
    { key: 'monto_maximo', title: 'Monto Máximo', render: (value) => value != null ? `Q${parseFloat(value).toFixed(2)}` : 'N/A' }, // <-- Nuevo campo (formato moneda)
    { key: 'requiere_factura', title: 'Req. Factura?', render: (value) => (value ? 'Sí' : 'No') }, // <-- Nuevo campo (booleano)
    { key: 'afecta_isr', title: 'Afecta ISR?', render: (value) => (value ? 'Sí' : 'No') }, // <-- Nuevo campo (booleano)
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => { 
        const isInactivo = !item.activo; 
        return ( 
            <>
              <Button 
                  onClick={() => handleEdit(item)} 
                  className="app-button" 
                  style={{ marginRight: '5px' }}
                  disabled={isInactivo} 
              >
                  Editar
              </Button>
              <Button 
                  onClick={() => handleDelete(item.id_tipo_viatico)} 
                  className="app-button-danger"
                  disabled={isInactivo} 
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
    fetchTiposViaticos();
  }, []); 

  const fetchTiposViaticos = async () => {
    try {
      setLoading(true);
      setError(null);
      // Asegúrate de que tu backend devuelve TODOS los campos listados
      const data = await api.getAll('TIPOS_VIATICOS'); 
      setTiposViaticos(data);
    } catch (err) {
      setError('Error al cargar los tipos de viáticos.');
      console.error(err);
      setTiposViaticos([]); 
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTipoViatico(null); 
    fetchTiposViaticos();
  };

  const handleCreate = () => {
    setEditingTipoViatico(null); 
    openModal();
  };

  const handleEdit = (tipoViatico) => {
    if (!tipoViatico.activo) {
        alert('No se puede editar un tipo de viático inactivo.');
        return;
    }
    setEditingTipoViatico(tipoViatico); 
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingTipoViatico) {
        // Actualizar tipo existente
        await api.update('TIPOS_VIATICOS', editingTipoViatico.id_tipo_viatico, formData); 
        console.log('Tipo de viático actualizado:', formData);
      } else {
        // Crear nuevo tipo
        await api.create('TIPOS_VIATICOS', formData); 
        console.log('Tipo de viático creado:', formData);
      }
      closeModal(); 
    } catch (err) {
      setError('Error al guardar el tipo de viático.'); 
      console.error('Error al guardar tipo:', err.response?.data || err.message);
        alert('Error al guardar el registro: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación (Borrado Lógico) ---
  const handleDelete = async (id) => {
     const itemToDeactivate = tiposViaticos.find(t => t.id_tipo_viatico === id);
     if (itemToDeactivate && !itemToDeactivate.activo) {
         alert('Este tipo de viático ya está inactivo.');
         return;
     }

    if (window.confirm(`¿Estás seguro de desactivar el tipo de viático con ID ${id}? (Se marcará como inactivo)`)) {
      try {
        setLoading(true);
         await api.update('TIPOS_VIATICOS', id, { activo: false }); 
        console.log('Tipo de viático desactivado:', id);
        fetchTiposViaticos(); 
      } catch (err) {
        setError('Error al desactivar el tipo de viático.');
        console.error('Error al desactivar tipo:', err.response?.data || err.message);
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
    <div>
      <h2>Gestión de Tipos de Viáticos</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nuevo Tipo
      </Button>

      <Table data={tiposViaticos} columns={columns} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTipoViatico?.id_tipo_viatico ? 'Editar Tipo de Viático' : 'Crear Tipo de Viático'} 
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