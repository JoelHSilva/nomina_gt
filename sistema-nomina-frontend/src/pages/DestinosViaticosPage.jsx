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

  // Columnas para la tabla de Destinos de Viáticos - CORREGIDAS Y SIN CAMPO 'codigo'
  const columns = [
    // --- CORRECCIÓN CLAVE 5: Usar 'id_destino' como clave ---
    { key: 'id_destino', title: 'ID' }, 
    // --- FIN CORRECCIÓN CLAVE 5 ---
    // { key: 'codigo', title: 'Código' }, // Campo 'codigo' eliminado según solicitud
    { key: 'nombre', title: 'Nombre' },
    { key: 'descripcion', title: 'Descripción' }, 
    { key: 'es_internacional', title: 'Es Intl.?', render: (value) => (value ? 'Sí' : 'No') }, 
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
              {/* Botón Eliminar (Borrado Lógico) - Deshabilitado si ya está inactivo */}
              <Button 
                  // --- CORRECCIÓN CLAVE 6: Usar 'id_destino' para handleDelete ---
                  onClick={() => handleDelete(item.id_destino)} 
                  // --- FIN CORRECCIÓN CLAVE 6 ---
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
    fetchDestinosViaticos();
  }, []); 

  const fetchDestinosViaticos = async () => {
    try {
      setLoading(true);
      setError(null);
      // Asegúrate de que tu backend devuelve TODOS los campos listados, incluyendo 'id_destino'
      const data = await api.getAll('DESTINOS_VIATICOS'); 
      setDestinosViaticos(data);
    } catch (err) {
      setError('Error al cargar los destinos de viáticos.');
      console.error(err);
      setDestinosViaticos([]); 
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDestinoViatico(null); 
    fetchDestinosViaticos();
  };

  const handleCreate = () => {
    setEditingDestinoViatico(null); 
    openModal();
  };

  const handleEdit = (destinoViatico) => {
    if (!destinoViatico.activo) {
        alert('No se puede editar un destino de viático inactivo.');
        return;
    }
    setEditingDestinoViatico(destinoViatico); 
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      // --- CORRECCIÓN CLAVE 7: Usar 'id_destino' para update ---
      if (editingDestinoViatico?.id_destino) { // Usa ?. y el ID correcto
        // Actualizar destino existente
        await api.update('DESTINOS_VIATICOS', editingDestinoViatico.id_destino, formData); 
        console.log('Destino de viático actualizado:', formData);
      } else {
        // Crear nuevo destino
        await api.create('DESTINOS_VIATICOS', formData); 
        console.log('Destino de viático creado:', formData);
      }
      // --- FIN CORRECCIÓN CLAVE 7 ---
      closeModal(); 
    } catch (err) {
      setError('Error al guardar el destino de viático.'); 
      console.error('Error al guardar destino:', err.response?.data || err.message);
        alert('Error al guardar el registro: ' + (err.response?.data?.error || err.message || 'Error desconocido.'));
    } finally {
        setLoading(false);
    }
  };

  // --- Manejo de Eliminación (Borrado Lógico) ---
  const handleDelete = async (id) => {
      // Buscar el registro para verificar si ya está inactivo
      const itemToDeactivate = destinosViaticos.find(t => t.id_destino === id); // Usa 'id_destino' para encontrar el item
      if (itemToDeactivate && !itemToDeactivate.activo) {
          alert('Este tipo de viático ya está inactivo.');
          return;
      }

    if (window.confirm(`¿Estás seguro de desactivar el destino de viático con ID ${id}? (Se marcará como inactivo)`)) {
      try {
        setLoading(true);
        // --- MODIFICACIÓN CLAVE 8: Llamar a update con activo: false y usar 'id_destino' ---
        await api.update('DESTINOS_VIATICOS', id, { activo: false }); 
        console.log('Destino de viático desactivado:', id);
        fetchDestinosViaticos(); 
      } catch (err) {
        setError('Error al desactivar el destino de viático.');
        console.error('Error al desactivar destino:', err.response?.data || err.message);
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
      <h2>Gestión de Destinos de Viáticos</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nuevo Destino
      </Button>

      <Table data={destinosViaticos} columns={columns} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        // CORRECCIÓN CLAVE 9: Usar 'id_destino' con encadenamiento opcional en el título del modal
        title={editingDestinoViatico?.id_destino ? 'Editar Destino de Viático' : 'Crear Destino de Viático'} 
        // FIN CORRECCIÓN CLAVE 9
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