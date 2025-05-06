// src/components/Forms/PrestamoForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx'; // Asegúrate de que la ruta sea correcta
import Button from '../Common/Button.jsx'; // Asegúrate de que la ruta sea correcta
import LoadingSpinner from '../Common/LoadingSpinner.jsx'; // Asegúrate de que la ruta sea correcta
import api from '../../api/api.jsx'; // Asegúrate de que la ruta sea correcta
// Ya no necesitas ENDPOINTS aquí, solo api
// import { ENDPOINTS } from '../../api/endpoints.jsx'; 

function PrestamoForm({ initialData, onSubmit }) {
  // Estado inicial del formulario
  const initialFormState = {
    id_empleado: '',
    monto_total: '',
    saldo_pendiente: '', // Se inicializa en backend para creación
    cuota_mensual: '',
    cantidad_cuotas: '',
    cuotas_pagadas: 0, // Se inicializa en backend para creación
    fecha_inicio: '',
    fecha_fin_estimada: '', // Se calcula en backend para creación
    motivo: '',
    estado: 'Aprobado'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [empleados, setEmpleados] = useState([]);
  const [loadingRelaciones, setLoadingRelaciones] = useState(true);
  const [errorRelaciones, setErrorRelaciones] = useState(null);

  // Determinar si estamos creando o editando
  const isEditing = !!initialData?.id_prestamo;

  // Cargar la lista de Empleados al montar el componente
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoadingRelaciones(true);
        const data = await api.getAll('EMPLEADOS');
        setEmpleados(data);
      } catch (err) {
        setErrorRelaciones('Error al cargar la lista de empleados.');
        console.error('Error fetching empleados:', err);
      } finally {
        setLoadingRelaciones(false);
      }
    };
    fetchEmpleados();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Actualiza el estado del formulario si cambia initialData (para modo edición)
  useEffect(() => {
    if (initialData?.id_prestamo) {
      setFormData({
        id_empleado: initialData.id_empleado?.toString() || '',
        monto_total: initialData.monto_total?.toString() || '',
        saldo_pendiente: initialData.saldo_pendiente?.toString() || '',
        cuota_mensual: initialData.cuota_mensual?.toString() || '',
        cantidad_cuotas: initialData.cantidad_cuotas?.toString() || '',
        cuotas_pagadas: initialData.cuotas_pagadas?.toString() || '0',
        fecha_inicio: initialData.fecha_inicio ? new Date(initialData.fecha_inicio).toISOString().split('T')[0] : '',
        fecha_fin_estimada: initialData.fecha_fin_estimada ? new Date(initialData.fecha_fin_estimada).toISOString().split('T')[0] : '',
        motivo: initialData.motivo || '',
        estado: initialData.estado || 'Aprobado'
      });
    } else {
      // Si no hay initialData (modo creación), resetear al estado inicial
      setFormData(initialFormState);
    }
  }, [initialData]); // Dependencia en initialData para re-render cuando cambia (ej: abres modal para crear vs. editar)

  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    // Convertir a número solo para campos numéricos si el valor no está vacío
    const numericFields = ['monto_total', 'cuota_mensual', 'cantidad_cuotas', 'saldo_pendiente', 'cuotas_pagadas'];
    const newValue = numericFields.includes(id) && value !== '' ? parseFloat(value) : value;
    
    setFormData({
      ...formData,
      [id]: newValue
    });
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construir el objeto base con los datos que siempre se envían
    // Los valores numéricos se convierten a float/int aquí antes de enviar
    let dataToSend = {
      id_empleado: formData.id_empleado ? parseInt(formData.id_empleado, 10) : null, // Manejar caso vacío si required falla
      monto_total: formData.monto_total !== '' ? parseFloat(formData.monto_total) : null,
      cuota_mensual: formData.cuota_mensual !== '' ? parseFloat(formData.cuota_mensual) : null,
      cantidad_cuotas: formData.cantidad_cuotas !== '' ? parseInt(formData.cantidad_cuotas, 10) : null,
      fecha_inicio: formData.fecha_inicio || null, // Enviar null si está vacío
      motivo: formData.motivo || null, // Enviar null si está vacío
      estado: formData.estado
    };

    // Validación básica del lado del cliente
    if (!dataToSend.id_empleado || dataToSend.monto_total <= 0 || dataToSend.cuota_mensual <= 0 || dataToSend.cantidad_cuotas <= 0 || !dataToSend.fecha_inicio) {
      alert('Por favor, complete todos los campos obligatorios y asegúrese de que los valores numéricos sean mayores a 0.');
      return;
    }

    // Si estamos EDITANDO, añadimos los campos que el frontend maneja en la edición
    if (isEditing) {
      dataToSend = {
        ...dataToSend, // Incluye los campos base
        // Convertir a float/int antes de enviar para edición
        saldo_pendiente: formData.saldo_pendiente !== '' ? parseFloat(formData.saldo_pendiente) : null, // O null si es editable y está vacío
        cuotas_pagadas: formData.cuotas_pagadas !== '' ? parseInt(formData.cuotas_pagadas, 10) : null, // O null si es editable y está vacío
        fecha_fin_estimada: formData.fecha_fin_estimada || null // Enviar null si está vacío en edición
      };
      // Aquí podrías añadir validaciones adicionales específicas para edición si las necesitas
       if (dataToSend.saldo_pendiente === null || dataToSend.cuotas_pagadas === null) {
          alert('Saldo Pendiente y Cuotas Pagadas son obligatorios en modo edición.');
          return;
       }
    }
    // En modo CREACIÓN, los campos saldo_pendiente, cuotas_pagadas y fecha_fin_estimada
    // NO se añaden a dataToSend, ya que el backend los inicializa/calcula.

    // Log para depuración: ver qué datos se enviarán
    console.log("Datos a enviar:", dataToSend);

    // Llamar a la función onSubmit proporcionada por el padre (PrestamosPage)
    onSubmit(dataToSend);
  };

  if (loadingRelaciones) {
    return <LoadingSpinner />;
  }

  if (errorRelaciones) {
    return <div style={{ color: 'red' }}>{errorRelaciones}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Editar' : 'Registrar Nuevo'} Préstamo</h3>

      {/* Selector de Empleado: Deshabilitado en edición */}
      <div className="app-input-container">
        <label htmlFor="id_empleado" className="app-input-label">Empleado:</label>
        <select
          id="id_empleado"
          value={formData.id_empleado}
          onChange={handleSelectChange}
          required
          className="app-input-field"
          disabled={isEditing} // Deshabilitado si estamos editando
        >
          <option value="">-- Seleccione un Empleado --</option>
          {empleados.map(empleado => (
            <option key={empleado.id_empleado} value={empleado.id_empleado}>
              {empleado.nombre} {empleado.apellido} ({empleado.codigo_empleado})
            </option>
          ))}
        </select>
      </div>

      {/* Campos principales visibles siempre y editables */}
      <Input label="Monto Total (Q):" id="monto_total" type="number" value={formData.monto_total} onChange={handleInputChange} required step="0.01" min="0.01" />
      <Input label="Cuota Mensual (Q):" id="cuota_mensual" type="number" value={formData.cuota_mensual} onChange={handleInputChange} required step="0.01" min="0.01" />
      <Input label="Cantidad de Cuotas:" id="cantidad_cuotas" type="number" value={formData.cantidad_cuotas} onChange={handleInputChange} required step="1" min="1" />
      <Input label="Fecha de Inicio:" id="fecha_inicio" type="date" value={formData.fecha_inicio} onChange={handleInputChange} required />
      <Input label="Motivo:" id="motivo" value={formData.motivo} onChange={handleInputChange} type="textarea" />

      {/* Campos Saldo Pendiente, Cuotas Pagadas y Fecha Fin Estimada: Visibles siempre, deshabilitados en creación */}
      {/* Saldo Pendiente */}
      <Input 
        label="Saldo Pendiente (Q):" 
        id="saldo_pendiente" 
        type="number" 
        value={formData.saldo_pendiente} 
        onChange={handleInputChange} 
        required={isEditing} // Requerido solo en edición
        disabled={!isEditing} // Deshabilitado si no estamos editando (modo creación)
        step="0.01" 
        min="0" 
      />

      {/* Cuotas Pagadas */}
      <Input 
        label="Cuotas Pagadas:" 
        id="cuotas_pagadas" 
        type="number" 
        value={formData.cuotas_pagadas} 
        onChange={handleInputChange} 
        required={isEditing} // Requerido solo en edición
        disabled={!isEditing} // Deshabilitado si no estamos editando (modo creación)
        step="1" 
        min="0" 
      />

      {/* Fecha Fin Estimada */}
      <Input 
        label="Fecha Fin Estimada:" 
        id="fecha_fin_estimada" 
        type="date" 
        value={formData.fecha_fin_estimada} 
        onChange={handleInputChange} 
        required={isEditing} // Requerido solo en edición
        disabled={!isEditing} // Deshabilitado si no estamos editando (modo creación)
      />


      {/* Selector de Estado: Deshabilitado si el estado es final */}
      <div className="app-input-container">
        <label htmlFor="estado" className="app-input-label">Estado:</label>
        <select
          id="estado"
          value={formData.estado}
          onChange={handleSelectChange}
          required
          className="app-input-field"
          disabled={isEditing && (formData.estado === 'Pagado' || formData.estado === 'Cancelado')} // Deshabilitado en edición si ya está en estado final
        >
          <option value="Aprobado">Aprobado</option>
          <option value="En Curso">En Curso</option>
          <option value="Pagado">Pagado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      <Button type="submit" className="app-button-primary" style={{marginTop: '15px'}}>
        {isEditing ? 'Actualizar' : 'Crear'} Préstamo
      </Button>
    </form>
  );
}

export default PrestamoForm;