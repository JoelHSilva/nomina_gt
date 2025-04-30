// src/pages/PrestamosPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import PrestamoForm from '../components/Forms/PrestamoForm.jsx'; // Importa el formulario de préstamo
import PagosPrestamoList from '../components/Prestamos/PagosPrestamoList.jsx'; // Importa la lista de pagos

function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Modal para crear/editar
  const [editingPrestamo, setEditingPrestamo] = useState(null);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false); // Modal para ver pagos
  const [viewingLoanId, setViewingLoanId] = useState(null); // ID del préstamo cuyos pagos estamos viendo


  // Columnas para la tabla de Préstamos
  const columns = [
    { key: 'id_prestamo', title: 'ID' },
    // { key: 'id_empleado', title: 'ID Empleado' }, // Mostrar nombre empleado si unes
    { key: 'empleado_nombre_completo', title: 'Empleado' }, // Asumiendo que backend une y devuelve nombre
    { key: 'monto_total', title: 'Monto Total', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'saldo_pendiente', title: 'Saldo Pendiente', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'cuota_mensual', title: 'Cuota Mensual', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'cantidad_cuotas', title: 'Total Cuotas' },
    { key: 'cuotas_pagadas', title: 'Cuotas Pagadas' },
    { key: 'fecha_inicio', title: 'Fecha Inicio', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'fecha_fin_estimada', title: 'Fecha Fin Est.', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'estado', title: 'Estado' },
    // { key: 'motivo', title: 'Motivo' }, // Opcional mostrar
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( // item es el objeto completo del préstamo
        <>
          <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px', marginBottom: '5px' }}>Editar</Button>
          <Button onClick={() => handleDelete(item.id_prestamo)} className="app-button-danger" style={{ marginRight: '5px', marginBottom: '5px' }}>Eliminar</Button>
           {/* Botones de acciones específicas */}
           {item.estado === 'En Curso' && item.saldo_pendiente > 0 && (
               <Button onClick={() => handleRegisterPayment(item.id_prestamo)} className="app-button-success" style={{ marginRight: '5px', marginBottom: '5px' }}>Reg. Pago</Button>
           )}
           {/* Mostrar botón Ver Pagos si hay cuotas pagadas o saldo_pendiente < monto_total (indicando que hubo pagos) */}
            {(item.cuotas_pagadas > 0 || parseFloat(item.saldo_pendiente) < parseFloat(item.monto_total)) && (
               <Button onClick={() => handleViewPayments(item.id_prestamo)} className="app-button-info" style={{ marginBottom: '5px' }}>Ver Pagos</Button>
            )}
        </>
      ),
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchPrestamos();
  }, []); // Se ejecuta solo una vez al montar

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
       // Asegúrate de que tu backend une los datos del empleado para mostrar el nombre
      const data = await api.getAll('PRESTAMOS'); // Usar la clave string
      setPrestamos(data);
    } catch (err) {
      setError('Error al cargar los préstamos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario de Préstamo ---
  const openFormModal = () => setIsFormModalOpen(true);
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingPrestamo(null); // Limpiar el préstamo de edición al cerrar
  };

  const handleCreate = () => {
    setEditingPrestamo(null); // Asegurarse de que no estamos editando
    openFormModal();
  };

  const handleEdit = (prestamo) => {
    setEditingPrestamo(prestamo); // Cargar datos en el formulario
    openFormModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingPrestamo) {
        // Actualizar préstamo existente
        await api.update('PRESTAMOS', editingPrestamo.id_prestamo, formData); // Usar la clave string
        console.log('Préstamo actualizado:', formData);
      } else {
        // Crear nuevo préstamo
         // Al crear, saldo_pendiente y cuotas_pagadas se inicializan en backend
         // formData aquí puede no incluirlos o tener valores iniciales
        await api.create('PRESTAMOS', formData); // Usar la clave string
        console.log('Préstamo creado:', formData);
      }
      closeFormModal(); // Cerrar modal después de guardar
      fetchPrestamos(); // Recargar la lista de préstamos
    } catch (err) {
      setError('Error al guardar el préstamo.'); // Manejo de error básico
      console.error('Error al guardar préstamo:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar el préstamo con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('PRESTAMOS', id); // Usar la clave string
        console.log('Préstamo eliminado:', id);
        fetchPrestamos(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el préstamo.'); // Manejo de error básico
        console.error('Error al eliminar préstamo:', err.response?.data || err.message);
         // Mostrar mensaje de error al usuario
      } finally {
         setLoading(false);
      }
    }
  };

   // --- Manejo de Registro de Pago (Acción Específica) ---
   const handleRegisterPayment = async (loanId) => {
       // Idealmente, esto abriría un modal con un formulario para ingresar monto, fecha, tipo, etc.
       // Para simplicidad, usaremos un prompt básico.

       const paymentAmount = prompt("Ingrese el monto del pago:");
       if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
           alert("Monto inválido.");
           return;
       }

       // También idealmente, deberías seleccionar tipo de pago (Nómina/Manual)
       // Para simplicidad, asumimos tipo 'Manual' o tu API lo gestiona
       const paymentData = {
           monto_pagado: parseFloat(paymentAmount),
           fecha_pago: new Date().toISOString().split('T')[0], // Fecha actual en YYYY-MM-DD
           tipo_pago: 'Manual', // O pides al usuario
           observaciones: 'Pago manual registrado desde frontend', // O pides al usuario
            // id_detalle_nomina sería null para pagos manuales
       };

       try {
           setLoading(true);
           // Llama a la función específica de la API para procesar el pago
           // Necesitas tener una función processLoanPayment en api.jsx usando el endpoint PRESTAMO_PROCESS_PAYMENT
           const result = await api.processLoanPayment(loanId, paymentData); // <-- Usa tu función real
           console.log('Pago de préstamo registrado:', result);
           fetchPrestamos(); // Recargar la lista para actualizar saldo/cuotas pagadas
           alert('Pago registrado exitosamente.');
       } catch (err) {
           setError('Error al registrar el pago del préstamo.');
           console.error('Error al registrar pago:', err.response?.data || err.message);
           alert('Error al registrar el pago: ' + (err.response?.data?.error || err.message));
       } finally {
           setLoading(false);
       }
   };

   // --- Manejo de Visualización de Pagos (Modal) ---
   const handleViewPayments = (loanId) => {
       setViewingLoanId(loanId); // Establece el ID del préstamo para el que ver pagos
       setIsPaymentsModalOpen(true); // Abre el modal de pagos
   };

   const closePaymentsModal = () => {
       setIsPaymentsModalOpen(false);
       setViewingLoanId(null); // Limpiar el ID al cerrar
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
      <h2>Gestión de Préstamos</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Registrar Nuevo Préstamo
      </Button>

      {/* Tabla para mostrar los préstamos */}
      <Table data={prestamos} columns={columns} />

      {/* Modal para crear o editar préstamo */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingPrestamo ? 'Editar Préstamo' : 'Registrar Nuevo Préstamo'}
      >
        <PrestamoForm
          initialData={editingPrestamo} // Pasa los datos para edición
          onSubmit={handleSubmit} // Pasa la función de envío
        />
      </Modal>

       {/* Modal para ver pagos del préstamo */}
        <Modal
           isOpen={isPaymentsModalOpen}
           onClose={closePaymentsModal}
           title={`Pagos del Préstamo #${viewingLoanId}`}
        >
            {/* Renderiza la lista de pagos dentro del modal, pasándole el ID del préstamo */}
           {viewingLoanId && <PagosPrestamoList prestamoId={viewingLoanId} />}
           {!viewingLoanId && <p>Seleccione un préstamo para ver sus pagos.</p>}
        </Modal>
    </div>
  );
}

export default PrestamosPage;