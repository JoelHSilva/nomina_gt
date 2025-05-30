// src/pages/LogsSistemaPage.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { ENDPOINTS } from '../api/endpoints';
import Table from '../components/Common/Table';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button';

function LogsSistemaPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Columnas para la tabla de Logs
  const columns = [
    { key: 'id_log', title: 'ID' },
    { key: 'id_usuario', title: 'ID Usuario' },
    { key: 'accion', title: 'Acción' },
    { key: 'tabla_afectada', title: 'Tabla' },
    { key: 'id_registro', title: 'ID Registro' },
    { key: 'direccion_ip', title: 'IP' },
    { 
      key: 'fecha_hora', 
      title: 'Fecha/Hora', 
      render: (value) => new Date(value).toLocaleString() 
    },
  ];

  // Función para formatear la fecha y hora de última actualización
  const formatLastUpdate = (date) => {
    return date.toLocaleString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  // Usar useCallback para memoizar la función fetchLogs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAll('LOGS_SISTEMA');
      setLogs(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Error al cargar los logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para cargar logs al montar el componente
  useEffect(() => {
    // Cargar logs inmediatamente al montar
    fetchLogs();

    // Configurar actualización automática cada 5 segundos
    const intervalId = setInterval(fetchLogs, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [fetchLogs]);

  // Efecto para actualizar al entrar a la vista
  useEffect(() => {
    // Actualizar logs cuando el componente se monta o se vuelve a mostrar
    fetchLogs();
  }, [fetchLogs]);

  if (loading && logs.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Registro de Actividad (Logs)</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button 
            onClick={fetchLogs}
            className="app-button-primary"
          >
            Actualizar
          </Button>
          <div style={{ textAlign: 'right' }}>
            <small style={{ color: '#666', display: 'block' }}>
              Última actualización:
            </small>
            <small style={{ color: '#666', display: 'block' }}>
              {formatLastUpdate(lastUpdate)}
            </small>
          </div>
        </div>
      </div>

      {loading && logs.length > 0 && (
        <div style={{ marginBottom: '10px', color: '#666' }}>
          Actualizando...
        </div>
      )}

      <Table 
        data={logs} 
        columns={columns}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
}

export default LogsSistemaPage;