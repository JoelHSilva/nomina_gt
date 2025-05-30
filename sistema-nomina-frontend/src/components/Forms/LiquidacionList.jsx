import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';
import { FiPlus, FiEye, FiFilter } from 'react-icons/fi';
import './LiquidacionList.css';

const LiquidacionList = () => {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    id_empleado: '',
    tipo_liquidacion: '',
    fecha_inicio: '',
    fecha_fin: ''
  });
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Tipos de liquidación
  const tiposLiquidacion = [
    'Renuncia',
    'Despido Justificado',
    'Despido Injustificado',
    'Mutuo Acuerdo'
  ];

  useEffect(() => {
    fetchEmpleados();
    fetchLiquidaciones();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await api.getAll('EMPLEADOS');
      setEmpleados(response.data || []);
    } catch (error) {
      console.error('Error fetching empleados:', error);
    }
  };

  const fetchLiquidaciones = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filtros.id_empleado) params.append('id_empleado', filtros.id_empleado);
      if (filtros.tipo_liquidacion) params.append('tipo_liquidacion', filtros.tipo_liquidacion);
      if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);

      console.log('Fetching liquidaciones with params:', params.toString());
      const response = await api.getAll('LIQUIDACIONES', params.toString());
      console.log('API Response:', response);
      
      if (response && response.liquidaciones) {
        console.log('Liquidaciones recibidas:', response.liquidaciones);
        setLiquidaciones(response.liquidaciones);
      } else {
        console.warn('La respuesta de la API no contiene datos de liquidaciones:', response);
        setLiquidaciones([]);
      }
    } catch (error) {
      console.error('Error detallado al obtener liquidaciones:', error);
      console.error('Error response:', error.response);
      setLiquidaciones([]);
      alert('Error al cargar las liquidaciones: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleAplicarFiltros = () => {
    setCurrentPage(1);
    fetchLiquidaciones();
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      id_empleado: '',
      tipo_liquidacion: '',
      fecha_inicio: '',
      fecha_fin: ''
    });
    setCurrentPage(1);
    fetchLiquidaciones();
  };

  const getEstadoClass = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE':
        return 'list-badge-yellow';
      case 'PAGADA':
        return 'list-badge-green';
      case 'RECHAZADA':
        return 'list-badge-red';
      default:
        return 'list-badge-gray';
    }
  };

  const filteredLiquidaciones = (liquidaciones || []).filter((liquidacion) => {
    if (!liquidacion || !liquidacion.empleado) return false;
    
    const searchString = searchTerm.toLowerCase();
    const empleado = liquidacion.empleado;
    
    return (
      (empleado.nombre?.toLowerCase() || '').includes(searchString) ||
      (empleado.apellido?.toLowerCase() || '').includes(searchString) ||
      (liquidacion.tipo_liquidacion?.toLowerCase() || '').includes(searchString)
    );
  });

  const totalPages = Math.ceil(filteredLiquidaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLiquidaciones = filteredLiquidaciones.slice(startIndex, endIndex);

  const formatMonto = (valor) => {
    if (valor === null || valor === undefined) return '0.00';
    const numero = parseFloat(valor);
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="liquidacion-list-container">
      <div className="list-header">
        <h1 className="list-title">Liquidaciones</h1>
        <div className="list-header-actions">
          <button
            className="list-button list-button-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="list-button-icon" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          <button
            className="list-button list-button-primary"
            onClick={() => navigate('/liquidaciones/nueva')}
          >
            <FiPlus className="list-button-icon" />
            Nueva Liquidación
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="list-filters">
          <div className="list-filters-grid">
            <div className="list-filter-item">
              <label>Empleado</label>
              <select
                value={filtros.id_empleado}
                onChange={(e) => handleFiltroChange('id_empleado', e.target.value)}
                className="list-select"
              >
                <option value="">Todos los empleados</option>
                {empleados.map((empleado) => (
                  <option key={empleado.id_empleado} value={empleado.id_empleado}>
                    {`${empleado.nombre} ${empleado.apellido}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="list-filter-item">
              <label>Tipo de Liquidación</label>
              <select
                value={filtros.tipo_liquidacion}
                onChange={(e) => handleFiltroChange('tipo_liquidacion', e.target.value)}
                className="list-select"
              >
                <option value="">Todos los tipos</option>
                {tiposLiquidacion.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="list-filter-item">
              <label>Fecha Inicio</label>
              <input
                type="date"
                value={filtros.fecha_inicio}
                onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
                className="list-input"
              />
            </div>

            <div className="list-filter-item">
              <label>Fecha Fin</label>
              <input
                type="date"
                value={filtros.fecha_fin}
                onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
                className="list-input"
              />
            </div>
          </div>

          <div className="list-filters-actions">
            <button
              className="list-button list-button-secondary"
              onClick={handleLimpiarFiltros}
            >
              Limpiar Filtros
            </button>
            <button
              className="list-button list-button-primary"
              onClick={handleAplicarFiltros}
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      <div className="list-card">
        <div className="list-card-header">
          <h2 className="list-card-title">Lista de Liquidaciones</h2>
        </div>
        <div className="list-card-body">
          {loading ? (
            <div className="loading">Cargando liquidaciones...</div>
          ) : liquidaciones.length === 0 ? (
            <div className="no-data">
              No se encontraron liquidaciones. 
              {filtros.id_empleado || filtros.tipo_liquidacion || filtros.fecha_inicio || filtros.fecha_fin 
                ? 'Intenta con otros filtros.' 
                : 'No hay liquidaciones registradas.'}
            </div>
          ) : (
            <>
              <input
                type="text"
                className="list-search"
                placeholder="Buscar por nombre o tipo..."
                value={searchTerm}
                onChange={handleSearch}
              />

              <table className="list-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Empleado</th>
                    <th>Fecha Liquidación</th>
                    <th>Tipo</th>
                    <th>Motivo</th>
                    <th>Salario Base</th>
                    <th>Estado</th>
                    <th>Periodo Inicio</th>
                    <th>Periodo Fin</th>
                    <th>Total Bonificaciones</th>
                    <th>Total Deducciones</th>
                    <th>Total Líquido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLiquidaciones.map((liquidacion) => (
                    <tr key={liquidacion.id_liquidacion}>
                      <td>{liquidacion.id_liquidacion}</td>
                      <td>
                        {liquidacion.empleado?.nombre} {liquidacion.empleado?.apellido}
                      </td>
                      <td>{new Date(liquidacion.fecha_liquidacion).toLocaleDateString()}</td>
                      <td>{liquidacion.tipo_liquidacion}</td>
                      <td>{liquidacion.motivo}</td>
                      <td>Q {formatMonto(liquidacion.salario_base)}</td>
                      <td>
                        <span className={`list-badge ${getEstadoClass(liquidacion.estado)}`}>
                          {liquidacion.estado}
                        </span>
                      </td>
                      <td>{new Date(liquidacion.periodo_inicio).toLocaleDateString()}</td>
                      <td>{new Date(liquidacion.periodo_fin).toLocaleDateString()}</td>
                      <td>Q {formatMonto(liquidacion.total_bonificaciones)}</td>
                      <td>Q {formatMonto(liquidacion.total_deducciones)}</td>
                      <td>Q {formatMonto(liquidacion.total_liquido)}</td>
                      <td>
                        <div className="list-actions">
                          <button
                            className="list-button list-button-secondary"
                            onClick={() => navigate(`/liquidaciones/${liquidacion.id_liquidacion}`)}
                          >
                            <FiEye className="list-button-icon" />
                            Ver Detalles
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="list-pagination">
                  <button
                    className="list-pagination-button"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`list-pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="list-pagination-button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiquidacionList; 