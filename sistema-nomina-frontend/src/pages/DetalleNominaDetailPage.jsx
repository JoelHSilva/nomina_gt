// src/pages/DetalleNominaDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Necesitas react-router-dom para obtener el ID de la URL
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import Table from '../components/Common/Table.jsx'; // Asumiendo que tienes un componente de tabla reutilizable
import Button from '../components/Common/Button.jsx';
import { FiFileText } from 'react-icons/fi';
import './DetalleNominaDetailPage.css';
// Asumiendo que tienes componentes para mostrar errores o mensajes vacíos
// import ErrorMessage from '../components/Common/ErrorMessage.jsx';
// import EmptyState from '../components/Common/EmptyState.jsx';

function DetalleNominaDetailPage() {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL
    const navigate = useNavigate();
    const [detalleNomina, setDetalleNomina] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                setLoading(true);
                setError(null);
                // La llamada getById ahora devolverá el objeto con las relaciones anidadas
                const data = await api.getById('DETALLE_NOMINA', id);
                setDetalleNomina(data);
            } catch (err) {
                console.error(`Error al cargar detalle de nómina ${id}:`, err.response?.data || err.message);
                setError('Error al cargar el detalle de nómina.');
                setDetalleNomina(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) { // Asegúrate de que hay un ID en la URL antes de intentar cargar
            fetchDetalle();
        } else {
            setLoading(false);
            setError('No se especificó un ID de detalle de nómina.');
        }

    }, [id]); // El efecto se re-ejecuta si cambia el ID en la URL

    const handleVerReporte = () => {
        navigate(`/reportes/nomina/${id}`);
    };

    if (loading) {
        return <LoadingSpinner />; // Muestra un spinner mientras carga
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <h2>Error al cargar el detalle</h2>
                <p style={{ color: 'red' }}>{error}</p>
                <Button onClick={() => navigate(-1)} className="app-button">
                    Volver
                </Button>
            </div>
        );
    }

    if (!detalleNomina) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <h2>Detalle de nómina no encontrado</h2>
                <Button onClick={() => navigate(-1)} className="app-button">
                    Volver
                </Button>
            </div>
        );
    }

    // --- Definición de columnas para las tablas anidadas ---
    // Los keys aquí se refieren a las propiedades DENTRO del objeto relacionado (ej. ConceptoAplicado)
    const conceptosAplicadosColumns = [
        { key: 'id_concepto_aplicado', title: 'ID' },
        // Si ConceptoAplicado tiene un belongsTo a ConceptoPago y lo incluyeras, podrías hacer:
        // { key: 'concepto_pago.nombre', title: 'Concepto', render: (value, item) => item.concepto_pago?.nombre || 'N/A' },
        { key: 'id_concepto', title: 'ID Concepto' }, // Usamos solo el ID del concepto por ahora
        { key: 'monto', title: 'Monto', render: (value) => `Q${parseFloat(value || 0).toFixed(2)}` },
        { key: 'observacion', title: 'Observación' },
        { key: 'activo', title: 'Activo?', render: (value) => (value ? 'Sí' : 'No') },
        // ... otras columnas relevantes para Concepto Aplicado
    ];

     const pagosPrestamoColumns = [
        { key: 'id_pago', title: 'ID Pago' },
         // Si PagoPrestamo tiene un belongsTo a Prestamo y lo incluyeras, podrías hacer:
        // { key: 'prestamo.descripcion', title: 'Préstamo', render: (value, item) => item.prestamo?.descripcion || 'N/A' },
        { key: 'id_prestamo', title: 'ID Préstamo' }, // Usamos solo el ID del préstamo por ahora
        { key: 'monto_pagado', title: 'Monto Pagado' },
        { key: 'fecha_pago', title: 'Fecha Pago', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
        { key: 'tipo_pago', title: 'Tipo Pago' },
        // ... otras columnas relevantes para Pago Prestamo
    ];

     const horasExtrasColumns = [
        { key: 'id_hora_extra', title: 'ID Hora Extra' },
         // Si HoraExtra tiene un belongsTo a Empleado y lo incluyeras en la inclusión original (no necesario aquí), podrías hacer:
        // { key: 'empleado.nombre', title: 'Empleado', render: (value, item) => item.empleado?.nombre || 'N/A' },
        { key: 'id_empleado', title: 'ID Empleado' }, // Usamos solo el ID del empleado por ahora
        { key: 'fecha', title: 'Fecha', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
        { key: 'horas', title: 'Horas' },
        { key: 'motivo', title: 'Motivo' },
        { key: 'estado', title: 'Estado' },
        // ... otras columnas relevantes para Hora Extra
    ];

    const columns = [
        // ... otras columnas
        {
            key: 'actions',
            title: 'Acciones',
            render: (value, item) => {
                return (
                    <>
                        {/* Botón/Enlace para ver los detalles completos */}
                        <Link to={`/detalles-nomina/${item.id_detalle}`}>
                            <button className="app-button">Ver Detalles</button>
                        </Link>
                        {/* ... otros botones como Editar/Desactivar si aplican desde la lista */}
                    </>
                );
            },
        },
    ];
    // --- Renderizado de la información ---
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Detalle de Nómina #{detalleNomina.id_detalle}</h2>
                <div>
                    <Button 
                        onClick={handleVerReporte}
                        className="app-button"
                        style={{ marginRight: '10px' }}
                    >
                        <FiFileText style={{ marginRight: '5px' }} />
                        Ver Reporte Detallado
                    </Button>
                    <Button onClick={() => navigate(-1)} className="app-button">
                        Volver
                    </Button>
                </div>
            </div>

            <div className="detalle-nomina-detail-page"> {/* Clase CSS para estilizar */}
                <h2>Detalle de Nómina #{detalleNomina.id_detalle}</h2>

                {/* Sección de Información Principal del Detalle de Nómina */}
                <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <h3>Información General</h3>
                    <div className="info-list">
                        <div className="info-item">
                            <strong>Salario Base:</strong> Q{parseFloat(detalleNomina.salario_base || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>Días Trabajados:</strong> {detalleNomina.dias_trabajados}
                        </div>
                        <div className="info-item">
                            <strong>Horas Extra Registradas:</strong> {detalleNomina.horas_extra}
                        </div>
                        <div className="info-item">
                            <strong>Monto Horas Extra:</strong> Q{parseFloat(detalleNomina.monto_horas_extra || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>Bonificación Incentivo:</strong> Q{parseFloat(detalleNomina.bonificacion_incentivo || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>Otros Ingresos:</strong> Q{parseFloat(detalleNomina.otros_ingresos || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>Total Ingresos:</strong> Q{parseFloat(detalleNomina.total_ingresos || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>IGSS Laboral:</strong> Q{parseFloat(detalleNomina.igss_laboral || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>ISR:</strong> Q{parseFloat(detalleNomina.isr || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>Otros Descuentos:</strong> Q{parseFloat(detalleNomina.otros_descuentos || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>Total Descuentos:</strong> Q{parseFloat(detalleNomina.total_descuentos || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>Líquido a Recibir:</strong> Q{parseFloat(detalleNomina.liquido_recibir || 0).toFixed(2)}
                        </div>
                        <div className="info-item">
                            <strong>Observaciones:</strong> {detalleNomina.observaciones || 'N/A'}
                        </div>
                        <div className="info-item">
                            <strong>Activo:</strong> {detalleNomina.activo ? 'Sí' : 'No'}
                        </div>
                        <div className="info-item">
                            <strong>Fecha Creación:</strong> {new Date(detalleNomina.fecha_creacion).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Sección de Información del Empleado (relación belongTo) */}
                <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <h3>Información del Empleado</h3>
                    {detalleNomina.empleado ? (
                        <div className="info-list">
                            <div className="info-item">
                                <strong>ID Empleado:</strong> {detalleNomina.empleado.id_empleado}
                            </div>
                            <div className="info-item">
                                <strong>Nombre:</strong> {detalleNomina.empleado.nombre} {detalleNomina.empleado.apellido}
                            </div>
                            <div className="info-item">
                                <strong>Código:</strong> {detalleNomina.empleado.codigo_empleado}
                            </div>
                            <div className="info-item">
                                <strong>DPI:</strong> {detalleNomina.empleado.dpi}
                            </div>
                        </div>
                    ) : (
                        <p>Información del empleado no disponible.</p> // Maneja el caso si la relación es null
                    )}
                </div>

                {/* Sección de Información de la Nómina (relación belongTo) */}
                <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                     <h3>Información de la Nómina</h3>
                     {detalleNomina.nomina ? (
                         <div className="info-list">
                             <div className="info-item">
                                 <strong>ID Nómina:</strong> {detalleNomina.nomina.id_nomina}
                             </div>
                             <div className="info-item">
                                 <strong>Descripción:</strong> {detalleNomina.nomina.descripcion}
                             </div>
                              <div className="info-item">
                                 <strong>Estado:</strong> {detalleNomina.nomina.estado}
                             </div>
                         </div>
                     ) : (
                         <p>Información de la nómina no disponible.</p> // Maneja el caso si la relación es null
                     )}
                 </div>

                {/* Sección de Liquidación de Viático Incluida (relación hasOne) */}
                 <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                     <h3>Liquidación de Viático Incluida</h3>
                     {detalleNomina.liquidacion_viatico_incluida ? (
                         <div className="info-list">
                             <div className="info-item">
                                 <strong>ID Liquidación:</strong> {detalleNomina.liquidacion_viatico_incluida.id_liquidacion}
                             </div>
                             <div className="info-item">
                                 <strong>Fecha Liquidación:</strong> {new Date(detalleNomina.liquidacion_viatico_incluida.fecha_liquidacion).toLocaleDateString()}
                             </div>
                             <div className="info-item">
                                 <strong>Monto Total Gastado:</strong> Q{parseFloat(detalleNomina.liquidacion_viatico_incluida.monto_total_gastado || 0).toFixed(2)}
                             </div>
                             <div className="info-item">
                                 <strong>Saldo a Favor Empresa:</strong> Q{parseFloat(detalleNomina.liquidacion_viatico_incluida.saldo_favor_empresa || 0).toFixed(2)}
                             </div>
                             <div className="info-item">
                                 <strong>Saldo a Favor Empleado:</strong> Q{parseFloat(detalleNomina.liquidacion_viatico_incluida.saldo_favor_empleado || 0).toFixed(2)}
                             </div>
                         </div>
                     ) : (
                         <p>No hay liquidación de viático incluida en este detalle de nómina.</p> // Maneja el caso si la relación es null
                     )}
                 </div>


                {/* Sección de Conceptos Aplicados (relación hasMany - usando Tabla) */}
                <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <h3>Conceptos Aplicados ({detalleNomina.conceptos_aplicados?.length || 0})</h3> {/* Muestra el conteo */}
                    {detalleNomina.conceptos_aplicados && detalleNomina.conceptos_aplicados.length > 0 ? (
                        // Pasa el array anidado 'conceptos_aplicados' como data a la tabla
                        <Table columns={conceptosAplicadosColumns} data={detalleNomina.conceptos_aplicados} />
                    ) : (
                        <p>No hay conceptos aplicados para este detalle.</p> // Mensaje si no hay datos relacionados
                    )}
                </div>

                 {/* Sección de Pagos de Préstamo Asociados (relación hasMany - usando Tabla) */}
                 <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                     <h3>Pagos de Préstamo Asociados ({detalleNomina.pagos_prestamo_asociados?.length || 0})</h3>
                     {detalleNomina.pagos_prestamo_asociados && detalleNomina.pagos_prestamo_asociados.length > 0 ? (
                         // Pasa el array anidado 'pagos_prestamo_asociados' como data a la tabla
                         <Table columns={pagosPrestamoColumns} data={detalleNomina.pagos_prestamo_asociados} />
                     ) : (
                         <p>No hay pagos de préstamo asociados a este detalle.</p>
                     )}
                 </div>

                {/* Sección de Horas Extras Pagadas (relación hasMany - usando Tabla) */}
                 <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                     <h3>Horas Extras Pagadas ({detalleNomina.horas_extras_pagadas?.length || 0})</h3>
                     {detalleNomina.horas_extras_pagadas && detalleNomina.horas_extras_pagadas.length > 0 ? (
                         // Pasa el array anidado 'horas_extras_pagadas' como data a la tabla
                         <Table columns={horasExtrasColumns} data={detalleNomina.horas_extras_pagadas} />
                     ) : (
                         <p>No hay horas extras pagadas asociadas a este detalle.</p>
                     )}
                 </div>

                 {/* Repite para otras relaciones hasMany si las incluyes y necesitas mostrarlas en tablas separadas */}
                 {/* Por ejemplo, si LiquidacionViatico tuviera hasMany a DetalleLiquidacionViatico y lo incluyeras */}
                 {/*
                 <div className="detalle-nomina-section">
                     <h3>Detalles de Liquidación de Viático ({detalleNomina.liquidacion_viatico_incluida?.detalles_liquidacion?.length || 0})</h3>
                      {detalleNomina.liquidacion_viatico_incluida?.detalles_liquidacion && detalleNomina.liquidacion_viatico_incluida.detalles_liquidacion.length > 0 ? (
                          <Table data={detalleNomina.liquidacion_viatico_incluida.detalles_liquidacion} columns={tusColumnasDeDetalleLiquidacion} />
                      ) : (
                         <p>No hay detalles para esta liquidación de viático.</p>
                      )}
                 </div>
                 */}


            </div>
        </div>
    );
}

export default DetalleNominaDetailPage;