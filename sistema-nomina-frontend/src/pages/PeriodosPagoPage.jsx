// src/pages/PeriodosPagoPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import PeriodoPagoForm from '../components/Forms/PeriodoPagoForm.jsx';
import Input from '../components/Common/Input.jsx';

function PeriodosPagoPage() {
  const [periodosPago, setPeriodosPago] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriodoPago, setEditingPeriodoPago] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const columns = useMemo(() => [
    // CORREGIDO: Usar el nombre correcto del ID: id_periodo
    { key: 'id_periodo', title: 'ID', render: (value) => value || 'N/A' }, // Mostrar N/A si el valor es nulo/undefined
    { key: 'nombre', title: 'Nombre' },
    // Añadir columnas para Tipo y Estado si quieres mostrarlos en la tabla
     { key: 'tipo', title: 'Tipo' },
     { key: 'estado', title: 'Estado' },
    // Columna para Fechas (formateadas)
    { key: 'fecha_inicio', title: 'Fecha Inicio', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'fecha_fin', title: 'Fecha Fin', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'fecha_pago', title: 'Fecha Pago', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    // Columna para mostrar el estado Activo (Sí/No)
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    // Columna para mostrar la fecha de creación
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    {
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => {
          const isInactive = !item.activo;

          return (
            <>
              <Button
                  onClick={() => handleEdit(item)}
                  className="app-button"
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                   // Opcional: Deshabilitar edición si está inactivo
                   // disabled={isInactive}
              >
                  Editar
              </Button>

              <Button
                  // CORREGIDO: Usar el nombre correcto del ID: item.id_periodo
                  onClick={() => handleToggleActivo(item.id_periodo)}
                  className={item.activo ? "app-button-warning" : "app-button-success"}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                  disabled={item.activo ? isInactive : !isInactive}
              >
                  {item.activo ? 'Desactivar' : 'Activar'}
              </Button>
            </>
          );
      }
    },
  ], [periodosPago]);

  // --- Carga de datos ---
  useEffect(() => {
    fetchPeriodosPago();
  }, []);

  const fetchPeriodosPago = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('PERIODOS_PAGO');
      console.log("Datos de períodos de pago recibidos:", data);
      // CORREGIDO: Filtrar elementos nulos/indefinidos Y asegurar que tengan un id_periodo válido
      const cleanedData = data.filter(periodo => periodo != null && periodo.id_periodo != null); // CORREGIDO: Usar id_periodo
      setPeriodosPago(cleanedData);
    } catch (err) {
      setError('Error al cargar los períodos de pago.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Filtrado ---
  const filteredPeriodosPago = useMemo(() => {
    if (searchTerm.trim() === '') {
      return periodosPago;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return periodosPago.filter(periodo => {
        if (!periodo) return false;

      // Añadir campos tipo y estado si quieres buscarlos
      const searchableFields = ['nombre', 'tipo', 'estado'];

      for (const key of searchableFields) {
          const value = periodo[key];
           if (value && typeof value === 'string') {
               if (value.toLowerCase().includes(lowerCaseSearchTerm)) {
                 return true;
               }
           }
      }
      // Opcional: buscar en representaciones string de fechas si es útil
       // const fechaInicioStr = periodo.fecha_inicio ? new Date(periodo.fecha_inicio).toLocaleDateString() : '';
       // if (fechaInicioStr.toLowerCase().includes(lowerCaseSearchTerm)) return true;
       // etc.


      return false;
    });
  }, [periodosPago, searchTerm]);


  // --- Manejo de Modal y Formulario ---
  const openModal = () => {
      setIsModalOpen(true);
      console.log("Modal abierto.");
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPeriodoPago(null);
    console.log("Modal cerrado.");
  };

  const handleCreate = () => {
    setEditingPeriodoPago(null); // Modo creación
    openModal();
    console.log("handleCreate llamado. editingPeriodoPago es null.");
  };

  const handleEdit = (periodo) => { // Recibe el objeto período
    setEditingPeriodoPago(periodo); // Establece el período a editar
    console.log("handleEdit llamado. editingPeriodoPago:", periodo); // Log para ver los datos pasados a edición
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      // CORREGIDO: Usar el nombre correcto del ID: editingPeriodoPago.id_periodo
      if (editingPeriodoPago && editingPeriodoPago.id_periodo != null) {
        console.log("Intentando actualizar período:", editingPeriodoPago.id_periodo, formData);
        // CORREGIDO: Usar el nombre correcto del ID en la llamada a api.update
        await api.update('PERIODOS_PAGO', editingPeriodoPago.id_periodo, formData);
        console.log('Período actualizado:', formData);
      } else {
        console.log("Intentando crear nuevo período:", formData);
        await api.create('PERIODOS_PAGO', formData);
        console.log('Período creado:', formData);
      }
      closeModal();
      fetchPeriodosPago();
    } catch (err) {
      setError('Error al guardar el período de pago.');
      const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
      console.error('Error al guardar período de pago:', backendErrorMessage || err.message);
       alert(`Error al guardar el período de pago: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
    } finally {
       setLoading(false);
    }
  };

   // --- Manejo de Activar/Desactivar Período (Borrado Lógico) ---
   const handleToggleActivo = async (id) => {
        // CORREGIDO: Usar el nombre correcto del ID: id_periodo
        const periodoToToggle = periodosPago.find(per => per.id_periodo === id); // CORREGIDO: Usar id_periodo
        if (!periodoToToggle) {
            console.warn(`Período de pago con ID ${id} no encontrado en la lista local.`);
            return;
        }

        const action = periodoToToggle.activo ? 'desactivar' : 'activar';
        const confirmMessage = periodoToToggle.activo
            ? `¿Estás seguro de desactivar el período de pago "${periodoToToggle.nombre}"? Esto lo marcará como inactivo lógicamente.`
            : `¿Estás seguro de activar el período de pago "${periodoToToggle.nombre}"?`;

        if (window.confirm(confirmMessage)) {
            try {
                setLoading(true);
                 const updatePayload = { activo: !periodoToToggle.activo };

                console.log(`Cambiando estado activo a ${!periodoToToggle.activo} para período ${id}:`, updatePayload);
                await api.update('PERIODOS_PAGO', id, updatePayload); // ID ya es correcto

                console.log(`Período ${action}do:`, id);
                fetchPeriodosPago();
            } catch (err) {
                setError(`Error al ${action} el período de pago.`);
                const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
                console.error(`Error al ${action} período:`, backendErrorMessage || err.message);
                alert(`Error al ${action} el período: ` + (backendErrorMessage || 'Ocurrió un error desconocido.'));
            } finally {
                setLoading(false);
            }
        }
   };


  // --- Renderizado del Componente ---
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h2>Gestión de Períodos de Pago</h2>

       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
           <Button onClick={handleCreate} className="app-button-primary">
               Crear Nuevo Período de Pago
           </Button>
           <div className="app-input-container" style={{ marginBottom: '0', width: '300px' }}>
               <Input
                   id="search"
                   type="text"
                   placeholder="Buscar períodos..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   label=""
               />
           </div>
       </div>


      <Table data={filteredPeriodosPago} columns={columns} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPeriodoPago ? 'Editar Período de Pago' : 'Crear Período de Pago'}
      >
        <PeriodoPagoForm
          initialData={editingPeriodoPago} // Pasar el objeto de edición o null
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

export default PeriodosPagoPage;