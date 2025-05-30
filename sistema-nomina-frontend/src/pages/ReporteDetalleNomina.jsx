import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api.jsx';
import { ENDPOINTS } from '../api/endpoints.jsx';
import Button from '../components/Common/Button.jsx';
import Table from '../components/Common/Table.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import html2pdf from 'html2pdf.js';
import './ReporteDetalleNomina.css';

const ReporteDetalleNomina = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detalleNomina, setDetalleNomina] = useState(null);
    const reportRef = useRef(null);

    useEffect(() => {
        const cargarDetalleNomina = async () => {
            try {
                setLoading(true);
                const response = await api.getById('DETALLE_NOMINA', id);
                setDetalleNomina(response);
            } catch (error) {
                console.error('Error al cargar el detalle de nómina:', error);
                setError('Error al cargar el detalle de nómina');
            } finally {
                setLoading(false);
            }
        };

        cargarDetalleNomina();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        if (!reportRef.current) return;

        const element = reportRef.current;
        const opt = {
            margin: 1,
            filename: `reporte-nomina-${detalleNomina.id_detalle}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'cm', 
                format: 'a4', 
                orientation: 'portrait' 
            }
        };

        try {
            // Ocultar botones antes de generar el PDF
            const buttons = element.querySelectorAll('.app-button');
            buttons.forEach(button => button.style.display = 'none');

            // Generar el PDF
            await html2pdf().set(opt).from(element).save();

            // Restaurar la visibilidad de los botones
            buttons.forEach(button => button.style.display = '');
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Error al generar el PDF. Por favor, intente nuevamente.');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
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
                <h2>No se encontró el detalle de nómina</h2>
                <Button onClick={() => navigate(-1)} className="app-button">
                    Volver
                </Button>
            </div>
        );
    }

    // Configuración de columnas para la tabla de conceptos aplicados
    const conceptosColumns = [
        {
            key: 'concepto_pago.nombre',
            title: 'Concepto',
            render: (value, item) => item.concepto_pago?.nombre || 'N/A',
        },
        {
            key: 'concepto_pago.tipo',
            title: 'Tipo',
            render: (value, item) => item.concepto_pago?.tipo || 'N/A',
        },
        {
            key: 'monto',
            title: 'Monto',
            render: (value) => `Q${parseFloat(value).toFixed(2)}`,
        },
    ];

    // Configuración de columnas para la tabla de horas extras
    const horasExtrasColumns = [
        {
            key: 'fecha',
            title: 'Fecha',
            render: (value) => new Date(value).toLocaleDateString(),
        },
        {
            key: 'horas',
            title: 'Horas',
            render: (value) => parseFloat(value).toFixed(2),
        },
        {
            key: 'monto',
            title: 'Monto',
            render: (value) => `Q${parseFloat(value).toFixed(2)}`,
        },
    ];

    return (
        <div style={{ padding: '20px' }} ref={reportRef}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Reporte de Detalle de Nómina</h2>
                <div>
                    <Button 
                        onClick={handlePrint}
                        className="app-button"
                        style={{ marginRight: '10px' }}
                    >
                        Imprimir
                    </Button>
                    <Button 
                        onClick={handleDownload}
                        className="app-button"
                    >
                        Descargar PDF
                    </Button>
                </div>
            </div>

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h3>Información del Empleado</h3>
                <div className="info-list">
                    <div className="info-item">
                        <strong>Nombre Completo:</strong> {detalleNomina.empleado?.nombre} {detalleNomina.empleado?.apellido}
                    </div>
                    <div className="info-item">
                        <strong>Puesto:</strong> {detalleNomina.empleado?.puesto?.nombre || 'N/A'}
                    </div>
                    <div className="info-item">
                        <strong>Periodo Nómina:</strong> {detalleNomina.nomina?.periodo_pago?.nombre || 'N/A'} (
                            {detalleNomina.nomina?.periodo_pago?.fecha_inicio
                                ? new Date(detalleNomina.nomina.periodo_pago.fecha_inicio).toLocaleDateString()
                                : 'N/A'}
                            -
                            {detalleNomina.nomina?.periodo_pago?.fecha_fin
                                ? new Date(detalleNomina.nomina.periodo_pago.fecha_fin).toLocaleDateString()
                                : 'N/A'}
                        )
                    </div>
                    <div className="info-item">
                        <strong>Días Trabajados:</strong> {detalleNomina.dias_trabajados}/{detalleNomina.nomina?.periodo_pago?.dias_periodo}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h3>Desglose de Ingresos</h3>
                <div className="info-list">
                    <div className="info-item">
                        <strong>Salario Base:</strong> Q{parseFloat(detalleNomina.salario_base || 0).toFixed(2)}
                    </div>
                    <div className="info-item">
                        <strong>Salario Proporcional:</strong> Q{parseFloat(detalleNomina.salario_proporcional || 0).toFixed(2)}
                    </div>
                    <div className="info-item">
                        <strong>Bono 14:</strong> Q{parseFloat(detalleNomina.bono14 || 0).toFixed(2)}
                    </div>
                    <div className="info-item">
                        <strong>Aguinaldo:</strong> Q{parseFloat(detalleNomina.aguinaldo || 0).toFixed(2)}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h3>Desglose de Descuentos</h3>
                <div className="info-list">
                    <div className="info-item">
                        <strong>IGSS:</strong> Q{parseFloat(detalleNomina.igss_laboral || 0).toFixed(2)}
                    </div>
                    <div className="info-item">
                        <strong>ISR:</strong> Q{parseFloat(detalleNomina.isr || 0).toFixed(2)}
                    </div>
                </div>
            </div>

            {detalleNomina.conceptos_aplicados && detalleNomina.conceptos_aplicados.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <h3>Conceptos Aplicados</h3>
                    <Table 
                        columns={conceptosColumns}
                        data={detalleNomina.conceptos_aplicados}
                    />
                </div>
            )}

            {detalleNomina.horas_extras && detalleNomina.horas_extras.length > 0 && (
                <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                    <h3>Horas Extras</h3>
                    <Table 
                        columns={horasExtrasColumns}
                        data={detalleNomina.horas_extras}
                    />
                </div>
            )}

            <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h3>Resumen Final</h3>
                <div className="info-list">
                    <div className="info-item">
                        <strong>Total Ingresos:</strong> Q{parseFloat(detalleNomina.total_ingresos || 0).toFixed(2)}
                    </div>
                    <div className="info-item">
                        <strong>Total Descuentos:</strong> Q{parseFloat(detalleNomina.total_descuentos || 0).toFixed(2)}
                    </div>
                    <div className="info-item" style={{ borderTop: '2px solid #ccc', marginTop: '10px', paddingTop: '10px' }}>
                        <strong>Líquido a Recibir:</strong> Q{parseFloat(detalleNomina.liquido_recibir || 0).toFixed(2)}
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button onClick={() => navigate(-1)} className="app-button">
                    Volver
                </Button>
            </div>
        </div>
    );
};

export default ReporteDetalleNomina; 