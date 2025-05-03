import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';

function HorasExtrasForm({ initialData = {}, onSubmit }) {
  // Estado inicial con multiplicador fijo en 1.5
  const [formData, setFormData] = useState({
    id_empleado: null,
    fecha: '',
    horas: null,
    multiplicador: 1.5, // Valor fijo no editable
    motivo: '',
    estado: 'Pendiente',
    activo: true
  });

  const [empleados, setEmpleados] = useState([]);
  const [loadingRelaciones, setLoadingRelaciones] = useState(true);
  const [errorRelaciones, setErrorRelaciones] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Cargar empleados
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        setLoadingRelaciones(true);
        const data = await api.getAll('EMPLEADOS');
        setEmpleados(data);
      } catch (err) {
        setErrorRelaciones('Error al cargar la lista de empleados. Por favor intente más tarde.');
        console.error('Error:', err.response?.data || err.message);
      } finally {
        setLoadingRelaciones(false);
      }
    };
    fetchEmpleados();
  }, []);

  // Cargar datos iniciales para edición (manteniendo 1.5 siempre)
  useEffect(() => {
    if (initialData?.id_hora_extra) {
      setFormData({
        id_empleado: initialData.id_empleado || null,
        fecha: initialData.fecha ? formatDateForInput(initialData.fecha) : '',
        horas: initialData.horas || null,
        multiplicador: 1.5, // Siempre 1.5 aunque haya otro valor en initialData
        motivo: initialData.motivo || '',
        estado: initialData.estado || 'Pendiente',
        activo: initialData.activo !== false
      });
    }
  }, [initialData]);

  // Formatear fecha para input type="date"
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Manejar cambios en los inputs (sin manejar cambios para multiplicador)
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    // No permitir cambios en el multiplicador
    if (id === 'multiplicador') return;
    
    let newValue;
    if (type === 'number') {
      newValue = value === '' ? null : parseFloat(value);
    } else if (type === 'checkbox') {
      newValue = checked;
    } else {
      newValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [id]: newValue
    }));

    // Limpiar error al cambiar
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Validar formulario (sin validar multiplicador)
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.id_empleado) {
      errors.id_empleado = 'Seleccione un empleado';
      isValid = false;
    }

    if (!formData.fecha) {
      errors.fecha = 'La fecha es requerida';
      isValid = false;
    }

    if (formData.horas === null || formData.horas <= 0) {
      errors.horas = 'Ingrese horas válidas (> 0)';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Enviar formulario (siempre con multiplicador 1.5)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Preparar datos para el backend (multiplicador siempre 1.5)
    const payload = {
      id_empleado: Number(formData.id_empleado),
      fecha: new Date(formData.fecha).toISOString(),
      horas: Number(formData.horas),
      multiplicador: 1.5, // Valor fijo
      motivo: formData.motivo || null,
      estado: formData.estado,
      activo: formData.activo
    };

    onSubmit(payload);
  };

  const isProcessed = !!initialData.id_detalle_nomina;

  if (loadingRelaciones) {
    return <LoadingSpinner />;
  }

  if (errorRelaciones) {
    return <div className="error-message">{errorRelaciones}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="app-form">
      <h3>{initialData?.id_hora_extra ? 'Editar' : 'Registrar'} Horas Extras</h3>

      {/* Empleado */}
      <div className="form-group">
        <label htmlFor="id_empleado">Empleado *</label>
        <select
          id="id_empleado"
          value={formData.id_empleado || ''}
          onChange={handleInputChange}
          className={`form-control ${formErrors.id_empleado ? 'is-invalid' : ''}`}
          disabled={isProcessed}
        >
          <option value="">-- Seleccione --</option>
          {empleados.map(empleado => (
            <option key={empleado.id_empleado} value={empleado.id_empleado}>
              {empleado.nombre} {empleado.apellido} ({empleado.codigo_empleado})
            </option>
          ))}
        </select>
        {formErrors.id_empleado && <div className="invalid-feedback">{formErrors.id_empleado}</div>}
      </div>

      {/* Fecha */}
      <Input
        label="Fecha *"
        id="fecha"
        type="date"
        value={formData.fecha}
        onChange={handleInputChange}
        error={formErrors.fecha}
        disabled={isProcessed}
      />

      {/* Horas */}
      <Input
        label="Horas *"
        id="horas"
        type="number"
        value={formData.horas ?? ''}
        onChange={handleInputChange}
        step="0.5"
        min="0"
        error={formErrors.horas}
        disabled={isProcessed}
      />

      {/* Multiplicador (solo lectura) */}
      <div className="form-group">
        <label htmlFor="multiplicador">Multiplicador</label>
        <input
          id="multiplicador"
          type="number"
          className="form-control"
          value={formData.multiplicador}
          readOnly
          step="0.1"
          min="0.1"
          disabled={isProcessed}
          style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
        />
        <small className="form-text text-muted">
          Valor fijo establecido en 1.5
        </small>
      </div>

      {/* Motivo */}
      <Input
        label="Motivo"
        id="motivo"
        type="textarea"
        value={formData.motivo}
        onChange={handleInputChange}
        disabled={isProcessed}
      />

      {/* Estado */}
      <div className="form-group">
        <label htmlFor="estado">Estado *</label>
        <select
          id="estado"
          value={formData.estado}
          onChange={handleInputChange}
          className="form-control"
          disabled={isProcessed}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>
          <option value="Pagada">Pagada</option>
        </select>
      </div>

      {/* Activo */}
      <div className="form-check">
        <input
          type="checkbox"
          id="activo"
          checked={formData.activo}
          onChange={handleInputChange}
          className="form-check-input"
          disabled={isProcessed}
        />
        <label htmlFor="activo" className="form-check-label">Activo</label>
      </div>

      {/* Mostrar ID de nómina si existe */}
      {initialData.id_detalle_nomina && (
        <div className="form-group">
          <label>Procesado en nómina:</label>
          <p className="form-control-plaintext">{initialData.id_detalle_nomina}</p>
        </div>
      )}

      <Button 
        type="submit" 
        className="btn-primary"
        disabled={isProcessed || loadingRelaciones}
      >
        {initialData?.id_hora_extra ? 'Actualizar' : 'Guardar'}
      </Button>

      {isProcessed && (
        <div className="alert alert-warning mt-3">
          Este registro ya fue procesado en nómina y no puede ser modificado.
        </div>
      )}
    </form>
  );
}

export default HorasExtrasForm;