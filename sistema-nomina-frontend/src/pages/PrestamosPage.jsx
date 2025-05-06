// src/pages/PrestamosPage.jsx
import React, { useState, useEffect, useMemo } from 'react'; // Importar useMemo
import api from '../api/api.jsx'; // Asegúrate de que la ruta sea correcta

import Table from '../components/Common/Table.jsx'; // Asegúrate de que la ruta sea correcta
import Button from '../components/Common/Button.jsx'; // Asegúrate de que la ruta sea correcta
import Modal from '../components/Common/Modal.jsx'; // Asegúrate de que la ruta sea correcta
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx'; // Asegúrate de que la ruta sea correcta
import PrestamoForm from '../components/Forms/PrestamoForm.jsx'; // Asegúrate de que la ruta sea correcta
import PagosPrestamoList from '../components/Prestamos/PagosPrestamoList.jsx'; // Asegúrate de que la ruta sea correcta
// --- Import necesario para los inputs de filtro ---
import Input from '../components/Common/Input.jsx'; // Asegúrate de que la ruta a tu componente Input es correcta
// --- Fin Import necesario ---


function PrestamosPage() {
  // Estado para almacenar TODOS los préstamos sin filtrar
  const [prestamos, setPrestamos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
  const [editingPrestamo, setEditingPrestamo] = useState(null);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false); 
  const [viewingLoanId, setViewingLoanId] = useState(null); 

  // --- Estado para los valores de los filtros ---
  const [filters, setFilters] = useState({
    empleadoNombre: '',
    estado: '',
    activo: '', // Usaremos 'true', 'false' o '' (todos)
  });
  // --- Fin Estado para los filtros ---


  // Columnas para la tabla de Préstamos
  const columns = [
    { key: 'id_prestamo', title: 'ID' },
    { 
      key: 'empleado', 
      title: 'Empleado', 
      render: (empleado) => empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Empleado no disponible' 
    }, 
    { key: 'monto_total', title: 'Monto Total', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'saldo_pendiente', title: 'Saldo Pendiente', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'cuota_mensual', title: 'Cuota Mensual', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'cantidad_cuotas', title: 'Total Cuotas' },
    { key: 'cuotas_pagadas', title: 'Cuotas Pagadas' },
    { key: 'fecha_inicio', title: 'Fecha Inicio', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'fecha_fin_estimada', title: 'Fecha Fin Est.', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'estado', title: 'Estado' },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') }, 
    { // Columna de acciones - MODIFICADA para deshabilitar Editar/Eliminar si inactivo
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => ( 
        <>
            {/* Botón Editar - Deshabilitado si el préstamo no está activo */}
          <Button 
                onClick={() => handleEdit(item)} 
                className="app-button" 
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={!item.activo} 
            >
                Editar
            </Button>
            {/* Botón Eliminar (Borrado Lógico) - Deshabilitado si ya está inactivo */}
          <Button 
                onClick={() => handleDelete(item.id_prestamo)} 
                className="app-button-danger" 
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={!item.activo} 
            >
                Eliminar 
            </Button>
             {/* Botón Registrar Pago - visible solo si En Curso, Saldo > 0 Y está activo */}
             {item.activo && item.estado === 'En Curso' && item.saldo_pendiente > 0 && (
                <Button onClick={() => handleRegisterPayment(item.id_prestamo)} className="app-button-success" style={{ marginRight: '5px', marginBottom: '5px' }}>Reg. Pago</Button>
             )}
             {/* Botón Ver Pagos - visible si hubo pagos (independientemente del estado activo) */}
             {(item.cuotas_pagadas > 0 || parseFloat(item.saldo_pendiente) < parseFloat(item.monto_total)) && (
                <Button onClick={() => handleViewPayments(item.id_prestamo)} className="app-button-info" style={{ marginBottom: '5px' }}>Ver Pagos</Button>
              )}
          </>
        ),
      },
  ];

  // --- Carga de TODOS los datos (sin filtros en la llamada API) ---
  // Renombramos a fetchAllPrestamos para clarificar que trae todo
  const fetchAllPrestamos = async () => {
    try {
      setLoading(true);
      setError(null); 

       // Llama a api.getAll SIN pasar filtros en los parámetros
        const data = await api.getAll('PRESTAMOS'); 
        // Guarda la lista COMPLETA en el estado `prestamos`
        setPrestamos(data); 
      } catch (err) {
        setError('Error al cargar los préstamos.');
        console.error(err);
        setPrestamos([]); // Asegurarse de que sea un array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

  // Efecto para cargar los datos al montar (y solo al montar)
  useEffect(() => {
    fetchAllPrestamos();
    // Este efecto solo se ejecuta al montar
  }, []); 

  // --- Lógica de Filtrado en Frontend (usando useMemo) ---
  // useMemo recalcula filteredPrestamos solo cuando cambian `prestamos` (los datos completos) o `filters` (los valores de filtro)
  const filteredPrestamos = useMemo(() => {
    if (!prestamos || prestamos.length === 0) {
      return []; // Si no hay datos cargados, la lista filtrada está vacía
    }

    // Aplicar los filtros a la lista completa de préstamos
    return prestamos.filter(prestamo => {
      let matches = true;

      // Filtro por Nombre de Empleado (parcial e insensible a mayúsculas/minúsculas)
      if (filters.empleadoNombre) {
        const nombreCompleto = prestamo.empleado ? 
          `${prestamo.empleado.nombre} ${prestamo.empleado.apellido}`.toLowerCase() : '';
        const filterText = filters.empleadoNombre.toLowerCase();
        matches = nombreCompleto.includes(filterText);
      }

      if (!matches) return false;

      // Filtro por Estado
      if (filters.estado && filters.estado !== '') {
        matches = prestamo.estado === filters.estado;
      }

      if (!matches) return false;

      // Filtro por Estado Activo/Inactivo ('true', 'false', o '')
      if (filters.activo !== '' && filters.activo !== undefined && filters.activo !== null) {
        const filterActivoBoolean = filters.activo === 'true';
        matches = prestamo.activo === filterActivoBoolean;
      }

      return matches;
    });
  }, [prestamos, filters]); // Dependencias: Re-ejecutar cuando prestamos o filters cambian
  // --- Fin Lógica de Filtrado en Frontend ---


  // --- Manejador para cambios en los inputs de filtro ---
  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [id]: value
    }));
    // useMemo se encargará de actualizar la lista filtrada automáticamente
  };


  // --- Manejo de Modal y Formulario de Préstamo ---
  // Estas funciones controlan la apertura y cierre del modal del formulario (crear/editar)
  const openFormModal = () => setIsFormModalOpen(true);
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingPrestamo(null); 
    // Después de guardar (crear/editar), recargar la lista COMPLETA
    // y useMemo actualizará la lista filtrada.
    fetchAllPrestamos(); 
  };

  const handleCreate = () => {
    setEditingPrestamo(null);
    openFormModal();
  };

  // Modificado para evitar editar préstamos inactivos
  const handleEdit = (prestamo) => {
    if (prestamo.activo) {
        setEditingPrestamo(prestamo); 
        openFormModal();
    } else {
        alert('No se puede editar un préstamo inactivo.');
    }
  };

  // --- Definición de la función handleSubmit ---
  // Esta función maneja el envío del formulario de creación/edición
  const handleSubmit = async (formData) => {
    // ... (El contenido de handleSubmit es el mismo que antes) ...
    try {
      setLoading(true);
      if (editingPrestamo) {
        await api.update('PRESTAMOS', editingPrestamo.id_prestamo, formData); 
        console.log('Préstamo actualizado:', formData);
      } else {
        await api.create('PRESTAMOS', formData); 
        console.log('Préstamo creado:', formData);
      }
      closeFormModal(); // Cerrar modal después de guardar
      // Recargar la lista para reflejar el cambio (llama a la versión que carga TODO)
      fetchAllPrestamos(); 
    } catch (err) {
      setError('Error al guardar el préstamo.'); 
      console.error('Error al guardar préstamo:', err.response?.data || err.message);
       const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al guardar el préstamo.';
        alert('Error al guardar el préstamo: ' + (Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage));

    } finally {
       setLoading(false);
    }
  };
  // --- Fin Definición de la función handleSubmit ---


  // --- Manejo de Borrado Lógico (Eliminar) ---
  // Esta función maneja la desactivación lógica de un préstamo
  const handleDelete = async (id) => {
    // ... (El contenido de handleDelete es el mismo que antes) ...
    if (window.confirm(`¿Estás seguro de desactivar (borrado lógico) el préstamo con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.update('PRESTAMOS', id, { activo: false }); 

        console.log('Préstamo desactivado (borrado lógico):', id);
        // Recargar la lista para que se actualice la columna 'Activo?' y los botones
        fetchAllPrestamos(); 
      } catch (err) {
        setError('Error al desactivar el préstamo.'); 
        console.error('Error al desactivar préstamo:', err.response?.data || err.message);
        const errorMessage = err.response?.data?.error || err.message || 'Error desconocido al desactivar el préstamo.';
        alert('Error al desactivar el préstamo: ' + (Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage));

      } finally {
         setLoading(false);
      }
    }
  };

   // --- INICIO: Definición de handleViewPayments y closePaymentsModal ---
    // Estas funciones controlan la apertura y cierre del modal de pagos
   const handleViewPayments = (loanId) => {
       setViewingLoanId(loanId); 
       setIsPaymentsModalOpen(true);
   };

   const closePaymentsModal = () => {
       setIsPaymentsModalOpen(false);
       setViewingLoanId(null);
   };
   // --- FIN: Definición de handleViewPayments y closePaymentsModal ---


   // --- Manejo de Registro de Pago (modificado para recargar lista completa) ---
    // Esta función maneja el registro manual de un pago
   const handleRegisterPayment = async (loanId) => {
    // ... (El contenido de handleRegisterPayment es el mismo que antes) ...
       const paymentAmount = prompt("Ingrese el monto del pago:");
       if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
           alert("Monto inválido.");
           return;
       }

       const paymentData = {
           monto_pagado: parseFloat(paymentAmount),
           fecha_pago: new Date().toISOString().split('T')[0], 
           tipo_pago: 'Manual', 
           observaciones: 'Pago manual registrado desde frontend', 
       };

       try {
           setLoading(true);
           const result = await api.processLoanPayment(loanId, paymentData); 
           console.log('Pago de préstamo registrado:', result);
           // Recargar la lista COMPLETA para que se actualice el saldo/cuotas
           fetchAllPrestamos(); 
           alert('Pago registrado exitosamente.');
       } catch (err) {
           setError('Error al registrar el pago del préstamo.');
           console.error('Error al registrar pago:', err.response?.data || err.message);
           alert('Error al registrar el pago: ' + (err.response?.data?.error || err.message));
       } finally {
           setLoading(false);
       }
   };



  // --- Renderizado ---
  // Ajustar el spinner y el mensaje de error para no ocultar la página completa
  // si ya hay datos cargados o si el error es solo para la carga inicial.
  // `filteredPrestamos` se usa para determinar si mostrar la tabla o el mensaje de "no resultados"
  if (loading && prestamos.length === 0 && !error) { 
    return <LoadingSpinner />;
  }

  if (error && prestamos.length === 0) { 
    return <div style={{ color: 'red' }}>{error}</div>;
  }


  return (
    // La clase 'main-content' ya provee padding gracias a App.jsx
    // Puedes añadir estilos adicionales si es necesario
    <div>
      <h2>Gestión de Préstamos</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Registrar Nuevo Préstamo
      </Button>

      {/* Sección de Filtros */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
         <h4>Filtros</h4>
         <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}> 
            {/* Filtro por Nombre de Empleado */}
            {/* Asegúrate de que tu componente Input funciona correctamente y que la ruta de importación es correcta */}
            <Input 
                label="Empleado:" 
                id="empleadoNombre" 
                value={filters.empleadoNombre} 
                onChange={handleFilterChange} 
                placeholder="Buscar por nombre/apellido"
                style={{ flex: '1 1 200px' }} 
            />

            {/* Filtro por Estado */}
            <div className="app-input-container" style={{ flex: '1 1 150px' }}> 
                <label htmlFor="estado" className="app-input-label">Estado:</label>
                <select
                    id="estado"
                    value={filters.estado}
                    onChange={handleFilterChange}
                    className="app-input-field"
                >
                    <option value="">-- Todos los Estados --</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="En Curso">En Curso</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
            </div>

            {/* Filtro por Estado Activo/Inactivo */}
            <div className="app-input-container" style={{ flex: '1 1 100px' }}> 
                <label htmlFor="activo" className="app-input-label">Activo:</label>
                <select
                    id="activo"
                    value={filters.activo}
                    onChange={handleFilterChange}
                    className="app-input-field"
                >
                    <option value="">-- Todos --</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                </select>
            </div>
         </div>
      </div>

      {/* Tabla para mostrar los préstamos filtrados */}
      {/* Pasa la lista `filteredPrestamos` a la tabla */}
      {!loading && filteredPrestamos.length === 0 ? ( 
          <p>No se encontraron préstamos que coincidan con los filtros.</p>
      ) : (
         <Table data={filteredPrestamos} columns={columns} /> //{/* <-- Usa filteredPrestamos aquí */}
      )}
       {error && prestamos.length > 0 && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}


      {/* Modal para crear o editar préstamo */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={editingPrestamo ? 'Editar Préstamo' : 'Registrar Nuevo Préstamo'}
      >
        <PrestamoForm initialData={editingPrestamo} onSubmit={handleSubmit} /> 
      </Modal>

       {/* Modal para ver pagos del préstamo */}
        <Modal
           isOpen={isPaymentsModalOpen}
           onClose={closePaymentsModal} //{/* <-- closePaymentsModal se usa aquí */}
           title={`Pagos del Préstamo #${viewingLoanId}`}
        >
           {viewingLoanId && <PagosPrestamoList prestamoId={viewingLoanId} />}
           {!viewingLoanId && <p>Seleccione un préstamo para ver sus pagos.</p>}
        </Modal>
    </div>
  );
}

export default PrestamosPage;