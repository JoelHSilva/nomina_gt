// src/components/Prestamos/PagosPrestamoList.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api.jsx';
import { ENDPOINTS } from '../../api/endpoints.jsx';
import Table from '../Common/Table.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';

function PagosPrestamoList({ prestamoId }) {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Columnas para la tabla de Pagos de Préstamo
    const columns = [
        { key: 'id_pago', title: 'ID Pago' },
        // { key: 'id_prestamo', title: 'ID Préstamo' }, // Redundante en esta vista
        // { key: 'id_detalle_nomina', title: 'ID Detalle Nómina', render: (value) => value || 'Manual' }, // Mostrar ID o "Manual"
        { key: 'monto_pagado', title: 'Monto Pagado (Q)', render: (value) => `Q ${parseFloat(value).toFixed(2)}` },
        { key: 'fecha_pago', title: 'Fecha Pago', render: (value) => new Date(value).toLocaleDateString() },
        { key: 'tipo_pago', title: 'Tipo Pago' },
        // { key: 'observaciones', title: 'Observaciones' }, // Opcional
        { key: 'fecha_creacion', title: 'Fecha Registro', render: (value) => new Date(value).toLocaleString() },
         // Eliminar pagos no suele ser común, pero se podría añadir si la API lo permite
    ];

    useEffect(() => {
        const fetchPagos = async () => {
            if (!prestamoId) {
                setLoading(false);
                setPagos([]);
                return;
            }
            try {
                setLoading(true);
                // Asumiendo que el endpoint GET /api/v1/pagos-prestamos soporta el query param id_prestamo
                const data = await api.getAll('PAGOS_PRESTAMOS', { params: { id_prestamo: prestamoId } });
                // Si tu backend no soporta el query param, necesitas una función específica en api.jsx
                // const data = await api.getPagosByPrestamoId(prestamoId); // <-- Crear esta función
                 setPagos(data);
            } catch (err) {
                setError('Error al cargar los pagos del préstamo.');
                console.error('Error fetching pagos:', err.response?.data || err.message);
                 setPagos([]); // Limpiar pagos en caso de error
            } finally {
                setLoading(false);
            }
        };
        fetchPagos();
    }, [prestamoId]); // Re-ejecutar si el ID del préstamo cambia

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        // Usa la clase para el contenedor de la tabla
        <div className="app-table-container">
             <h3>Historial de Pagos</h3>
            <Table data={pagos} columns={columns} />
        </div>
    );
}

export default PagosPrestamoList;