// src/components/Prestamos/PagosPrestamoList.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api.jsx';
import Table from '../Common/Table.jsx';
import LoadingSpinner from '../Common/LoadingSpinner.jsx';
import Button from '../Common/Button.jsx';

function PagosPrestamoList({ prestamoId, onClose }) {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'id_pago', title: 'ID Pago' },
    { 
      key: 'monto_pagado', 
      title: 'Monto', 
      render: (value) => `Q ${parseFloat(value).toFixed(2)}`
    },
    { 
      key: 'fecha_pago', 
      title: 'Fecha', 
      render: (value) => new Date(value).toLocaleDateString() 
    },
    { key: 'tipo_pago', title: 'Tipo' },
    { 
      key: 'fecha_creacion', 
      title: 'Registrado', 
      render: (value) => new Date(value).toLocaleString() 
    }
  ];

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        
        // OPCIÓN 1: Si tu backend tiene endpoint específico
        // const response = await api.get(`/prestamos/${prestamoId}/pagos`);
        
        // OPCIÓN 2: Filtrar manualmente los resultados
        const allPagos = await api.getAll('PAGOS_PRESTAMOS');
        const filteredPagos = allPagos.filter(pago => pago.id_prestamo == prestamoId);
        
        setPagos(filteredPagos);
        
      } catch (err) {
        setError('Error al cargar los pagos: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching pagos:', err);
      } finally {
        setLoading(false);
      }
    };

    if (prestamoId) {
      fetchPagos();
    }
  }, [prestamoId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="pagos-prestamo-container">
      <h3>Pagos del Préstamo #{prestamoId}</h3>
      
      <Table 
        data={pagos} 
        columns={columns} 
        emptyMessage="No hay pagos registrados para este préstamo"
      />
      
      <div className="modal-actions">
        <Button onClick={onClose} className="secondary">
          Cerrar
        </Button>
      </div>
    </div>
  );
}

export default PagosPrestamoList;