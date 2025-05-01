import React, { useState, useEffect } from 'react';
import Input from '../Common/Input.jsx';
import Button from '../Common/Button.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import api from '../../api/api.jsx';

function PrestamoForm({ initialData = {}, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id_empleado: initialData.id_empleado?.toString() || '',
    monto_total: initialData.monto_total?.toString() || '',
    cantidad_cuotas: initialData.cantidad_cuotas?.toString() || '',
    fecha_inicio: initialData.fecha_inicio?.split('T')[0] || new Date().toISOString().split('T')[0],
    motivo: initialData.motivo || '',
    estado: initialData.id_prestamo ? initialData.estado : 'Aprobado' // Fijar como "Aprobado" en creación
  });

  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(prev => ({
        ...prev,
        id_empleado: initialData.id_empleado?.toString() || '',
        monto_total: initialData.monto_total?.toString() || '',
        cantidad_cuotas: initialData.cantidad_cuotas?.toString() || '',
        fecha_inicio: initialData.fecha_inicio?.split('T')[0] || prev.fecha_inicio,
        motivo: initialData.motivo || '',
        estado: initialData.estado || 'Aprobado'
      }));
    }
  }, [initialData]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const data = await api.getAll('EMPLEADOS');
        setEmpleados(data.filter(e => e.activo));
      } catch (err) {
        setError('Error al cargar empleados: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchEmpleados();
  }, []);

  const calcularFechaFin = (fechaInicio, cuotas) => {
    const date = new Date(fechaInicio);
    date.setMonth(date.getMonth() + parseInt(cuotas));
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.id_empleado || !formData.monto_total || 
        !formData.cantidad_cuotas || !formData.fecha_inicio) {
      alert('Complete todos los campos requeridos');
      return;
    }

    const monto = parseFloat(formData.monto_total);
    const cuotas = parseInt(formData.cantidad_cuotas);

    if (monto <= 0 || cuotas <= 0) {
      alert('Monto y cuotas deben ser mayores a cero');
      return;
    }

    const payload = {
      id_empleado: parseInt(formData.id_empleado),
      monto_total: monto,
      saldo_pendiente: initialData.saldo_pendiente || monto,
      cuota_mensual: (monto / cuotas).toFixed(2),
      cantidad_cuotas: cuotas,
      cuotas_pagadas: initialData.cuotas_pagadas || 0,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin_estimada: calcularFechaFin(formData.fecha_inicio, cuotas),
      motivo: formData.motivo || null,
      estado: formData.estado, // Enviar el estado seleccionado
      activo: true,
      fecha_creacion: initialData.fecha_creacion || new Date().toISOString()
    };

    onSubmit(payload);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="prestamo-form">
      <h2>{initialData.id_prestamo ? 'Editar Préstamo' : 'Nuevo Préstamo'}</h2>

      <div className="form-group">
        <label>Empleado *</label>
        <select
          id="id_empleado"
          value={formData.id_empleado}
          onChange={handleChange}
          required
          disabled={!!initialData.id_prestamo}
        >
          <option value="">Seleccione empleado</option>
          {empleados.map(emp => (
            <option key={emp.id_empleado} value={emp.id_empleado}>
              {emp.nombre} {emp.apellido}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Monto Total (Q) *"
        id="monto_total"
        type="number"
        value={formData.monto_total}
        onChange={handleChange}
        required
        min="0.01"
        step="0.01"
      />

      <Input
        label="Cantidad de Cuotas *"
        id="cantidad_cuotas"
        type="number"
        value={formData.cantidad_cuotas}
        onChange={handleChange}
        required
        min="1"
      />

      <Input
        label="Fecha de Inicio *"
        id="fecha_inicio"
        type="date"
        value={formData.fecha_inicio}
        onChange={handleChange}
        required
      />

      <div className="form-group">
        <label>Cuota Mensual (Q)</label>
        <input
          type="text"
          value={(formData.monto_total && formData.cantidad_cuotas) ? 
            (parseFloat(formData.monto_total) / parseInt(formData.cantidad_cuotas)).toFixed(2) : '0.00'}
          readOnly
          className="form-control"
        />
      </div>

      <Input
        label="Motivo"
        id="motivo"
        type="textarea"
        value={formData.motivo}
        onChange={handleChange}
      />

      <div className="form-group">
        <label>Estado *</label>
        {initialData.id_prestamo ? (
          // Modo edición: permitir cambiar estado
          <select
            id="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="Aprobado">Aprobado</option>
            <option value="En Curso">En Curso</option>
            <option value="Pagado">Pagado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        ) : (
          // Modo creación: mostrar como campo de solo lectura
          <input
            type="text"
            value="Aprobado"
            readOnly
            className="form-control"
          />
        )}
      </div>

      <div className="form-actions">
        <Button type="button" onClick={onCancel} className="secondary">
          Cancelar
        </Button>
        <Button type="submit" className="primary">
          {initialData.id_prestamo ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

export default PrestamoForm;