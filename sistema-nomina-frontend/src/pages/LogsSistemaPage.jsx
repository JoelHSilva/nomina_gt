// src/pages/LogsSistemaPage.js
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { ENDPOINTS } from '../api/endpoints';
import Table from '../components/Common/Table';
import LoadingSpinner from '../components/Common/LoadingSpinner';

function LogsSistemaPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Columnas para la tabla de Logs
  const columns = [
    { key: 'id_log', title: 'ID' },
    { key: 'id_usuario', title: 'ID Usuario' }, // Podrías querer mostrar el nombre del usuario si haces join
    { key: 'accion', title: 'Acción' },
    { key: 'tabla_afectada', title: 'Tabla' },
    { key: 'id_registro', title: 'ID Registro' },
    // { key: 'datos_anteriores', title: 'Datos Anteriores' }, // Puede ser mucha data para mostrar directo
    // { key: 'datos_nuevos', title: 'Datos Nuevos' }, // Puede ser mucha data para mostrar directo
    { key: 'direccion_ip', title: 'IP' },
    { key: 'fecha_hora', title: 'Fecha/Hora', render: (value) => new Date(value).toLocaleString() }, // Formato fecha/hora
    // Puedes añadir un botón para ver detalles completos de datos_anteriores/nuevos en un modal
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('LOGS_SISTEMA');
       // Opcional: formatear datos_anteriores/nuevos si los incluyes en la tabla o necesitas verlos
      setLogs(data);
    } catch (err) {
      setError('Error al cargar los logs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Registro de Actividad (Logs)</h2>

      {/* Los logs generalmente no se crean/editan/eliminan desde el frontend */}
      {/* <Button onClick={...}>...</Button> */}

      <Table data={logs} columns={columns} />

      {/* Si quieres ver detalles de log con datos_anteriores/nuevos */}
      {/* <Modal>...</Modal> */}
    </div>
  );
}

export default LogsSistemaPage;