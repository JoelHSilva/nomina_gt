// src/pages/HorasExtrasPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import HorasExtrasForm from '../components/Forms/HorasExtrasForm.jsx';

function HorasExtrasPage() {
  const [horasExtras, setHorasExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoraExtra, setEditingHoraExtra] = useState(null); // Registro seleccionado para editar

  // Columnas para la tabla de Horas Extras - Ajustadas a la estructura real del backend
  const columns = [
    { key: 'id_hora_extra', title: 'ID' }, // <-- Usar id_hora_extra
    // { key: 'id_empleado', title: 'ID Empleado' },
    { key: 'empleado_nombre_completo', title: 'Empleado' }, // Asumiendo que backend une y devuelve nombre
    { key: 'fecha', title: 'Fecha', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'horas', title: 'Cantidad Horas' }, // <-- Usar 'horas'
    { key: 'multiplicador', title: 'Multiplicador' }, // Si tu backend devuelve este campo
    { key: 'motivo', title: 'Motivo' }, // <-- Añadir columna Motivo
    { key: 'estado', title: 'Estado' }, // <-- Usar 'estado'
    { key: 'aprobado_por', title: 'Aprobado Por' }, // Si tu backend devuelve este campo
    { key: 'id_detalle_nomina', title: 'Procesado en Nómina ID', render: (value) => value || 'No' },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => new Date(value).toLocaleDateString() },
    { // Columna de acciones
      key: 'actions',
      title: 'Acciones',
      // CORREGIDO: Añadir 'return' antes del JSX y cerrar llaves {} correctamente
      render: (value, item) => {
        // Determinar si el registro fue procesado en nómina
        const isProcessed = !!item.id_detalle_nomina;
        return ( // <-- AÑADIDO 'return' aquí
            <>
              {/* Deshabilitar Editar y Eliminar si ya fue procesado en nómina */}
              <Button onClick={() => handleEdit(item)} className="app-button" style={{ marginRight: '5px', marginBottom: '5px' }} disabled={isProcessed}>Editar</Button>
              <Button onClick={() => handleDelete(item.id_hora_extra)} className="app-button-danger" style={{ marginBottom: '5px' }} disabled={isProcessed}>Eliminar</Button> {/* <-- Usar id_hora_extra */}
               {/* Si necesitas botones de flujo de trabajo por estado, agrégalos aquí */}
               {/* Ejemplo: Botón Aprobar si estado es 'Solicitada' y no procesado */}
               {/* {item.estado === 'Solicitada' && !isProcessed && (
                   <Button onClick={() => handleApprove(item.id_hora_extra)} className="app-button-success">Aprobar</Button>
               )} */}
            </>
        );
      }, // <-- Fin de la función render
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchHorasExtras();
  }, []);

  const fetchHorasExtras = async () => {
    try {
      setLoading(true);
       // Asegúrate de que tu backend une los datos del empleado para mostrar el nombre
       // y devuelve los campos con los nombres correctos (id_hora_extra, horas, motivo, estado)
      const data = await api.getAll('HORAS_EXTRAS'); // Usar la clave string
      setHorasExtras(data);
    } catch (err) {
      setError('Error al cargar los registros de horas extras.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Manejo de Modal y Formulario ---
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHoraExtra(null); // Limpiar el registro de edición al cerrar
  };

  const handleCreate = () => {
    setEditingHoraExtra(null); // Asegurarse de que no estamos editando
    openModal();
  };

  const handleEdit = (horaExtra) => {
       // No permitir editar si ya fue procesado en nómina
       if (!!horaExtra.id_detalle_nomina) {
            alert('Este registro de horas extras ya fue procesado en nómina y no puede ser modificado.');
            return;
       }
    setEditingHoraExtra(horaExtra); // Cargar datos en el formulario
    openModal();
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      // Usar id_hora_extra para verificar si es edición
      if (editingHoraExtra && editingHoraExtra.id_hora_extra) {
        // Actualizar registro existente
        await api.update('HORAS_EXTRAS', editingHoraExtra.id_hora_extra, formData); // <-- Usar id_hora_extra
        console.log('Registro de horas extras actualizado:', formData);
      } else {
        // Crear nuevo registro
        await api.create('HORAS_EXTRAS', formData); // Usar la clave string
        console.log('Registro de horas extras creado:', formData);
      }
      closeModal(); // Cerrar modal después de guardar
      fetchHorasExtras(); // Recargar la lista de registros
    } catch (err) {
      setError('Error al guardar el registro de horas extras.'); // Manejo de error básico
      console.error('Error al guardar horas extras:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de Eliminación ---
  const handleDelete = async (id) => {
       // No permitir eliminar si ya fue procesado en nómina
       const registroToDelete = horasExtras.find(h => h.id_hora_extra === id); // <-- Usar id_hora_extra
        if (registroToDelete && !!registroToDelete.id_detalle_nomina) {
            alert('Este registro de horas extras ya fue procesado en nómina y no puede ser eliminado.');
            return;
        }


    if (window.confirm(`¿Estás seguro de eliminar el registro de horas extras con ID ${id}?`)) {
      try {
        setLoading(true);
        await api.remove('HORAS_EXTRAS', id); // Usar la clave string y el ID correcto
        console.log('Registro de horas extras eliminado:', id);
        fetchHorasExtras(); // Recargar la lista
      } catch (err) {
        setError('Error al eliminar el registro de horas extras.'); // Manejo de error básico
        console.error('Error al eliminar horas extras:', err.response?.data || err.message);
         // Mostrar mensaje de error al usuario
      } finally {
         setLoading(false);
      }
    }
  };

    // --- Manejo de Acción de Aprobación (Si se usa un endpoint específico) ---
    // Si tienes un endpoint como PUT /api/v1/horas-extras/:id/aprobar
    /*
    const handleApprove = async (id) => {
        // Buscar el registro para verificar si no está procesado
        const itemToApprove = horasExtras.find(h => h.id_hora_extra === id); // <-- Usar id_hora_extra
         if (itemToApprove && !!itemToApprove.id_detalle_nomina) {
             alert('Este registro ya fue procesado en nómina.');
             return;
         }
        if (window.confirm(`¿Estás seguro de aprobar este registro de horas extras con ID ${id}?`)) {
             try {
                 setLoading(true);
                 // Necesitas crear una función api.approveHoraExtra en api.jsx
                 // await api.approveHoraExtra(id); // <-- Ejemplo
                 console.log(`Acción: Aprobar Horas Extra ${id}`);
                 fetchHorasExtras(); // Recargar
             } catch (err) {
                 setError('Error al aprobar el registro.');
                 console.error('Error al aprobar horas extras:', err.response?.data || err.message);
             } finally {
                 setLoading(false);
             }
        }
    };
    */


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
      <h2>Gestión de Horas Extras</h2>

      <Button onClick={handleCreate} className="app-button-primary" style={{ marginBottom: '20px' }}>
          Registrar Horas Extra
      </Button>

      {/* Tabla para mostrar los registros */}
      <Table data={horasExtras} columns={columns} />

      {/* Modal para crear o editar registro */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        // Usar id_hora_extra para verificar modo edición
        title={editingHoraExtra && editingHoraExtra.id_hora_extra ? 'Editar Horas Extra' : 'Registrar Horas Extra'}
      >
        <HorasExtrasForm
          initialData={editingHoraExtra} // Pasa los datos para edición
          onSubmit={handleSubmit} // Pasa la función de envío
        />
      </Modal>
    </div>
  );
}

export default HorasExtrasPage;