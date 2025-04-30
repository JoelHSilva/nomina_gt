// src/pages/EmpleadosPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import Modal from '../components/Common/Modal.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import EmpleadoForm from '../components/Forms/EmpleadoForm.jsx';
import Input from '../components/Common/Input.jsx';

function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const columns = [
    { key: 'id_empleado', title: 'ID' },
    { key: 'codigo_empleado', title: 'Código' },
    { key: 'nombre', title: 'Nombre' },
    { key: 'apellido', title: 'Apellido' },
    {
        key: 'nombre_completo',
        title: 'Nombre Completo',
        render: (value, item) => `${item.nombre || ''} ${item.apellido || ''}`
    },
    { key: 'dpi', title: 'DPI' },
    { key: 'nit', title: 'NIT' },
    { key: 'numero_igss', title: 'No. IGSS' },
    { key: 'fecha_nacimiento', title: 'Fecha Nac.', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'genero', title: 'Género' },
    { key: 'direccion', title: 'Dirección' },
    { key: 'telefono', title: 'Teléfono' },
    { key: 'correo_electronico', title: 'Correo Electrónico' },
    { key: 'fecha_contratacion', title: 'Fecha Contratación', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'fecha_fin_contrato', title: 'Fecha Fin Contrato', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    { key: 'tipo_contrato', title: 'Tipo Contrato' },
    { key: 'salario_actual', title: 'Salario Actual', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
    { key: 'cuenta_bancaria', title: 'Cuenta Bancaria' },
    { key: 'banco', title: 'Banco' },
    { key: 'estado', title: 'Estado' },
    { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
     {
        key: 'puesto_nombre',
        title: 'Puesto',
        render: (value, item) => item.puesto ? item.puesto.nombre : 'Sin Puesto'
    },
     {
        key: 'departamento_nombre',
        title: 'Departamento',
        render: (value, item) => {
            return item.puesto && item.puesto.departamento ? item.puesto.departamento.nombre : 'Sin Departamento';
        }
    },
    { key: 'fecha_creacion', title: 'Fecha Creación', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
    {
      key: 'actions',
      title: 'Acciones',
      render: (value, item) => {
          // Determinar si el empleado está inactivo lógicamente
          const isInactive = item.estado === 'Inactivo';

          return (
            <>
              {/* Botón Editar - Deshabilitado si está inactivo */}
              <Button
                  onClick={() => handleEdit(item)}
                  className="app-button"
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                  disabled={isInactive} // <-- Deshabilitar si está inactivo
              >
                  Editar
              </Button>

              {/* Botón Desactivar/Activar (toggle activo) - Deshabilitado si está inactivo */}
              <Button
                  onClick={() => handleToggleStatus(item.id_empleado)}
                  className={item.activo ? "app-button-warning" : "app-button-success"}
                  style={{ marginRight: '5px', marginBottom: '5px' }}
                  disabled={isInactive} // <-- Deshabilitar si está inactivo
              >
                  {item.activo ? 'Desactivar' : 'Activar'}
              </Button>

              {/* Botón "Marcar Inactivo" (borrado lógico) - Ya deshabilitado si estado es 'Inactivo' */}
              <Button
                  onClick={() => handleDelete(item.id_empleado)}
                  className="app-button-danger"
                  style={{ marginBottom: '5px' }}
                  disabled={isInactive} // <-- Deshabilitar si está inactivo
              >
                  {isInactive ? 'Ya Inactivo' : 'Marcar Inactivo'}
              </Button>
            </>
          );
      }
    },
  ];

  // --- Carga de datos ---
  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('EMPLEADOS');
      console.log("Datos de empleados recibidos:", data);
      // CORREGIDO: Filtrar elementos nulos o indefinidos de la lista recibida
      const cleanedData = data.filter(empleado => empleado != null);
      setEmpleados(cleanedData); // Usar los datos limpiados
    } catch (err) {
      setError('Error al cargar los empleados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica de Filtrado ---
  const filteredEmpleados = useMemo(() => {
    if (searchTerm.trim() === '') {
      return empleados;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return empleados.filter(empleado => {
        // Añadir comprobación defensiva aquí también, aunque ya filtramos al cargar
        if (!empleado) return false;

      for (const key in empleado) {
        if (Object.prototype.hasOwnProperty.call(empleado, key)) {
            const value = empleado[key];

             if (key === 'puesto' && value && value.nombre) {
                 if (value.nombre.toLowerCase().includes(lowerCaseSearchTerm)) {
                     return true;
                 }
             }
             if (key === 'departamento' && value && value.nombre) {
                  if (value.nombre.toLowerCase().includes(lowerCaseSearchTerm)) {
                     return true;
                 }
             }
              if (key === 'puesto' && value && value.departamento && value.departamento.nombre) {
                 if (value.departamento.nombre.toLowerCase().includes(lowerCaseSearchTerm)) {
                     return true;
                 }
             }

             if (typeof value !== 'object' || value === null) {
                const stringValue = String(value).toLowerCase();
                if (stringValue.includes(lowerCaseSearchTerm)) {
                  return true;
                }
             }
        }
      }
      return false;
    });
  }, [empleados, searchTerm]);


  // --- Manejo de Modal y Formulario ---
  const openModal = () => {
      setIsModalOpen(true);
      console.log("Modal abierto.");
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmpleado(null);
    console.log("Modal cerrado.");
  };

  const handleCreate = () => {
    setEditingEmpleado(null);
    openModal();
    console.log("handleCreate llamado. editingEmpleado es null.");
  };

  const handleEdit = (empleado) => {
    setEditingEmpleado(empleado);
    openModal();
    console.log("handleEdit llamado. editingEmpleado:", empleado);
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (editingEmpleado) {
        console.log("Intentando actualizar empleado:", editingEmpleado.id_empleado, formData);
        await api.update('EMPLEADOS', editingEmpleado.id_empleado, formData); // Llamada a UPDATE
        console.log('Empleado actualizado:', formData);
      } else {
        console.log("Intentando crear nuevo empleado:", formData);
        await api.create('EMPLEADOS', formData); // Llamada a CREATE
        console.log('Empleado creado:', formData);
      }
      closeModal();
      fetchEmpleados(); // Recargar la lista
    } catch (err) {
      setError('Error al guardar el empleado.'); // Mensaje genérico para Create/Update
      console.error('Error al guardar empleado:', err.response?.data || err.message);
       // Mostrar mensaje de error al usuario
    } finally {
       setLoading(false);
    }
  };

  // --- Manejo de "Eliminar" (ahora Borrado Lógico) ---
  const handleDelete = async (id) => {
      const empleadoToDeactivate = empleados.find(emp => emp.id_empleado === id);
       if (!empleadoToDeactivate) return;

       // No permitir marcar como inactivo si ya está en ese estado
       if (empleadoToDeactivate.estado === 'Inactivo') {
           console.warn(`El empleado ${empleadoToDeactivate.nombre} ${empleadoToDeactivate.apellido} ya está marcado como Inactivo.`);
           return; // Salir si ya está inactivo
       }

    if (window.confirm(`¿Estás seguro de marcar al empleado ${empleadoToDeactivate.nombre} ${empleadoToDeactivate.apellido} como Inactivo? Esto realizará un borrado lógico.`)) {
      try {
        setLoading(true);
         // Llama a la función de actualización para cambiar el estado y la bandera activo
         // Asumimos que tu backend PUT/PATCH /api/v1/empleados/:id acepta actualizar estos campos
        const updatePayload = {
             // Solo enviamos los campos que queremos cambiar
             estado: 'Inactivo',
             activo: false // Generalmente, Inactivo implica no Activo
             // Si tu backend PUT requiere el objeto completo, necesitas obtener los datos primero y enviar el objeto completo modificado
        };

        console.log(`Marcando empleado ${id} como Inactivo:`, updatePayload);
        await api.update('EMPLEADOS', id, updatePayload); // <-- Usamos api.update
        console.log('Empleado marcado como Inactivo:', id);
        fetchEmpleados(); // Recargar la lista
      } catch (err) {
        setError('Error al marcar el empleado como inactivo.'); // Mensaje específico para esta acción
        const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
        console.error('Error al marcar empleado como inactivo:', backendErrorMessage || err.message);
         // Mostrar mensaje de error al usuario
         alert(`Error al marcar empleado como inactivo: ` + (backendErrorMessage || 'Ocurrió un error.'));
      } finally {
         setLoading(false);
      }
    }
  };

   // --- Manejo de Cambio de Bandera Activo (toggle) ---
   // Este botón simplemente invierte la bandera activo
   const handleToggleStatus = async (id) => {
        const empleadoToToggle = empleados.find(emp => emp.id_empleado === id);
        if (!empleadoToToggle) return;

        const action = empleadoToToggle.activo ? 'desactivar' : 'activar';
        const confirmMessage = empleadoToToggle.activo
            ? `¿Estás seguro de desactivar la bandera "Activo" para el empleado ${empleadoToToggle.nombre} ${empleadoToToggle.apellido}?`
            : `¿Estás seguro de activar la bandera "Activo" para el empleado ${empleadoToToggle.nombre} ${empleadoToToggle.apellido}?`;

        if (window.confirm(confirmMessage)) {
            try {
                setLoading(true);
                 // Llama a la función API específica para cambiar solo la bandera activo
                 // Asume que tu backend tiene un endpoint PATCH o PUT que acepta { activo: boolean }
                 // Si usas PATCH, un payload { activo: !empleadoToToggle.activo } es ideal
                 // Si usas PUT, necesitas enviar el objeto completo con activo modificado
               const updatePayload = { activo: !empleadoToToggle.activo }; // Solo el campo activo

                console.log(`Cambiando bandera activo a ${!empleadoToToggle.activo} para empleado ${id}:`, updatePayload);
                // Asumimos que tu backend PUT/PATCH /api/v1/empleados/:id acepta actualizar 'activo'
                // Si tu backend tiene un endpoint específico para toggle: await api.toggleEmpleadoStatus(id);
                // Si usa PUT/PATCH genérico:
                await api.update('EMPLEADOS', id, updatePayload); // <-- Usamos api.update para el toggle

                console.log(`Empleado bandera activo ${action}da:`, id);
                fetchEmpleados(); // Recargar la lista
            } catch (err) {
                setError(`Error al ${action} la bandera activo del empleado.`);
                const backendErrorMessage = err.response?.data?.error || err.response?.data?.message;
                console.error(`Error al ${action} bandera activo:`, backendErrorMessage || err.message);
                alert(`Error al ${action} la bandera activo: ` + (backendErrorMessage || 'Ocurrió un error.'));
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
      <h2>Gestión de Empleados</h2>

       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
           <Button onClick={handleCreate} className="app-button-primary">
               Crear Nuevo Empleado
           </Button>
           <div className="app-input-container" style={{ marginBottom: '0', width: '300px' }}>
               <Input
                   id="search"
                   type="text"
                   placeholder="Buscar empleados..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   label=""
               />
           </div>
       </div>


      <Table data={filteredEmpleados} columns={columns} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingEmpleado ? 'Editar Empleado' : 'Crear Empleado'}
      >
        {/* Pasa initialData como null para indicar modo creación */}
        <EmpleadoForm
          initialData={editingEmpleado} // Será null en modo creación
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}

export default EmpleadosPage;