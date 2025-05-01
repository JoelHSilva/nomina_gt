import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import PrestamoForm from '../components/Forms/PrestamoForm.jsx';
import PagosPrestamoList from '../components/Prestamos/PagosPrestamoList.jsx';

function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPrestamo, setEditingPrestamo] = useState(null);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [viewingLoanId, setViewingLoanId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  const columns = [
    { key: 'id_prestamo', title: 'ID' },
    { key: 'empleado_nombre_completo', title: 'Empleado' },
    { key: 'monto_total', title: 'Monto Total', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'saldo_pendiente', title: 'Saldo Pendiente', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'cuota_mensual', title: 'Cuota Mensual', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'cantidad_cuotas', title: 'Total Cuotas' },
    { key: 'cuotas_pagadas', title: 'Cuotas Pagadas' },
    { key: 'fecha_inicio', title: 'Fecha Inicio', render: (value) => formatDate(value) },
    { key: 'fecha_fin_estimada', title: 'Fecha Fin Est.', render: (value) => formatDate(value) },
    { key: 'estado', title: 'Estado' },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    { 
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => (
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px', marginBottom: '5px' }}>Editar</Button>
          <Button onClick={() => handleDelete(item.id_prestamo)} className="app-button-danger" style={{ marginRight: '5px', marginBottom: '5px' }}>Eliminar</Button>
          {item.estado === 'En Curso' && item.saldo_pendiente > 0 && (
            <Button onClick={() => handleRegisterPayment(item.id_prestamo, item.cuota_mensual)} className="app-button-success" style={{ marginRight: '5px', marginBottom: '5px' }}>Reg. Pago</Button>
          )}
          {(item.cuotas_pagadas > 0 || parseFloat(item.saldo_pendiente) < parseFloat(item.monto_total)) && (
            <Button onClick={() => handleViewPayments(item.id_prestamo)} className="app-button-info" style={{ marginBottom: '5px' }}>Ver Pagos</Button>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchPrestamos();
  }, []);

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('PRESTAMOS');
      const prestamosConNombre = data.map(prestamo => ({
        ...prestamo,
        empleado_nombre_completo: prestamo.empleado?.nombre_completo || `${prestamo.empleado?.nombre} ${prestamo.empleado?.apellido}` || 'N/A'
      }));
      setPrestamos(prestamosConNombre);
    } catch (err) {
      setError('Error al cargar los préstamos: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching prestamos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPrestamo(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (prestamo) => {
    setEditingPrestamo({
      id_prestamo: prestamo.id_prestamo,
      id_empleado: prestamo.id_empleado.toString(),
      monto_total: prestamo.monto_total,
      cantidad_cuotas: prestamo.cantidad_cuotas,
      fecha_inicio: prestamo.fecha_inicio.split('T')[0],
      motivo: prestamo.motivo || '',
      estado: prestamo.estado,
      saldo_pendiente: prestamo.saldo_pendiente,
      cuota_mensual: prestamo.cuota_mensual,
      cuotas_pagadas: prestamo.cuotas_pagadas
    });
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingPrestamo(null);
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        id_empleado: parseInt(formData.id_empleado),
        monto_total: parseFloat(formData.monto_total),
        cantidad_cuotas: parseInt(formData.cantidad_cuotas),
        fecha_fin_estimada: formData.fecha_fin_estimada || null,
        motivo: formData.motivo || null,
        estado: formData.estado
      };

      if (editingPrestamo) {
        await api.update('PRESTAMOS', editingPrestamo.id_prestamo, dataToSend);
      } else {
        await api.create('PRESTAMOS', dataToSend);
      }
      
      closeFormModal();
      await fetchPrestamos();
    } catch (err) {
      setError('Error al guardar: ' + (err.response?.data?.message || err.message));
      console.error('Error saving prestamo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`¿Eliminar préstamo ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('PRESTAMOS', id);
        await fetchPrestamos();
      } catch (err) {
        setError('Error al eliminar: ' + (err.response?.data?.message || err.message));
        console.error('Error deleting prestamo:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegisterPayment = async (loanId, cuotaMensual) => {
    try {
      setLoading(true);
      
      // Obtener el préstamo para validar el saldo pendiente
      const prestamo = await api.getById('PRESTAMOS', loanId);
      
      // Validar si el saldo pendiente es menor que la cuota
      const montoAPagar = Math.min(parseFloat(cuotaMensual), parseFloat(prestamo.saldo_pendiente));
      
      // Mostrar confirmación con el monto fijo
      const confirmacion = window.confirm(
        `Se registrará un pago de Q${montoAPagar.toFixed(2)} (Cuota mensual). ¿Desea continuar?`
      );

      if (!confirmacion) {
        setLoading(false);
        return;
      }

      await api.processLoanPayment(loanId, {
        monto_pagado: montoAPagar,
        tipo_pago: 'Manual',
        fecha_pago: new Date().toISOString().split('T')[0],
        observaciones: 'Pago de cuota mensual registrado desde el sistema'
      });

      await fetchPrestamos();
      alert(`Pago de Q${montoAPagar.toFixed(2)} registrado exitosamente`);
    } catch (err) {
      setError('Error en pago: ' + (err.response?.data?.message || err.message));
      console.error('Error processing payment:', err);
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayments = (loanId) => {
    setViewingLoanId(loanId);
    setIsPaymentsModalOpen(true);
  };

  const closePaymentsModal = () => {
    setIsPaymentsModalOpen(false);
    setViewingLoanId(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="prestamos-container">
      <h2>Gestión de Préstamos</h2>
      
      <div className="action-buttons">
        <Button 
          onClick={handleCreate} 
          className="app-button-primary" 
          style={{ marginBottom: '20px' }}
        >
          Registrar Nuevo Préstamo
        </Button>
      </div>

      <Table 
        data={prestamos} 
        columns={columns} 
        emptyMessage="No hay préstamos registrados"
      />

      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingPrestamo ? 'Editar Préstamo' : 'Nuevo Préstamo'}
        size="lg"
      >
        {isFormModalOpen && (
          <PrestamoForm
            key={editingPrestamo ? `edit-${editingPrestamo.id_prestamo}` : 'create'}
            initialData={editingPrestamo || {}}
            onSubmit={handleSubmit}
            onCancel={closeFormModal}
          />
        )}
      </Modal>

      <Modal
        isOpen={isPaymentsModalOpen}
        onClose={closePaymentsModal}
        title={`Pagos del Préstamo #${viewingLoanId}`}
        size="xl"
      >
        {viewingLoanId && (
          <PagosPrestamoList 
            prestamoId={viewingLoanId} 
            onClose={closePaymentsModal}
          />
        )}
      </Modal>
    </div>
  );
}

export default PrestamosPage;