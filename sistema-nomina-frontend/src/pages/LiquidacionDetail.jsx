import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import { FiArrowLeft } from 'react-icons/fi';
import './LiquidacionDetail.css';

const LiquidacionDetail = () => {
  const [liquidacion, setLiquidacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLiquidacion();
  }, [id]);

  const fetchLiquidacion = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching liquidacion with id:', id);
      const response = await api.getById('LIQUIDACIONES', id);
      console.log('API Response completa:', JSON.stringify(response, null, 2));
      console.log('Tipo de respuesta:', typeof response);
      console.log('Keys de la respuesta:', Object.keys(response));
      
      if (response) {
        if (response.data) {
          console.log('Datos encontrados en response.data:', response.data);
          setLiquidacion(response.data);
        } else if (response.liquidacion) {
          console.log('Datos encontrados en response.liquidacion:', response.liquidacion);
          setLiquidacion(response.liquidacion);
        } else if (typeof response === 'object' && !Array.isArray(response)) {
          console.log('Usando el objeto response directamente:', response);
          setLiquidacion(response);
        } else {
          console.warn('La respuesta no tiene el formato esperado:', response);
          setError('No se encontró la liquidación');
        }
      } else {
        console.warn('La respuesta está vacía');
        setError('No se encontró la liquidación');
      }
    } catch (error) {
      console.error('Error detallado al cargar la liquidación:', error);
      console.error('Error response:', error.response);
      setError('Error al cargar la liquidación: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleVolver = () => {
    navigate('/liquidaciones');
  };

  const getEstadoClass = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE':
        return 'badge-yellow';
      case 'PAGADA':
        return 'badge-green';
      case 'RECHAZADA':
        return 'badge-red';
      default:
        return 'badge-gray';
    }
  };

  const formatMonto = (valor) => {
    if (valor === null || valor === undefined) return '0.00';
    const numero = parseFloat(valor);
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="button button-secondary" onClick={handleVolver}>
          <FiArrowLeft /> Volver
        </button>
      </div>
    );
  }

  if (!liquidacion) {
    return (
      <div className="error-container">
        <div className="error-message">No se encontró la liquidación</div>
        <button className="button button-secondary" onClick={handleVolver}>
          <FiArrowLeft /> Volver
        </button>
      </div>
    );
  }

  return (
    <div className="liquidacion-container">
      <div className="liquidacion-header">
        <h1 className="liquidacion-title">Detalle de Liquidación</h1>
        <div className="button-group">
          <button className="button button-secondary" onClick={handleVolver}>
            <FiArrowLeft /> Volver
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Información del Empleado</h2>
        </div>
        <div className="card-body">
          <div className="info-list">
            <p>Código: {liquidacion.empleado?.codigo_empleado || '-'}</p>
            <p>
              Nombre: {liquidacion.empleado?.nombre} {liquidacion.empleado?.apellido}
            </p>
            <p>Puesto: {
              liquidacion.empleado?.puesto?.nombre
                ? liquidacion.empleado.puesto.nombre
                : (typeof liquidacion.empleado?.puesto === 'string' && liquidacion.empleado.puesto)
                  ? liquidacion.empleado.puesto
                  : '-'
            }</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Información de la Liquidación</h2>
        </div>
        <div className="card-body">
          <div className="info-list">
            <p>Fecha: {new Date(liquidacion.fecha_liquidacion).toLocaleDateString()}</p>
            <p>Tipo: {liquidacion.tipo_liquidacion}</p>
            <p>Motivo: {liquidacion.motivo}</p>
            <p>
              Estado:{' '}
              <span className={`badge ${getEstadoClass(liquidacion.estado)}`}>
                {liquidacion.estado}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Desglose de Montos</h2>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Tipo</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {liquidacion.detalles?.map((detalle) => (
                <tr key={detalle.id_detalle}>
                  <td>{detalle.concepto}</td>
                  <td>
                    <span className={`badge ${detalle.tipo === 'Ingreso' ? 'badge-green' : 'badge-red'}`}>
                      {detalle.tipo}
                    </span>
                  </td>
                  <td>Q {formatMonto(detalle.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Resumen</h2>
        </div>
        <div className="card-body">
          <div className="info-list">
            <div className="summary-item">
              <span>Salario Base:</span>
              <span className="text-bold">Q {formatMonto(liquidacion.salario_base)}</span>
            </div>
            <div className="summary-item">
              <span>Total Bonificaciones:</span>
              <span className="text-bold text-green">Q {formatMonto(liquidacion.total_bonificaciones)}</span>
            </div>
            <div className="summary-item">
              <span>Total Deducciones:</span>
              <span className="text-bold text-red">Q {formatMonto(liquidacion.total_deducciones)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item">
              <span className="text-lg">Total Líquido:</span>
              <span className="text-lg text-bold">Q {formatMonto(liquidacion.total_liquido)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidacionDetail; 