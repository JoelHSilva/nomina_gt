// src/pages/ConceptosPagoPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx'; // Asegúrate de la extensión .jsx
import { ENDPOINTS } from '../api/endpoints.jsx'; // Asegúrate de la extensión .jsx
import Table from '../components/Common/Table.jsx'; // Asegúrate de la extensión .jsx
import Button from '../components/Common/Button.jsx'; // Asegúrate de la extensión .jsx
import Modal from '../components/Common/Modal.jsx'; // Asegúrate de la extensión .jsx
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx'; // Asegúrate de la extensión .jsx
import ConceptoPagoForm from '../components/Forms/ConceptoPagoForm.jsx'; // Importa el formulario específico

function ConceptosPagoPage() {
  const [conceptos, setConceptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConcepto, setEditingConcepto] = useState(null); // Concepto seleccionado para editar

  // Columnas para la tabla de Conceptos de Pago
  const columns = [
    { key: 'id_concepto', title: 'ID' },
    { key: 'codigo', title: 'Código' },
    { key: 'nombre', title: 'Nombre' },
    { key: 'tipo', title: 'Tipo' },
    { key: 'es_fijo', title: 'Fijo?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'porcentaje', title: 'Porcentaje (%)', render: (value) => value !== null ? parseFloat(value).toFixed(2) : 'N/A' },
    { key: 'monto_fijo', title: 'Monto Fijo (Q)', render: (value) => value !== null ? `Q ${parseFloat(value).toFixed(2)}` : 'N/A' },
    { key: 'afecta_igss', title: 'Afecta IGSS?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'afecta_isr', title: 'Afecta ISR?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'es_viatico', title: 'Es Viático?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'obligatorio', title: 'Obligatorio?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    // { key: 'descripcion', title: 'Descripción' }, // Opcional mostrar en tabla
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( // item es el objeto completo del concepto
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px' }}>Editar</Button>
          <Button onClick={() => handleDelete(item.id_concepto)} className="app-button-danger">Eliminar</Button>
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchConceptos();
  }, []); // Se ejecuta solo una vez al montar

  const fetchConceptos = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('CONCEPTOS_PAGO'); // Usar la clave string
      setConceptos(data);
    } catch (err) {
      setError('Error al cargar los conceptos de pago.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingConcepto(null); // Limpiar el concepto de edición al cerrar
  };

  const handleCreate = () => {
    setEditingConcepto(null); // Asegurarse de que no estamos editando
    openModal();
  };

  const handleEdit = (concepto) => {
    setEditingConcepto(concepto); // Cargar datos en el formulario
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingConcepto) {
        // Actualizar concepto existente
        await api.update('CONCEPTOS_PAGO', editingConcepto.id_concepto, formData); // Usar la clave string
        console.log('Concepto de pago actualizado:', formData);
      } else {
        // Crear nuevo concepto
        await api.create('CONCEPTOS_PAGO', formData); // Usar la clave string
        console.log('Concepto de pago creado:', formData);
      }
      closeModal(); // Cerrar modal después de guardar
      fetchConceptos(); // Recargar la lista de conceptos
    } catch (err) {
      setError('Error al guardar el concepto de pago.'); // Manejo de error básico
      console.error('Error al guardar concepto:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el concepto de pago con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('CONCEPTOS_PAGO', id); // Usar la clave string
        console.log('Concepto de pago eliminado:', id);
        fetchConceptos(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el concepto de pago.'); // Manejo de error básico
        console.error('Error al eliminar concepto:', err.response?.data || err.message);
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
      <h2>Gestión de Conceptos de Pago</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Crear Nuevo Concepto
      </Button>

      {/* Tabla para mostrar los conceptos */}
      <Table data={conceptos} columns={columns} />

      {/* Modal para crear o editar concepto */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingConcepto ? 'Editar Concepto de Pago' : 'Crear Concepto de Pago'}
      >
        <ConceptoPagoForm
          initialData={editingConcepto} // Pasa los datos para edición
          onSubmit={handleSubmit} // Pasa la función de envío
        />
      </Modal>
    </div>
  );
}

export default ConceptosPagoPage;