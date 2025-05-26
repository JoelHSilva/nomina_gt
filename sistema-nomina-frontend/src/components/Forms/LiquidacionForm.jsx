import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../Common/Input';
import Button from '../Common/Button';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';
import './LiquidacionForm.css';

const LiquidacionForm = () => {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liquidacionPreview, setLiquidacionPreview] = useState(null);
  const [formData, setFormData] = useState({
    id_empleado: '',
    tipo_liquidacion: '',
    fecha_liquidacion: '',
    motivo: ''
  });

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const response = await api.getAll('EMPLEADOS');
        setEmpleados(response || []);
      } catch (error) {
        console.error('Error fetching empleados:', error);
        alert('No se pudieron cargar los empleados');
      }
    };

    fetchEmpleados();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    // Si se cambió el empleado o el tipo de liquidación, actualizar la vista previa
    if (id === 'id_empleado' || id === 'tipo_liquidacion') {
      if (formData.id_empleado && formData.tipo_liquidacion && formData.fecha_liquidacion) {
        updatePreview();
      }
    }
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });

    // Si se cambió el empleado o el tipo de liquidación, actualizar la vista previa
    if (id === 'id_empleado' || id === 'tipo_liquidacion') {
      if (formData.id_empleado && formData.tipo_liquidacion && formData.fecha_liquidacion) {
        updatePreview();
      }
    }
  };

  const updatePreview = async () => {
    try {
      const response = await api.create('LIQUIDACIONES', {
        id_empleado: formData.id_empleado,
        tipo_liquidacion: formData.tipo_liquidacion,
        fecha_liquidacion: formData.fecha_liquidacion,
        motivo: formData.motivo || 'Vista previa'
      }, true); // El parámetro true indica que es una vista previa

      if (response && response.liquidacion) {
        setLiquidacionPreview(response.liquidacion);
      }
    } catch (error) {
      console.error('Error al generar vista previa:', error);
      alert('Error al generar vista previa de la liquidación');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.create('LIQUIDACIONES', {
        id_empleado: formData.id_empleado,
        tipo_liquidacion: formData.tipo_liquidacion,
        fecha_liquidacion: formData.fecha_liquidacion,
        motivo: formData.motivo
      });

      if (response && response.liquidacion) {
        alert('Liquidación creada exitosamente');
        navigate('/liquidaciones');
      }
    } catch (error) {
      console.error('Error al crear liquidación:', error);
      alert(error.response?.data?.message || 'Error al crear la liquidación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="liquidacion-form-container">
      <div className="form-header">
        <h1 className="form-title">Nueva Liquidación</h1>
        <Button
          type="button"
          onClick={() => navigate('/liquidaciones')}
          className="app-button-secondary"
        >
          Ver Liquidaciones
        </Button>
      </div>

      <div className="form-content">
        <form onSubmit={handleSubmit} className="form-section">
          <div className="app-input-container">
            <label htmlFor="id_empleado" className="app-input-label">Empleado:</label>
            <select
              id="id_empleado"
              value={formData.id_empleado}
              onChange={handleSelectChange}
              required
              className="app-input-field"
            >
              <option value="">-- Seleccione un empleado --</option>
              {empleados.map(empleado => (
                <option key={empleado.id_empleado} value={empleado.id_empleado}>
                  {`${empleado.nombre} ${empleado.apellido}`}
                </option>
              ))}
            </select>
          </div>

          <div className="app-input-container">
            <label htmlFor="tipo_liquidacion" className="app-input-label">Tipo de Liquidación:</label>
            <select
              id="tipo_liquidacion"
              value={formData.tipo_liquidacion}
              onChange={handleSelectChange}
              required
              className="app-input-field"
            >
              <option value="">-- Seleccione el tipo de liquidación --</option>
              <option value="Renuncia">Renuncia</option>
              <option value="Despido Justificado">Despido Justificado</option>
              <option value="Despido Injustificado">Despido Injustificado</option>
              <option value="Mutuo Acuerdo">Mutuo Acuerdo</option>
            </select>
          </div>

          <Input
            label="Fecha de Liquidación:"
            id="fecha_liquidacion"
            type="date"
            value={formData.fecha_liquidacion}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Motivo:"
            id="motivo"
            type="textarea"
            value={formData.motivo}
            onChange={handleInputChange}
            required
          />

          <Button
            type="submit"
            className="app-button-primary"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Liquidación'}
          </Button>
        </form>

        {liquidacionPreview && (
          <div className="preview-section">
            <div className="preview-card">
              <h3>Vista Previa de la Liquidación</h3>
              <div className="preview-details">
                <div className="preview-row">
                  <span className="preview-label">Empleado:</span>
                  <span className="preview-value">
                    {`${liquidacionPreview.empleado.nombre} ${liquidacionPreview.empleado.apellido}`}
                  </span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Tipo de Liquidación:</span>
                  <span className="preview-value">{liquidacionPreview.tipo_liquidacion}</span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Fecha de Liquidación:</span>
                  <span className="preview-value">
                    {new Date(liquidacionPreview.fecha_liquidacion).toLocaleDateString()}
                  </span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Salario Base:</span>
                  <span className="preview-value">
                    Q {liquidacionPreview.empleado.salario_actual.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Tipo</th>
                      <th>Monto</th>
                      <th>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liquidacionPreview.detalles.map((detalle, index) => (
                      <tr key={index}>
                        <td>{detalle.concepto}</td>
                        <td style={{ color: detalle.tipo === 'Ingreso' ? 'green' : 'red' }}>
                          {detalle.tipo}
                        </td>
                        <td align="right">Q {parseFloat(detalle.monto).toFixed(2)}</td>
                        <td>{detalle.descripcion}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2"><strong>Total Ingresos:</strong></td>
                      <td align="right" style={{ color: 'green' }}>
                        Q {liquidacionPreview.total_ingresos.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan="2"><strong>Total Deducciones:</strong></td>
                      <td align="right" style={{ color: 'red' }}>
                        Q {liquidacionPreview.total_deducciones.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan="2"><strong>Total Final:</strong></td>
                      <td align="right" style={{ fontWeight: 'bold' }}>
                        Q {liquidacionPreview.total_final.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiquidacionForm; 