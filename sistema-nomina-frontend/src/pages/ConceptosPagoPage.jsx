import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import ConceptoPagoForm from '../components/Forms/ConceptoPagoForm.jsx';

function ConceptosPagoPage() {
  const [conceptos, setConceptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConcepto, setEditingConcepto] = useState(null);

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
    { 
      key: 'activo', 
      title: 'Estado', 
      render: (value) => (
        <span style={{ color: value ? 'green' : 'red' }}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ) 
    },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { 
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => (
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px' }}>
            Editar
          </Button>
          <Button 
            onClick={() => handleToggleStatus(item.id_concepto, item.activo)}
            className={item.activo ? "app-button-danger" : "app-button-success"}
          >
            {item.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchConceptos();
  }, []);

  const fetchConceptos = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('CONCEPTOS_PAGO');
      setConceptos(data);
    } catch (err) {
      setError('Error al cargar los conceptos de pago.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingConcepto(null);
  };

  const handleCreate = () => {
    setEditingConcepto(null);
    openModal();
  };

  const handleEdit = (concepto) => {
    setEditingConcepto(concepto);
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingConcepto?.id_concepto) {
        await api.update('CONCEPTOS_PAGO', editingConcepto.id_concepto, formData);
      } else {
        await api.create('CONCEPTOS_PAGO', formData);
      }
      closeModal();
      await fetchConceptos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el concepto de pago.');
      console.error('Error al guardar concepto:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    
    if (window.confirm(`¿Estás seguro de ${action} el concepto con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.update('CONCEPTOS_PAGO', id, { activo: !currentStatus });
        await fetchConceptos();
      } catch (err) {
        setError(`Error al ${action} el concepto: ${err.response?.data?.message || err.message}`);
        console.error(`Error al ${action} concepto:`, err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="main-content">
      <h2>Gestión de Conceptos de Pago</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button onClick={handleCreate} className="app-button-primary">
          Crear Nuevo Concepto
        </Button>
        <div>
          <Button 
            onClick={() => fetchConceptos()} 
            className="app-button-secondary"
            style={{ marginRight: '10px' }}
          >
            Recargar
          </Button>
        </div>
      </div>

      <Table 
        data={conceptos} 
        columns={columns} 
        emptyMessage="No hay conceptos de pago registrados"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingConcepto?.id_concepto ? `Editar Concepto #${editingConcepto.id_concepto}` : 'Nuevo Concepto de Pago'}
      >
        <ConceptoPagoForm
          initialData={editingConcepto}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

export default ConceptosPagoPage;