// C:\Users\Tareas\Desktop\Final\nomina_gt\nomina-backend\frontend\src\components\ViaticosList.jsx
import React, { useEffect, useState } from 'react';
import { useViaticosContext } from '../context/ViaticosContext'; // Importa el hook personalizado
import '../styles/ViaticosList.css'; // Asegúrate que esta ruta sea correcta

const ViaticosList = () => {
    // Usa el hook personalizado y desestructura correctamente
    const { state, actions } = useViaticosContext();
    // 'solicitudes' ahora SIEMPRE será un array gracias al contexto
    const { solicitudes, loading, error } = state; 
    const { fetchSolicitudes } = actions; 
    
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        // Llama a la acción para obtener las solicitudes
        fetchSolicitudes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Se ejecuta una vez al montar el componente

    // solicitudes ya es un array, no es necesario '?'
    const solicitudesFiltradas = solicitudes.filter(sol => {
        if (filtro === 'todos') return true;
        return sol.estado === filtro;
    });

    if (loading) return <div className="loading">Cargando solicitudes...</div>;
    // 'error' ya es un string del contexto
    if (error) return <div className="error">Error: {error}</div>; 

    return (
        <div className="viaticos-list-container">
            <h2>Listado de Solicitudes de Viáticos</h2>
            
            <div className="filtros">
                <label>
                    Filtrar por estado:
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                        <option value="todos">Todos</option>
                        <option value="Solicitada">Solicitadas</option>
                        <option value="Aprobada">Aprobadas</option>
                        <option value="Rechazada">Rechazadas</option>
                        <option value="Liquidada">Liquidadas</option>
                    </select>
                </label>
            </div>

            <table className="viaticos-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Empleado</th>
                        <th>Destino</th>
                        <th>Fechas</th>
                        <th>Monto Solicitado</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudesFiltradas.length > 0 ? (
                        solicitudesFiltradas.map((solicitud) => (
                            <tr key={solicitud.id_solicitud}>
                                <td>{solicitud.id_solicitud}</td>
                                {/* Asegúrate de que 'Empleado' esté incluido en tus solicitudes desde el backend */}
                                <td>{solicitud.Empleado?.nombre || 'N/A'} {solicitud.Empleado?.apellido || ''}</td>
                                <td>{solicitud.destino}</td>
                                <td>
                                    {new Date(solicitud.fecha_inicio_viaje).toLocaleDateString()} - {' '}
                                    {new Date(solicitud.fecha_fin_viaje).toLocaleDateString()}
                                </td>
                                <td>Q{solicitud.monto_solicitado?.toFixed(2) || '0.00'}</td>
                                <td className={`estado ${solicitud.estado?.toLowerCase() || ''}`}>
                                    {solicitud.estado || 'N/A'}
                                </td>
                                <td>
                                    <button 
                                        className="btn-detalle"
                                        onClick={() => console.log('Ver detalle:', solicitud.id_solicitud)}
                                    >
                                        Detalle
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="no-results">
                                {loading ? 'Cargando...' : 'No hay solicitudes registradas'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ViaticosList;