// src/pages/DetalleNominaDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Necesitas react-router-dom para obtener el ID de la URL
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import Table from '../components/Common/Table.jsx'; // Asumiendo que tienes un componente de tabla reutilizable
// Asumiendo que tienes componentes para mostrar errores o mensajes vacíos
// import ErrorMessage from '../components/Common/ErrorMessage.jsx';
// import EmptyState from '../components/Common/EmptyState.jsx';

function DetalleNominaDetailPage() {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL
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

    if (loading) {
        return <LoadingSpinner />; // Muestra un spinner mientras carga
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Muestra un mensaje de error
    }

    if (!detalleNomina) {
        return <p>Detalle de nómina no encontrado.</p>; // Maneja el caso de ID no encontrado o si la carga falló
    }

    // --- Definición de columnas para las tablas anidadas ---
    // Los keys aquí se refieren a las propiedades DENTRO del objeto relacionado (ej. ConceptoAplicado)
    const conceptosAplicadosColumns = [
        { key: 'id_concepto_aplicado', title: 'ID' },
        // Si ConceptoAplicado tiene un belongsTo a ConceptoPago y lo incluyeras, podrías hacer:
        // { key: 'concepto_pago.nombre', title: 'Concepto', render: (value, item) => item.concepto_pago?.nombre || 'N/A' },
        { key: 'id_concepto', title: 'ID Concepto' }, // Usamos solo el ID del concepto por ahora
        { key: 'monto', title: 'Monto' },
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

    // Función auxiliar para parsear el detalle de ausencias
    const parsearDetalleAusencias = (detalleAusenciasStr) => {
        try {
            return JSON.parse(detalleAusenciasStr || '[]');
        } catch (e) {
            console.error('Error al parsear detalle de ausencias:', e);
            return [];
        }
    };

    // --- Renderizado de la información ---
    return (
        <div className="detalle-nomina-detail-page"> {/* Clase CSS para estilizar */}
            <h2>Detalle de Nómina #{detalleNomina.id_detalle}</h2>

            {/* Sección de Información Principal del Detalle de Nómina */}
            <div className="detalle-nomina-section">
                <h3>Información General</h3>
                <p><strong>Salario Base:</strong> Q {parseFloat(detalleNomina.salario_base).toFixed(2)}</p>
                <p><strong>Días Trabajados:</strong> {parseFloat(detalleNomina.dias_trabajados).toFixed(1)} de {parseFloat(detalleNomina.dias_totales_periodo).toFixed(1)} días hábiles</p>
                {detalleNomina.dias_ausencia > 0 && (
                    <p><strong>Días de Ausencia:</strong> {parseFloat(detalleNomina.dias_ausencia).toFixed(1)} días</p>
                )}
                <p><strong>Horas Extra Registradas:</strong> {detalleNomina.horas_extra}</p>
                <p><strong>Monto Horas Extra:</strong> {detalleNomina.monto_horas_extra}</p>
                <p><strong>Bonificación Incentivo:</strong> {detalleNomina.bonificacion_incentivo}</p>
                <p><strong>Otros Ingresos:</strong> {detalleNomina.otros_ingresos}</p>
                <p><strong>Total Ingresos:</strong> {detalleNomina.total_ingresos}</p>
                <p><strong>IGSS Laboral:</strong> {detalleNomina.igss_laboral}</p>
                <p><strong>ISR:</strong> {detalleNomina.isr}</p>
                <p><strong>Otros Descuentos:</strong> {detalleNomina.otros_descuentos}</p>
                <p><strong>Total Descuentos:</strong> {detalleNomina.total_descuentos}</p>
                <p><strong>Líquido a Recibir:</strong> {detalleNomina.liquido_recibir}</p>
                <p><strong>Observaciones:</strong> {detalleNomina.observaciones || 'N/A'}</p>
                <p><strong>Activo:</strong> {detalleNomina.activo ? 'Sí' : 'No'}</p>
                <p><strong>Fecha Creación:</strong> {new Date(detalleNomina.fecha_creacion).toLocaleDateString()}</p>
            </div>

            {/* Nueva Sección de Ausencias */}
            {detalleNomina.dias_ausencia > 0 && (
                <div className="detalle-nomina-section">
                    <h3>Detalle de Ausencias</h3>
                    <Table 
                        data={parsearDetalleAusencias(detalleNomina.detalle_ausencias)}
                        columns={[
                            { 
                                key: 'tipo', 
                                title: 'Tipo de Ausencia',
                                render: (value) => value || 'N/A'
                            },
                            { 
                                key: 'fecha_inicio', 
                                title: 'Fecha Inicio',
                                render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
                            },
                            { 
                                key: 'fecha_fin', 
                                title: 'Fecha Fin',
                                render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
                            },
                            { 
                                key: 'dias', 
                                title: 'Días',
                                render: (value) => parseFloat(value).toFixed(1)
                            },
                            { 
                                key: 'afecta_salario', 
                                title: 'Afecta Salario',
                                render: (value) => value ? 'Sí' : 'No'
                            },
                            { 
                                key: 'motivo', 
                                title: 'Motivo',
                                render: (value) => value || 'N/A'
                            }
                        ]}
                    />
                </div>
            )}

            {/* Sección de Información del Empleado (relación belongTo) */}
            <div className="detalle-nomina-section">
                <h3>Información del Empleado</h3>
                {detalleNomina.empleado ? (
                    <div>
                         {/* Accede a las propiedades del objeto empleado anidado */}
                        <p><strong>ID Empleado:</strong> {detalleNomina.empleado.id_empleado}</p>
                        <p><strong>Nombre:</strong> {detalleNomina.empleado.nombre} {detalleNomina.empleado.apellido}</p>
                        <p><strong>Código:</strong> {detalleNomina.empleado.codigo_empleado}</p>
                        <p><strong>DPI:</strong> {detalleNomina.empleado.dpi}</p>
                        {/* ... muestra otros campos relevantes del empleado */}
                    </div>
                ) : (
                    <p>Información del empleado no disponible.</p> // Maneja el caso si la relación es null
                )}
            </div>

            {/* Sección de Información de la Nómina (relación belongTo) */}
            <div className="detalle-nomina-section">
                 <h3>Información de la Nómina</h3>
                 {detalleNomina.nomina ? (
                     <div>
                         {/* Accede a las propiedades del objeto nomina anidado */}
                         <p><strong>ID Nómina:</strong> {detalleNomina.nomina.id_nomina}</p>
                         <p><strong>Descripción:</strong> {detalleNomina.nomina.descripcion}</p>
                          <p><strong>Estado:</strong> {detalleNomina.nomina.estado}</p>
                         {/* ... muestra otros campos relevantes de la nómina */}
                     </div>
                 ) : (
                     <p>Información de la nómina no disponible.</p> // Maneja el caso si la relación es null
                 )}
             </div>

            {/* Sección de Liquidación de Viático Incluida (relación hasOne) */}
             <div className="detalle-nomina-section">
                 <h3>Liquidación de Viático Incluida</h3>
                 {detalleNomina.liquidacion_viatico_incluida ? (
                     <div>
                         {/* Accede a las propiedades del objeto liquidacionViatico anidado */}
                         <p><strong>ID Liquidación:</strong> {detalleNomina.liquidacion_viatico_incluida.id_liquidacion}</p>
                         <p><strong>Fecha Liquidación:</strong> {new Date(detalleNomina.liquidacion_viatico_incluida.fecha_liquidacion).toLocaleDateString()}</p>
                         <p><strong>Monto Total Gastado:</strong> {detalleNomina.liquidacion_viatico_incluida.monto_total_gastado}</p>
                         <p><strong>Saldo a Favor Empresa:</strong> {detalleNomina.liquidacion_viatico_incluida.saldo_favor_empresa}</p>
                         <p><strong>Saldo a Favor Empleado:</strong> {detalleNomina.liquidacion_viatico_incluida.saldo_favor_empleado}</p>
                         {/* ... muestra otros campos relevantes */}
                     </div>
                 ) : (
                     <p>No hay liquidación de viático incluida en este detalle de nómina.</p> // Maneja el caso si la relación es null
                 )}
             </div>


            {/* Sección de Conceptos Aplicados (relación hasMany - usando Tabla) */}
            <div className="detalle-nomina-section">
                <h3>Conceptos Aplicados ({detalleNomina.conceptos_aplicados?.length || 0})</h3> {/* Muestra el conteo */}
                {detalleNomina.conceptos_aplicados && detalleNomina.conceptos_aplicados.length > 0 ? (
                    // Pasa el array anidado 'conceptos_aplicados' como data a la tabla
                    <Table data={detalleNomina.conceptos_aplicados} columns={conceptosAplicadosColumns} />
                ) : (
                    <p>No hay conceptos aplicados para este detalle.</p> // Mensaje si no hay datos relacionados
                )}
            </div>

             {/* Sección de Pagos de Préstamo Asociados (relación hasMany - usando Tabla) */}
             <div className="detalle-nomina-section">
                 <h3>Pagos de Préstamo Asociados ({detalleNomina.pagos_prestamo_asociados?.length || 0})</h3>
                 {detalleNomina.pagos_prestamo_asociados && detalleNomina.pagos_prestamo_asociados.length > 0 ? (
                     // Pasa el array anidado 'pagos_prestamo_asociados' como data a la tabla
                     <Table data={detalleNomina.pagos_prestamo_asociados} columns={pagosPrestamoColumns} />
                 ) : (
                     <p>No hay pagos de préstamo asociados a este detalle.</p>
                 )}
             </div>

            {/* Sección de Horas Extras Pagadas (relación hasMany - usando Tabla) */}
             <div className="detalle-nomina-section">
                 <h3>Horas Extras Pagadas ({detalleNomina.horas_extras_pagadas?.length || 0})</h3>
                 {detalleNomina.horas_extras_pagadas && detalleNomina.horas_extras_pagadas.length > 0 ? (
                     // Pasa el array anidado 'horas_extras_pagadas' como data a la tabla
                     <Table data={detalleNomina.horas_extras_pagadas} columns={horasExtrasColumns} />
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
    );
}

export default DetalleNominaDetailPage;